import connectDB from "@/config/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = await auth();



        await connectDB();

        const user = await User.findById(userId);

        const { cartItems } = user

        return NextResponse.json({
            success: true,
            cartItems
        })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({
            success: false,
            message: error.message
        })
    }
}