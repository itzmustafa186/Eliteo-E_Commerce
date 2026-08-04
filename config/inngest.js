// src/inngest/client.js
import { resend } from "@/config/resend";
import Product from "@/models/product";
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/order";

export const inngest = new Inngest({
  id: "eliteo",
});

// Sync User Creation
export const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-creation",
    triggers: [
      {
        event: "clerk/user.created",
      },
    ],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
      } = event.data;

      const userData = {
        _id: id,
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        email: email_addresses?.[0]?.email_address ?? "",
        imageUrl: image_url ?? "",
      };

      await User.findByIdAndUpdate(id, userData, {
        upsert: true,
        new: true,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("User Creation Error:", error);
      throw error;
    }
  }
);

// Sync User Update
export const syncUserUpdation = inngest.createFunction(
  {
    id: "sync-user-updation",
    triggers: [
      {
        event: "clerk/user.updated",
      },
    ],
  },
  async ({ event }) => {
    try {
      await connectDB();

      const {
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
      } = event.data;

      const userData = {
        name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
        email: email_addresses?.[0]?.email_address ?? "",
        imageUrl: image_url ?? "",
      };

      await User.findByIdAndUpdate(id, userData, {
        new: true,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("User Update Error:", error);
      throw error;
    }
  }
);

// Sync User Deletion
export const syncUserDeletion = inngest.createFunction(
  {
    id: "sync-user-deletion",
    triggers: [
      {
        event: "clerk/user.deleted",
      },
    ],
  },
  async ({ event }) => {
    try {
      await connectDB();

      await User.findByIdAndDelete(event.data.id);

      return {
        success: true,
      };
    } catch (error) {
      console.error("User Delete Error:", error);
      throw error;
    }
  }
);

// Inngest function to place order

export const createUserOrder = inngest.createFunction(
  {
    id: "create-user-order",
    batchEvents: {
      maxSize: 5,
      timeout: "5s",
    },
    triggers: [
      {
        event: "order/created",
      },
    ],
  },

  async ({ events }) => {
    await connectDB();

    const orders = events.map((event) => ({
      userId: event.data.userId,
      isGuest: event.data.isGuest,

      customer: event.data.customer,
      address: event.data.address,

      items: event.data.items,

      subtotal: event.data.subtotal,
      shipping: 250,
      totalAmount: event.data.totalAmount,

      paymentMethod: event.data.paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",

      date: event.data.date,
    }));

    // Insert ONLY ONCE
    const createdOrders = await Order.insertMany(orders);

    // Send email for each order
    for (const order of createdOrders) {
      const products = await Promise.all(
        order.items.map(async (item) => {
          const product = await Product.findById(item.product).lean();

          return {
            name: product?.name || "Product",
            image: product?.image?.[0] || "",
            price: product?.offerPrice || 0,
            quantity: item.quantity,
          };
        })
      );

      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: order.customer.email,
        subject: "Your Eliteo Order Confirmation",

        html: `
      <div style="font-family:Arial,sans-serif;padding:30px;background:#f7f7f7">
        <div style="max-width:650px;margin:auto;background:white;border-radius:12px;padding:30px">

          <h2 style="color:#f97316;">🎉 Thank you for shopping with Eliteo</h2>

          <p>Hi <strong>${order.customer.firstName}</strong>,</p>

          <p>Your order has been placed successfully.</p>

          <hr>

          <h3>Ordered Products</h3>

          ${products
            .map(
              (product) => `
                <div style="display:flex;gap:15px;margin-bottom:20px;border-bottom:1px solid #eee;padding-bottom:15px;">
                  <img
                    src="${product.image}"
                    width="90"
                    height="90"
                    style="border-radius:10px;object-fit:cover;"
                  />

                  <div>
                    <h4 style="margin:0">${product.name}</h4>
                    <p>Quantity: ${product.quantity}</p>
                    <p>Price: Rs ${product.price}</p>
                  </div>
                </div>
              `
            )
            .join("")}

          <hr>

          <p><strong>Subtotal:</strong> Rs ${order.subtotal}</p>
          <p><strong>Shipping:</strong> Rs ${order.shipping}</p>

          <h2>Total: Rs ${order.totalAmount}</h2>

          <p>We'll notify you once your order is confirmed.</p>

          <p>❤️ Team Eliteo</p>

        </div>
      </div>
    `,
      });
    }

    return {
      success: true,
      ordersCreated: createdOrders.length,
    };
  }
);

// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  createUserOrder
];