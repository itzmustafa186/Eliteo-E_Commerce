"use client";

import React from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Package,
    MapPin,
    CreditCard,
    CalendarDays
} from "lucide-react";

const MyOrders = ({ orders }) => {

    const { currency } = useAppContext();

    const statusColor = {
        Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        Confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        Processing: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        Shipped: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
        Delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        Cancelled: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    };
console.log(orders);

    

    return (
        <div className="bg-[#f8f9fa] min-h-screen text-slate-900 flex flex-col antialiased">
            <Navbar />

            <main className="flex-grow">

                {/* Page Header */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                    <div className="flex items-end justify-between border-b border-slate-200/80 pb-6">
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                Account
                            </p>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
                                My Orders
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                View and track your recent purchases
                            </p>
                        </div>

                        <div className="hidden md:flex h-12 w-12 rounded-xl bg-white border border-slate-200/80 shadow-xs items-center justify-center text-slate-700">
                            <Package size={22} />
                        </div>
                    </div>
                </section>

                {/* Orders Container */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    {orders.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center shadow-xs max-w-lg mx-auto my-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-400">
                                <Package size={32} />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                No orders yet
                            </h2>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <article
                                    key={order._id}
                                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:border-slate-300"
                                >
                                    {/* Order Top Bar */}
                                    <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-slate-900 text-sm tracking-wide">
                                                Order #{order.orderNumber}
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                                                <CalendarDays size={14} className="text-slate-400" />
                                                {order.createdAt}
                                            </div>
                                        </div>

                                        <div>
                                            <span className={`inline-flex items-center border px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide ${statusColor[order.orderStatus]}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items List */}
                                    <div className="px-6 py-5">
                                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                                            Products
                                        </h3>

                                        <div className="divide-y divide-slate-100">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-16 w-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 relative">
                                                            <Image
                                                                src={item.product.images[0]}
                                                                alt=""
                                                                width={100}
                                                                height={100}
                                                                className="h-full w-full object-cover object-center"
                                                            />
                                                        </div>

                                                        <div>
                                                            <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                                                                {item.product.name}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                Qty: <span className="text-slate-700">{item.quantity}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Details Footer */}
                                    <div className="bg-slate-50/60 border-t border-slate-100 px-6 py-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        <div>
                                            <h3 className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 uppercase tracking-wider mb-2">
                                                <MapPin size={14} className="text-slate-400" />
                                                Delivery
                                            </h3>
                                            <div className="text-xs text-slate-600 leading-relaxed font-normal">
                                                <p className="font-semibold text-slate-800">
                                                    {order.customer.firstName} {order.customer.lastName}
                                                </p>
                                                <p>{order.address.street}, {order.address.area}</p>
                                                <p>{order.address.city}, {order.address.country}</p>
                                                <p className="mt-1 text-slate-400">{order.customer.phone}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="flex items-center gap-1.5 font-semibold text-xs text-slate-900 uppercase tracking-wider mb-2">
                                                <CreditCard size={14} className="text-slate-400" />
                                                Payment
                                            </h3>
                                            <div className="text-xs text-slate-600 leading-relaxed">
                                                <p className="font-medium text-slate-800">{order.paymentMethod}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-200/60 text-slate-700 text-[11px] font-semibold">
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="md:text-right flex flex-col justify-end">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                Total
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">
                                                {currency}{order.totalAmount}
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