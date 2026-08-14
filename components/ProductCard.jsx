"use client";

import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { memo } from "react";

const ProductCard = ({ product }) => {
    const { currency } = useAppContext();

    const isOutOfStock = product.stock <= 0;

    const discount =
        product.price > 0
            ? Math.round(
                ((product.price - product.offerPrice) /
                    product.price) *
                100
            )
            : 0;

    return (
        <div
            className={`group relative w-full overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOutOfStock
                ? "border-slate-200"
                : "border-slate-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
                }`}
        >
            {/* Product Image */}
            <Link href={`/product/${product.slug}`}>
                <div
                    className={`relative flex aspect-square w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 sm:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] ${isOutOfStock ? "opacity-70" : ""
                        }`}
                >
                    <div className="relative flex h-[82%] w-[82%] items-center justify-center">
                        <Image
                            src={product.images?.[0]}
                            alt={product.name}
                            fill
                            sizes="
                                (max-width: 640px) 50vw,
                                (max-width: 768px) 33vw,
                                (max-width: 1024px) 25vw,
                                (max-width: 1280px) 20vw,
                                18vw
                            "
                            className={`object-contain transition-transform duration-500 ${!isOutOfStock
                                ? "group-hover:scale-110"
                                : ""
                                }`}
                        />
                    </div>

                    {/* Discount */}
                    {!isOutOfStock && discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white shadow-md sm:left-4 sm:top-4 sm:text-xs">
                            SAVE {discount}%
                        </span>
                    )}

                    {/* Out Of Stock */}
                    {isOutOfStock && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg sm:bottom-4 sm:left-4 sm:px-4 sm:text-xs">
                            Out of Stock
                        </span>
                    )}
                </div>
            </Link>

            {/* Product Details */}
            <div className="p-3.5 sm:p-4 lg:p-5">
                {/* Category */}
                <Link href={`/product/${product.slug}`}>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-500 sm:text-xs">
                        {product.category}
                    </p>
                </Link>

                {/* Product Name */}
                <Link href={`/product/${product.slug}`}>
                    <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-base">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1">
                        <Image
                            src={assets.star_icon}
                            alt="Rating"
                            width={14}
                            height={14}
                        />

                        <span className="text-xs font-semibold text-indigo-600 sm:text-sm">
                            {product.rating || 0}
                        </span>
                    </div>

                    <span className="truncate text-[10px] text-slate-400 sm:text-xs">
                        {product.reviewCount || 0} Reviews
                    </span>
                </div>

                {/* Price */}
                <div className="mt-3">
                    <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                            {currency}
                            {product.offerPrice?.toLocaleString()}
                        </span>

                        {product.price > product.offerPrice && (
                            <span className="text-xs text-slate-400 line-through sm:text-sm">
                                {currency}
                                {product.price?.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Buy Button */}
                <Link
                    href={`/product/${product.slug}`}
                    className={`mt-4 flex w-full items-center justify-center rounded-xl py-2.5 text-xs font-semibold sm:py-3 sm:text-sm ${isOutOfStock
                            ? "pointer-events-none cursor-not-allowed bg-slate-100 !text-slate-400"
                            : "bg-slate-900 !text-white shadow-sm hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-200"
                        }`}
                >
                    {isOutOfStock ? "Out of Stock" : "Buy Now"}
                </Link>
            </div>

            {/* Premium Hover Ring */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-indigo-500/0 transition-all duration-300 group-hover:ring-indigo-500/20" />
        </div>
    );
};

export default memo(ProductCard);