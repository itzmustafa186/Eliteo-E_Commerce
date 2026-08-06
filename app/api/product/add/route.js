import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/product";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import slugify from "slugify";
import crypto from "crypto";

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
        const subCategory = formData.get("subCategory") || "";
        const brand = formData.get("brand") || "";

        const price = Number(formData.get("price"));
        const offerPrice = Number(formData.get("offerPrice"));
        const stock = Number(formData.get("stock")) || 0;

        const files = formData.getAll("images");

        // Validation
        if (
            !name ||
            !description ||
            !category ||
            price <= 0 ||
            offerPrice < 0 ||
            stock < 0
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid product data.",
                },
                { status: 400 }
            );
        }

        if (offerPrice > price) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Offer price cannot be greater than price.",
                },
                { status: 400 }
            );
        }

        if (files.length === 0 || !files[0].name) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please upload at least one image.",
                },
                { status: 400 }
            );
        }
        const slug =
            slugify(name, {
                lower: true,
                strict: true,
            }) +
            "-" +
            crypto.randomBytes(3).toString("hex");

        const sku = `ELT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

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
        const imageUrls = uploadResults.map((item) => item.secure_url);

        if (imageUrls.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Image upload failed.",
                },
                { status: 500 }
            );
        }

        const product = await Product.create({
            sellerId: userId,

            name,
            slug,

            description,

            category,
            subCategory,
            brand,

            images: imageUrls,

            price,
            offerPrice,
            stock,

            sku,

            featured: false,
            isActive: true,
        });

        revalidatePath("/");
        revalidatePath("/all-products");
        revalidatePath("/seller/product-list");
        

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