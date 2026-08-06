import connectDB from "@/config/db";
import Product from "@/models/product";
import authSeller from "@/lib/authSeller";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

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

        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Not Authorized",
                },
                { status: 403 }
            );
        }

        await connectDB();

        const { id } = await params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        // Toggle active status
        product.isActive = !product.isActive;

        await product.save();

        revalidatePath("/");
        revalidatePath("/all-products");
        revalidatePath("/seller/product-list");
        revalidatePath(`/product/${product.slug}`);

        return NextResponse.json(
            {
                success: true,
                message: product.isActive
                    ? "Product activated successfully."
                    : "Product deactivated successfully.",
                product,
            },
            { status: 200 }
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