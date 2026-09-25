import connectDB from "@/config/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { orderNumber, phone } = await req.json();

        if (!orderNumber && !phone) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please enter your order number or phone number.",
                },
                { status: 400 }
            );
        }

        const conditions = [];

        if (orderNumber?.trim()) {
            conditions.push({
                orderNumber: orderNumber.trim(),
            });
        }

        if (phone?.trim()) {
            conditions.push({
                "customer.phone": phone.trim(),
            });
        }

        const order = await Order.findOne({
            $or: conditions,
        })
            .populate("items.product")
            .lean();

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            order: {
                ...order,
                _id: order._id.toString(),

                items: order.items.map((item) => ({
                    ...item,
                    _id: item._id.toString(),

                    product: item.product
                        ? {
                              ...item.product,
                              _id: item.product._id.toString(),
                          }
                        : null,
                })),
            },
        });
    } catch (error) {
        console.error("Track order error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Something went wrong.",
            },
            { status: 500 }
        );
    }
}