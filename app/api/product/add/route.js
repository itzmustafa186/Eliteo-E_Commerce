import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        // Get logged-in user
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

        // Check seller
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

        // Connect DB
        await connectDB();

        // Get form data
        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const price = Number(formData.get("price"));
        const offerPrice = Number(formData.get("offerPrice"));

        const files = formData.getAll("images");

        // Validation
        if (!name || !description || !category) {
            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400 }
            );
        }

        if (files.length === 0 || !files[0].name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please upload at least one image",
                },
                { status: 400 }
            );
        }

        if (offerPrice > price) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Offer price cannot be greater than price",
                },
                { status: 400 }
            );
        }
        console.time("Total");

        console.time("Cloudinary Upload");

        const uploadResults = await Promise.all(
            files.map(async (file) => {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "eliteo/products",
                            resource_type: "image",
                            transformation: [
                                {
                                    width: 1200,
                                    height: 1200,
                                    crop: "limit",
                                },
                                {
                                    quality: "auto:good",
                                },
                                {
                                    fetch_format: "auto",
                                },
                            ],
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );

                    stream.end(buffer);
                });
            })
        );

        console.timeEnd("Cloudinary Upload");

        console.time("MongoDB");

        const product = await Product.create({
            userId,
            name,
            description,
            category,
            price,
            offerPrice,
            image: uploadResults.map((item) => item.secure_url),
            date: Date.now(),
        });

        console.timeEnd("MongoDB");

        console.timeEnd("Total");

        return NextResponse.json(
            {
                success: true,
                message: "Product added successfully",
                product,
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