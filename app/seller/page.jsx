"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    ArrowRight,
    IndianRupee,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function SellerDashboard() {
    const { currency } = useAppContext();

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const [productsRes, ordersRes] = await Promise.all([
                fetch("/api/product/list"),
                fetch("/api/seller/orders"),
            ]);

            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();

            if (productsData.success) {
                setProducts(productsData.products || []);
            }

            if (ordersData.success) {
                setOrders(ordersData.orders || []);
            }
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // =========================
    // REAL DASHBOARD STATS
    // =========================

    const totalProducts = products.length;

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.orderStatus === "Pending"
    ).length;

    const totalSales = orders
        .filter((order) => order.paymentStatus === "Paid")
        .reduce(
            (total, order) => total + Number(order.totalAmount || 0),
            0
        );

    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-32 rounded-3xl bg-gray-200" />

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-32 rounded-2xl bg-gray-200"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

            {/* ================= HEADER ================= */}

            <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 p-6 text-white shadow-xl md:p-8">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-orange-100">
                            Seller Center
                        </p>

                        <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                            Dashboard
                        </h1>

                        <p className="mt-2 text-sm text-orange-100 md:text-base">
                            Manage your store, products and orders.
                        </p>
                    </div>

                    <Link
                        href="/seller/add-product"
                        className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-orange-600 shadow-lg transition hover:scale-105"
                    >
                        Add Product
                        <ArrowRight size={17} />
                    </Link>

                </div>
            </div>

            {/* ================= STATS ================= */}

            <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                {/* Products */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Products
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {totalProducts}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                            <Package size={23} />
                        </div>

                    </div>

                    <Link
                        href="/seller/product-list"
                        className="mt-5 flex items-center gap-1 text-sm font-semibold text-orange-600"
                    >
                        View products
                        <ArrowRight size={15} />
                    </Link>

                </div>

                {/* Orders */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Orders
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {totalOrders}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                            <ShoppingCart size={23} />
                        </div>

                    </div>

                    <Link
                        href="/seller/orders"
                        className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600"
                    >
                        Manage orders
                        <ArrowRight size={15} />
                    </Link>

                </div>

                {/* Sales */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Sales
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {currency}
                                {totalSales.toLocaleString()}
                            </h2>
                        </div>

                        

                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                        From paid orders
                    </p>

                </div>

                {/* Pending */}

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Pending Orders
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900">
                                {pendingOrders}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-600">
                            <Clock size={23} />
                        </div>

                    </div>

                    <Link
                        href="/seller/orders"
                        className="mt-5 flex items-center gap-1 text-sm font-semibold text-yellow-600"
                    >
                        View orders
                        <ArrowRight size={15} />
                    </Link>

                </div>

            </div>

            {/* ================= PRODUCTS + ORDERS ================= */}

            <div className="grid gap-6 xl:grid-cols-2">

                {/* ================= PRODUCTS ================= */}

                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your latest products
                            </p>
                        </div>

                        <Link
                            href="/seller/product-list"
                            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                        >
                            View All
                        </Link>

                    </div>

                    <div className="space-y-3">

                        {products.slice(0, 5).map((product) => (

                            <div
                                key={product._id}
                                className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3 transition hover:border-orange-200 hover:bg-orange-50/30"
                            >

                                {/* Product Image */}

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2">

                                    <Image
                                        src={product.images?.[0]}
                                        alt={product.name}
                                        width={60}
                                        height={60}
                                        className="h-full w-full object-contain"
                                    />

                                </div>

                                {/* Product Details */}

                                <div className="min-w-0 flex-1">

                                    <h3 className="truncate font-semibold text-gray-900">
                                        {product.name}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {product.category}
                                    </p>

                                </div>

                                {/* Price */}

                                <div className="text-right">

                                    <p className="font-bold text-orange-600">
                                        {currency}
                                        {Number(
                                            product.offerPrice || 0
                                        ).toLocaleString()}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        Stock: {product.stock || 0}
                                    </p>

                                </div>

                            </div>

                        ))}

                        {!products.length && (
                            <div className="rounded-2xl border border-dashed p-10 text-center">

                                <Package
                                    className="mx-auto text-gray-300"
                                    size={40}
                                />

                                <p className="mt-3 font-semibold text-gray-600">
                                    No products yet
                                </p>

                                <Link
                                    href="/seller/add-product"
                                    className="mt-2 inline-block text-sm font-semibold text-orange-600"
                                >
                                    Add your first product
                                </Link>

                            </div>
                        )}

                    </div>

                </section>

                {/* ================= RECENT ORDERS ================= */}

                <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="mb-6 flex items-center justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Orders
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest customer orders
                            </p>
                        </div>

                        <Link
                            href="/seller/orders"
                            className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                        >
                            View All
                        </Link>

                    </div>

                    <div className="space-y-3">

                        {recentOrders.map((order) => (

                            <div
                                key={order._id}
                                className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                            >

                                <div>

                                    <p className="font-semibold text-gray-900">
                                        #{order.orderNumber}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {order.customer?.firstName || "Customer"}
                                        {" "}
                                        {order.customer?.lastName || ""}
                                    </p>

                                </div>

                                <div className="text-right">

                                    <p className="font-bold text-gray-900">
                                        {currency}
                                        {Number(
                                            order.totalAmount || 0
                                        ).toLocaleString()}
                                    </p>

                                    <span
                                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            order.orderStatus === "Delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.orderStatus === "Cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-orange-100 text-orange-700"
                                        }`}
                                    >
                                        {order.orderStatus}
                                    </span>

                                </div>

                            </div>

                        ))}

                        {!recentOrders.length && (
                            <div className="rounded-2xl border border-dashed p-10 text-center">

                                <ShoppingCart
                                    className="mx-auto text-gray-300"
                                    size={40}
                                />

                                <p className="mt-3 font-semibold text-gray-600">
                                    No orders yet
                                </p>

                            </div>
                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}