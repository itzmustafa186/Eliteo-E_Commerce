"use client"

import { useAppContext } from "@/context/AppContext";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
const OrderSummary = () => {

  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    cartItems,
    user,
    setCartItems
  } = useAppContext();

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
  const SHIPPING_FEE = 250;


  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const createOrder = async () => {

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.area ||
      !formData.apartment
    ) {
      return toast.error("Please fill all required fields");
    }
    if (loading) return;

    setLoading(true);
    try {
      const items = Object.keys(cartItems).map((productId) => ({
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

        items: Object.keys(cartItems).map((productId) => ({
          product: productId,
          quantity: cartItems[productId],
        })),

        paymentMethod: "Cash on Delivery",
      };

      const { data } = await axios.post("/api/order/create", orderData);

      if (data.success) {
        toast.success("Order placed successfully");
        router.push("/orders");
        localStorage.removeItem("guestCart");
        router.push("/order-success");
        setCartItems({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || error.message
      );
    
  } finally {
    setLoading(false)
  }
};




return (
  <div className="w-full md:w-[420px] bg-white border rounded-2xl shadow-sm p-6">
    {/* Heading */}
    <h2 className="text-2xl font-bold text-gray-800">
      Order Summary
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Complete your contact and delivery details.
    </p>

    <hr className="my-6" />

    {/* Contact */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Contact Information
      </h3>

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email Address"
        className={inputClass}
      />

      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone Number"
        className={inputClass}
      />
    </div>

    {/* Delivery */}
    <div className="mt-8 space-y-4">

      <h3 className="text-lg font-semibold text-gray-800">
        Delivery Address
      </h3>

      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        className={inputClass}
      >
        <option>Pakistan</option>
      </select>

      <div className="grid grid-cols-2 gap-4">

        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className={inputClass}
        />

        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className={inputClass}
        />

      </div>

      <input
        name="street"
        value={formData.street}
        onChange={handleChange}
        placeholder="Street Address"
        className={inputClass}
      />

      <input
        name="apartment"
        value={formData.apartment}
        onChange={handleChange}
        required
        placeholder="Apartment, Suite"
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-4">

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className={inputClass}
        />

        <input
          name="area"
          value={formData.area}
          onChange={handleChange}
          placeholder="Area"
          className={inputClass}
        />

      </div>

      <input
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        placeholder="Postal Code (optional)"
        className={inputClass}
      />

      <textarea
        rows={4}
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Order Notes (Optional)"
        className={`${inputClass} resize-none`}
      />

    </div>
    <div className="mt-8 rounded-xl bg-gray-50 border p-5">

      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{currency}{getCartAmount()}</span>
      </div>

      <div className="flex justify-between text-gray-600 mt-3">
        <span>Shipping</span>
        <span>{currency}{SHIPPING_FEE}</span>
      </div>

      <div className="mt-4 border-t pt-4 flex justify-between text-xl font-bold">
        <span>Total</span>
        <span className="text-orange-600">
          {currency}{getCartAmount() + SHIPPING_FEE}
        </span>
      </div>

    </div>
    <button
      onClick={createOrder}
      disabled={loading}
      className={`mt-6 w-full rounded-xl py-4 text-lg font-semibold text-white transition
    ${loading
          ? "bg-orange-400 cursor-not-allowed"
          : "bg-orange-600 hover:bg-orange-700 active:scale-[0.98]"
        }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Placing Order...
        </span>
      ) : (
        "Place Order"
      )}
    </button>
  </div>
);
};

export default OrderSummary;