import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import connectDB from "@/config/db";
import Order from "@/models/order";
import MyOrders from "@/components/MyOrders";

export default async function MyOrdersPage() {
    const { userId } = await auth();

    // User is not logged in
    if (!userId) {
        redirect("/");
    }

    await connectDB();

    const orders = await Order.find({
        userId: userId,
    })
        .populate({
            path: "items.product",
            select: "name images category offerPrice",
        })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <MyOrders
            orders={JSON.parse(JSON.stringify(orders))}
        />
    );
}