// src/inngest/client.js

import Product from "@/models/product";
import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
import Order from "@/models/order";
import { sendEmail } from "@/lib/sendEmail";

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

  async ({ event }) => {
    console.log("🔥 createUserOrder started");

    await connectDB();

    const order = await Order.findById(event.data.orderId).lean();

    if (!order) {
      throw new Error("Order not found");
    }

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

    const productsHtml = products
      .map(
        (product) => `
<tr>
  <td style="padding:15px;border-bottom:1px solid #f1f1f1;">
    <img
      src="${product.image}"
      width="70"
      height="70"
      style="border-radius:10px;object-fit:cover;border:1px solid #eee;"
    />
  </td>

  <td style="padding:15px;border-bottom:1px solid #f1f1f1;">
    <strong>${product.name}</strong>
  </td>

  <td style="padding:15px;text-align:center;border-bottom:1px solid #f1f1f1;">
    ${product.quantity}
  </td>

  <td style="padding:15px;text-align:right;border-bottom:1px solid #f1f1f1;">
    Rs ${product.price}
  </td>

  <td style="padding:15px;text-align:right;border-bottom:1px solid #f1f1f1;font-weight:bold;">
    Rs ${product.price * product.quantity}
  </td>
</tr>
`
      )
      .join("");

    console.log("📧 Sending Email...");

    await sendEmail({
      to: order.customer.email,
      subject: `Order Confirmed • Eliteo #${order._id}`,
      html: `...YOUR SAME HTML...`,
    });

    console.log("✅ Email Sent");

    return {
      success: true,
    };
  }
)
// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  createUserOrder
];