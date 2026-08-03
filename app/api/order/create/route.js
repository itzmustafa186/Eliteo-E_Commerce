import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Order from "@/models/order";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { userId } = await auth();

        const body = await req.json();

        const {
            customer,
            address,
            items,
            subtotal,
            totalAmount,
            paymentMethod,
        } = body;

        // Validation
        if (
            !customer ||
            !address ||
            !items ||
            items.length === 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields",
                },
                { status: 400 }
            );
        }


        await inngest.send({
            name: "order/created",
            data: {
                userId: userId || null,
                isGuest: !userId,

                customer,
                address,

                items,

                subtotal,
                totalAmount,

                paymentMethod,
                date: Date.now()
            },
        });

        if (userId) {
            const user = await User.findOne({ userId });

            if (user) {
                user.cartItems = {};
                await user.save();
            }
        }
        return NextResponse.json(
            {
                success: true,
                message: "Order placed successfully",

            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}