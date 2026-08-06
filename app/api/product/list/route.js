import connectDB from "@/config/db";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        const products = (await Product.find({})
            .sort({ createdAt: -1 })
            .lean()).map((product) => ({
                ...product,
                _id: product._id.toString(),
            }));

        return NextResponse.json(
            {
                success: true,
                products,
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