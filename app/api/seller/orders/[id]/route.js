import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/order";
import { auth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";

export async function PATCH(req, { params }) {
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

    const body = await req.json();
    const { id } = await params;

    const order = await Order.findByIdAndUpdate(
        id,
        body,
        { new: true }
    );

    return NextResponse.json({
        success: true,
        order,
    });
}