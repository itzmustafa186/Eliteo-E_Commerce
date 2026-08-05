import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";



export default async function ProductPage({ params }) {
    const { id } = await params;
    console.time("page");
    await connectDB();
    console.time("product");
    const productData = await Product.findById(id)
        .select("name description image offerPrice price category")
        .lean();
    console.timeEnd("product");
    if (!productData) {
        notFound();
    }
    console.time("featured");
    const featuredProducts = await Product.find({
        category: productData.category,
        _id: { $ne: productData._id },
    })

        .limit(5)
        .lean();
        
    console.timeEnd("featured");

    console.timeEnd("page");
    return (
        <ProductDetailsClient
            productData={productData}
            featuredProducts={featuredProducts}
        />
    );
}