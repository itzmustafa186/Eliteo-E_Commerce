"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import {
    Package,
    CreditCard,
    CalendarDays,
    Truck,
    CheckCircle,
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

            const { data } = await axios.post(
                "/api/track-order",
                {
                    orderNumber,
                    email,
                }
            );


            if (!data.success) {
                setError(data.message);
                return;
            }


            setOrder(data.order);


        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };


    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100 py-20 px-5">


                <div className="max-w-4xl mx-auto">


                    {/* Card */}

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">


                        <div className="text-center">

                            <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                                <Truck className="text-orange-600" size={32}/>
                            </div>


                            <h1 className="mt-5 text-4xl font-bold text-gray-900">
                                Track Your Order
                            </h1>


                            <p className="mt-3 text-gray-500">
                                Enter your order number and email to check your delivery status.
                            </p>

                        </div>



                        {/* FORM */}

                        <form
                            onSubmit={handleTrack}
                            className="mt-10 space-y-5"
                        >

                            <div>

                                <label className="text-sm font-semibold text-gray-700">
                                    Order Number
                                </label>

                                <input
                                    value={orderNumber}
                                    onChange={(e)=>setOrderNumber(e.target.value)}
                                    placeholder="Example: ELT-82938471"
                                    className="mt-2 w-full rounded-xl border border-gray-200 px-5 py-4 outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />

                            </div>



                            <div>

                                <label className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="mt-2 w-full rounded-xl border border-gray-200 px-5 py-4 outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />

                            </div>



                            <button
                                disabled={loading}
                                className="w-full rounded-xl bg-orange-600 py-4 text-white font-semibold text-lg hover:bg-orange-700 transition disabled:opacity-50"
                            >

                                {
                                    loading
                                    ? "Searching..."
                                    : "Track Order"
                                }

                            </button>


                        </form>



                        {
                            error && (
                                <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600 text-center">
                                    {error}
                                </div>
                            )
                        }





                        {
                            order && (

                                <section className="mt-12">


                                    <div className="flex items-center justify-between mb-6">

                                        <div>

                                            <h2 className="text-2xl font-bold">
                                                Order Details
                                            </h2>

                                            <p className="text-gray-500">
                                                #{order.orderNumber}
                                            </p>

                                        </div>


                                        <CheckCircle
                                            className="text-green-500"
                                            size={35}
                                        />

                                    </div>




                                    {/* STATUS */}

                                    <div className="grid md:grid-cols-3 gap-5">


                                        <div className="rounded-2xl bg-orange-50 p-5">

                                            <Package className="text-orange-600"/>

                                            <p className="mt-3 text-sm text-gray-500">
                                                Status
                                            </p>

                                            <h3 className="font-bold">
                                                {order.orderStatus}
                                            </h3>

                                        </div>



                                        <div className="rounded-2xl bg-blue-50 p-5">

                                            <CreditCard className="text-blue-600"/>

                                            <p className="mt-3 text-sm text-gray-500">
                                                Payment
                                            </p>

                                            <h3 className="font-bold">
                                                {order.paymentStatus}
                                            </h3>

                                        </div>



                                        <div className="rounded-2xl bg-gray-100 p-5">

                                            <CalendarDays/>

                                            <p className="mt-3 text-sm text-gray-500">
                                                Date
                                            </p>

                                            <h3 className="font-bold text-sm">
                                                {new Date(order.createdAt)
                                                .toLocaleDateString()}
                                            </h3>

                                        </div>


                                    </div>





                                    {/* PRODUCTS */}

                                    <div className="mt-10">


                                        <h3 className="text-xl font-bold mb-5">
                                            Products
                                        </h3>



                                        <div className="space-y-5">


                                            {
                                                order.items.map((item)=>(
                                                    <div
                                                        key={item._id}
                                                        className="flex gap-5 items-center border rounded-2xl p-5"
                                                    >

                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.product.name}
                                                            width={90}
                                                            height={90}
                                                            className="rounded-xl object-cover"
                                                        />


                                                        <div className="flex-1">

                                                            <h4 className="font-bold">
                                                                {item.product.name}
                                                            </h4>

                                                            <p className="text-gray-500">
                                                                Quantity: {item.quantity}
                                                            </p>


                                                            <p className="font-semibold text-orange-600">
                                                                Rs {item.product.offerPrice}
                                                            </p>

                                                        </div>


                                                    </div>
                                                ))
                                            }


                                        </div>


                                    </div>




                                    <div className="mt-8 rounded-2xl bg-gray-900 text-white p-6 flex justify-between">

                                        <span className="font-semibold">
                                            Total Amount
                                        </span>


                                        <span className="text-xl font-bold">
                                            Rs {order.totalAmount}
                                        </span>

                                    </div>


                                </section>

                            )
                        }



                    </div>


                </div>


            </main>


            <Footer />

        </>
    );
}