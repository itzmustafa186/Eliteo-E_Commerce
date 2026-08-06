'use client';
import React, { useEffect, useState } from "react";

import Image from "next/image";
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

    const fetchSellerOrders = async () => {
        try {

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
            console.log(id, type, value);
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
            console.log("API Response:", data);

            if (data.success) {
                setOrders((prev) =>
                    prev.map((order) =>
                        order._id === id
                            ? { ...order, [type]: value }
                            : order
                    )
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const formatDate = (date) => {
        const now = new Date();
        const created = new Date(date);

        const diff = Math.floor((now - created) / 1000);

        if (diff < 60) return "Just now";

        if (diff < 3600)
            return `${Math.floor(diff / 60)} min ago`;

        if (diff < 86400)
            return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;

        if (diff < 604800)
            return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;

        return created.toLocaleDateString("en-PK", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50">
            {loading ? (
                <Loading />
            ) : (
                <div className="p-4 md:p-8">

                    {/* Page Header */}

                    <div className="mb-8 rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-8 text-white shadow-xl">

                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                            <div>

                                <p className="text-sm uppercase tracking-[0.25em] text-orange-100">
                                    Seller Dashboard
                                </p>

                                <h1 className="mt-3 text-4xl font-bold">
                                    Orders Management
                                </h1>

                                <p className="mt-2 max-w-xl text-orange-100">
                                    Track customer orders, update delivery status and manage payments from one place.
                                </p>

                            </div>

                            <button
                                onClick={fetchSellerOrders}
                                className="rounded-2xl bg-white px-6 py-3 font-semibold text-orange-600 shadow-lg transition hover:scale-105"
                            >
                                Refresh Orders
                            </button>

                        </div>

                    </div>

                    <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-3xl border bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <h2 className="mt-2 text-4xl font-bold">
                                {orders.length}
                            </h2>
                        </div>

                        <div className="rounded-3xl border bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Pending
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-orange-600">
                                {
                                    orders.filter(
                                        order => order.orderStatus === "Pending"
                                    ).length
                                }
                            </h2>
                        </div>

                        <div className="rounded-3xl border bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Delivered
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-green-600">
                                {
                                    orders.filter(
                                        order => order.orderStatus === "Delivered"
                                    ).length
                                }
                            </h2>
                        </div>

                        <div className="rounded-3xl border bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">
                                Revenue
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-blue-600">
                                {currency}
                                {orders
                                    .reduce((acc, order) => acc + order.totalAmount, 0)
                                    .toLocaleString()}
                            </h2>
                        </div>

                    </div>

                    <div className="space-y-5">

                        {orders.map((order) => (

                            <div
                                key={order._id}
                                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    {/* Product */}
                                    <div className="flex gap-4">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
                                            <Image
                                                src={order.items[0]?.product?.images?.[0] || assets.box_icon}
                                                alt={order.items[0]?.product?.name || "Product"}
                                                width={45}
                                                height={45}
                                                className="rounded-lg object-cover"
                                            />
                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-600">
                                                {order.items
                                                    .map(
                                                        (item) =>
                                                            `${item.product.name} × ${item.quantity}`
                                                    )
                                                    .join(", ")}
                                            </p>

                                            <p className="mt-2 text-sm text-gray-500">
                                                {order.items.length} Item(s)
                                            </p>

                                        </div>

                                    </div>

                                    {/* Customer */}
                                    <div>

                                        <p className="font-semibold">
                                            {order.customer.firstName}{" "}
                                            {order.customer.lastName}
                                        </p>
                                        
                                        <p className="font-semibold">
                                           
                                            {order.customer.email}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.address.area}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.address.city}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.customer.phone}
                                        </p>

                                    </div>

                                    {/* Amount */}
                                    <div className="text-center">

                                        <p className="text-sm text-gray-500">
                                            Total
                                        </p>

                                        <h3 className="text-2xl font-bold text-orange-600">
                                            {currency}
                                            {order.totalAmount.toLocaleString()}
                                        </h3>

                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">

                                        <div>
                                            <p className="mb-1 text-xs font-semibold text-gray-500">
                                                Order Status
                                            </p>

                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) =>
                                                    updateStatus(
                                                        order._id,
                                                        "orderStatus",
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-orange-500"
                                            >
                                                {orderStatuses.map((status) => (
                                                    <option key={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-semibold text-gray-500">
                                                Payment Status
                                            </p>

                                            <select
                                                value={order.paymentStatus}
                                                onChange={(e) =>
                                                    updateStatus(
                                                        order._id,
                                                        "paymentStatus",
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-orange-500"
                                            >
                                                {paymentStatuses.map((status) => (
                                                    <option key={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                        {!orders.length && (
                            <div className="rounded-3xl border border-dashed bg-white p-20 text-center">

                                <Image
                                    src={assets.box_icon}
                                    alt=""
                                    width={70}
                                    height={70}
                                    className="mx-auto opacity-40"
                                />

                                <h3 className="mt-6 text-xl font-semibold">
                                    No Orders Yet
                                </h3>

                                <p className="mt-2 text-gray-500">
                                    Orders placed by customers will appear here.
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