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
      const productsHtml = products
        .map(
          (product) => `
      <tr>
        <td style="padding:15px;border-bottom:1px solid #f1f1f1;">
          <img
            src="${product.image}"
            alt="${product.name}"
            width="70"
            height="70"
            style="border-radius:10px;object-fit:cover;border:1px solid #eee;"
          />
        </td>

        <td style="padding:15px;border-bottom:1px solid #f1f1f1;">
          <div style="font-weight:600;color:#222;">
            ${product.name}
          </div>
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

      console.log("Calling sendEmail...");

      await sendEmail({
        to: order.customer.email,
        subject: `Order Confirmed • Eliteo #${order._id}`,

        html: `
<div style="margin:0;padding:40px;background:#f4f4f5;font-family:Arial,sans-serif;">

<div style="max-width:720px;margin:auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.08);">

<div style="background:#f97316;padding:30px;text-align:center;color:white;">

<h1 style="margin:0;font-size:34px;">
Eliteo
</h1>

<p style="margin-top:10px;font-size:18px;">
🎉 Your Order Has Been Confirmed
</p>

</div>

<div style="padding:35px;">

<h2 style="margin-top:0;">
Hi ${order.customer.firstName},
</h2>

<p style="font-size:15px;color:#555;line-height:1.8;">
Thank you for shopping with <strong>Eliteo</strong>.
We've successfully received your order and our team is preparing it.
</p>

<table width="100%" style="margin-top:25px;font-size:14px;">
<tr>
<td><strong>Order ID</strong></td>
<td>${order._id}</td>
</tr>

<tr>
<td><strong>Order Date</strong></td>
<td>${new Date(order.createdAt).toLocaleString()}</td>
</tr>

<tr>
<td><strong>Payment</strong></td>
<td>${order.paymentMethod}</td>
</tr>

<tr>
<td><strong>Status</strong></td>
<td style="color:#f97316;font-weight:bold;">
${order.orderStatus}
</td>
</tr>

</table>

<h2 style="margin-top:40px;">
Ordered Items
</h2>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="border-collapse:collapse;">

<thead>

<tr style="background:#fff7ed;">

<th align="left" style="padding:15px;">Image</th>

<th align="left" style="padding:15px;">Product</th>

<th align="center" style="padding:15px;">Qty</th>

<th align="right" style="padding:15px;">Price</th>

<th align="right" style="padding:15px;">Total</th>

</tr>

</thead>

<tbody>

${productsHtml}

</tbody>

</table>

<div
style="
margin-top:35px;
background:#fafafa;
padding:25px;
border-radius:12px;
">

<h3 style="margin-top:0;">
Order Summary
</h3>

<table width="100%">

<tr>

<td>Subtotal</td>

<td align="right">
Rs ${order.subtotal}
</td>

</tr>

<tr>

<td>Shipping</td>

<td align="right">
Rs ${order.shipping}
</td>

</tr>

<tr>

<td style="padding-top:15px;font-size:18px;font-weight:bold;">
Grand Total
</td>

<td
align="right"
style="padding-top:15px;font-size:20px;color:#f97316;font-weight:bold;">

Rs ${order.totalAmount}

</td>

</tr>

</table>

</div>

<div
style="
margin-top:35px;
padding:25px;
background:#fff7ed;
border-radius:12px;
">

<h3 style="margin-top:0;">
Shipping Address
</h3>

<p style="margin:0;line-height:1.8;">

${order.customer.firstName}
${order.customer.lastName}<br>

${order.address.street}<br>

${order.address.apartment || ""}<br>

${order.address.area},
${order.address.city}<br>

${order.address.country}
${order.address.postalCode}

</p>

</div>

<p
style="
margin-top:35px;
font-size:15px;
color:#555;
line-height:1.8;
">

We'll send another email once your order is packed and shipped.

</p>

<div style="text-align:center;margin-top:40px;">

<a
href="https://eliteo.pk/my-orders"
style="
display:inline-block;
padding:15px 35px;
background:#f97316;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;
">

Track My Order

</a>

</div>

<hr style="margin:40px 0;">

<p
style="
text-align:center;
font-size:13px;
color:#888;
">

Thank you for choosing <strong>Eliteo</strong> ❤️

</p>

</div>

</div>

</div>
`,
      });
      console.log("sendEmail completed");
      return {
        success: true,
        ordersCreated: createdOrders.length,
      };
    }
  }
)
// Export all functions
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  createUserOrder
];