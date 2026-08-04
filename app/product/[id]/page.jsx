import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function ProductPage({ params }) {
    const { id } = await params;

    await connectDB();

    const productData = await Product.findById(id)
        .select("name description image offerPrice price category")
        .lean();

    if (!productData) {
        notFound();
    }

    const featuredProducts = await Product.find({
        category: productData.category,
        _id: { $ne: productData._id },
    })

        .limit(5)
        .lean();

    return (
        <ProductDetailsClient
            productData={productData}
            featuredProducts={featuredProducts}
        />
    );
}