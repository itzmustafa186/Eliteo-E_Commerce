"use client";

import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ReviewSection from "./ReviewSection";
import { assets } from "@/assets/assets";

const ProductDetailsClient = ({
    productData,
    featuredProducts = [],
    reviews = [],
}) => {
    const { router, addToCart } = useAppContext();

    const [mainImage, setMainImage] = useState(null);

    if (!productData) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-slate-500">
                    Product not found.
                </p>
            </div>
        );
    }

    const currentImage = useMemo(
        () => mainImage || productData.images?.[0],
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
            productData.images?.map((image, index) => (
                <button
                    type="button"
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${currentImage === image
                            ? "border-indigo-500 shadow-md shadow-indigo-100"
                            : "border-slate-200 hover:border-indigo-300"
                        }`}
                >
                    <Image
                        src={image}
                        alt={`${productData.name} ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-contain p-2"
                    />
                </button>
            )),
        [
            productData.images,
            productData.name,
            currentImage,
        ]
    );

    useEffect(() => {
        router.prefetch("/cart");
    }, [router]);

    const discount =
        productData.price > 0
            ? Math.round(
                ((productData.price - productData.offerPrice) /
                    productData.price) *
                100
            )
            : 0;

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

                    {/* Breadcrumb */}
                    <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                        <span>Home</span>
                        <span>/</span>
                        <span>{productData.category}</span>
                        <span>/</span>
                        <span className="truncate text-slate-600">
                            {productData.name}
                        </span>
                    </div>

                    {/* Product */}
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

                        {/* =================================
                            PRODUCT IMAGES
                        ================================= */}
                        <div>
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

                                {discount > 0 && (
                                    <span className="absolute left-5 top-5 z-10 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                                        SAVE {discount}%
                                    </span>
                                )}

                                <div className="relative aspect-square w-full">
                                    <Image
                                        src={currentImage}
                                        alt={productData.name}
                                        fill
                                        priority
                                        quality={90}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain transition-all duration-500"
                                    />
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                {thumbnails}
                            </div>
                        </div>

                        {/* =================================
                            PRODUCT INFORMATION
                        ================================= */}
                        <div className="flex flex-col">

                            {/* Category */}
                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                                {productData.category}
                            </p>

                            {/* Product Name */}
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                                {productData.name}
                            </h1>

                            {/* Rating */}
                            <div className="mt-5 flex items-center gap-3">
                                {productData.rating > 0 ? (
                                    <>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map(
                                                (_, index) => (
                                                    <Image
                                                        key={index}
                                                        src={
                                                            index <
                                                                Math.round(
                                                                    productData.rating
                                                                )
                                                                ? assets.star_icon
                                                                : assets.star_dull_icon
                                                        }
                                                        alt="star"
                                                        width={17}
                                                        height={17}
                                                    />
                                                )
                                            )}
                                        </div>

                                        <span className="font-semibold text-slate-700">
                                            {productData.rating}
                                        </span>

                                        <span className="text-sm text-slate-400">
                                            ({productData.reviewCount || 0} Reviews)
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-sm text-slate-400">
                                        No reviews yet
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="mt-6 leading-7 text-slate-500">
                                {productData.description}
                            </p>

                            {/* Price */}
                            <div className="mt-7 flex flex-wrap items-baseline gap-3">
                                <span className="text-3xl font-bold text-slate-900">
                                    Rs.{" "}
                                    {productData.offerPrice?.toLocaleString()}
                                </span>

                                {productData.price >
                                    productData.offerPrice && (
                                        <span className="text-lg text-slate-400 line-through">
                                            Rs.{" "}
                                            {productData.price?.toLocaleString()}
                                        </span>
                                    )}
                            </div>

                            {/* Savings */}
                            {discount > 0 && (
                                <p className="mt-2 text-sm font-medium text-emerald-600">
                                    You save Rs.{" "}
                                    {(
                                        productData.price -
                                        productData.offerPrice
                                    ).toLocaleString()}
                                </p>
                            )}

                            {/* Divider */}
                            <div className="my-8 h-px bg-slate-200" />

                            {/* Product Information */}
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <div className="grid grid-cols-2 border-b border-slate-200">
                                    <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                                        Brand
                                    </div>

                                    <div className="px-5 py-4 text-sm font-medium text-slate-900">
                                        {productData.brand || "N/A"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2">
                                    <div className="bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                                        Category
                                    </div>

                                    <div className="px-5 py-4 text-sm font-medium text-slate-900">
                                        {productData.category}
                                    </div>
                                </div>
                            </div>

                            {/* Stock */}
                            <div className="mt-6 flex items-center gap-2">
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${Number(productData.stock) > 0
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                        }`}
                                />

                                <span
                                    className={`text-sm font-semibold ${Number(productData.stock) > 0
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {Number(productData.stock) > 0
                                        ? `${productData.stock} in stock`
                                        : "Out of stock"}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="mt-7">
                                {Number(productData.stock) <= 0 ? (
                                    <div className="flex h-14 w-full items-center justify-center rounded-xl bg-slate-100 text-sm font-bold uppercase tracking-wider text-slate-400">
                                        Sold Out
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full rounded-xl border border-slate-900 bg-white py-3.5 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                                        >
                                            Add to Cart
                                        </button>

                                        <button
                                            onClick={handleBuyNow}
                                            className="w-full rounded-xl bg-slate-900 py-3.5 font-semibold !text-white shadow-lg shadow-slate-200 transition hover:bg-indigo-600 hover:shadow-indigo-200"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* =================================
                        REVIEWS
                    ================================= */}
                    <div className="mt-16">
                        <ReviewSection
                            productId={productData._id}
                            rating={productData.rating}
                            reviewCount={productData.reviewCount}
                            reviews={reviews}
                        />
                    </div>

                    {/* =================================
                        FEATURED PRODUCTS
                    ================================= */}
                    {featuredProducts.length > 0 && (
                        <section className="mt-20 border-t border-slate-200 pt-16">

                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">
                                    You May Also Like
                                </p>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                    Featured Products
                                </h2>

                                <p className="mx-auto mt-3 max-w-xl text-slate-500">
                                    Explore more premium products selected
                                    from our collection.
                                </p>
                            </div>

                            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product._id.toString()}
                                        product={product}
                                    />
                                ))}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() =>
                                        router.push("/all-products")
                                    }
                                    className="rounded-full border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Explore More Products
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
};

export default ProductDetailsClient;