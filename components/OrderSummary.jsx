"use client";

import { useAppContext } from "@/context/AppContext";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Loader2,
    LockKeyhole,
    Truck,
    ShieldCheck,
} from "lucide-react";
import Image from "next/image";

const OrderSummary = () => {
    const {
        currency,
        router,
        getCartAmount,
        cartItems,
        setCartItems,
        products,
    } = useAppContext();

    const SHIPPING_FEE = 250;

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        country: "Pakistan",
        firstName: "",
        lastName: "",
        street: "",
        apartment: "",
        city: "",
        area: "",
        postalCode: "",
        notes: "",
    });

    /* =========================================================
       CART PRODUCTS
    ========================================================= */

    const cartProducts = Object.keys(cartItems || {})
        .map((itemId) => {
            const product = products?.find(
                (item) => item._id === itemId
            );

            if (!product || cartItems[itemId] <= 0) {
                return null;
            }

            return {
                ...product,
                quantity: cartItems[itemId],
            };
        })
        .filter(Boolean);

    /* =========================================================
       INPUT CLASS
    ========================================================= */

    const getInputClass = (field) => `
        w-full rounded-xl
        border
        ${
            errors[field]
                ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-500/10"
                : "border-[#E8E1D6] bg-[#FCFBF8] focus:border-[#C8A96B] focus:bg-white focus:ring-[#C8A96B]/10"
        }
        px-4 py-3.5
        text-sm text-[#172033]
        outline-none
        transition-all duration-200
        placeholder:text-[#9A9DA4]
        focus:ring-2
    `;

    /* =========================================================
       HANDLE INPUT
    ========================================================= */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Remove error when user starts typing
        if (value.trim()) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    /* =========================================================
       VALIDATE FORM
    ========================================================= */

    const validateForm = () => {
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "street",
            "apartment",
            "city",
            "area",
        ];

        const newErrors = {};

        requiredFields.forEach((field) => {
            if (!formData[field].trim()) {
                newErrors[field] = "This field is required";
            }
        });

        // Email validation
        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {
            newErrors.email = "Enter a valid email address";
        }

        // Pakistan phone validation
        if (
            formData.phone &&
            !/^(\+92|0)?3[0-9]{9}$/.test(
                formData.phone.replace(/\s|-/g, "")
            )
        ) {
            newErrors.phone =
                "Enter a valid Pakistani phone number";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =========================================================
       CREATE ORDER
    ========================================================= */

    const createOrder = async () => {
        if (loading) return;

        const isValid = validateForm();

        if (!isValid) {
            toast.error(
                "Please fix the highlighted fields"
            );
            return;
        }

        if (cartProducts.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            const items = Object.keys(cartItems)
                .filter(
                    (productId) =>
                        cartItems[productId] > 0
                )
                .map((productId) => ({
                    product: productId,
                    quantity: cartItems[productId],
                }));

            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                },

                address: {
                    country: formData.country,
                    city: formData.city,
                    area: formData.area,
                    street: formData.street,
                    apartment: formData.apartment,
                    postalCode: formData.postalCode,
                    notes: formData.notes,
                },

                items,

                paymentMethod: "Cash on Delivery",
            };

            const { data } = await axios.post(
                "/api/order/create",
                orderData
            );

            if (data.success) {
                toast.success(
                    "Order placed successfully"
                );

                localStorage.removeItem("guestCart");

                setCartItems({});

                router.push("/order-success");
            } else {
                toast.error(
                    data.message ||
                        "Unable to place order"
                );
            }
        } catch (error) {
            console.log(
                "Order Error:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       PRICE
    ========================================================= */

    const subtotal = getCartAmount() || 0;
    const total = subtotal + SHIPPING_FEE;

    /* =========================================================
       ERROR MESSAGE
    ========================================================= */

    const ErrorMessage = ({ field }) => {
        if (!errors[field]) return null;

        return (
            <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors[field]}
            </p>
        );
    };

    /* =========================================================
       UI
    ========================================================= */

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-[28px] border border-[#E8E1D6] bg-white shadow-[0_12px_40px_rgba(23,32,51,0.06)]">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="border-b border-[#E8E1D6] bg-[#F4EFE6] p-6 sm:p-8">

                    <div className="flex items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#9B7A42] shadow-sm">

                            <Truck
                                size={21}
                                strokeWidth={1.6}
                            />

                        </div>

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                Eliteo
                            </p>

                            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#172033] sm:text-2xl">
                                Checkout
                            </h2>

                            <p className="mt-1 text-xs text-[#687080] sm:text-sm">
                                Complete your delivery details
                            </p>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    PRODUCTS
                ===================================================== */}

                <div className="border-b border-[#E8E1D6]">

                    <div className="px-6 pt-7 sm:px-8">

                        <div className="flex items-center justify-between gap-4">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                    Your Cart
                                </p>

                                <h3 className="mt-1 text-lg font-semibold text-[#172033]">
                                    Products
                                </h3>

                            </div>

                            <span className="shrink-0 rounded-full bg-[#F4EFE6] px-3 py-1.5 text-xs font-semibold text-[#9B7A42]">
                                {cartProducts.length}{" "}
                                {cartProducts.length === 1
                                    ? "Product"
                                    : "Products"}
                            </span>

                        </div>

                    </div>

                    <div className="mt-5 divide-y divide-[#EEE8DF]">

                        {cartProducts.map((product) => {

                            const itemTotal =
                                Number(product.offerPrice || 0) *
                                product.quantity;

                            return (
                                <div
                                    key={product._id}
                                    className="flex gap-4 px-6 py-5 sm:px-8"
                                >

                                    {/* IMAGE */}

                                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#E8E1D6] bg-[#F7F5F1]">

                                        {product.images?.[0] ? (
                                            <Image
                                                src={
                                                    product.images[0]
                                                }
                                                alt={
                                                    product.name
                                                }
                                                fill
                                                sizes="96px"
                                                className="object-contain p-3"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-[#9A9DA4]">
                                                No Image
                                            </div>
                                        )}

                                    </div>

                                    {/* DETAILS */}

                                    <div className="min-w-0 flex-1">

                                        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9B7A42]">
                                            {product.category}
                                        </p>

                                        <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[#172033] sm:text-base">
                                            {product.name}
                                        </h4>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">

                                            <span className="rounded-full bg-[#F4EFE6] px-2.5 py-1 text-[11px] font-semibold text-[#9B7A42]">
                                                Qty:{" "}
                                                {product.quantity}
                                            </span>

                                            <span className="text-xs text-[#687080]">
                                                {currency}
                                                {Number(
                                                    product.offerPrice ||
                                                        0
                                                ).toLocaleString()}
                                                {" "}each
                                            </span>

                                        </div>

                                    </div>

                                    {/* TOTAL */}

                                    <div className="shrink-0 text-right">

                                        <p className="text-[10px] uppercase tracking-wider text-[#9A9DA4]">
                                            Total
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#172033] sm:text-base">
                                            {currency}
                                            {itemTotal.toLocaleString()}
                                        </p>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>

                {/* =====================================================
                    FORM
                ===================================================== */}

                <div className="p-6 sm:p-8">

                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <div>

                        <div className="mb-5">

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                Contact
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-[#172033]">
                                Contact Information
                            </h3>

                        </div>

                        <div className="space-y-4">

                            {/* EMAIL */}

                            <div>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Email Address *"
                                    className={getInputClass(
                                        "email"
                                    )}
                                />

                                <ErrorMessage field="email" />

                            </div>

                            {/* PHONE */}

                            <div>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Phone Number *"
                                    className={getInputClass(
                                        "phone"
                                    )}
                                />

                                <ErrorMessage field="phone" />

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        DELIVERY
                    ================================================= */}

                    <div className="mt-10">

                        <div className="mb-5">

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                Delivery
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-[#172033]">
                                Delivery Address
                            </h3>

                        </div>

                        <div className="space-y-4">

                            {/* COUNTRY */}

                            <select
                                name="country"
                                value={
                                    formData.country
                                }
                                onChange={
                                    handleChange
                                }
                                className={getInputClass(
                                    "country"
                                )}
                            >
                                <option value="Pakistan">
                                    Pakistan
                                </option>
                            </select>

                            {/* NAME */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>

                                    <input
                                        name="firstName"
                                        value={
                                            formData.firstName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="First Name *"
                                        className={getInputClass(
                                            "firstName"
                                        )}
                                    />

                                    <ErrorMessage field="firstName" />

                                </div>

                                <div>

                                    <input
                                        name="lastName"
                                        value={
                                            formData.lastName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Last Name *"
                                        className={getInputClass(
                                            "lastName"
                                        )}
                                    />

                                    <ErrorMessage field="lastName" />

                                </div>

                            </div>

                            {/* STREET */}

                            <div>

                                <input
                                    name="street"
                                    value={
                                        formData.street
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Street Address *"
                                    className={getInputClass(
                                        "street"
                                    )}
                                />

                                <ErrorMessage field="street" />

                            </div>

                            {/* APARTMENT */}

                            <div>

                                <input
                                    name="apartment"
                                    value={
                                        formData.apartment
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Apartment, Suite, House No. *"
                                    className={getInputClass(
                                        "apartment"
                                    )}
                                />

                                <ErrorMessage field="apartment" />

                            </div>

                            {/* CITY / AREA */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                <div>

                                    <input
                                        name="city"
                                        value={
                                            formData.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="City *"
                                        className={getInputClass(
                                            "city"
                                        )}
                                    />

                                    <ErrorMessage field="city" />

                                </div>

                                <div>

                                    <input
                                        name="area"
                                        value={
                                            formData.area
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Area *"
                                        className={getInputClass(
                                            "area"
                                        )}
                                    />

                                    <ErrorMessage field="area" />

                                </div>

                            </div>

                            {/* POSTAL */}

                            <input
                                name="postalCode"
                                value={
                                    formData.postalCode
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Postal Code (optional)"
                                className={getInputClass(
                                    "postalCode"
                                )}
                            />

                            {/* NOTES */}

                            <textarea
                                rows={4}
                                name="notes"
                                value={
                                    formData.notes
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Order Notes (Optional)"
                                className={`${getInputClass(
                                    "notes"
                                )} resize-none`}
                            />

                        </div>

                    </div>

                    {/* =================================================
                        PAYMENT
                    ================================================= */}

                    <div className="mt-10">

                        <div className="mb-4">

                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                                Payment
                            </p>

                            <h3 className="mt-1 text-lg font-semibold text-[#172033]">
                                Payment Method
                            </h3>

                        </div>

                        <div className="flex items-center gap-4 rounded-2xl border border-[#DCCBAA] bg-[#F4EFE6] p-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#9B7A42]">

                                <LockKeyhole
                                    size={19}
                                    strokeWidth={1.6}
                                />

                            </div>

                            <div>

                                <p className="text-sm font-semibold text-[#172033]">
                                    Cash on Delivery
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#687080]">
                                    Pay when your Eliteo order arrives.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="mt-10 rounded-2xl border border-[#E8E1D6] bg-[#FCFBF8] p-5 sm:p-6">

                        <div className="flex justify-between text-sm text-[#687080]">

                            <span>
                                Subtotal
                            </span>

                            <span className="font-medium text-[#172033]">
                                {currency}
                                {subtotal.toLocaleString()}
                            </span>

                        </div>

                        <div className="mt-3 flex justify-between text-sm text-[#687080]">

                            <span>
                                Shipping
                            </span>

                            <span className="font-medium text-[#172033]">
                                {currency}
                                {SHIPPING_FEE.toLocaleString()}
                            </span>

                        </div>

                        <div className="my-4 h-px bg-[#E8E1D6]" />

                        <div className="flex items-center justify-between">

                            <span className="font-semibold text-[#172033]">
                                Total
                            </span>

                            <span className="text-2xl font-semibold tracking-tight text-[#9B7A42]">
                                {currency}
                                {total.toLocaleString()}
                            </span>

                        </div>

                    </div>

                    {/* =================================================
                        PLACE ORDER
                    ================================================= */}

                    <button
                        onClick={createOrder}
                        disabled={loading}
                        className={`
                            mt-6
                            flex w-full
                            items-center
                            justify-center
                            rounded-xl
                            border
                            py-4
                            text-sm
                            font-semibold
                            transition-all
                            duration-300
                            ${
                                loading
                                    ? `
                                        cursor-not-allowed
                                        border-[#DCCBAA]
                                        bg-[#DCCBAA]
                                        text-white
                                    `
                                    : `
                                        border-[#9B7A42]
                                        bg-[#9B7A42]
                                        text-white
                                        hover:border-[#856631]
                                        hover:bg-[#856631]
                                        hover:shadow-[0_10px_25px_rgba(155,122,66,0.2)]
                                        active:scale-[0.99]
                                    `
                            }
                        `}
                    >

                        {loading ? (
                            <span className="flex items-center gap-2">

                                <Loader2
                                    className="h-5 w-5 animate-spin"
                                />

                                Placing Order...

                            </span>
                        ) : (
                            "Place Order"
                        )}

                    </button>

                    {/* =================================================
                        TRUST
                    ================================================= */}

                    <div className="mt-5 flex items-center justify-center gap-2 text-center">

                        <ShieldCheck
                            size={16}
                            className="text-[#9B7A42]"
                            strokeWidth={1.6}
                        />

                        <p className="text-xs text-[#687080]">
                            Secure checkout · Cash on Delivery
                        </p>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default OrderSummary;