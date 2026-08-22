"use client";

import React from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

const CartClient = ({ products }) => {
  const {
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
    currency,
  } = useAppContext();

  const SHIPPING_FEE = 250;

  /* ================= LOADING ================= */

  if (!products || products.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#FAF8F4] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1E9DC]">
              <ShoppingBag
                size={28}
                className="text-[#9B7A42]"
                strokeWidth={1.5}
              />
            </div>

            <p className="mt-5 text-sm text-[#687080]">
              Loading your cart...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* ================= EMPTY CART ================= */

  if (getCartCount() === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-[75vh] bg-[#FAF8F4] px-6">
          <div className="flex min-h-[75vh] flex-col items-center justify-center text-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F1E9DC]">
              <ShoppingBag
                size={40}
                className="text-[#9B7A42]"
                strokeWidth={1.4}
              />
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-[#9B7A42]">
              Eliteo Collection
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
              Your Cart is Empty
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#687080]">
              Looks like you haven't added anything yet.
              Discover something you'll love from our collection.
            </p>

            <button
              onClick={() => router.push("/all-products")}
              className="
                mt-8 rounded-xl
                border border-[#9B7A42]
                bg-[#9B7A42]
                px-7 py-3.5
                text-sm font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-[#856631]
                hover:shadow-[0_10px_25px_rgba(155,122,66,0.18)]
              "
            >
              Continue Shopping
            </button>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const subtotal = getCartAmount();
  const total = subtotal + SHIPPING_FEE;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF8F4]">

        {/* ================= HEADER ================= */}

        <section className="border-b border-[#E8E1D6] bg-white">
          <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9B7A42]">
              Eliteo
            </p>

            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                  Shopping Cart
                </h1>

                <p className="mt-2 text-sm text-[#687080]">
                  Review your selected products before checkout.
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#687080]">
                <ShoppingBag size={17} />

                <span>
                  <strong className="text-[#172033]">
                    {getCartCount()}
                  </strong>{" "}
                  {getCartCount() === 1 ? "item" : "items"}
                </span>
              </div>

            </div>
          </div>
        </section>


        {/* ================= CART CONTENT ================= */}

        <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_390px]">


            {/* ================================================= */}
            {/* LEFT — CART PRODUCTS */}
            {/* ================================================= */}

            <div>

              <div className="overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white shadow-[0_10px_35px_rgba(23,32,51,0.04)]">

                {/* Card Header */}

                <div className="border-b border-[#E8E1D6] px-6 py-6 sm:px-8">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F1E9DC] text-[#9B7A42]">
                      <ShoppingBag
                        size={20}
                        strokeWidth={1.5}
                      />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-[#172033]">
                        Your Products
                      </h2>

                      <p className="mt-0.5 text-xs text-[#687080]">
                        Products in your shopping cart
                      </p>
                    </div>

                  </div>

                </div>


                {/* ================= PRODUCTS ================= */}

                <div className="divide-y divide-[#EEE9E1]">

                  {Object.keys(cartItems || {}).map((itemId) => {

                    const product = products.find(
                      (item) => item._id === itemId
                    );

                    if (
                      !product ||
                      cartItems[itemId] <= 0
                    ) {
                      return null;
                    }

                    const quantity = cartItems[itemId];

                    const itemTotal =
                      product.offerPrice * quantity;

                    return (
                      <div
                        key={itemId}
                        className="p-5 transition-colors hover:bg-[#FCFBF8] sm:p-7"
                      >

                        <div className="flex flex-col gap-5 sm:flex-row">


                          {/* PRODUCT IMAGE */}

                          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-[#E8E1D6] bg-[#F8F6F1] sm:h-32 sm:w-32">

                            <Image
                              src={product.images?.[0]}
                              alt={product.name}
                              fill
                              sizes="128px"
                              className="object-contain p-4"
                            />

                          </div>


                          {/* PRODUCT INFORMATION */}

                          <div className="min-w-0 flex-1">

                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9B7A42]">
                              {product.category}
                            </p>

                            <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-6 text-[#172033] sm:text-lg">
                              {product.name}
                            </h3>

                            <p className="mt-2 text-lg font-semibold text-[#9B7A42]">
                              {currency}
                              {product.offerPrice?.toLocaleString()}
                            </p>


                            {/* REMOVE */}

                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  product._id,
                                  0
                                )
                              }
                              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#8A6A38] transition hover:text-red-500"
                            >
                              <Trash2
                                size={14}
                                strokeWidth={1.5}
                              />

                              Remove
                            </button>

                          </div>


                          {/* QUANTITY + TOTAL */}

                          <div className="flex items-center justify-between gap-5 sm:flex-col sm:items-end sm:justify-between">

                            {/* Quantity */}

                            <div className="flex items-center overflow-hidden rounded-xl border border-[#DDD6CA] bg-white">

                              <button
                                onClick={() =>
                                  updateCartQuantity(
                                    product._id,
                                    quantity - 1
                                  )
                                }
                                className="flex h-10 w-10 items-center justify-center text-[#687080] transition hover:bg-[#F4EFE6] hover:text-[#172033]"
                              >
                                <Minus size={15} />
                              </button>

                              <span className="flex h-10 min-w-10 items-center justify-center border-x border-[#E8E1D6] px-2 text-sm font-semibold text-[#172033]">
                                {quantity}
                              </span>

                              <button
                                onClick={() =>
                                  addToCart(product._id)
                                }
                                className="flex h-10 w-10 items-center justify-center text-[#687080] transition hover:bg-[#F4EFE6] hover:text-[#172033]"
                              >
                                <Plus size={15} />
                              </button>

                            </div>


                            {/* ITEM TOTAL */}

                            <div className="text-right">

                              <p className="text-[10px] uppercase tracking-wider text-[#9A9DA4]">
                                Item Total
                              </p>

                              <p className="mt-1 text-lg font-semibold text-[#172033]">
                                {currency}
                                {itemTotal.toLocaleString()}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>


                {/* CONTINUE SHOPPING */}

                <div className="border-t border-[#E8E1D6] bg-[#FCFBF8] px-6 py-5 sm:px-8">

                  <button
                    onClick={() =>
                      router.push("/all-products")
                    }
                    className="group flex items-center gap-2 text-sm font-semibold text-[#687080] transition hover:text-[#9B7A42]"
                  >
                    <ArrowLeft
                      size={17}
                      className="transition-transform group-hover:-translate-x-1"
                    />

                    Continue Shopping
                  </button>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* RIGHT — CART SUMMARY */}
            {/* ================================================= */}

            <aside className="lg:sticky lg:top-24">

              <div className="overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white shadow-[0_12px_40px_rgba(23,32,51,0.06)]">

                {/* Summary Header */}

                <div className="border-b border-[#E8E1D6] bg-[#F4EFE6] p-6">

                  <h2 className="text-xl font-semibold text-[#172033]">
                    Cart Summary
                  </h2>

                  <p className="mt-1 text-xs text-[#687080]">
                    Your order total
                  </p>

                </div>


                <div className="p-6">

                  {/* SUBTOTAL */}

                  <div className="flex justify-between text-sm text-[#687080]">
                    <span>
                      Subtotal
                    </span>

                    <span className="font-medium text-[#172033]">
                      {currency}
                      {subtotal.toLocaleString()}
                    </span>
                  </div>


                  {/* SHIPPING */}

                  <div className="mt-4 flex justify-between text-sm text-[#687080]">
                    <span>
                      Shipping
                    </span>

                    <span className="font-medium text-[#172033]">
                      {currency}
                      {SHIPPING_FEE.toLocaleString()}
                    </span>
                  </div>


                  <div className="my-5 h-px bg-[#E8E1D6]" />


                  {/* TOTAL */}

                  <div className="flex items-center justify-between">

                    <span className="font-semibold text-[#172033]">
                      Total
                    </span>

                    <span className="text-2xl font-semibold tracking-tight text-[#9B7A42]">
                      {currency}
                      {total.toLocaleString()}
                    </span>

                  </div>


                  {/* CHECKOUT */}

                  <button
                    onClick={() =>
                      router.push("/checkout")
                    }
                    className="
                      mt-7
                      flex w-full
                      items-center justify-center
                      rounded-xl
                      bg-[#9B7A42]
                      py-4
                      text-sm
                      font-semibold
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#856631]
                      hover:shadow-[0_10px_25px_rgba(155,122,66,0.18)]
                      active:scale-[0.99]
                    "
                  >
                    Proceed to Checkout
                  </button>


                  {/* TRUST */}

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3">

                      <Truck
                        size={17}
                        className="text-[#9B7A42]"
                        strokeWidth={1.5}
                      />

                      <p className="text-xs text-[#687080]">
                        Fast & secure delivery
                      </p>

                    </div>


                    <div className="flex items-center gap-3">

                      <ShieldCheck
                        size={17}
                        className="text-[#9B7A42]"
                        strokeWidth={1.5}
                      />

                      <p className="text-xs text-[#687080]">
                        Secure Cash on Delivery
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default CartClient;