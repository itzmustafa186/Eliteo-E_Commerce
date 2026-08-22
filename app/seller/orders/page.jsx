"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
    Package,
    RefreshCw,
    ShoppingBag,
    Clock3,
    CheckCircle2,
    WalletCards,
    Truck,
    MapPin,
    Phone,
    Mail,
    Copy,
    Check,
    User,
    CalendarDays,
} from "lucide-react";

import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/app/loading";
import { assets } from "@/assets/assets";

const orderStatuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
];

const paymentStatuses = [
    "Pending",
    "Paid",
    "Failed",
];

const Orders = () => {
    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState("");

    const fetchSellerOrders = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/seller/orders");
            const data = await res.json();

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, type, value) => {
        try {
            const res = await fetch(`/api/seller/orders/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    [type]: value,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === id
                            ? {
                                  ...order,
                                  [type]: value,
                              }
                            : order
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const copyText = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);

            setCopied(key);

            setTimeout(() => {
                setCopied("");
            }, 1500);
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const created = new Date(date);

        const diff = Math.floor((now - created) / 1000);

        if (diff < 60) return "Just now";

        if (diff < 3600) {
            const minutes = Math.floor(diff / 60);

            return `${minutes} min ago`;
        }

        if (diff < 86400) {
            const hours = Math.floor(diff / 3600);

            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        }

        if (diff < 604800) {
            const days = Math.floor(diff / 86400);

            return `${days} day${days > 1 ? "s" : ""} ago`;
        }

        return created.toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const pendingOrders = orders.filter(
        (order) => order.orderStatus === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.orderStatus === "Delivered"
    ).length;

    const revenue = orders.reduce(
        (acc, order) => acc + Number(order.totalAmount || 0),
        0
    );

    return (
        <div className="min-h-screen flex-1 bg-[#FCFBF8]">

            {loading ? (
                <Loading />
            ) : (
                <div className="p-4 md:p-8 lg:p-10">

                    {/* =====================================================
                        HEADER
                    ====================================================== */}

                    <div className="relative overflow-hidden rounded-[30px] border border-[#E8E1D6] bg-[#F4EFE6] p-7 md:p-9">

                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#C8A96B]/20" />

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <div className="flex items-center gap-3">

                                    <span className="h-px w-8 bg-[#C8A96B]" />

                                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9B7A42]">
                                        Seller Dashboard
                                    </p>

                                </div>

                                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#172033] md:text-4xl">
                                    Orders Management
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#737985]">
                                    Manage customer orders, view complete
                                    customer information and update delivery
                                    status.
                                </p>

                            </div>

                            <button
                                onClick={fetchSellerOrders}
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#25324A]"
                            >
                                <RefreshCw size={17} />

                                Refresh Orders
                            </button>

                        </div>
                    </div>


                    {/* =====================================================
                        STATISTICS
                    ====================================================== */}

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Total */}
                        <div className="rounded-2xl border border-[#E8E1D6] bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-[#7A808B]">
                                        Total Orders
                                    </p>

                                    <h2 className="mt-2 text-3xl font-semibold text-[#172033]">
                                        {orders.length}
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
                                    <ShoppingBag size={21} />
                                </div>

                            </div>

                        </div>


                        {/* Pending */}
                        <div className="rounded-2xl border border-[#E8E1D6] bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-[#7A808B]">
                                        Pending
                                    </p>

                                    <h2 className="mt-2 text-3xl font-semibold text-[#172033]">
                                        {pendingOrders}
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
                                    <Clock3 size={21} />
                                </div>

                            </div>

                        </div>


                        {/* Delivered */}
                        <div className="rounded-2xl border border-[#E8E1D6] bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-[#7A808B]">
                                        Delivered
                                    </p>

                                    <h2 className="mt-2 text-3xl font-semibold text-[#172033]">
                                        {deliveredOrders}
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF7F2] text-[#3D8B67]">
                                    <CheckCircle2 size={21} />
                                </div>

                            </div>

                        </div>


                        {/* Revenue */}
                        <div className="rounded-2xl border border-[#E8E1D6] bg-white p-5">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-[#7A808B]">
                                        Revenue
                                    </p>

                                    <h2 className="mt-2 text-2xl font-semibold text-[#172033]">
                                        {currency}
                                        {revenue.toLocaleString()}
                                    </h2>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
                                    <WalletCards size={21} />
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
                        ORDERS
                    ====================================================== */}

                    <div className="mt-8 space-y-6">

                        {orders.map((order) => {

                            const customerName =
                                `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim();

                            const fullAddress = [
                                order.address?.street,
                                order.address?.house,
                                order.address?.area,
                                order.address?.city,
                                order.address?.postalCode,
                            ]
                                .filter(Boolean)
                                .join(", ");

                            return (
                                <div
                                    key={order._id}
                                    className="overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white shadow-[0_8px_30px_rgba(23,32,51,0.04)]"
                                >

                                    {/* =================================================
                                        ORDER TOP
                                    ================================================== */}

                                    <div className="border-b border-[#EEEAE2] p-6">

                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            <div className="flex items-start gap-4">

                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F4EFE6] text-[#9B7A42]">
                                                    <Package size={25} />
                                                </div>

                                                <div>

                                                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9B7A42]">
                                                        Order
                                                    </p>

                                                    <div className="mt-1 flex flex-wrap items-center gap-2">

                                                        <h3 className="text-lg font-semibold text-[#172033]">
                                                            #{order.orderNumber}
                                                        </h3>

                                                        {/* COPY ORDER NUMBER */}
                                                        <button
                                                            onClick={() =>
                                                                copyText(
                                                                    order.orderNumber,
                                                                    `order-${order._id}`
                                                                )
                                                            }
                                                            className="flex items-center gap-1.5 rounded-lg border border-[#E4DED3] px-2.5 py-1.5 text-xs font-medium text-[#737985] transition hover:border-[#C8A96B] hover:text-[#9B7A42]"
                                                        >
                                                            {copied ===
                                                            `order-${order._id}` ? (
                                                                <>
                                                                    <Check
                                                                        size={13}
                                                                    />
                                                                    Copied
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy
                                                                        size={13}
                                                                    />
                                                                    Copy
                                                                </>
                                                            )}
                                                        </button>

                                                    </div>

                                                    <p className="mt-1 text-xs text-[#969BA3]">
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </p>

                                                </div>

                                            </div>


                                            {/* TOTAL */}

                                            <div className="lg:text-right">

                                                <p className="text-xs uppercase tracking-wider text-[#9A9DA4]">
                                                    Order Total
                                                </p>

                                                <p className="mt-1 text-2xl font-semibold text-[#9B7A42]">
                                                    {currency}
                                                    {Number(
                                                        order.totalAmount || 0
                                                    ).toLocaleString()}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CUSTOMER INFORMATION
                                    ================================================== */}

                                    <div className="grid gap-6 border-b border-[#EEEAE2] p-6 lg:grid-cols-3">

                                        {/* CUSTOMER */}
                                        <div>

                                            <div className="mb-4 flex items-center gap-2">

                                                <User
                                                    size={17}
                                                    className="text-[#9B7A42]"
                                                />

                                                <h4 className="text-sm font-semibold text-[#172033]">
                                                    Customer Information
                                                </h4>

                                            </div>


                                            <p className="font-semibold text-[#172033]">
                                                {customerName || "Customer"}
                                            </p>


                                            {/* EMAIL */}
                                            {order.customer?.email && (
                                                <div className="mt-3 flex items-center gap-2">

                                                    <Mail
                                                        size={15}
                                                        className="shrink-0 text-[#9B7A42]"
                                                    />

                                                    <span className="min-w-0 truncate text-sm text-[#687080]">
                                                        {order.customer.email}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            copyText(
                                                                order.customer.email,
                                                                `email-${order._id}`
                                                            )
                                                        }
                                                        className="shrink-0 text-[#969BA3] transition hover:text-[#9B7A42]"
                                                        title="Copy email"
                                                    >
                                                        {copied ===
                                                        `email-${order._id}` ? (
                                                            <Check size={14} />
                                                        ) : (
                                                            <Copy size={14} />
                                                        )}
                                                    </button>

                                                </div>
                                            )}


                                            {/* PHONE */}
                                            {order.customer?.phone && (
                                                <div className="mt-2 flex items-center gap-2">

                                                    <Phone
                                                        size={15}
                                                        className="shrink-0 text-[#9B7A42]"
                                                    />

                                                    <span className="text-sm text-[#687080]">
                                                        {order.customer.phone}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            copyText(
                                                                order.customer.phone,
                                                                `phone-${order._id}`
                                                            )
                                                        }
                                                        className="text-[#969BA3] transition hover:text-[#9B7A42]"
                                                        title="Copy phone"
                                                    >
                                                        {copied ===
                                                        `phone-${order._id}` ? (
                                                            <Check size={14} />
                                                        ) : (
                                                            <Copy size={14} />
                                                        )}
                                                    </button>

                                                </div>
                                            )}

                                        </div>


                                        {/* DELIVERY ADDRESS */}
                                        <div>

                                            <div className="mb-4 flex items-center gap-2">

                                                <MapPin
                                                    size={17}
                                                    className="text-[#9B7A42]"
                                                />

                                                <h4 className="text-sm font-semibold text-[#172033]">
                                                    Delivery Address
                                                </h4>

                                            </div>


                                            {fullAddress ? (
                                                <p className="text-sm leading-6 text-[#687080]">
                                                    {fullAddress}
                                                </p>
                                            ) : (
                                                <div className="space-y-1 text-sm text-[#687080]">

                                                    {order.address?.area && (
                                                        <p>
                                                            Area:{" "}
                                                            {order.address.area}
                                                        </p>
                                                    )}

                                                    {order.address?.city && (
                                                        <p>
                                                            City:{" "}
                                                            {order.address.city}
                                                        </p>
                                                    )}

                                                </div>
                                            )}


                                            {order.address?.area &&
                                                fullAddress && (
                                                    <p className="mt-2 text-xs text-[#969BA3]">
                                                        Area:{" "}
                                                        {order.address.area}
                                                    </p>
                                                )}

                                        </div>


                                        {/* ORDER INFO */}
                                        <div>

                                            <div className="mb-4 flex items-center gap-2">

                                                <CalendarDays
                                                    size={17}
                                                    className="text-[#9B7A42]"
                                                />

                                                <h4 className="text-sm font-semibold text-[#172033]">
                                                    Order Information
                                                </h4>

                                            </div>


                                            <div className="space-y-2 text-sm">

                                                <div className="flex justify-between gap-4">
                                                    <span className="text-[#8A8F97]">
                                                        Items
                                                    </span>

                                                    <span className="font-medium text-[#172033]">
                                                        {order.items?.length ||
                                                            0}
                                                    </span>
                                                </div>


                                                <div className="flex justify-between gap-4">
                                                    <span className="text-[#8A8F97]">
                                                        Payment
                                                    </span>

                                                    <span className="font-medium text-[#172033]">
                                                        {order.paymentStatus}
                                                    </span>
                                                </div>


                                                <div className="flex justify-between gap-4">
                                                    <span className="text-[#8A8F97]">
                                                        Date
                                                    </span>

                                                    <span className="font-medium text-[#172033]">
                                                        {new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString(
                                                            "en-PK",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </span>
                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        PRODUCTS
                                    ================================================== */}

                                    <div className="border-b border-[#EEEAE2] p-6">

                                        <div className="mb-5 flex items-center gap-2">

                                            <ShoppingBag
                                                size={18}
                                                className="text-[#9B7A42]"
                                            />

                                            <h4 className="font-semibold text-[#172033]">
                                                Products
                                            </h4>

                                        </div>


                                        <div className="space-y-3">

                                            {order.items?.map((item, index) => (

                                                <div
                                                    key={
                                                        item._id || index
                                                    }
                                                    className="flex items-center gap-4 rounded-2xl bg-[#FCFBF8] p-3"
                                                >

                                                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F4EFE6]">

                                                        <Image
                                                            src={
                                                                item.product
                                                                    ?.images?.[0] ||
                                                                assets.box_icon
                                                            }
                                                            alt={
                                                                item.product
                                                                    ?.name ||
                                                                "Product"
                                                            }
                                                            fill
                                                            sizes="64px"
                                                            className="object-contain p-2"
                                                        />

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <p className="truncate font-medium text-[#172033]">
                                                            {
                                                                item.product
                                                                    ?.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-[#8A8F97]">
                                                            Quantity:{" "}
                                                            {item.quantity}
                                                        </p>

                                                    </div>


                                                    <div className="text-right">

                                                        <p className="font-semibold text-[#172033]">
                                                            {currency}
                                                            {Number(
                                                                item.product
                                                                    ?.offerPrice ||
                                                                    0
                                                            ).toLocaleString()}
                                                        </p>

                                                    </div>

                                                </div>

                                            ))}

                                        </div>

                                    </div>


                                    {/* =================================================
                                        STATUS
                                    ================================================== */}

                                    <div className="grid gap-5 p-6 md:grid-cols-2">

                                        {/* ORDER STATUS */}
                                        <div>

                                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A808B]">

                                                <Truck size={15} />

                                                Order Status

                                            </label>

                                            <select
                                                value={
                                                    order.orderStatus
                                                }
                                                onChange={(e) =>
                                                    updateStatus(
                                                        order._id,
                                                        "orderStatus",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#E3DED4] bg-[#FCFBF8] px-4 py-3 text-sm font-medium text-[#172033] outline-none transition focus:border-[#C8A96B] focus:ring-4 focus:ring-[#C8A96B]/10"
                                            >
                                                {orderStatuses.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                        </div>


                                        {/* PAYMENT STATUS */}
                                        <div>

                                            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A808B]">

                                                <WalletCards size={15} />

                                                Payment Status

                                            </label>

                                            <select
                                                value={
                                                    order.paymentStatus
                                                }
                                                onChange={(e) =>
                                                    updateStatus(
                                                        order._id,
                                                        "paymentStatus",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-[#E3DED4] bg-[#FCFBF8] px-4 py-3 text-sm font-medium text-[#172033] outline-none transition focus:border-[#C8A96B] focus:ring-4 focus:ring-[#C8A96B]/10"
                                            >
                                                {paymentStatuses.map(
                                                    (status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}


                        {/* =====================================================
                            EMPTY STATE
                        ====================================================== */}

                        {!orders.length && (
                            <div className="rounded-[28px] border border-dashed border-[#DCD5C9] bg-white p-16 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4EFE6] text-[#9B7A42]">

                                    <Package size={30} />

                                </div>

                                <h3 className="mt-6 text-xl font-semibold text-[#172033]">
                                    No Orders Yet
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A808B]">
                                    Orders placed by customers will appear
                                    here once they start purchasing your
                                    products.
                                </p>

                            </div>
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

export default Orders;