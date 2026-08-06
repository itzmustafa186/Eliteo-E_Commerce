"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const HomeProducts = ({ products }) => {
  const router = useRouter();

  return (
    <section className="py-16 lg:py-20">

      {/* Heading */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-600">
            Trending Collection
          </span>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900">
            Popular Products
          </h2>

          <p className="mt-3 max-w-2xl text-gray-500">
            Discover our best-selling products with premium quality,
            modern designs, and unbeatable prices.
          </p>
        </div>

        <button
          onClick={() => router.push("/all-products")}
          className="group flex items-center gap-2 rounded-full border border-orange-200 bg-white px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-600 hover:text-white"
        >
          View All
          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        </button>

      </div>

      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        loop
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

      {/* Bottom Button */}
      <div className="mt-14 flex justify-center">
        <button
          onClick={() => router.push("/all-products")}
          className="group flex items-center gap-3 rounded-full bg-orange-600 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:bg-orange-700"
        >
          Explore All Products
          <ArrowRight
            size={20}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </div>

    </section>
  );
};

export default HomeProducts;