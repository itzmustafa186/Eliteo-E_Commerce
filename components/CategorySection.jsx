"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const categories = [
    {
        name: "Earbuds",
        slug: "earbuds",
        dbCategory: "Earbuds",
        image: "/categories/earbuds.png",
        bg: "from-violet-100 via-purple-50 to-white",
        accent: "bg-violet-500",
    },
    {
        name: "Headphones",
        slug: "headphones",
        dbCategory: "Headphones",
        image: "/categories/headphones.png",
        bg: "from-blue-100 via-sky-50 to-white",
        accent: "bg-blue-500",
    },
    {
        name: "Chargers",
        slug: "chargers",
        dbCategory: "Chargers",
        image: "/categories/chargers.png",
        bg: "from-orange-100 via-amber-50 to-white",
        accent: "bg-orange-500",
    },
    {
        name: "Cables",
        slug: "cables",
        dbCategory: "Cables",
        image: "/categories/cables.png",
        bg: "from-emerald-100 via-green-50 to-white",
        accent: "bg-emerald-500",
    },
    {
        name: "Power Banks",
        slug: "powerbanks",
        dbCategory: "Powerbanks",
        image: "/categories/power-banks.png",
        bg: "from-rose-100 via-pink-50 to-white",
        accent: "bg-rose-500",
    },
    {
        name: "Handsfree",
        slug: "handsfree",
        dbCategory: "Handsfree",
        image: "/categories/hand-frees.png",
        bg: "from-fuchsia-100 via-pink-50 to-white",
        accent: "bg-fuchsia-500",
    },
    {
        name: "Smartwatches",
        slug: "smartwatches",
        dbCategory: "Smartwatches",
        image: "/categories/smart-watches.png",
        bg: "from-cyan-100 via-teal-50 to-white",
        accent: "bg-cyan-500",
    },
];

const CategorySection = () => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (!sliderRef.current) return;

        const amount =
            direction === "left" ? -320 : 320;

        sliderRef.current.scrollBy({
            left: amount,
            behavior: "smooth",
        });
    };

    return (
        <section className="bg-white py-14 sm:py-16 lg:py-20 overflow-hidden">

            <div className=" mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex items-end justify-between mb-8 sm:mb-10">

                    <div>
                        <p className="text-xs sm:text-sm font-semibold tracking-[0.22em] uppercase text-gray-400 mb-2">
                            Explore
                        </p>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
                            Shop by Category
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Find what fits your everyday lifestyle.
                        </p>
                    </div>

                    {/* Desktop view all */}
                    <Link
                        href="/all-products"
                        className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition"
                    >
                        View all
                        <ArrowUpRight size={17} />
                    </Link>

                </div>

                {/* Slider wrapper */}
                <div className="relative">

                    {/* Left Arrow */}
                    <button
                        onClick={() => scroll("left")}
                        aria-label="Previous categories"
                        className="
                            absolute
                            left-0
                            top-1/2
                            -translate-y-1/2
                            z-20
                            w-10
                            h-10
                            sm:w-11
                            sm:h-11
                            rounded-full
                            bg-white
                            border
                            border-gray-200
                            shadow-lg
                            flex
                            items-center
                            justify-center
                            text-gray-800
                            hover:bg-black
                            hover:text-white
                            hover:border-black
                            transition-all
                            duration-300
                        "
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scroll("right")}
                        aria-label="Next categories"
                        className="
                            absolute
                            right-0
                            top-1/2
                            -translate-y-1/2
                            z-20
                            w-10
                            h-10
                            sm:w-11
                            sm:h-11
                            rounded-full
                            bg-white
                            border
                            border-gray-200
                            shadow-lg
                            flex
                            items-center
                            justify-center
                            text-gray-800
                            hover:bg-black
                            hover:text-white
                            hover:border-black
                            transition-all
                            duration-300
                        "
                    >
                        <ArrowRight size={18} />
                    </button>

                    {/* Slider */}
                    <div
                        ref={sliderRef}
                        className="
                            flex
                            gap-5
                            sm:gap-6
                            overflow-x-auto
                            scroll-smooth
                            snap-x
                            snap-mandatory
                            px-12
                            sm:px-14
                            pb-5
                            scrollbar-hide
                        "
                        style={{
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >

                        {categories.map((category, index) => (
                            <Link
                                href={`/category/${category.slug}`}
                                key={category.slug}
                                className="
                                    group
                                    flex-none
                                    snap-start
                                    w-[145px]
                                    sm:w-[180px]
                                    md:w-[200px]
                                    lg:w-[210px]
                                "
                            >

                                {/* Circle */}
                                <div
                                    className={`
                                        relative
                                        aspect-square
                                        rounded-full
                                        overflow-hidden
                                        bg-gradient-to-br
                                        ${category.bg}
                                        border
                                        border-white
                                        shadow-sm
                                        group-hover:shadow-xl
                                        transition-all
                                        duration-500
                                        group-hover:-translate-y-2
                                    `}
                                >

                                    {/* Decorative circles */}
                                    <div
                                        className={`
                                            absolute
                                            -top-8
                                            -right-8
                                            w-24
                                            h-24
                                            rounded-full
                                            ${category.accent}
                                            opacity-10
                                        `}
                                    />

                                    <div
                                        className="
                                            absolute
                                            bottom-5
                                            left-5
                                            w-12
                                            h-12
                                            rounded-full
                                            bg-white/50
                                            blur-sm
                                        "
                                    />

                                    {/* Product Image */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            flex
                                            items-center
                                            justify-center
                                            p-7
                                            sm:p-8
                                        "
                                    >
                                        <div
                                            className={`
                                                relative
                                                w-full
                                                h-full
                                                animate-category-float
                                                group-hover:scale-110
                                                transition-transform
                                                duration-500
                                            `}
                                        >
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                sizes="
                                                    (max-width: 640px) 145px,
                                                    (max-width: 768px) 180px,
                                                    210px
                                                "
                                                className="
                                                    object-contain
                                                    drop-shadow-xl
                                                "
                                            />
                                        </div>
                                    </div>

                                    {/* Hover overlay */}
                                    <div
                                        className="
                                            absolute
                                            inset-0
                                            rounded-full
                                            bg-black/0
                                            group-hover:bg-black/10
                                            transition-all
                                            duration-500
                                        "
                                    />

                                    {/* Arrow */}
                                    <div
                                        className="
                                            absolute
                                            right-3
                                            top-3
                                            w-8
                                            h-8
                                            sm:w-9
                                            sm:h-9
                                            rounded-full
                                            bg-white/90
                                            backdrop-blur
                                            flex
                                            items-center
                                            justify-center
                                            opacity-0
                                            scale-75
                                            group-hover:opacity-100
                                            group-hover:scale-100
                                            transition-all
                                            duration-300
                                            shadow-sm
                                        "
                                    >
                                        <ArrowUpRight
                                            size={15}
                                            className="text-gray-900"
                                        />
                                    </div>
                                </div>

                                {/* Category Name */}
                                <div className="text-center mt-4">

                                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                                        {category.name}
                                    </h3>

                                    <p className="text-xs text-gray-400 mt-1 group-hover:text-gray-600 transition">
                                        Explore collection
                                    </p>

                                </div>

                            </Link>
                        ))}

                    </div>
                </div>

                {/* Mobile View All */}
                <Link
                    href="/all-products"
                    className="
                        sm:hidden
                        mt-5
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-700
                    "
                >
                    View all products
                    <ArrowUpRight size={17} />
                </Link>

            </div>
        </section>
    );
};

export default CategorySection;