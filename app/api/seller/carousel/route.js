import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Carousel from "@/models/Carousel";
import authSeller from "@/lib/authSeller";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});




export async function POST(request) {
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

        await connectDB();

        const formData = await request.formData();

        const title = formData.get("title");
        const subtitle = formData.get("subtitle");
        const image = formData.get("image");
        const buttonText = formData.get("buttonText");
        const buttonLink = formData.get("buttonLink");
        const order = formData.get("order");
        const isActive = formData.get("isActive");

        // Validate title
        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title is required.",
                },
                { status: 400 }
            );
        }

        // Validate image
        if (!image || !(image instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Carousel image is required.",
                },
                { status: 400 }
            );
        }

        // Validate image type
        if (!image.type.startsWith("image/")) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only image files are allowed.",
                },
                { status: 400 }
            );
        }

        // Convert image to buffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "eliteo/carousels",
                    resource_type: "image",

                    transformation: [
                        {
                            width: 1920,
                            height: 800,
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

        if (!uploadResult?.secure_url) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image upload failed.",
                },
                { status: 500 }
            );
        }

        // Create carousel
        const carousel = await Carousel.create({
            title: title.trim(),
            subtitle: subtitle?.trim() || "",
            image: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            buttonText: buttonText?.trim() || "Shop Now",
            buttonLink: buttonLink?.trim() || "/all-products",
            order: order ? Number(order) : 0,
            isActive: isActive !== "false",
        });

        return NextResponse.json(
            {
                success: true,
                message: "Carousel created successfully.",
                carousel,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create carousel error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create carousel.",
            },
            { status: 500 }
        );
    }
};

export async function GET() {
    try {


        await connectDB();

        const carousels = await Carousel.find({})
            .sort({ order: 1, createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            carousels,
        });

    } catch (error) {
        console.error("Get carousels error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch carousels.",
            },
            { status: 500 }
        );
    }
}

