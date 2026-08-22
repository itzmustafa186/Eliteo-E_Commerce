"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderSummary from "@/components/OrderSummary";
import { useAppContext } from "@/context/AppContext";

export default function CheckoutPage() {
    const {
        getCartCount,
        router,
    } = useAppContext();

    if (getCartCount() === 0) {
        return (
            <>
                <Navbar />

                <main className="min-h-[75vh] bg-[#faf9f6]">
                    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">

                        <h1 className="text-3xl font-semibold text-[#172033]">
                            Your cart is empty
                        </h1>

                        <p className="mt-3 text-sm text-[#687080]">
                            Add some products to your cart before
                            continuing to checkout.
                        </p>

                        <button
                            onClick={() =>
                                router.push("/all-products")
                            }
                            className="mt-7 rounded-xl bg-[#9b7a42] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#856631]"
                        >
                            Continue Shopping
                        </button>

                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#faf9f6]">

                {/* Header */}

                <section className="border-b border-[#e8e1d6] bg-white">

                    <div className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8 lg:px-10">

                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b7a42]">
                            Eliteo
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                            Checkout
                        </h1>

                        <p className="mt-3 text-sm text-[#687080] sm:text-base">
                            Review your order and complete your delivery details.
                        </p>

                    </div>

                </section>


                {/* Checkout */}

                <section className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

                    <OrderSummary />

                    <button
                        onClick={() => router.push("/cart")}
                        className="mt-5 text-sm font-medium text-[#687080] hover:text-[#9b7a42]"
                    >
                        ← Back to Cart
                    </button>

                </section>

            </main>

            <Footer />
        </>
    );
}