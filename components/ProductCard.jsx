"use client";

import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { Heart } from "lucide-react";
import React, { memo } from "react";

const ProductCard = ({ product }) => {
    const { currency } = useAppContext();

    const discount = Math.round(
        ((product.price - product.offerPrice) / product.price) * 100
    );

    return (
        <Link
            href={`/product/${product._id}`}
            className="group relative w-full max-w-sm mx-auto overflow-hidden rounded-3xl bg-white border border-gray-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-orange-200"
        >
            {/* IMAGE */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50">

                <Image
                    src={product.image[0]}
                    alt={product.name}
                    fill
                    priority={false}
                    sizes="(max-width:768px) 50vw,(max-width:1200px) 33vw,20vw"
                    className="object-contain p-5 sm:p-7 transition duration-700 group-hover:scale-110 group-hover:rotate-2"
                />

                {/* Discount */}
                {discount > 0 && (
                    <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        SAVE {discount}%
                    </div>
                )}

                {/* Wishlist */}
                <button className="absolute right-3 top-3 sm:right-4 sm:top-4 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition hover:scale-110 hover:bg-orange-500 hover:text-white">
                    <Heart size={18} />
                </button>

                {/* Quick View */}
                <div className="hidden md:block absolute bottom-5 left-1/2 w-[85%] -translate-x-1/2 translate-y-20 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-full bg-orange-600 py-3 text-center font-semibold text-white shadow-xl">
                        View Product
                    </div>
                </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-3 p-5">

                {/* Category */}
                <span className="text-xs uppercase tracking-widest text-orange-500 font-semibold">
                    {product.category}
                </span>

                {/* Name */}
                <h3 className="line-clamp-2 min-h-[48px] text-base sm:text-lg font-semibold text-gray-900 transition group-hover:text-orange-600">
                    {product.name}
                </h3>

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
                            4.8
                        </span>

                    </div>

                    <span className="text-xs text-gray-400">
                        120+ Reviews
                    </span>

                </div>

                {/* PRICE */}
                <div className="flex items-end justify-between pt-2">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            {currency}
                            {product.offerPrice}
                        </h2>

                        <p className="text-sm text-gray-400 line-through">
                            {currency}
                            {product.price}
                        </p>

                    </div>

                    <div className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                        Buy
                    </div>

                </div>

            </div>

            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-orange-500/0 transition group-hover:ring-orange-500/20"></div>
        </Link>
    );
};

export default memo(ProductCard);