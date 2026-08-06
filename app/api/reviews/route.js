import connectDB from "@/config/db";
import Review from "@/models/review";
import Product from "@/models/product";
import { NextResponse } from "next/server";


export async function POST(request) {

    try {

        await connectDB();

        const {
            productId,
            userId,
            userName,
            rating,
            comment
        } = await request.json();


        if(!productId || !userId || !userName || !rating || !comment){
            return NextResponse.json(
                {
                    success:false,
                    message:"All fields are required"
                },
                {status:400}
            );
        }


        const review = await Review.create({
            productId,
            userId,
            userName,
            rating,
            comment
        });


        // Calculate rating
        const reviews = await Review.find({
            productId
        });


        const average =
            reviews.reduce(
                (sum,item)=>sum + item.rating,
                0
            ) / reviews.length;



        await Product.findByIdAndUpdate(
            productId,
            {
                rating:Number(average.toFixed(1)),
                reviewCount:reviews.length
            }
        );


        return NextResponse.json({
            success:true,
            review
        });


    } catch(error){

        return NextResponse.json(
            {
                success:false,
                message:error.message
            },
            {
                status:500
            }
        );

    }
}