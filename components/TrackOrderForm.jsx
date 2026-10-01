"use client";

import { useState } from "react";
import axios from "axios";
import {
  Search,
  ArrowRight,
  Truck,
} from "lucide-react";

import OrderResult from "@/components/OrderResult";

export default function TrackOrderForm() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      setError("Please enter your order number or phone number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const isPhone = /^[0-9+\-\s()]+$/.test(value);

      const { data } = await axios.post("/api/track-order", {
        orderNumber: isPhone ? undefined : value,
        phone: isPhone ? value : undefined,
      });

      if (!data.success) {
        setError(
          data.message ||
            "Order not found. Please check your details."
        );
        return;
      }

      setOrder(data.order);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTrackAnother = () => {
    setOrder(null);
    setSearch("");
    setError("");
  };

  return (
    <div className="space-y-5">

      {/* SEARCH CARD */}
      <div className="rounded-2xl border border-[#E8E1D6] bg-white p-5 shadow-[0_8px_30px_rgba(23,32,51,0.04)] sm:p-6">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#9B7A42]">
            <Truck size={20} strokeWidth={1.7} />
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight text-[#172033]">
              Find your order
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#7A808B]">
              Enter your order number or phone number below.
            </p>
          </div>

        </div>

        <form
          onSubmit={handleTrack}
          className="mt-5 space-y-3"
        >

          {/* INPUT */}
          <div>

            <label className="mb-1.5 block text-xs font-medium text-[#303747]">
              Order Number or Phone Number
            </label>

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9B7A42]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ELT-82938471 or 03001234567"
                required
                autoComplete="off"
                className="w-full rounded-lg border border-[#E3DED4] bg-[#FCFBF8] py-3 pl-10 pr-3 text-sm text-[#172033] outline-none transition placeholder:text-[#A6A9AF] focus:border-[#C8A96B] focus:bg-white focus:ring-2 focus:ring-[#C8A96B]/10"
              />

            </div>

            <p className="mt-1.5 text-[10px] text-[#9A9DA4]">
              Use the details provided when placing your order.
            </p>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#172033] py-3 text-sm font-semibold text-white transition hover:bg-[#25324A] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <Search size={16} />

            {loading ? "Finding Order..." : "Track Order"}

            {!loading && (
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            )}

          </button>

        </form>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
            {error}
          </div>
        )}

      </div>

      {/* ORDER RESULT */}
      {order && (
        <OrderResult
          order={order}
          onTrackAnother={handleTrackAnother}
        />
      )}

    </div>
  );
}