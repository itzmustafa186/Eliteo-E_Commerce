import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";



export default async function ProductPage({ params }) {
    const { id } = await params;
    console.time("page");

    await connectDB();

    console.time("product");
    const productData = await Product.findById(id).lean();
    console.timeEnd("product");

    console.time("featured");
    const featuredProducts = await Product.find({})
        .sort({ date: -1 })
        .limit(5)
        .lean();
    console.timeEnd("featured");

    console.timeEnd("page");

    return (
        <ProductDetailsClient
            productData={JSON.parse(JSON.stringify(productData))}
            featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
        />
    );
}