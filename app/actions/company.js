"use server";

import connectDB from "@/config/db";
import Company from "@/models/Company";
import Product from "@/models/product";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================================================
   CATEGORY IMAGES
========================================================= */

const categoryImages = {
    earbuds: "/categories/earbuds.png",
    headphones: "/categories/headphones.png",
    chargers: "/categories/chargers.png",
    cables: "/categories/cables.png",
    powerbanks: "/categories/powerbanks.png",
    handsfree: "/categories/handsfree.png",
    smartwatches: "/categories/smartwatches.png",
};

/* =========================================================
   CREATE SLUG
========================================================= */

const createSlug = (value) => {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

/* =========================================================
   ADD COMPANY
========================================================= */

export async function addCompany(formData) {
    try {
        await connectDB();

        const name = formData.get("name")?.trim();
        const logoFile = formData.get("logo");

        if (!name) {
            return {
                success: false,
                message: "Company name is required",
            };
        }

        if (!logoFile || logoFile.size === 0) {
            return {
                success: false,
                message: "Company logo is required",
            };
        }

        const slug = createSlug(name);

        const existingCompany = await Company.findOne({
            $or: [
                { name },
                { slug },
            ],
        });

        if (existingCompany) {
            return {
                success: false,
                message: "Company already exists",
            };
        }

        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "eliteo/companies",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                )
                .end(buffer);
        });

        const company = await Company.create({
            name,
            slug,
            logo: uploadResult.secure_url,
        });

        return {
            success: true,
            message: "Company added successfully",

            company: {
                _id: company._id.toString(),
                name: company.name,
                slug: company.slug,
                logo: company.logo,
                isActive: company.isActive,
            },
        };
    } catch (error) {
        console.error("ADD COMPANY ERROR:", error);

        return {
            success: false,
            message: "Failed to add company",
        };
    }
}

/* =========================================================
   GET ACTIVE COMPANIES
========================================================= */

export async function getCompanies() {
    try {
        await connectDB();

        const companies = await Company.find({
            isActive: true,
        })
            .sort({ name: 1 })
            .lean();

        return {
            success: true,

            companies: companies.map((company) => ({
                ...company,
                _id: company._id.toString(),
            })),
        };
    } catch (error) {
        console.error("GET COMPANIES ERROR:", error);

        return {
            success: false,
            companies: [],
            message: "Failed to get companies",
        };
    }
}

/* =========================================================
   GET NAVBAR CATEGORIES
   Category → Company → Products
========================================================= */

export async function getNavbarCategories() {
    try {
        await connectDB();

        const products = await Product.aggregate([
            /* ---------------------------------------------
               ONLY ACTIVE PRODUCTS WITH A COMPANY
            --------------------------------------------- */

            {
                $match: {
                    isActive: true,
                    company: { $ne: null },
                },
            },

            /* ---------------------------------------------
               GET COMPANY
            --------------------------------------------- */

            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "companyData",
                },
            },

            {
                $unwind: "$companyData",
            },

            /* ---------------------------------------------
               GROUP BY CATEGORY + COMPANY
            --------------------------------------------- */

            {
                $group: {
                    _id: {
                        category: "$category",
                        companyId: "$companyData._id",
                        companyName: "$companyData.name",
                        companySlug: "$companyData.slug",
                        companyLogo: "$companyData.logo",
                    },

                    products: {
                        $push: {
                            _id: "$_id",
                            name: "$name",
                            slug: "$slug",
                            images: "$images",
                            price: "$price",
                            offerPrice: "$offerPrice",
                        },
                    },
                },
            },

            /* ---------------------------------------------
               GROUP COMPANIES INSIDE CATEGORY
            --------------------------------------------- */

            {
                $group: {
                    _id: "$_id.category",

                    companies: {
                        $push: {
                            _id: "$_id.companyId",
                            name: "$_id.companyName",
                            slug: "$_id.companySlug",
                            logo: "$_id.companyLogo",
                            products: "$products",
                        },
                    },
                },
            },

            /* ---------------------------------------------
               SORT CATEGORIES
            --------------------------------------------- */

            {
                $sort: {
                    _id: 1,
                },
            },
        ]);

        return {
            success: true,

            categories: products.map((category) => {
                const name = category._id;
                const slug = createSlug(name);

                return {
                    name,
                    slug,

                    image:
                        categoryImages[slug] ||
                        "/categories/default.png",

                    companies: category.companies.map((company) => ({
                        _id: company._id.toString(),
                        name: company.name,
                        slug: company.slug,
                        logo: company.logo,

                        products: company.products.map((product) => ({
                            _id: product._id.toString(),
                            name: product.name,
                            slug: product.slug,
                            images: product.images || [],
                            price: product.price,
                            offerPrice: product.offerPrice,
                        })),
                    })),
                };
            }),
        };
    } catch (error) {
        console.error(
            "GET NAVBAR CATEGORIES ERROR:",
            error
        );

        return {
            success: false,
            categories: [],
            message: "Failed to load navbar categories",
        };
    }
}