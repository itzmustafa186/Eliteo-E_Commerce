import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Order from "@/models/order";
import Product from "@/models/product";
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
            paymentMethod,
        } = body;

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

        const SHIPPING_FEE = 250;

        let subtotal = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product not found.",
                    },
                    { status: 404 }
                );
            }

            if (!product.isActive) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${product.name} is unavailable.`,
                    },
                    { status: 400 }
                );
            }

            if (product.stock < item.quantity) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Only ${product.stock} ${product.name} left in stock.`,
                    },
                    { status: 400 }
                );
            }

            subtotal += product.offerPrice * item.quantity;
        }

        const totalAmount = subtotal + SHIPPING_FEE;

        const orderNumber = `ELT-${Date.now().toString().slice(-8)}`;

        const order = await Order.create({
            userId: userId || null,
            isGuest: !userId,

            orderNumber,

            customer,
            address,

            items,

            subtotal,
            shipping: SHIPPING_FEE,
            totalAmount,

            paymentMethod,
            paymentStatus: "Pending",
            orderStatus: "Pending",
        });

        // Update stock & sold count
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity,
                        sold: item.quantity,
                    },
                }
            );
        }

        // Clear user's cart
        if (userId) {
            await User.findOneAndUpdate(
                { _id: userId },
                { cartItems: {} }
            );
        }

        await inngest.send({
            name: "order/created",
            data: {
                orderId: order._id,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Order placed successfully",
                order,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}