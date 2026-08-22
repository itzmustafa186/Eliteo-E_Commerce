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
            <div className="flex min-h-screen items-center justify-center bg-[#FAF8F4]">
                <p className="text-[#687080]">
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

    const thumbnails = useMemo(
        () =>
            productData.images?.map((image, index) => (
                <button
                    type="button"
                    key={index}
                    onClick={() => setMainImage(image)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                        currentImage === image
                            ? "border-[#9B7A42] shadow-md shadow-[#9B7A42]/10"
                            : "border-[#E8E1D6] hover:border-[#C8A96B]"
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

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#FAF8F4]">

                {/* ================================================= */}
                {/* MAIN CONTAINER */}
                {/* ================================================= */}

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

                    {/* ================================================= */}
                    {/* BREADCRUMB */}
                    {/* ================================================= */}

                    <div className="mb-8 flex items-center gap-2 text-sm text-[#9A9DA4]">

                        <button
                            onClick={() => router.push("/")}
                            className="transition hover:text-[#9B7A42]"
                        >
                            Home
                        </button>

                        <span>/</span>

                        <button
                            onClick={() =>
                                router.push(
                                    `/category/${productData.category
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-")}`
                                )
                            }
                            className="transition hover:text-[#9B7A42]"
                        >
                            {productData.category}
                        </button>

                        <span>/</span>

                        <span className="truncate text-[#687080]">
                            {productData.name}
                        </span>

                    </div>


                    {/* ================================================= */}
                    {/* PRODUCT */}
                    {/* ================================================= */}

                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

                        {/* ================================================= */}
                        {/* LEFT — IMAGES */}
                        {/* ================================================= */}

                        <div>

                            <div className="relative overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white p-5 shadow-[0_12px_40px_rgba(23,32,51,0.05)] sm:p-8">

                                {/* Discount */}

                                {discount > 0 && (
                                    <span className="absolute left-6 top-6 z-10 rounded-full bg-[#9B7A42] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                                        SAVE {discount}%
                                    </span>
                                )}

                                {/* Image */}

                                <div className="relative aspect-square w-full">

                                    {currentImage && (
                                        <Image
                                            src={currentImage}
                                            alt={productData.name}
                                            fill
                                            priority
                                            quality={90}
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-contain transition-all duration-500"
                                        />
                                    )}

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* THUMBNAILS */}
                            {/* ================================================= */}

                            <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
                                {thumbnails}
                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* RIGHT — PRODUCT INFORMATION */}
                        {/* ================================================= */}

                        <div className="flex flex-col">

                            {/* Category */}

                            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9B7A42]">
                                {productData.category}
                            </p>


                            {/* Product Name */}

                            <h1 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
                                {productData.name}
                            </h1>


                            {/* Rating */}

                            <div className="mt-5 flex items-center gap-3">

                                {productData.rating > 0 ? (
                                    <>
                                        <div className="flex items-center gap-1">

                                            {Array.from({
                                                length: 5,
                                            }).map((_, index) => (
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
                                            ))}

                                        </div>

                                        <span className="font-semibold text-[#172033]">
                                            {productData.rating}
                                        </span>

                                        <span className="text-sm text-[#9A9DA4]">
                                            (
                                            {productData.reviewCount ||
                                                0}{" "}
                                            Reviews)
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-sm text-[#9A9DA4]">
                                        No reviews yet
                                    </span>
                                )}

                            </div>


                            {/* Description */}

                            <p className="mt-6 leading-7 text-[#687080]">
                                {productData.description}
                            </p>


                            {/* Price */}

                            <div className="mt-7 flex flex-wrap items-baseline gap-3">

                                <span className="text-3xl font-semibold text-[#9B7A42]">
                                    Rs.{" "}
                                    {productData.offerPrice?.toLocaleString()}
                                </span>

                                {productData.price >
                                    productData.offerPrice && (
                                    <span className="text-lg text-[#9A9DA4] line-through">
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

                            <div className="my-8 h-px bg-[#E8E1D6]" />


                            {/* ================================================= */}
                            {/* PRODUCT INFORMATION */}
                            {/* ================================================= */}

                            <div className="overflow-hidden rounded-2xl border border-[#E8E1D6] bg-white">

                                <div className="grid grid-cols-2 border-b border-[#E8E1D6]">

                                    <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                                        Brand
                                    </div>

                                    <div className="px-5 py-4 text-sm font-medium text-[#172033]">
                                        {productData.brand || "N/A"}
                                    </div>

                                </div>


                                <div className="grid grid-cols-2 border-b border-[#E8E1D6]">

                                    <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                                        Category
                                    </div>

                                    <div className="px-5 py-4 text-sm font-medium text-[#172033]">
                                        {productData.category}
                                    </div>

                                </div>


                                <div className="grid grid-cols-2">

                                    <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                                        SKU
                                    </div>

                                    <div className="px-5 py-4 text-sm font-medium text-[#172033]">
                                        {productData.sku || "N/A"}
                                    </div>

                                </div>

                            </div>


                            {/* ================================================= */}
                            {/* STOCK */}
                            {/* ================================================= */}

                            <div className="mt-6 flex items-center gap-2">

                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${
                                        Number(productData.stock) > 0
                                            ? "bg-emerald-500"
                                            : "bg-red-500"
                                    }`}
                                />

                                <span
                                    className={`text-sm font-semibold ${
                                        Number(productData.stock) > 0
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {Number(productData.stock) > 0
                                        ? `${productData.stock} in stock`
                                        : "Out of stock"}
                                </span>

                            </div>


                            {/* ================================================= */}
                            {/* ACTIONS */}
                            {/* ================================================= */}

                            <div className="mt-7">

                                {Number(productData.stock) <= 0 ? (
                                    <div className="flex h-14 w-full items-center justify-center rounded-xl bg-[#F1EDE6] text-sm font-bold uppercase tracking-wider text-[#9A9DA4]">
                                        Sold Out
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 sm:flex-row">

                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full rounded-xl border border-[#9B7A42] bg-white py-3.5 font-semibold text-[#9B7A42] transition-all hover:bg-[#9B7A42] hover:text-white"
                                        >
                                            Add to Cart
                                        </button>

                                        <button
                                            onClick={handleBuyNow}
                                            className="w-full rounded-xl border border-[#9B7A42] bg-[#9B7A42] py-3.5 font-semibold text-white shadow-lg shadow-[#9B7A42]/15 transition-all hover:border-[#856631] hover:bg-[#856631]"
                                        >
                                            Buy Now
                                        </button>

                                    </div>
                                )}

                            </div>


                            {/* ================================================= */}
                            {/* TRUST */}
                            {/* ================================================= */}

                            <div className="mt-6 grid grid-cols-3 gap-3">

                                <div className="rounded-xl border border-[#E8E1D6] bg-white p-3 text-center">
                                    <p className="text-xs font-semibold text-[#172033]">
                                        Secure
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#9A9DA4]">
                                        Checkout
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8E1D6] bg-white p-3 text-center">
                                    <p className="text-xs font-semibold text-[#172033]">
                                        Fast
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#9A9DA4]">
                                        Delivery
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E8E1D6] bg-white p-3 text-center">
                                    <p className="text-xs font-semibold text-[#172033]">
                                        COD
                                    </p>
                                    <p className="mt-1 text-[10px] text-[#9A9DA4]">
                                        Available
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* REVIEWS */}
                    {/* ================================================= */}

                    <div className="mt-16 border-t border-[#E8E1D6] pt-12">

                        <ReviewSection
                            productId={productData._id}
                            rating={productData.rating}
                            reviewCount={productData.reviewCount}
                            reviews={reviews}
                        />

                    </div>


                    {/* ================================================= */}
                    {/* FEATURED PRODUCTS */}
                    {/* ================================================= */}

                    {featuredProducts.length > 0 && (
                        <section className="mt-20 border-t border-[#E8E1D6] pt-16">

                            <div className="text-center">

                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9B7A42]">
                                    You May Also Like
                                </p>

                                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                                    Featured Products
                                </h2>

                                <p className="mx-auto mt-3 max-w-xl text-[#687080]">
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
                                        router.push(
                                            "/all-products"
                                        )
                                    }
                                    className="rounded-full border border-[#E8E1D6] bg-white px-8 py-3 font-semibold text-[#687080] transition-all hover:border-[#C8A96B] hover:bg-[#F4EFE6] hover:text-[#9B7A42]"
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