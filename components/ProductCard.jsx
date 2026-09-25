"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";

const categorySlugs = {
  Earbuds: "earbuds",
  Headphones: "headphones",
  Chargers: "chargers",
  Cables: "cables",
  "Power Banks": "powerbanks",
  Powerbanks: "powerbanks",
  Handsfree: "handsfree",
  Smartwatches: "smartwatches",
};

const ProductCard = ({ product }) => {
  const { currency } = useAppContext();

  if (!product) return null;

  const isOutOfStock = Number(product.stock || 0) <= 0;

  const price = Number(product.price || 0);
  const offerPrice = Number(product.offerPrice || 0);

  const discount =
    price > 0 && offerPrice > 0 && offerPrice < price
      ? Math.round(((price - offerPrice) / price) * 100)
      : 0;

  const categorySlug =
    categorySlugs[product.category] ||
    product.category?.toLowerCase().replace(/\s+/g, "-");

  const company =
    product.company && typeof product.company === "object"
      ? product.company
      : null;

  const productImage = product.images?.[0];

  return (
    <div
      className={`
                group relative flex h-full flex-col
                overflow-hidden rounded-3xl
                border border-[#EAE5DB]
                bg-white
                transition-all duration-300
                ${
                  !isOutOfStock
                    ? "hover:-translate-y-1 hover:border-[#D8C29A] hover:shadow-[0_10px_25px_rgba(23,32,51,0.08)]"
                    : ""
                }
            `}
    >
      {/* ================= IMAGE ================= */}

      {/* ================= IMAGE ================= */}

      <Link href={`/product/${product.slug}`}>
        <div
          className={`
            relative aspect-square overflow-hidden
            bg-[#F7F4EE]
            ${isOutOfStock ? "grayscale-[15%]" : ""}
        `}
        >
          {/* DISCOUNT */}
          {/* DISCOUNT + COMPANY */}

          {!isOutOfStock && discount > 0 && (
            <span className="absolute left-3 top-3 z-20 rounded-md bg-[#172033] px-2 py-1 text-[9px] font-semibold tracking-wide text-white">
              -{discount}%
            </span>
          )}

          {/* COMPANY LOGO + NAME */}

          {company?.name && (
            <div className="absolute right-3 top-3 z-20 max-w-[55%]">
              <div className="flex items-center gap-1.5 rounded-full border border-[#E8E1D6] bg-white/95 px-2 py-1.5 shadow-sm backdrop-blur-sm">
                {/* LOGO */}

                {company.logo ? (
                  <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-white">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      fill
                      sizes="20px"
                      className="object-contain p-0.5"
                    />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F4EFE6] text-[8px] font-bold text-[#9B7A42]">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* COMPANY NAME */}

                <span className="max-w-[80px] truncate text-[9px] font-semibold text-[#172033]">
                  {company.name}
                </span>
              </div>
            </div>
          )}

          {/* PRODUCT IMAGE */}

          {productImage ? (
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <Image
                src={productImage}
                alt={product.name || "Product"}
                fill
                sizes="
                        (max-width: 640px) 50vw,
                        (max-width: 1024px) 33vw,
                        25vw
                    "
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}

          {/* OUT OF STOCK */}

          {isOutOfStock && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/30">
              <span className="rounded-md bg-[#172033] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ================= CONTENT ================= */}

      <div className="flex flex-1 flex-col p-3">
        {/* CATEGORY */}

        {product.category && (
          <Link
            href={`/category/${categorySlug}`}
            className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#9B7A42] transition hover:text-[#172033]"
          >
            {product.category}
          </Link>
        )}

        {/* ================= COMPANY / BRAND ================= */}

        {company?.name && (
          <Link
            href={`/category/${categorySlug}?company=${company.slug}`}
            className="mb-2 flex w-fit max-w-full items-center gap-1.5 rounded-md border border-[#EAE5DB] bg-[#FCFBF8] px-1.5 py-1 transition hover:border-[#D8C29A] hover:bg-[#F7F3EA]"
          >
            {/* COMPANY LOGO */}

            {company.logo ? (
              <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded bg-white">
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  sizes="20px"
                  className="object-contain p-0.5"
                />
              </div>
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#F0E8D9] text-[8px] font-bold text-[#9B7A42]">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* COMPANY NAME */}

            <span className="max-w-[110px] truncate text-[10px] font-semibold text-[#555B65]">
              {company.name}
            </span>
          </Link>
        )}

        {/* ================= PRODUCT NAME ================= */}

        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[36px] text-xs font-semibold leading-[18px] text-[#172033] transition-colors group-hover:text-[#9B7A42] sm:text-sm">
            {product.name}
          </h3>
        </Link>

        {/* ================= RATING ================= */}

        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-1 rounded bg-[#F7F3EA] px-1.5 py-0.5">
            <Image src={assets.star_icon} alt="Rating" width={11} height={11} />

            <span className="text-[9px] font-semibold text-[#8A6A36]">
              {product.rating || 0}
            </span>
          </div>

          <span className="text-[9px] text-[#8A8F97]">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* ================= PRICE ================= */}

        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-base font-bold tracking-tight text-[#172033] sm:text-lg">
            {currency}
            {offerPrice.toLocaleString()}
          </span>

          {price > offerPrice && (
            <span className="text-[10px] text-[#9A9DA4] line-through">
              {currency}
              {price.toLocaleString()}
            </span>
          )}
        </div>

        {/* ================= BUTTON ================= */}

        <Link
          href={`/product/${product.slug}`}
          className={`
                        mt-3 flex w-full items-center justify-center
                        rounded-md py-2
                        text-[10px] font-semibold
                        transition-all sm:text-xs
                        ${
                          isOutOfStock
                            ? "pointer-events-none bg-[#F1EEE8] text-[#9A9DA4]"
                            : "bg-[#172033] !text-white hover:bg-[#9B7A42]"
                        }
                    `}
        >
          {isOutOfStock ? "Out of Stock" : "View Product"}
        </Link>
      </div>

      {/* ================= HOVER BORDER ================= */}

      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-[#C8A96B]/40" />
    </div>
  );
};

export default ProductCard;
