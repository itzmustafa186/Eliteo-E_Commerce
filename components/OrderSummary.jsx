"use client";

import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Loader2,
  LockKeyhole,
  Truck,
  ShieldCheck,
  ChevronDown,
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
  const [productsOpen, setProductsOpen] = useState(false);

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

  // =========================================================
  // CART PRODUCTS
  // =========================================================

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

  // =========================================================
  // PRICE
  // =========================================================

  const subtotal = getCartAmount() || 0;
  const total = subtotal + SHIPPING_FEE;

  // =========================================================
  // INPUT CLASS
  // =========================================================

  const getInputClass = (field) => `
    w-full rounded-xl border px-4 py-3
    text-sm text-[#172033]
    outline-none
    transition-all duration-200
    placeholder:text-[#9A9DA4]
    focus:ring-2
    ${
      errors[field]
        ? `
          border-red-400
          bg-red-50
          focus:border-red-500
          focus:ring-red-500/10
        `
        : `
          border-[#E8E1D6]
          bg-[#FCFBF8]
          focus:border-[#C8A96B]
          focus:bg-white
          focus:ring-[#C8A96B]/10
        `
    }
  `;

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

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

    // Email
    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Pakistani phone
    const cleanPhone = formData.phone.replace(
      /[\s-]/g,
      ""
    );

    if (
      formData.phone &&
      !/^(?:\+92|0)?3[0-9]{9}$/.test(cleanPhone)
    ) {
      newErrors.phone =
        "Enter a valid Pakistani phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // CREATE ORDER
  // =========================================================

  const createOrder = async () => {
    if (loading) return;

    if (cartProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const isValid = validateForm();

    if (!isValid) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setLoading(true);

    try {
      const items = Object.keys(cartItems)
        .filter(
          (productId) => cartItems[productId] > 0
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
        toast.success("Order placed successfully");

        localStorage.removeItem("guestCart");

        setCartItems({});

        router.push("/order-success");
      } else {
        toast.error(
          data.message || "Unable to place order"
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

  // =========================================================
  // ERROR MESSAGE
  // =========================================================

  const ErrorMessage = ({ field }) => {
    if (!errors[field]) return null;

    return (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {errors[field]}
      </p>
    );
  };

  // =========================================================
  // PRODUCT LIST
  // =========================================================

  const ProductList = () => {
    if (cartProducts.length === 0) {
      return (
        <div className="px-4 py-8 text-center">
          <p className="text-sm font-medium text-[#172033]">
            Your cart is empty
          </p>

          <p className="mt-1 text-xs text-[#9A9DA4]">
            Add products to continue checkout.
          </p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-[#EEE8DF]">
        {cartProducts.map((product) => {
          const itemTotal =
            Number(product.offerPrice || 0) *
            product.quantity;

          return (
            <div
              key={product._id}
              className="px-4 py-4 sm:px-5"
            >
              <div className="flex items-center gap-3">

                {/* IMAGE */}

                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E8E1D6] bg-[#F7F5F1] sm:h-16 sm:w-16">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[8px] text-[#9A9DA4]">
                      No Image
                    </div>
                  )}
                </div>

                {/* DETAILS */}

                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[#9B7A42]">
                    {product.category}
                  </p>

                  <h4 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-4 text-[#172033]">
                    {product.name}
                  </h4>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="rounded-md bg-[#F4EFE6] px-1.5 py-0.5 text-[9px] font-semibold text-[#9B7A42]">
                      Qty {product.quantity}
                    </span>

                    <span className="text-[9px] text-[#687080]">
                      {currency}
                      {Number(
                        product.offerPrice || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* TOTAL */}

                <div className="shrink-0 text-right">
                  <p className="text-[8px] uppercase tracking-wider text-[#9A9DA4]">
                    Total
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-[#172033]">
                    {currency}
                    {itemTotal.toLocaleString()}
                  </p>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // =========================================================
  // PRICE SUMMARY
  // =========================================================

  const PriceSummary = () => (
    <div className="rounded-xl border border-[#E8E1D6] bg-white p-4 sm:p-5">

      <div className="flex items-center justify-between gap-4 text-sm text-[#687080]">
        <span>Subtotal</span>

        <span className="font-medium text-[#172033]">
          {currency}
          {subtotal.toLocaleString()}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-sm text-[#687080]">
        <span>Shipping</span>

        <span className="font-medium text-[#172033]">
          {currency}
          {SHIPPING_FEE.toLocaleString()}
        </span>
      </div>

      <div className="my-4 h-px bg-[#E8E1D6]" />

      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-[#172033]">
          Total
        </span>

        <span className="text-xl font-semibold tracking-tight text-[#9B7A42] sm:text-2xl">
          {currency}
          {total.toLocaleString()}
        </span>
      </div>

    </div>
  );

  // =========================================================
  // PLACE ORDER BUTTON
  // =========================================================

  const PlaceOrderButton = () => (
    <button
      type="button"
      onClick={createOrder}
      disabled={loading}
      className={`
        mt-5 flex w-full items-center justify-center
        rounded-xl border py-3.5
        text-sm font-semibold
        transition-all duration-300
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
  );

  // =========================================================
  // PRODUCTS DROPDOWN
  // =========================================================

  const ProductsDropdown = () => (
    <div className="mb-5">

      <button
        type="button"
        onClick={() =>
          setProductsOpen((prev) => !prev)
        }
        className="flex w-full items-center justify-between rounded-xl border border-[#E8E1D6] bg-white px-4 py-3.5 text-left transition-colors hover:border-[#DCCBAA]"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
            Your Cart
          </p>

          <p className="mt-1 text-sm font-semibold text-[#172033]">
            {cartProducts.length}{" "}
            {cartProducts.length === 1
              ? "Product"
              : "Products"}
          </p>
        </div>

        <div
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center
            rounded-lg bg-[#F4EFE6] text-[#9B7A42]
            transition-transform duration-200
            ${productsOpen ? "rotate-180" : ""}
          `}
        >
          <ChevronDown size={17} />
        </div>
      </button>

      {productsOpen && (
        <div className="mt-3 overflow-hidden rounded-xl border border-[#E8E1D6] bg-white">
          <ProductList />
        </div>
      )}

    </div>
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full">

      <div className="overflow-hidden rounded-2xl border border-[#E8E1D6] bg-white shadow-[0_12px_40px_rgba(23,32,51,0.06)] sm:rounded-[24px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-[#E8E1D6] bg-[#F4EFE6] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#9B7A42] shadow-sm">
              <Truck
                size={19}
                strokeWidth={1.6}
              />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                Eliteo
              </p>

              <h2 className="mt-0.5 text-xl font-semibold tracking-tight text-[#172033]">
                Checkout
              </h2>

              <p className="mt-0.5 text-xs text-[#687080]">
                Complete your delivery details
              </p>
            </div>

          </div>
        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="min-w-0 lg:border-r lg:border-[#E8E1D6]">

            {/* ================= DESKTOP PRODUCTS ================= */}

            {/* <section className="hidden border-b border-[#E8E1D6] lg:block">

              <div className="px-5 pt-6 sm:px-7">
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                      Your Cart
                    </p>

                    <h3 className="mt-1 text-base font-semibold text-[#172033]">
                      Products
                    </h3>
                  </div>

                  <span className="rounded-full bg-[#F4EFE6] px-2.5 py-1 text-[11px] font-semibold text-[#9B7A42]">
                    {cartProducts.length}{" "}
                    {cartProducts.length === 1
                      ? "Product"
                      : "Products"}
                  </span>

                </div>
              </div>

              <div className="mt-4">
                <ProductList />
              </div>

            </section> */}

            {/* =================================================
                FORM
            ================================================= */}

            <div className="p-5 sm:p-7">

              {/* ================= CONTACT ================= */}

              <section>

                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                    Contact
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-[#172033]">
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-3">

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      className={getInputClass("email")}
                    />

                    <ErrorMessage field="email" />
                  </div>

                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number *"
                      className={getInputClass("phone")}
                    />

                    <ErrorMessage field="phone" />
                  </div>

                </div>
              </section>

              {/* ================= DELIVERY ================= */}

              <section className="mt-8">

                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                    Delivery
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-[#172033]">
                    Delivery Address
                  </h3>
                </div>

                <div className="space-y-3">

                  {/* COUNTRY */}

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={getInputClass("country")}
                  >
                    <option value="Pakistan">
                      Pakistan
                    </option>
                  </select>

                  {/* NAME */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
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
                        value={formData.lastName}
                        onChange={handleChange}
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
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Street Address *"
                      className={getInputClass("street")}
                    />

                    <ErrorMessage field="street" />
                  </div>

                  {/* APARTMENT */}

                  <div>
                    <input
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Apartment, Suite, House No. *"
                      className={getInputClass(
                        "apartment"
                      )}
                    />

                    <ErrorMessage field="apartment" />
                  </div>

                  {/* CITY / AREA */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City *"
                        className={getInputClass("city")}
                      />

                      <ErrorMessage field="city" />
                    </div>

                    <div>
                      <input
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Area *"
                        className={getInputClass("area")}
                      />

                      <ErrorMessage field="area" />
                    </div>

                  </div>

                  {/* POSTAL */}

                  <input
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal Code (optional)"
                    className={getInputClass(
                      "postalCode"
                    )}
                  />

                  {/* NOTES */}

                  <textarea
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Order Notes (Optional)"
                    className={`${getInputClass(
                      "notes"
                    )} resize-none`}
                  />

                </div>
              </section>

              {/* ================= PAYMENT ================= */}

              <section className="mt-8">

                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                    Payment
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-[#172033]">
                    Payment Method
                  </h3>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#DCCBAA] bg-[#F4EFE6] p-3.5">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#9B7A42]">
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.6}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#172033]">
                      Cash on Delivery
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-[#687080]">
                      Pay when your Eliteo order arrives.
                    </p>
                  </div>

                </div>
              </section>

            </div>
          </div>

          {/* =================================================
              RIGHT SIDE / ORDER SUMMARY
          ================================================= */}

          <aside className="bg-[#FCFBF8] p-5 sm:p-7 lg:p-6">

            <div className="lg:sticky lg:top-6">

              {/* PRODUCTS DROPDOWN */}

              <ProductsDropdown />

              {/* SUMMARY TITLE */}

              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9B7A42]">
                  Your Order
                </p>

                <h3 className="mt-1 text-lg font-semibold text-[#172033]">
                  Order Summary
                </h3>
              </div>

              {/* PRICE */}

              <PriceSummary />

              {/* PLACE ORDER */}

              <PlaceOrderButton />

              {/* TRUST */}

              <div className="mt-4 flex items-center justify-center gap-2 text-center">

                <ShieldCheck
                  size={15}
                  className="shrink-0 text-[#9B7A42]"
                  strokeWidth={1.6}
                />

                <p className="text-[11px] text-[#687080]">
                  Secure checkout · Cash on Delivery
                </p>

              </div>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default OrderSummary;