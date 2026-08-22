"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
    Package,
    CreditCard,
    CalendarDays,
    Truck,
    CheckCircle2,
    Search,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState("");

    const handleTrack = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setOrder(null);

        try {
            const { data } = await axios.post("/api/track-order", {
                orderNumber,
                email,
            });

            if (!data.success) {
                setError(data.message);
                return;
            }

            setOrder(data.order);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#FCFBF8]">

                {/* HERO */}
                <section className="relative overflow-hidden border-b border-[#EAE4D9] bg-[#F4EFE6]">

                    <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-[#C8A96B]/20" />

                    <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full border border-[#C8A96B]/10" />

                    <div className="absolute right-[15%] top-10 h-2 w-2 rounded-full bg-[#C8A96B]" />

                    <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20">

                        <div className="max-w-3xl">

                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-[#C8A96B]" />

                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9B7A42]">
                                    Eliteo Delivery
                                </p>
                            </div>

                            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-[#172033] sm:text-5xl lg:text-6xl">
                                Track your
                                <span className="block font-normal text-[#9B7A42]">
                                    Eliteo order.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-7 text-[#687080] sm:text-base">
                                Enter your order details below to see the
                                latest update on your delivery.
                            </p>

                        </div>

                    </div>
                </section>

                {/* MAIN */}
                <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16 lg:py-20">

                    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">

                        {/* TRACKING FORM */}
                        <div className="rounded-[28px] border border-[#E8E1D6] bg-white p-6 shadow-[0_12px_40px_rgba(23,32,51,0.05)] sm:p-10">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F4EFE6] text-[#9B7A42]">
                                    <Truck
                                        size={23}
                                        strokeWidth={1.6}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight text-[#172033]">
                                        Find your order
                                    </h2>

                                    <p className="mt-1.5 text-sm leading-6 text-[#7A808B]">
                                        Enter your order number and email
                                        address to continue.
                                    </p>
                                </div>

                            </div>

                            <form
                                onSubmit={handleTrack}
                                className="mt-9 space-y-5"
                            >

                                {/* ORDER NUMBER */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-[#303747]">
                                        Order Number
                                    </label>

                                    <div className="relative">

                                        <Package
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7A42]"
                                            strokeWidth={1.7}
                                        />

                                        <input
                                            value={orderNumber}
                                            onChange={(e) =>
                                                setOrderNumber(e.target.value)
                                            }
                                            placeholder="ELT-82938471"
                                            required
                                            className="w-full rounded-xl border border-[#E3DED4] bg-[#FCFBF8] py-4 pl-12 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#A6A9AF] focus:border-[#C8A96B] focus:bg-white focus:ring-4 focus:ring-[#C8A96B]/10"
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}
                                <div>

                                    <label className="mb-2 block text-sm font-medium text-[#303747]">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <CreditCard
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7A42]"
                                            strokeWidth={1.7}
                                        />

                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="your@email.com"
                                            required
                                            className="w-full rounded-xl border border-[#E3DED4] bg-[#FCFBF8] py-4 pl-12 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#A6A9AF] focus:border-[#C8A96B] focus:bg-white focus:ring-4 focus:ring-[#C8A96B]/10"
                                        />

                                    </div>

                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#172033] py-4 text-sm font-semibold text-white shadow-lg shadow-[#172033]/10 transition-all duration-300 hover:bg-[#25324A] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    <Search size={18} />

                                    {loading
                                        ? "Finding your order..."
                                        : "Track Order"}

                                    {!loading && (
                                        <ArrowRight
                                            size={17}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                        />
                                    )}

                                </button>

                            </form>

                            {/* ERROR */}
                            {error && (
                                <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-600">
                                    {error}
                                </div>
                            )}

                        </div>

                        {/* ELITEO PROMISE */}
                        <div className="rounded-[28px] bg-[#172033] p-7 text-white sm:p-9">

                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A96B]">
                                Eliteo Promise
                            </p>

                            <h2 className="mt-4 text-2xl font-semibold leading-tight">
                                Your order is in
                                <span className="block font-normal text-white/60">
                                    good hands.
                                </span>
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-white/60">
                                We keep you informed at every important step
                                of your delivery.
                            </p>

                            <div className="mt-8 space-y-6">

                                {/* DELIVERY */}
                                <div className="flex gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C8A96B]">
                                        <Truck size={20} />
                                    </div>

                                    <div>
                                        <h3 className="font-medium">
                                            Reliable Delivery
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-white/50">
                                            Your order is handled carefully
                                            from dispatch to doorstep.
                                        </p>
                                    </div>

                                </div>

                                {/* SECURITY */}
                                <div className="flex gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C8A96B]">
                                        <ShieldCheck size={20} />
                                    </div>

                                    <div>
                                        <h3 className="font-medium">
                                            Secure Shopping
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-white/50">
                                            Your order information is kept
                                            secure throughout the process.
                                        </p>
                                    </div>

                                </div>

                                {/* PACKAGING */}
                                <div className="flex gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C8A96B]">
                                        <Package size={20} />
                                    </div>

                                    <div>
                                        <h3 className="font-medium">
                                            Carefully Packed
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-white/50">
                                            Every order is prepared and
                                            packed with care.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ORDER RESULT */}
                    {order && (
                        <section className="mt-10">

                            {/* ORDER HEADER */}
                            <div className="rounded-[28px] border border-[#E8E1D6] bg-white p-6 shadow-[0_12px_40px_rgba(23,32,51,0.05)] sm:p-9">

                                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <CheckCircle2
                                                size={19}
                                                className="text-[#3D8B67]"
                                            />

                                            <span className="text-sm font-medium text-[#3D8B67]">
                                                Order Found
                                            </span>

                                        </div>

                                        <h2 className="mt-3 text-2xl font-semibold text-[#172033]">
                                            Order Details
                                        </h2>

                                        <p className="mt-1 text-sm text-[#7A808B]">
                                            #{order.orderNumber}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() => {
                                            setOrder(null);
                                            setOrderNumber("");
                                            setEmail("");
                                        }}
                                        className="rounded-full border border-[#DDD7CC] px-5 py-2.5 text-sm font-medium text-[#303747] transition hover:border-[#C8A96B] hover:text-[#9B7A42]"
                                    >
                                        Track Another Order
                                    </button>

                                </div>

                                {/* STATUS CARDS */}
                                <div className="mt-8 grid gap-4 sm:grid-cols-3">

                                    {/* STATUS */}
                                    <div className="rounded-2xl border border-[#EAE4D9] bg-[#FCFBF8] p-5">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
                                            <Package size={19} />
                                        </div>

                                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#9A9DA4]">
                                            Order Status
                                        </p>

                                        <h3 className="mt-1 font-semibold capitalize text-[#172033]">
                                            {order.orderStatus}
                                        </h3>

                                    </div>

                                    {/* PAYMENT */}
                                    <div className="rounded-2xl border border-[#EAE4D9] bg-[#FCFBF8] p-5">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
                                            <CreditCard size={19} />
                                        </div>

                                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#9A9DA4]">
                                            Payment
                                        </p>

                                        <h3 className="mt-1 font-semibold capitalize text-[#172033]">
                                            {order.paymentStatus}
                                        </h3>

                                    </div>

                                    {/* DATE */}
                                    <div className="rounded-2xl border border-[#EAE4D9] bg-[#FCFBF8] p-5">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
                                            <CalendarDays size={19} />
                                        </div>

                                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#9A9DA4]">
                                            Order Date
                                        </p>

                                        <h3 className="mt-1 font-semibold text-[#172033]">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-PK", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </h3>

                                    </div>

                                </div>

                            </div>

                            {/* PRODUCTS */}
                            <div className="mt-6 rounded-[28px] border border-[#E8E1D6] bg-white p-6 shadow-[0_12px_40px_rgba(23,32,51,0.05)] sm:p-9">

                                <div className="mb-7">

                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7A42]">
                                        Your Selection
                                    </p>

                                    <h3 className="mt-2 text-xl font-semibold text-[#172033]">
                                        Products
                                    </h3>

                                </div>

                                <div className="divide-y divide-[#EEEAE2]">

                                    {order.items.map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex gap-4 py-5 first:pt-0 last:pb-0"
                                        >

                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#F7F4EE]">

                                                <Image
                                                    src={
                                                        item.product.images[0]
                                                    }
                                                    alt={
                                                        item.product.name
                                                    }
                                                    fill
                                                    sizes="80px"
                                                    className="object-contain p-2"
                                                />

                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <h4 className="font-semibold text-[#172033]">
                                                    {item.product.name}
                                                </h4>

                                                <p className="mt-1 text-sm text-[#858A94]">
                                                    Quantity: {item.quantity}
                                                </p>

                                                <p className="mt-2 text-sm font-semibold text-[#9B7A42]">
                                                    Rs{" "}
                                                    {item.product.offerPrice?.toLocaleString()}
                                                </p>

                                            </div>

                                            <div className="hidden text-right sm:block">

                                                <p className="text-xs text-[#A0A3A9]">
                                                    Item Total
                                                </p>

                                                <p className="mt-1 font-semibold text-[#172033]">
                                                    Rs{" "}
                                                    {(
                                                        item.product
                                                            .offerPrice *
                                                        item.quantity
                                                    ).toLocaleString()}
                                                </p>

                                            </div>

                                        </div>
                                    ))}

                                </div>

                                {/* TOTAL */}
                                <div className="mt-8 border-t border-[#EEEAE2] pt-6">

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm font-medium text-[#7A808B]">
                                            Total Amount
                                        </span>

                                        <span className="text-2xl font-semibold tracking-tight text-[#172033]">
                                            Rs{" "}
                                            {order.totalAmount?.toLocaleString()}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </section>
                    )}

                </section>
            </main>

            <Footer />
        </>
    );
}