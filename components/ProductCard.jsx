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
            className={`
                group relative w-full overflow-hidden rounded-[24px]
                border bg-white
                transition-all duration-300
                ${isOutOfStock
                    ? "border-[#E8E1D6]"
                    : "border-[#E8E1D6] hover:-translate-y-1 hover:border-[#D9C49B] hover:shadow-[0_18px_45px_rgba(23,32,51,0.08)]"
                }
            `}
        >

            {/* Product Image */}
            <Link href={`/product/${product.slug}`}>
                <div
                    className={`
                        relative flex aspect-square w-full
                        items-center justify-center overflow-hidden
                        bg-[#F4EFE6]
                        sm:aspect-[4/3]
                        lg:aspect-square
                        xl:aspect-[4/3]
                        ${isOutOfStock ? "opacity-65" : ""}
                    `}
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
                            className={`
                                object-contain
                                transition-transform duration-500
                                ${!isOutOfStock
                                    ? "group-hover:scale-110"
                                    : ""
                                }
                            `}
                        />

                    </div>


                    {/* Discount */}
                    {!isOutOfStock && discount > 0 && (
                        <span
                            className="
                                absolute left-3 top-3
                                rounded-full
                                border border-[#DCCBAA]
                                bg-white/90
                                px-3 py-1.5
                                text-[10px] font-semibold
                                tracking-wide
                                text-[#9B7A42]
                                shadow-sm
                                backdrop-blur
                                sm:left-4 sm:top-4 sm:text-xs
                            "
                        >
                            SAVE {discount}%
                        </span>
                    )}


                    {/* Out Of Stock */}
                    {isOutOfStock && (
                        <span
                            className="
                                absolute bottom-3 left-3
                                rounded-full
                                border border-[#E8E1D6]
                                bg-[#172033]
                                px-3 py-1.5
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-white
                                shadow-md
                                sm:bottom-4 sm:left-4
                                sm:px-4 sm:text-xs
                            "
                        >
                            Out of Stock
                        </span>
                    )}

                </div>
            </Link>


            {/* Product Details */}
            <div className="p-4 sm:p-5 lg:p-6">

                {/* Category */}
                <Link href={`/product/${product.slug}`}>
                    <p
                        className="
                            mb-1.5
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-[#9B7A42]
                            sm:text-xs
                        "
                    >
                        {product.category}
                    </p>
                </Link>


                {/* Product Name */}
                <Link href={`/product/${product.slug}`}>
                    <h3
                        className="
                            line-clamp-2
                            min-h-[40px]
                            text-sm
                            font-semibold
                            leading-5
                            text-[#172033]
                            transition-colors
                            group-hover:text-[#9B7A42]
                            sm:text-base
                        "
                    >
                        {product.name}
                    </h3>
                </Link>


                {/* Rating */}
                <div className="mt-4 flex items-center justify-between gap-2">

                    <div
                        className="
                            flex items-center gap-1.5
                            rounded-full
                            border border-[#E8E1D6]
                            bg-[#F4EFE6]
                            px-2.5 py-1
                        "
                    >
                        <Image
                            src={assets.star_icon}
                            alt="Rating"
                            width={14}
                            height={14}
                        />

                        <span className="text-xs font-semibold text-[#9B7A42] sm:text-sm">
                            {product.rating || 0}
                        </span>
                    </div>


                    <span className="truncate text-[10px] text-[#8A8F97] sm:text-xs">
                        {product.reviewCount || 0} Reviews
                    </span>

                </div>


                {/* Price */}
                <div className="mt-4">

                    <div className="flex flex-wrap items-baseline gap-2">

                        <span
                            className="
                                text-lg font-semibold
                                tracking-tight
                                text-[#172033]
                                sm:text-xl
                                lg:text-2xl
                            "
                        >
                            {currency}
                            {product.offerPrice?.toLocaleString()}
                        </span>


                        {product.price > product.offerPrice && (
                            <span className="text-xs text-[#9A9DA4] line-through sm:text-sm">
                                {currency}
                                {product.price?.toLocaleString()}
                            </span>
                        )}

                    </div>

                </div>


                {/* Buy Button */}
                <Link
                    href={`/product/${product.slug}`}
                    className={`
                        mt-5
                        flex w-full
                        items-center justify-center
                        rounded-xl
                        border
                        py-2.5
                        text-xs
                        font-semibold
                        transition-all
                        duration-300
                        sm:py-3 sm:text-sm

                        ${isOutOfStock
                            ? `
                                pointer-events-none
                                cursor-not-allowed
                                border-[#E8E1D6]
                                bg-[#F4EFE6]
                                !text-[#9A9DA4]
                              `
                            : `
                                border-[#9B7A42]
                                bg-[#9B7A42]
                                !text-white
                                hover:border-[#856631]
                                hover:bg-[#856631]
                                hover:shadow-[0_8px_20px_rgba(155,122,66,0.18)]
                              `
                        }
                    `}
                >
                    {isOutOfStock ? "Out of Stock" : "View Product"}
                </Link>

            </div>


            {/* Premium Hover Ring */}
            <div
                className="
                    pointer-events-none
                    absolute inset-0
                    rounded-[24px]
                    ring-1 ring-[#C8A96B]/0
                    transition-all duration-300
                    group-hover:ring-[#C8A96B]/30
                "
            />

        </div>
    );
};

export default memo(ProductCard);