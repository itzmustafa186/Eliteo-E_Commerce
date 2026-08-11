"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HeaderSlider = () => {
  const [carousels, setCarousels] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // ==========================================
  // FETCH CAROUSELS
  // ==========================================

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        const { data } = await axios.get(
          "/api/seller/carousel"
        );

        if (data?.success) {
          const activeCarousels = (data.carousels || [])
            .filter((item) => item?.isActive)
            .sort(
              (a, b) =>
                Number(a?.order || 0) -
                Number(b?.order || 0)
            );

          setCarousels(activeCarousels);
        }
      } catch (error) {
        console.error(
          "Failed to fetch carousels:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCarousels();
  }, []);

  // ==========================================
  // AUTO SLIDE
  // ==========================================

  useEffect(() => {
    if (carousels.length <= 1 || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carousels.length - 1
          ? 0
          : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [carousels.length, isPaused]);

  // ==========================================
  // NEXT
  // ==========================================

  const nextSlide = () => {
    if (carousels.length <= 1) return;

    setCurrentSlide((prev) =>
      prev === carousels.length - 1
        ? 0
        : prev + 1
    );
  };

  // ==========================================
  // PREVIOUS
  // ==========================================

  const previousSlide = () => {
    if (carousels.length <= 1) return;

    setCurrentSlide((prev) =>
      prev === 0
        ? carousels.length - 1
        : prev - 1
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="mt-5 w-full">
        <div className="h-[300px] w-full animate-pulse bg-gray-200 sm:h-[450px] lg:h-[600px]" />
      </section>
    );
  }

  // ==========================================
  // EMPTY
  // ==========================================

  if (!carousels.length) {
    return null;
  }

  return (
    <section
      className="mt-5 w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full overflow-hidden">

        <div
          className="flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {carousels.map((carousel, index) => (
            <div
              key={carousel._id}
              className="min-w-full"
            >
              <Link
                href={
                  carousel.buttonLink ||
                  "/all-products"
                }
                className="block w-full"
              >
                <Image
                  src={carousel.image}
                  alt={
                    carousel.title ||
                    "Featured product"
                  }
                  width={1920}
                  height={700}
                  priority={index === 0}
                  loading={
                    index === 0
                      ? "eager"
                      : "lazy"
                  }
                  sizes="100vw"
                  className="
                                block
                                h-auto
                                w-full
                                object-contain
                                transition-transform
                                duration-500
                                hover:scale-[1.01]
                            "
                />
              </Link>
            </div>
          ))}
        </div>

        {/* ARROWS */}
        {carousels.length > 1 && (
          <>
            <button
              type="button"
              onClick={previousSlide}
              className="
                        absolute
                        left-4
                        top-1/2
                        hidden
                        h-10
                        w-10
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-black/30
                        text-white
                        backdrop-blur-md
                        transition
                        hover:bg-white
                        hover:text-black
                        sm:flex
                    "
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="
                        absolute
                        right-4
                        top-1/2
                        hidden
                        h-10
                        w-10
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-black/30
                        text-white
                        backdrop-blur-md
                        transition
                        hover:bg-white
                        hover:text-black
                        sm:flex
                    "
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* DOTS */}
        {carousels.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {carousels.map((carousel, index) => (
              <button
                key={carousel._id}
                type="button"
                onClick={() =>
                  setCurrentSlide(index)
                }
                aria-label={`Go to slide ${index + 1
                  }`}
                className={`
                            h-1.5
                            rounded-full
                            transition-all
                            ${currentSlide === index
                    ? "w-8 bg-white"
                    : "w-2 bg-white/60"
                  }
                        `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeaderSlider;