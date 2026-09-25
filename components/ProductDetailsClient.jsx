"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import ProductCard from "./ProductCard";
import Navbar from "./navbar/Navbar";
import Footer from "./Footer";
import ReviewSection from "./ReviewSection";
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

const ProductDetailsClient = ({
  productData,
  featuredProducts = [],
  reviews = [],
}) => {
  const { router, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);

  // =========================================================
  // SAFE PRODUCT
  // =========================================================

  const safeProduct = productData || {};

  // =========================================================
  // COMPANY
  // =========================================================

  const company =
    safeProduct.company &&
    typeof safeProduct.company === "object"
      ? safeProduct.company
      : null;

  // =========================================================
  // CATEGORY
  // =========================================================

  const categorySlug =
    categorySlugs[safeProduct.category] ||
    safeProduct.category?.toLowerCase().replace(/\s+/g, "-") ||
    "";

  // =========================================================
  // COMPANY URL
  // =========================================================

  const companyUrl = company?.slug
    ? `/category/${categorySlug}?company=${company.slug}`
    : `/category/${categorySlug}`;

  // =========================================================
  // MAIN IMAGE
  // =========================================================

  const currentImage = useMemo(
    () => mainImage || safeProduct.images?.[0] || null,
    [mainImage, safeProduct.images]
  );

  // =========================================================
  // PRICE
  // =========================================================

  const price = Number(safeProduct.price || 0);
  const offerPrice = Number(safeProduct.offerPrice || 0);
  const stock = Number(safeProduct.stock || 0);

  const discount =
    price > 0 && offerPrice < price
      ? Math.round(((price - offerPrice) / price) * 100)
      : 0;

  const savings = Math.max(price - offerPrice, 0);

  // =========================================================
  // CART ACTIONS
  // =========================================================

  const handleAddToCart = useCallback(() => {
    if (!safeProduct._id) return;

    addToCart(safeProduct._id);
  }, [addToCart, safeProduct._id]);

  const handleBuyNow = useCallback(() => {
    if (!safeProduct._id) return;

    addToCart(safeProduct._id);
    router.push("/cart");
  }, [addToCart, router, safeProduct._id]);

  // =========================================================
  // PREFETCH CART
  // =========================================================

  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);

  // =========================================================
  // THUMBNAILS
  // =========================================================

  const thumbnails = useMemo(
    () =>
      (safeProduct.images || []).map((image, index) => (
        <button
          type="button"
          key={`${image}-${index}`}
          onClick={() => setMainImage(image)}
          className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
            currentImage === image
              ? "border-[#9B7A42] shadow-md shadow-[#9B7A42]/10"
              : "border-[#E8E1D6] hover:border-[#C8A96B]"
          }`}
        >
          <Image
            src={image}
            alt={`${safeProduct.name || "Product"} ${index + 1}`}
            fill
            sizes="100px"
            className="object-contain p-2"
          />
        </button>
      )),
    [
      safeProduct.images,
      safeProduct.name,
      currentImage,
    ]
  );

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================
  // IMPORTANT:
  // This return is AFTER ALL HOOKS.
  // Therefore it cannot break hook order.

  if (!productData) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#FAF8F4]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#172033]">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-[#687080]">
              The product you are looking for does not exist.
            </p>

            <button
              type="button"
              onClick={() => router.push("/all-products")}
              className="mt-6 rounded-xl bg-[#9B7A42] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#856631]"
            >
              Browse Products
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F4]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

          {/* =====================================================
              BREADCRUMB
          ===================================================== */}

          <nav
            aria-label="Breadcrumb"
            className="mb-7 flex items-center gap-2 overflow-hidden text-sm"
          >
            <button
              type="button"
              onClick={() => router.push("/")}
              className="shrink-0 text-[#9A9DA4] transition hover:text-[#9B7A42]"
            >
              Home
            </button>

            <span className="text-[#D0CCC4]">/</span>

            <button
              type="button"
              onClick={() =>
                router.push(`/category/${categorySlug}`)
              }
              className="shrink-0 text-[#9A9DA4] transition hover:text-[#9B7A42]"
            >
              {safeProduct.category}
            </button>

            {company?.name && (
              <>
                <span className="text-[#D0CCC4]">/</span>

                <button
                  type="button"
                  onClick={() => router.push(companyUrl)}
                  className="shrink-0 text-[#9A9DA4] transition hover:text-[#9B7A42]"
                >
                  {company.name}
                </button>
              </>
            )}

            <span className="text-[#D0CCC4]">/</span>

            <span className="truncate text-[#687080]">
              {safeProduct.name}
            </span>
          </nav>

          {/* =====================================================
              PRODUCT
          ===================================================== */}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

            {/* =================================================
                LEFT — IMAGES
            ================================================= */}

            <div>
              <div className="relative overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white p-5 shadow-[0_12px_40px_rgba(23,32,51,0.05)] sm:p-8">

                {/* COMPANY BADGE */}

                {company?.name && (
                  <button
                    type="button"
                    onClick={() => router.push(companyUrl)}
                    aria-label={`View ${company.name} products`}
                    className="absolute left-5 top-5 z-20 flex max-w-[65%] items-center gap-2 rounded-full border border-[#E8E1D6] bg-white/95 px-2.5 py-2 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-[#C8A96B] hover:bg-[#FCFBF8] sm:left-7 sm:top-7"
                  >
                    {company.logo ? (
                      <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#EEE9DF] bg-white">
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          fill
                          sizes="32px"
                          className="object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F4EFE6] text-xs font-bold text-[#9B7A42]">
                        {company.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <span className="truncate pr-1 text-xs font-bold text-[#172033] sm:text-sm">
                      {company.name}
                    </span>
                  </button>
                )}

                {/* DISCOUNT */}

                {discount > 0 && (
                  <span className="absolute right-5 top-5 z-20 rounded-full bg-[#172033] px-4 py-1.5 text-xs font-bold text-white shadow-md sm:right-7 sm:top-7">
                    -{discount}%
                  </span>
                )}

                {/* MAIN IMAGE */}

                <div className="relative aspect-square w-full">
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt={safeProduct.name || "Product"}
                      fill
                      priority
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain transition-all duration-500"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#9A9DA4]">
                      No image available
                    </div>
                  )}
                </div>
              </div>

              {/* THUMBNAILS */}

              {safeProduct.images?.length > 1 && (
                <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {thumbnails}
                </div>
              )}
            </div>

            {/* =================================================
                RIGHT — PRODUCT INFO
            ================================================= */}

            <div className="flex flex-col">

              {/* CATEGORY */}

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9B7A42]">
                {safeProduct.category}
              </p>

              {/* NAME */}

              <h1 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl lg:text-5xl">
                {safeProduct.name}
              </h1>

              {/* RATING */}

              <div className="mt-5 flex items-center gap-3">
                {safeProduct.rating > 0 ? (
                  <>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map(
                        (_, index) => (
                          <Image
                            key={index}
                            src={
                              index <
                              Math.round(
                                safeProduct.rating
                              )
                                ? assets.star_icon
                                : assets.star_dull_icon
                            }
                            alt=""
                            width={17}
                            height={17}
                          />
                        )
                      )}
                    </div>

                    <span className="font-semibold text-[#172033]">
                      {safeProduct.rating}
                    </span>

                    <span className="text-sm text-[#9A9DA4]">
                      ({safeProduct.reviewCount || 0} Reviews)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-[#9A9DA4]">
                    No reviews yet
                  </span>
                )}
              </div>

              {/* DESCRIPTION */}

              <p className="mt-6 leading-7 text-[#687080]">
                {safeProduct.description}
              </p>

              {/* PRICE */}

              <div className="mt-7 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-[#172033]">
                  Rs. {offerPrice.toLocaleString()}
                </span>

                {price > offerPrice && (
                  <span className="text-lg text-[#9A9DA4] line-through">
                    Rs. {price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* SAVINGS */}

              {discount > 0 && (
                <p className="mt-2 text-sm font-medium text-emerald-600">
                  You save Rs. {savings.toLocaleString()}
                </p>
              )}

              <div className="my-8 h-px bg-[#E8E1D6]" />

              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="overflow-hidden rounded-2xl border border-[#E8E1D6] bg-white">

                {/* BRAND */}

                {company?.name && (
                  <div className="grid grid-cols-2 border-b border-[#E8E1D6]">
                    <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                      Brand
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push(companyUrl)}
                      className="flex items-center gap-2 px-5 py-4 text-left text-sm font-semibold text-[#9B7A42] hover:underline"
                    >
                      {company.logo && (
                        <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded bg-white">
                          <Image
                            src={company.logo}
                            alt={`${company.name} logo`}
                            fill
                            sizes="24px"
                            className="object-contain"
                          />
                        </span>
                      )}

                      <span className="truncate">
                        {company.name}
                      </span>
                    </button>
                  </div>
                )}

                {/* CATEGORY */}

                <div className="grid grid-cols-2 border-b border-[#E8E1D6]">
                  <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                    Category
                  </div>

                  <div className="px-5 py-4 text-sm font-medium text-[#172033]">
                    {safeProduct.category}
                  </div>
                </div>

                {/* SUB CATEGORY */}

                {safeProduct.subCategory && (
                  <div className="grid grid-cols-2 border-b border-[#E8E1D6]">
                    <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                      Type
                    </div>

                    <div className="px-5 py-4 text-sm font-medium text-[#172033]">
                      {safeProduct.subCategory}
                    </div>
                  </div>
                )}

                {/* SKU */}

                <div className="grid grid-cols-2">
                  <div className="bg-[#F4EFE6] px-5 py-4 text-sm font-semibold text-[#687080]">
                    SKU
                  </div>

                  <div className="px-5 py-4 text-sm font-medium text-[#172033]">
                    {safeProduct.sku || "N/A"}
                  </div>
                </div>
              </div>

              {/* =================================================
                  STOCK
              ================================================= */}

              <div className="mt-6 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    stock > 0
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                />

                <span
                  className={`text-sm font-semibold ${
                    stock > 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {stock > 0
                    ? stock <= 5
                      ? `Only ${stock} left in stock`
                      : "In stock"
                    : "Out of stock"}
                </span>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="mt-7">
                {stock <= 0 ? (
                  <div className="flex h-14 w-full items-center justify-center rounded-xl bg-[#F1EDE6] text-sm font-bold uppercase tracking-wider text-[#9A9DA4]">
                    Sold Out
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full rounded-xl border border-[#9B7A42] bg-white py-3.5 font-semibold text-[#9B7A42] transition-all hover:bg-[#9B7A42] hover:text-white"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="w-full rounded-xl border border-[#9B7A42] bg-[#9B7A42] py-3.5 font-semibold text-white shadow-lg shadow-[#9B7A42]/15 transition-all hover:border-[#856631] hover:bg-[#856631]"
                    >
                      Buy Now
                    </button>
                  </div>
                )}
              </div>

              {/* =================================================
                  TRUST ITEMS
              ================================================= */}

              <div className="mt-6 grid grid-cols-3 gap-3">
                <TrustItem
                  title="Secure"
                  subtitle="Checkout"
                />

                <TrustItem
                  title="Fast"
                  subtitle="Delivery"
                />

                <TrustItem
                  title="COD"
                  subtitle="Available"
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              REVIEWS
          ===================================================== */}

          <div className="mt-16 border-t border-[#E8E1D6] pt-12">
            <ReviewSection
              productId={safeProduct._id}
              rating={safeProduct.rating}
              reviewCount={safeProduct.reviewCount}
              reviews={reviews}
            />
          </div>

          {/* =====================================================
              RELATED PRODUCTS
          ===================================================== */}

          {featuredProducts.length > 0 && (
            <section className="mt-20 border-t border-[#E8E1D6] pt-16">

              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9B7A42]">
                  You May Also Like
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                  Featured Products
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-[#687080]">
                  Explore more products from Eliteo.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id.toString()}
                    product={product}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    router.push("/all-products")
                  }
                  className="rounded-full border border-[#E8E1D6] bg-white px-8 py-3 font-semibold text-[#687080] transition-all hover:border-[#C8A96B] hover:bg-[#F4EFE6] hover:text-[#9B7A42]"
                >
                  Explore More Products
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

// =========================================================
// TRUST ITEM
// =========================================================

const TrustItem = ({ title, subtitle }) => (
  <div className="rounded-xl border border-[#E8E1D6] bg-white p-3 text-center">
    <p className="text-xs font-semibold text-[#172033]">
      {title}
    </p>

    <p className="mt-1 text-[10px] text-[#9A9DA4]">
      {subtitle}
    </p>
  </div>
);

export default ProductDetailsClient;