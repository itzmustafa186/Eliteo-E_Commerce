"use client";

import React from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const Cart = () => {
  const {
    products,
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    currency,
  } = useAppContext();

  // Empty Cart
  if (getCartCount() === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-[75vh] flex flex-col items-center justify-center px-6">
          <Image
            src={assets.empty_cart || "/empty-cart.png"}
            alt="Empty Cart"
            width={260}
            height={260}
          />

          <h1 className="mt-6 text-3xl font-bold text-gray-800">
            Your Cart is Empty
          </h1>

          <p className="mt-2 text-gray-500 text-center">
            Looks like you haven't added anything yet.
          </p>

          <button
            onClick={() => router.push("/all-products")}
            className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl transition"
          >
            Continue Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-6">
          {/* Heading */}
          <div className="flex items-center justify-between border-b pb-6 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>

              <p className="text-gray-500 mt-1">
                {getCartCount()}{" "}
                {getCartCount() === 1 ? "item" : "items"} in your cart
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-6">
            {Object.keys(cartItems || {}).map((itemId) => {
              const product = products.find((p) => p._id === itemId);

              if (!product || cartItems[itemId] <= 0) return null;

              return (
                <div
                  key={itemId}
                  className="flex flex-col sm:flex-row gap-5 border rounded-xl p-4"
                >
                  {/* Image */}
                  <div className="w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Image
                      src={product.image[0]}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-orange-600 font-bold text-xl">
                        {currency}
                        {product.offerPrice.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => updateCartQuantity(product._id, 0)}
                      className="text-red-500 hover:underline text-sm w-fit"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Quantity */}
                  <div className="flex flex-col justify-between items-end">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            product._id,
                            cartItems[itemId] - 1
                          )
                        }
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="px-5 font-semibold">
                        {cartItems[itemId]}
                      </span>

                      <button
                        onClick={() => addToCart(product._id)}
                        className="px-4 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold text-lg mt-5">
                      {currency}
                      {(
                        product.offerPrice * cartItems[itemId]
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping */}
          <button
            onClick={() => router.push("/all-products")}
            className="mt-8 border rounded-xl px-6 py-3 hover:bg-gray-100 transition"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Right Side */}
        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default Cart;