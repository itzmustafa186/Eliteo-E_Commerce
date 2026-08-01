import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const SHIPPING_FEE = 250;
  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {

  }

  useEffect(() => {
    fetchUserAddresses();
  }, [])
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
          Contact
        </h3>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />
      </div>

      {/* Delivery */}
      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold text-gray-800">
          Delivery
        </h3>

        <select
          defaultValue="Pakistan"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none bg-white focus:border-orange-500"
        >
          <option>Pakistan</option>
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="text"
            placeholder="Last Name"
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <input
          type="text"
          placeholder="Street Address"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />

        <input
          type="text"
          placeholder="Apartment, suite, etc. (optional)"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="City"
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />

          <input
            type="text"
            placeholder="Area"
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <input
          type="text"
          placeholder="Postal Code"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />

        <textarea
          rows={4}
          placeholder="Order Notes (optional)"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:border-orange-500"
        />
      </div>

      {/* Summary */}
      {/* Summary */}
      <div className="mt-8 border-t pt-6 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Items ({getCartCount()})</span>
          <span>
            {currency}
            {getCartAmount()}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping (Standard)</span>
          <span>
            {currency}
            {SHIPPING_FEE}
          </span>
        </div>

        <div className="flex justify-between text-xl font-bold border-t pt-4">
          <span>Total</span>
          <span>
            {currency}
            {getCartAmount() + SHIPPING_FEE}
          </span>
        </div>
      </div>

      {/* Place Order */}
      <button
        onClick={createOrder}
        className="w-full mt-6 rounded-xl bg-orange-600 py-3.5 text-white font-semibold transition hover:bg-orange-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;