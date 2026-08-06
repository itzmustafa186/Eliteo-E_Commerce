"use client";

import React from "react";
import Image from "next/image";
import Navbar from "./Navbar";
import OrderSummary from "./OrderSummary";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const CartClient = ({ products }) => {

  const {
    router,
    cartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    currency,
  } = useAppContext();

  if (!products || products.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center">
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </>
    );
  }

  if (getCartCount() === 0) {
    return (
      <>
        <Navbar />

        <div className="min-h-[75vh] flex flex-col items-center justify-center px-6">
          <Image
            src={assets.cart_icon}
            alt="Empty Cart"
            width={250}
            height={250}
          />

          <h1 className="mt-6 text-3xl font-bold">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything yet.
          </p>

          <button
            onClick={() => router.push("/all-products")}
            className="mt-8 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl"
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

        {/* Cart */}
        <div className="lg:col-span-2 bg-white border rounded-2xl shadow-sm p-6">

          <div className="flex justify-between border-b pb-5 mb-6">
            <div>
              <h1 className="text-3xl font-bold">
                Shopping Cart
              </h1>

              <p className="text-gray-500 mt-1">
                {getCartCount()}{" "}
                {getCartCount() === 1 ? "Item" : "Items"}
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {Object.keys(cartItems || {}).map((itemId) => {
              const product = products.find(
                (item) => item._id === itemId
              );

              if (!product || cartItems[itemId] <= 0) return null;

              return (
                <div
                  key={itemId}
                  className="flex flex-col md:flex-row gap-5 border rounded-xl p-5"
                >
                  <div className="w-28 h-28 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-xl font-bold text-orange-600">
                      {currency}
                      {product.offerPrice.toLocaleString()}
                    </p>

                    <button
                      onClick={() =>
                        updateCartQuantity(product._id, 0)
                      }
                      className="mt-4 text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex flex-col justify-between items-end">

                    <div className="flex items-center border rounded-lg">

                      <button
                        className="px-4 py-2"
                        onClick={() =>
                          updateCartQuantity(
                            product._id,
                            cartItems[itemId] - 1
                          )
                        }
                      >
                        −
                      </button>

                      <span className="px-5 font-semibold">
                        {cartItems[itemId]}
                      </span>

                      <button
                        className="px-4 py-2"
                        onClick={() =>
                          addToCart(product._id)
                        }
                      >
                        +
                      </button>

                    </div>

                    <p className="mt-5 text-lg font-bold">
                      {currency}
                      {(
                        product.offerPrice *
                        cartItems[itemId]
                      ).toLocaleString()}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>

          <button
            onClick={() =>
              router.push("/all-products")
            }
            className="mt-8 border rounded-xl px-6 py-3 hover:bg-gray-100"
          >
            ← Continue Shopping
          </button>

        </div>

        {/* Order Summary */}

        <div className="lg:sticky lg:top-24 h-fit">
          <OrderSummary />
        </div>

      </div>
    </>
  );
};

export default CartClient;