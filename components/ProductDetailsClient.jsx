"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ReviewSection from "./ReviewSection";


const ProductDetailsClient = ({ productData, featuredProducts, reviews }) => {
    const { router, addToCart } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    if (!productData) {
        return <p>Product not found.</p>;
    }
    const currentImage = useMemo(
        () => mainImage || productData.images[0],
        [mainImage, productData.images]
    );


    const handleAddToCart = useCallback(() => {
        addToCart(productData._id);
    }, [addToCart, productData._id]);

    const handleBuyNow = useCallback(() => {
        addToCart(productData._id);
        router.push("/cart");
    }, [addToCart, router, productData._id]);

    const thumbnails = useMemo(
        () =>
            productData.images.map((image, index) => (
                <div
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition ${currentImage === image
                        ? "border-orange-500"
                        : "border-transparent"
                        }`}
                >
                    <Image
                        src={image}
                        alt={productData.name}
                        width={120}
                        height={120}
                        loading="lazy"
                        className="w-full h-auto object-cover"
                    />
                </div>
            )),
        [productData.image, currentImage, productData.name]

    );

    useEffect(() => {
        router.prefetch("/cart");
    }, [router]);
    return (<>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={currentImage}
                            alt={productData.name}
                            width={900}
                            height={900}
                            priority
                            quality={85}
                            sizes="(max-width:768px)100vw,50vw"
                            className="w-full h-auto object-contain transition-all duration-300"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {thumbnails}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">

                        {
                            productData.rating > 0 ? (
                                <>
                                    <div className="flex items-center gap-0.5">

                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <Image
                                                key={index}
                                                className="h-4 w-4"
                                                src={
                                                    index < Math.round(productData.rating)
                                                        ? assets.star_icon
                                                        : assets.star_dull_icon
                                                }
                                                alt="star"
                                            />
                                        ))}

                                    </div>

                                    <p className="text-gray-600">
                                        {productData.rating}
                                    </p>

                                    <span className="text-gray-400">
                                        ({productData.reviewCount} Reviews)
                                    </span>
                                </>
                            ) : (

                                <p className="text-gray-400 text-sm">
                                    No rating yet
                                </p>

                            )

                        }

                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        Rs.{productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            Rs.{productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <table className="w-full text-sm">
                                <tbody>

                                    <tr className="border-b border-gray-200">
                                        <td className="w-32 bg-gray-50 px-5 py-4 font-semibold text-gray-700">
                                            Brand
                                        </td>
                                        <td className="px-5 py-4 text-gray-900">
                                            {productData.brand || "N/A"}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className="bg-gray-50 px-5 py-4 font-semibold text-gray-700">
                                            Category
                                        </td>
                                        <td className="px-5 py-4 text-gray-900">
                                            {productData.category}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button
                            disabled={productData.stock === 0}
                            onClick={handleAddToCart}
                            className={`w-full py-3.5 ${productData.stock === 0
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-orange-500 hover:bg-orange-600 text-white"
                                }`}
                        >
                            {productData.stock === 0 ? "Out of Stock" : "Add to Cart"}
                        </button>
                        <button onClick={handleBuyNow} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            <ReviewSection
                productId={productData._id}
                rating={productData.rating}
                reviewCount={productData.reviewCount}
                reviews={reviews}
            />
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {featuredProducts.map((product) => (
                        <ProductCard
                            key={product._id.toString()}
                            product={product}
                        />
                    ))}
                </div>
                <button
                    onClick={() => router.push("/all-products")}
                    className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
                >
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>

    )
};


export default ProductDetailsClient;
