import connectDB from "@/config/db";
import Order from "@/models/order";
import { NextResponse } from "next/server";

export async function POST(req) {

    try {

        await connectDB();

        const { orderId, email } = await req.json();

        const order = await Order.findOne({
            _id: orderId,
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
            order,
        });

    } catch (error) {

        return NextResponse.json({
            success: false,
            message: error.message,
        });

    }

}