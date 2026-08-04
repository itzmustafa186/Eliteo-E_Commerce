"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
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
                orderId,
                email,
            });

            if (!data.success) {
                setError(data.message);
                return;
            }

            setOrder(data.order);
        } catch (error) {
            setError(
                error.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-20 px-5">

                <div className="max-w-3xl mx-auto">

                    <div className="bg-white rounded-3xl shadow-xl p-10">

                        <h1 className="text-4xl font-bold">
                            Track Your Order
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Enter your Order ID and Email Address.
                        </p>

                        <form
                            onSubmit={handleTrack}
                            className="space-y-5 mt-10"
                        >

                            <input
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="Order ID"
                                className="w-full border rounded-xl p-4"
                                required
                            />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                className="w-full border rounded-xl p-4"
                                required
                            />

                            <button
                                disabled={loading}
                                className="w-full bg-orange-500 text-white p-4 rounded-xl"
                            >
                                {loading ? "Tracking..." : "Track Order"}
                            </button>

                        </form>

                        {error && (
                            <p className="text-red-500 mt-6">
                                {error}
                            </p>
                        )}

                        {order && (

                            <div className="mt-10">

                                <h2 className="text-2xl font-bold mb-5">
                                    Order Found
                                </h2>

                                <div className="border rounded-2xl p-6">

                                    <p>
                                        <b>Status:</b> {order.orderStatus}
                                    </p>

                                    <p>
                                        <b>Payment:</b> {order.paymentStatus}
                                    </p>

                                    <p>
                                        <b>Total:</b> Rs {order.totalAmount}
                                    </p>

                                    <p>
                                        <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
                                    </p>

                                    <div className="mt-6 space-y-4">

                                        {order.items.map((item) => (

                                            <div
                                                key={item._id}
                                                className="flex gap-4 items-center border-b pb-4"
                                            >

                                                <Image
                                                    src={item.product.image[0]}
                                                    alt={item.product.name}
                                                    width={80}
                                                    height={80}
                                                />

                                                <div>

                                                    <h3 className="font-semibold">
                                                        {item.product.name}
                                                    </h3>

                                                    <p>
                                                        Qty : {item.quantity}
                                                    </p>

                                                    <p>
                                                        Rs {item.product.offerPrice}
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>
            <Footer />
        </>
    );
}