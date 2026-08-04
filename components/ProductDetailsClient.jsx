"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ProductDetailsClient = ({ productData, featuredProducts }) => {
    const { router, addToCart } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    if (!productData) {
        return <p>Product not found.</p>;
    }
    const currentImage = useMemo(
        () => mainImage || productData.image[0],
        [mainImage, productData.image]
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
            productData.image.map((image, index) => (
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
                        <div className="flex items-center gap-0.5">
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image className="h-4 w-4" src={assets.star_icon} alt="star_icon" />
                            <Image
                                className="h-4 w-4"
                                src={assets.star_dull_icon}
                                alt="star_dull_icon"
                            />
                        </div>
                        <p>(4.5)</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        ${productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            ${productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Brand</td>
                                    <td className="text-gray-800/50 ">Generic</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">Multi</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        <button onClick={handleAddToCart} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                            Add to Cart
                        </button>
                        <button onClick={handleBuyNow} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
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
