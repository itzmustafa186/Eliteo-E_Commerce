"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Package,
    MapPin,
    CreditCard,
    CalendarDays,
    ShoppingBag,
    Copy,
    Check,
    Truck,
} from "lucide-react";
import toast from "react-hot-toast";

const MyOrders = ({ orders = [] }) => {
    const { currency } = useAppContext();

    const [copiedOrder, setCopiedOrder] = useState(null);

    const statusColor = {
        Pending:
            "border-[#E7C98A] bg-[#FBF3DF] text-[#9B7A42]",
        Confirmed:
            "border-[#B9D4E8] bg-[#EEF6FB] text-[#356B8D]",
        Processing:
            "border-[#D5C4E8] bg-[#F5F0FA] text-[#79559B]",
        Shipped:
            "border-[#C7D0E8] bg-[#F0F3FA] text-[#596B9A]",
        Delivered:
            "border-[#BBDCCB] bg-[#EEF8F1] text-[#39734D]",
        Cancelled:
            "border-[#E7C1C1] bg-[#FBEEEE] text-[#A94A4A]",
    };

    const copyOrderNumber = async (orderNumber) => {
        try {
            await navigator.clipboard.writeText(orderNumber);

            setCopiedOrder(orderNumber);

            toast.success("Order number copied");

            setTimeout(() => {
                setCopiedOrder(null);
            }, 2000);
        } catch (error) {
            toast.error("Unable to copy order number");
        }
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString();
    };

    return (
        <div className="min-h-screen bg-[#FAF8F4] text-[#172033]">

            <Navbar />

            <main className="min-h-[70vh]">

                {/* ================================================= */}
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <section className="border-b border-[#E8E1D6] bg-white">

                    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 xl:py-12">

                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9B7A42]">
                            Eliteo
                        </p>

                        <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                            <div>

                                <h1 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
                                    My Orders
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-[#687080] sm:text-base">
                                    View your recent purchases and track the
                                    status of your Eliteo orders.
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E8E1D6] bg-[#F4EFE6] text-[#9B7A42]">
                                <ShoppingBag
                                    size={21}
                                    strokeWidth={1.5}
                                />
                            </div>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ORDERS */}
                {/* ================================================= */}

                <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 xl:py-14">

                    {orders.length === 0 ? (

                        <div className="mx-auto max-w-xl rounded-[28px] border border-[#E8E1D6] bg-white px-6 py-16 text-center shadow-[0_12px_40px_rgba(23,32,51,0.05)]">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#F4EFE6] text-[#9B7A42]">

                                <Package
                                    size={34}
                                    strokeWidth={1.4}
                                />

                            </div>

                            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7A42]">
                                Your Orders
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#172033]">
                                No orders yet
                            </h2>

                            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#687080]">
                                You haven't placed an order yet. Explore our
                                collection and find something you'll love.
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-7">

                            {orders.map((order) => (

                                <article
                                    key={order._id}
                                    className="overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white shadow-[0_12px_40px_rgba(23,32,51,0.05)]"
                                >

                                    {/* ================================= */}
                                    {/* ORDER HEADER */}
                                    {/* ================================= */}

                                    <div className="border-b border-[#E8E1D6] bg-[#F4EFE6] px-5 py-5 sm:px-7">

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                            <div>

                                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                                    Order
                                                </p>

                                                <div className="mt-1 flex flex-wrap items-center gap-3">

                                                    {/* COPYABLE ORDER NUMBER */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyOrderNumber(
                                                                order.orderNumber
                                                            )
                                                        }
                                                        title="Copy order number"
                                                        className="group flex items-center gap-2 rounded-lg px-1.5 py-1 text-left transition hover:bg-white/70"
                                                    >

                                                        <h2 className="text-base font-semibold text-[#172033] sm:text-lg">
                                                            #{order.orderNumber}
                                                        </h2>

                                                        {copiedOrder ===
                                                        order.orderNumber ? (
                                                            <Check
                                                                size={15}
                                                                className="text-emerald-600"
                                                            />
                                                        ) : (
                                                            <Copy
                                                                size={15}
                                                                className="text-[#9B7A42] opacity-70 transition group-hover:opacity-100"
                                                            />
                                                        )}

                                                    </button>

                                                    <span className="hidden text-[#CFC6B8] sm:inline">
                                                        /
                                                    </span>

                                                    <div className="flex items-center gap-1.5 text-xs text-[#687080]">

                                                        <CalendarDays
                                                            size={14}
                                                            strokeWidth={1.5}
                                                            className="text-[#9B7A42]"
                                                        />

                                                        {order.createdAt}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <span
                                                className={`inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                                                    statusColor[
                                                        order.orderStatus
                                                    ] ||
                                                    "border-[#E8E1D6] bg-white text-[#687080]"
                                                }`}
                                            >
                                                {order.orderStatus}
                                            </span>

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* PRODUCTS */}
                                    {/* ================================= */}

                                    <div className="px-5 py-6 sm:px-7">

                                        <div className="mb-5 flex items-center justify-between">

                                            <div>

                                                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                                    Your Order
                                                </p>

                                                <h3 className="mt-1 text-lg font-semibold text-[#172033]">
                                                    Products
                                                </h3>

                                            </div>

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">

                                                <Package
                                                    size={17}
                                                    strokeWidth={1.5}
                                                />

                                            </div>

                                        </div>


                                        <div className="divide-y divide-[#EEE8DF]">

                                            {order.items?.map(
                                                (item, index) => {

                                                    const image =
                                                        item.product
                                                            ?.images?.[0];

                                                    const itemTotal =
                                                        Number(
                                                            item.price ||
                                                                item.product
                                                                    ?.offerPrice ||
                                                                0
                                                        ) *
                                                        Number(
                                                            item.quantity || 0
                                                        );

                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex gap-4 py-5 first:pt-0 last:pb-0"
                                                        >

                                                            {/* IMAGE */}

                                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[#E8E1D6] bg-[#F8F6F1] sm:h-24 sm:w-24">

                                                                {image && (
                                                                    <Image
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                ?.name ||
                                                                            "Product"
                                                                        }
                                                                        fill
                                                                        sizes="96px"
                                                                        className="object-contain p-2.5"
                                                                    />
                                                                )}

                                                            </div>


                                                            {/* PRODUCT */}

                                                            <div className="min-w-0 flex-1">

                                                                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B7A42]">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.category
                                                                    }
                                                                </p>

                                                                <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#172033] sm:text-base">
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.name
                                                                    }
                                                                </h4>

                                                                <div className="mt-2 flex flex-wrap items-center gap-2">

                                                                    <span className="rounded-full bg-[#F4EFE6] px-2.5 py-1 text-[11px] font-semibold text-[#9B7A42]">
                                                                        Qty:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>

                                                                    {item
                                                                        .product
                                                                        ?.offerPrice && (
                                                                        <span className="text-xs text-[#687080]">
                                                                            {
                                                                                currency
                                                                            }
                                                                            {formatPrice(
                                                                                item
                                                                                    .product
                                                                                    .offerPrice
                                                                            )}{" "}
                                                                            each
                                                                        </span>
                                                                    )}

                                                                </div>

                                                            </div>


                                                            {/* ITEM TOTAL */}

                                                            <div className="shrink-0 text-right">

                                                                <p className="text-[10px] uppercase tracking-wider text-[#9A9DA4]">
                                                                    Total
                                                                </p>

                                                                <p className="mt-1 text-sm font-semibold text-[#172033] sm:text-base">
                                                                    {
                                                                        currency
                                                                    }
                                                                    {formatPrice(
                                                                        itemTotal
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>


                                    {/* ================================= */}
                                    {/* DETAILS */}
                                    {/* ================================= */}

                                    <div className="grid grid-cols-1 gap-7 border-t border-[#E8E1D6] bg-[#FCFBF8] px-5 py-6 sm:px-7 md:grid-cols-2 lg:grid-cols-3">

                                        {/* DELIVERY */}

                                        <div>

                                            <div className="mb-3 flex items-center gap-2">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#9B7A42]">

                                                    <MapPin
                                                        size={15}
                                                        strokeWidth={1.5}
                                                    />

                                                </div>

                                                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#172033]">
                                                    Delivery
                                                </h3>

                                            </div>


                                            <div className="space-y-1 text-xs leading-5 text-[#687080]">

                                                <p className="font-semibold text-[#172033]">
                                                    {
                                                        order.customer
                                                            ?.firstName
                                                    }{" "}
                                                    {
                                                        order.customer
                                                            ?.lastName
                                                    }
                                                </p>

                                                {/* EMAIL */}

                                                {order.customer?.email && (
                                                    <p className="break-all text-[#687080]">
                                                        {
                                                            order.customer
                                                                .email
                                                        }
                                                    </p>
                                                )}

                                                {/* PHONE */}

                                                {order.customer?.phone && (
                                                    <p className="text-[#687080]">
                                                        {
                                                            order.customer
                                                                .phone
                                                        }
                                                    </p>
                                                )}

                                                {/* ADDRESS */}

                                                <p className="pt-1">
                                                    {
                                                        order.address
                                                            ?.street
                                                    }
                                                    {order.address?.apartment
                                                        ? `, ${order.address.apartment}`
                                                        : ""}
                                                </p>

                                                <p>
                                                    {
                                                        order.address
                                                            ?.area
                                                    }
                                                    {order.address?.city
                                                        ? `, ${order.address.city}`
                                                        : ""}
                                                </p>

                                                <p>
                                                    {
                                                        order.address
                                                            ?.country
                                                    }

                                                    {order.address
                                                        ?.postalCode
                                                        ? ` - ${order.address.postalCode}`
                                                        : ""}
                                                </p>

                                            </div>

                                        </div>


                                        {/* PAYMENT */}

                                        <div>

                                            <div className="mb-3 flex items-center gap-2">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#9B7A42]">

                                                    <CreditCard
                                                        size={15}
                                                        strokeWidth={1.5}
                                                    />

                                                </div>

                                                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#172033]">
                                                    Payment
                                                </h3>

                                            </div>


                                            <div className="space-y-2 text-xs">

                                                <p className="font-semibold text-[#172033]">
                                                    {
                                                        order.paymentMethod
                                                    }
                                                </p>

                                                <span className="inline-flex rounded-lg border border-[#E8E1D6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#687080]">
                                                    {
                                                        order.paymentStatus
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        {/* TOTAL */}

                                        <div className="md:col-span-2 lg:col-span-1 lg:text-right">

                                            <div className="mb-3 flex items-center gap-2 lg:justify-end">

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#9B7A42]">

                                                    <Truck
                                                        size={15}
                                                        strokeWidth={1.5}
                                                    />

                                                </div>

                                                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#172033]">
                                                    Order Total
                                                </h3>

                                            </div>


                                            <p className="text-2xl font-semibold tracking-tight text-[#9B7A42]">
                                                {currency}
                                                {formatPrice(
                                                    order.totalAmount
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-[#687080]">
                                                Including shipping
                                            </p>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}

                </section>

            </main>

            <Footer />

        </div>
    );
};

export default MyOrders;