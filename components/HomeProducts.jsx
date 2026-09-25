"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const HomeProducts = ({ products = [] }) => {
    const router = useRouter();

    // Show nothing if there are no featured products
    if (!products.length) {
        return null;
    }

    return (
        <section className="bg-[#fafafa] py-14 lg:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}

                <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8DCC8] bg-[#F7F3EA] px-4 py-1.5 text-sm font-semibold text-[#9B7A42]">
                            <Sparkles size={15} />
                            Handpicked For You
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
                            Featured Products
                        </h2>

                        <p className="mt-3 max-w-2xl text-gray-500">
                            Discover our handpicked selection of premium
                            products, carefully chosen for you.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/all-products")}
                        className="group flex items-center gap-2 self-start rounded-full border border-[#D8C29A] bg-white px-6 py-3 font-semibold text-[#9B7A42] shadow-sm transition hover:bg-[#9B7A42] hover:text-white md:self-auto"
                    >
                        View All

                        <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </div>

                {/* ================= SLIDER ================= */}

                <div className="relative">

                    {/* Previous Button */}
                    <button
                        className="featured-products-prev absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:border-[#9B7A42] hover:bg-[#9B7A42] hover:text-white sm:-left-2 sm:h-11 sm:w-11 lg:-left-5"
                        aria-label="Previous featured products"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* Next Button */}
                    <button
                        className="featured-products-next absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:border-[#9B7A42] hover:bg-[#9B7A42] hover:text-white sm:-right-2 sm:h-11 sm:w-11 lg:-right-5"
                        aria-label="Next featured products"
                    >
                        <ArrowRight size={18} />
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                            prevEl: ".featured-products-prev",
                            nextEl: ".featured-products-next",
                        }}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        loop={products.length > 4}
                        grabCursor
                        spaceBetween={20}
                        breakpoints={{
                            320: {
                                slidesPerView: 1.2,
                                spaceBetween: 12,
                            },
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 2.5,
                                spaceBetween: 18,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* ================= BOTTOM BUTTON ================= */}

                <div className="mt-12 flex justify-center">
                    <button
                        onClick={() => router.push("/all-products")}
                        className="group flex items-center gap-3 rounded-full bg-[#172033] px-8 py-4 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#9B7A42]"
                    >
                        Explore All Products

                        <ArrowRight
                            size={20}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default HomeProducts;