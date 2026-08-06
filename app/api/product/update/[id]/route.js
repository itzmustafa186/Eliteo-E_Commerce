import connectDB from "@/config/db";
import Product from "@/models/product";
import authSeller from "@/lib/authSeller";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request, { params }) {

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

        const seller = await authSeller(userId);

        if (!seller) {
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

        const formData = await request.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const category = formData.get("category");
        const subCategory = formData.get("subCategory");
        const brand = formData.get("brand");

        const price = Number(formData.get("price"));
        const offerPrice = Number(formData.get("offerPrice"));
        const stock = Number(formData.get("stock"));

        const featured = formData.get("featured") === "true";
        const isActive = formData.get("isActive") === "true";

        const files = formData.getAll("images");

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
                    message: "Invalid product data",
                },
                { status: 400 }
            );
        }

        if (offerPrice > price) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Offer Price cannot exceed Price",
                },
                { status: 400 }
            );
        }
        const oldSlug = product.slug;

        if (product.name !== name) {
            product.slug = slugify(name, {
                lower: true,
                strict: true,
            });
        }

        if (
            files.length > 0 &&
            files.some(file => file.name)
        ) {

            for (const image of product.images) {
                try {
                    const publicId = image.split("/").pop().split(".")[0];

                    await cloudinary.uploader.destroy(
                        `eliteo/products/${publicId}`
                    );
                } catch (err) {
                    console.error("Cloudinary delete failed:", err);
                }
            }

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

            product.images = uploadResults.map(
                (item) => item.secure_url
            );
        }

        product.name = name;
        product.description = description;


        product.category = category;
        product.subCategory = subCategory;
        product.brand = brand;

        product.price = price;
        product.offerPrice = offerPrice;
        product.stock = stock;

        product.featured = featured;
        product.isActive = isActive;

        await product.save();

        revalidatePath("/");
        revalidatePath("/all-products");
        revalidatePath("/seller/product-list");
        revalidatePath(`/product/${oldSlug}`);
        revalidatePath(`/product/${product.slug}`);

        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                product,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}