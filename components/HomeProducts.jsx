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

    if (!products.length) {
        return null;
    }

    return (
        <section className="bg-slate-50 py-16 lg:py-20">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                {/* Heading */}
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600">
                            <Sparkles size={15} />
                            Handpicked For You
                        </span>

                        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            Featured Products
                        </h2>

                        <p className="mt-3 max-w-2xl text-slate-500">
                            Discover our handpicked selection of premium
                            products, carefully chosen for you.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/all-products")}
                        className="group flex items-center gap-2 self-start rounded-full border border-indigo-200 bg-white px-6 py-3 font-semibold text-indigo-600 shadow-sm transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white md:self-auto"
                    >
                        View All

                        <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                        />
                    </button>
                </div>

                {/* Slider */}
                <div className="relative">
                    {/* Left Arrow */}
                    <button
                        className="featured-products-prev absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white sm:-left-2 sm:h-11 sm:w-11 lg:-left-5"
                        aria-label="Previous featured products"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        className="featured-products-next absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-lg transition-all duration-300 hover:border-indigo-600 hover:bg-indigo-600 hover:text-white sm:-right-2 sm:h-11 sm:w-11 lg:-right-5"
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
                                slidesPerView: 3.5,
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

                {/* Bottom Button */}
                <div className="mt-14 flex justify-center">
                    <button
                        onClick={() => router.push("/all-products")}
                        className="group flex items-center gap-3 rounded-full bg-slate-900 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-200"
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