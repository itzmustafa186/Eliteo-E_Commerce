import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";
import Review from "@/models/review";


export default async function ProductPage({ params }) {

    const { slug } = await params;



    await connectDB();



    const productData = await Product.findOne({
        slug: slug
    })
        .select("name description images offerPrice price category brand slug rating reviewCount stock ")
        .lean();




    if (!productData) {
        notFound();
    }




    const featuredProducts = await Product.find({
        category: productData.category,
        _id: { $ne: productData._id },
        isActive: true
    })
        .limit(5)
        .lean();

    const reviews = (await Review.find({
        productId: productData._id
    })
        .sort({
            createdAt: -1
        })
        .lean()
    ).map(review => ({
        ...review,
        _id: review._id.toString(),
        productId: review.productId.toString(),
    }));



    return (
        <ProductDetailsClient
            productData={{
                ...productData,
                _id: productData._id.toString()
            }}
            featuredProducts={featuredProducts.map(product => ({
                ...product,
                _id: product._id.toString()
            }))}
            reviews={reviews}
        />
    );
}