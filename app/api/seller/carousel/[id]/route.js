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


// ==========================================
// PUT - UPDATE CAROUSEL
// ==========================================

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

        const carousel = await Carousel.findById(id);

        if (!carousel) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Carousel not found.",
                },
                { status: 404 }
            );
        }

        const formData = await request.formData();

        const title = formData.get("title");
        const subtitle = formData.get("subtitle");
        const buttonText = formData.get("buttonText");
        const buttonLink = formData.get("buttonLink");
        const image = formData.get("image");

        // -------------------------------
        // Validate title
        // -------------------------------

        if (!title?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title is required.",
                },
                { status: 400 }
            );
        }

        // -------------------------------
        // Update text fields
        // -------------------------------

        carousel.title = title.trim();
        carousel.subtitle = subtitle?.trim() || "";
        carousel.buttonText = buttonText?.trim() || "Shop Now";
        carousel.buttonLink =
            buttonLink?.trim() || "/all-products";


        // ==========================================
        // IF NEW IMAGE WAS UPLOADED
        // ==========================================

        if (image instanceof File && image.size > 0) {

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

            // Validate image size

            if (image.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Image must be less than 5MB.",
                    },
                    { status: 400 }
                );
            }

            // Convert File to Buffer

            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Upload new image

            const uploadResult = await new Promise(
                (resolve, reject) => {

                    const stream =
                        cloudinary.uploader.upload_stream(
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
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );

                    stream.end(buffer);
                }
            );

            // Check upload

            if (!uploadResult?.secure_url) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Image upload failed.",
                    },
                    { status: 500 }
                );
            }

            // ---------------------------------
            // Delete OLD image from Cloudinary
            // ---------------------------------

            if (carousel.publicId) {
                try {
                    await cloudinary.uploader.destroy(
                        carousel.publicId,
                        {
                            resource_type: "image",
                        }
                    );
                } catch (cloudinaryError) {
                    console.error(
                        "Old image delete error:",
                        cloudinaryError
                    );
                }
            }

            // ---------------------------------
            // Save NEW image
            // ---------------------------------

            carousel.image = uploadResult.secure_url;
            carousel.publicId = uploadResult.public_id;
        }


        // Save changes

        await carousel.save();


        return NextResponse.json({
            success: true,
            message: "Carousel updated successfully.",
            carousel,
        });

    } catch (error) {

        console.error(
            "Update carousel error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update carousel.",
            },
            { status: 500 }
        );
    }
}


// ==========================================
// PATCH - ACTIVATE / DEACTIVATE
// ==========================================

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

        const body = await request.json();

        const { isActive } = body;

        // Validate isActive

        if (typeof isActive !== "boolean") {
            return NextResponse.json(
                {
                    success: false,
                    message: "isActive must be true or false.",
                },
                { status: 400 }
            );
        }


        const carousel = await Carousel.findByIdAndUpdate(
            id,
            {
                isActive,
            },
            {
                new: true,
                runValidators: true,
            }
        );


        if (!carousel) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Carousel not found.",
                },
                { status: 404 }
            );
        }


        return NextResponse.json({
            success: true,
            message: isActive
                ? "Carousel activated successfully."
                : "Carousel deactivated successfully.",
            carousel,
        });

    } catch (error) {

        console.error(
            "Toggle carousel error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update carousel status.",
            },
            { status: 500 }
        );
    }
}


// ==========================================
// DELETE - DELETE CAROUSEL
// ==========================================

export async function DELETE(request, { params }) {
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

        const carousel = await Carousel.findById(id);

        if (!carousel) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Carousel not found.",
                },
                { status: 404 }
            );
        }


        // ---------------------------------
        // Delete image from Cloudinary
        // ---------------------------------

        if (carousel.publicId) {
            try {
                await cloudinary.uploader.destroy(
                    carousel.publicId,
                    {
                        resource_type: "image",
                    }
                );
            } catch (cloudinaryError) {
                console.error(
                    "Cloudinary delete error:",
                    cloudinaryError
                );
            }
        }


        // ---------------------------------
        // Delete from MongoDB
        // ---------------------------------

        await Carousel.findByIdAndDelete(id);


        return NextResponse.json({
            success: true,
            message: "Carousel deleted successfully.",
        });

    } catch (error) {

        console.error(
            "Delete carousel error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete carousel.",
            },
            { status: 500 }
        );
    }
}