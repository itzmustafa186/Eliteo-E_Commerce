"use client";

import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { Heart } from "lucide-react";
import React, { memo } from "react";

const ProductCard = ({ product }) => {
    const { currency } = useAppContext();
    const isOutOfStock = product.stock <= 0;

    const discount = Math.round(
        ((product.price - product.offerPrice) / product.price) * 100
    );

    return (
        <Link
            href={`/product/${product.slug}`}
            className={`group relative w-full overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOutOfStock
                ? "border-gray-200"
                : "border-gray-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
                }`}
        >

            {/* IMAGE */}
            <div
                className={`relative flex aspect-square items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50 p-5 ${isOutOfStock ? "opacity-70" : ""
                    }`}
            >
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={220}
                    height={220}
                    className={`max-h-full max-w-full object-contain transition duration-500 ${!isOutOfStock && "group-hover:scale-105"
                        }`}
                />

                {/* Save Badge */}
                {!isOutOfStock && discount > 0 && (
                    <span className="absolute top-4 left-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                        SAVE {discount}%
                    </span>
                )}

                {/* Out of Stock Badge */}
                {isOutOfStock && (
                    <span className="absolute bottom-4 left-4 rounded-full bg-gray-900 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                        Out of Stock
                    </span>
                )}

                
            </div>

         

            {/* Quick View */}



            {/* DETAILS */}
            <div className="space-y-2 p-4">

                {/* Category */}
                <span className="text-xs uppercase tracking-widest text-orange-500 font-semibold">
                    {product.category}
                </span>

                {/* Name */}
                <h3 className="line-clamp-2 h-11 text-sm lg:text-base font-semibold text-gray-900 group-hover:text-orange-600">
                    {product.name}
                </h3>

                {/* Rating */}
                {/* Rating */}
                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1">

                        <Image
                            src={assets.star_icon}
                            alt="star"
                            width={15}
                            height={15}
                        />

                        <span className="text-sm font-medium text-orange-600">
                            {product.rating || 0}
                        </span>

                    </div>


                    <span className="text-xs text-gray-400">
                        {product.reviewCount || 0} Reviews
                    </span>

                </div>

                {/* PRICE */}
                <div className="pt-1">

                    <h2 className="text-xl font-bold text-orange-600">
                        {currency}{product.offerPrice.toLocaleString()}
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                            {currency}{product.price.toLocaleString()}
                        </span>


                    </div>

                </div>

                {/* Buy Button */}
                <button
                    disabled={isOutOfStock}
                    className={`mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition ${isOutOfStock
                            ? "cursor-not-allowed bg-gray-300 text-gray-600"
                            : "bg-orange-600 text-white hover:bg-orange-700"
                        }`}
                >
                    {isOutOfStock ? "Out of Stock" : "Buy Now"}
                </button>

            </div>


            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-orange-500/0 transition group-hover:ring-orange-500/20"></div>
        </Link >
    );
};

export default memo(ProductCard);