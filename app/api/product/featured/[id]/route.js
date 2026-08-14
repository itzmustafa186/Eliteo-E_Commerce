import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(request, { params }) {
    try {
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

        const { id } = await params;
        const { featured } = await request.json();

        if (typeof featured !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Featured must be true or false",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const product = await Product.findOneAndUpdate(
            {
                _id: id,
                sellerId: userId,
            },
            {
                $set: {
                    featured,
                },
            },
            {
                new: true,
            }
        ).lean();

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: featured
                ? "Product added to featured"
                : "Product removed from featured",
            product,
        });
    } catch (error) {
        console.error("Featured product error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update featured status",
            },
            { status: 500 }
        );
    }
}