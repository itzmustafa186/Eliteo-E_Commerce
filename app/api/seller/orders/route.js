import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import Order from "@/models/order";
import authSeller from "@/lib/authSeller";

export async function GET() {
    try {
        await connectDB();

        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not Authorized",
                },
                { status: 403 }
            );
        };

        const sellerProducts = await Product.find({
            sellerId: userId,
        }).select("_id");

        const productIds = sellerProducts.map((product) => product._id);

        const orders = await Order.find({
            "items.product": { $in: productIds },
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            totalOrders: orders.length,
            orders,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}