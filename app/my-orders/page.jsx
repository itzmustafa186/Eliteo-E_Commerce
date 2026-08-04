import connectDB from "@/config/db";
import Order from "@/models/order";
import { auth } from "@clerk/nextjs/server";
import MyOrders from "@/components/MyOrders";

export default async function OrdersPage() {

    await connectDB();

    const { userId } = await auth();

    const orders = await Order.find({ userId })
        .populate("items.product")
        .sort({ createdAt: -1 })
        .lean();

    const serializedOrders = orders.map((order) => ({
        ...order,
        _id: order._id.toString(),
        createdAt: new Date(order.createdAt).toLocaleDateString("en-US"),
        updatedAt: order.updatedAt.toISOString(),

        items: order.items.map((item) => ({
            ...item,
            _id: item._id.toString(),
            product: {
                ...item.product,
                _id: item.product._id.toString(),
            },
        })),
    }));


    return <MyOrders orders={serializedOrders} />;
}