import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function ProductPage({ params }) {
    const { id } = await params;

    await connectDB();

    const productData = await Product.findById(id).lean();

    if (!productData) {
        notFound();
    }

    const featuredProducts = await Product.find({})
        .sort({ date: -1 })
        .limit(5)
        .lean();

    return (
        <ProductDetailsClient
            productData={JSON.parse(JSON.stringify(productData))}
            featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
        />
    );
}