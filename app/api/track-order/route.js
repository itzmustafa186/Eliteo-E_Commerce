import connectDB from "@/config/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        await connectDB();

        const { orderNumber, email } = await req.json();


        const order = await Order.findOne({
            orderNumber,
            "customer.email": email,
        })
            .populate("items.product")
            .lean();


        if (!order) {
            return NextResponse.json({
                success: false,
                message: "Order not found."
            });
        }


        return NextResponse.json({
            success: true,
            order: {
                ...order,
                _id: order._id.toString(),
                items: order.items.map(item => ({
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

        return NextResponse.json({
            success: false,
            message: error.message,
        });

    }

}