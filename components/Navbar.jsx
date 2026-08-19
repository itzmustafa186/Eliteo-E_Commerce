"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { assets, CartIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categories = [
    {
      name: "Earbuds",
      slug: "earbuds",

      image: "/categories/earbuds.png",

    },
    {
      name: "Headphones",
      slug: "headphones",

      image: "/categories/headphones.png",

    },
    {
      name: "Chargers",
      slug: "chargers",

      image: "/categories/chargers.png",

    },
    {
      name: "Cables",
      slug: "cables",

      image: "/categories/cables.png",

    },
    {
      name: "Power Banks",
      slug: "powerbanks",
      image: "/categories/power-banks.png",

    },
    {
      name: "Handsfree",
      slug: "handsfree",
      image: "/categories/hand-frees.png",
    },
    {
      name: "Smartwatches",
      slug: "smartwatches",
      image: "/categories/smart-watches.png",
    },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
    setCategoryOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl">
      <div
        className="
          mx-auto
          flex
          h-16
          sm:h-18
          md:h-20
          lg:h-22
          xl:h-24
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* ================= MOBILE MENU BUTTON ================= */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full
              hover:bg-gray-100
              transition
            "
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="
            flex flex-1 items-center justify-center
            lg:flex-none lg:justify-start
          "
        >
          <Image
            src="/icon4.png"
            alt="Eliteo"
            width={220}
            height={100}
            priority
            className="
              h-auto
              w-[120px]
              sm:w-[140px]
              md:w-[160px]
              lg:w-[180px]
              xl:w-[200px]
              2xl:w-[220px]
              object-contain
            "
          />
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 2xl:gap-9">

          {/* HOME */}
          <Link
            href="/"
            className="
              relative
              font-medium
              text-gray-700
              hover:text-black
              transition
              group
            "
          >
            Home

            <span
              className="
                absolute
                left-0
                -bottom-1
                h-0.5
                w-0
                bg-yellow-400
                transition-all
                duration-300
                group-hover:w-full
              "
            />
          </Link>

          {/* ================= PRODUCTS MEGA MENU ================= */}
          <div className="relative group">

            <button
              className="
                flex
                items-center
                gap-1.5
                font-medium
                text-gray-700
                hover:text-black
                transition
                py-3
              "
            >
              Products

              <ChevronDown
                className="
                  w-4 h-4
                  transition-transform
                  duration-300
                  group-hover:rotate-180
                "
              />
            </button>

            {/* Mega Menu */}
            <div
              className="
                absolute
                left-1/2
                top-full
                mt-2
                w-[620px]
                -translate-x-1/2
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-4
                shadow-2xl

                opacity-0
                invisible
                translate-y-3

                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0

                transition-all
                duration-300
              "
            >

              {/* Menu Header */}
              <div className="mb-4 flex items-center justify-between px-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Shop Categories
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Explore our latest collections
                  </p>
                </div>

                <Link
                  href="/all-products"
                  className="
                    flex
                    items-center
                    gap-1
                    text-sm
                    font-medium
                    text-gray-700
                    hover:text-black
                    transition
                  "
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="
                      group/card
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-transparent
                      p-2
                      hover:border-gray-200
                      hover:bg-gray-50
                      transition-all
                      duration-300
                    "
                  >
                    {/* Category Image */}
                    <div
                      className="
                        relative
                        h-16
                        w-16
                        shrink-0
                        overflow-hidden
                        rounded-lg
                        bg-gray-100
                      "
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="64px"
                        className="
                          object-cover
                          transition-transform
                          duration-500
                          group-hover/card:scale-110
                        "
                      />
                    </div>

                    {/* Category Details */}
                    <div className="min-w-0">
                      <h4
                        className="
                          font-semibold
                          text-gray-900
                          group-hover/card:text-black
                        "
                      >
                        {category.name}
                      </h4>


                    </div>

                    <ArrowRight
                      className="
                        ml-auto
                        h-4
                        w-4
                        shrink-0
                        text-gray-300
                        opacity-0
                        -translate-x-1
                        transition-all
                        duration-300
                        group-hover/card:opacity-100
                        group-hover/card:translate-x-0
                      "
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ================= ORDERS ================= */}
          {user ? (
            <>
              <Link
                href="/my-orders"
                className="
                  relative
                  font-medium
                  text-gray-700
                  hover:text-black
                  transition
                  group
                "
              >
                My Orders

                <span
                  className="
                    absolute
                    left-0
                    -bottom-1
                    h-0.5
                    w-0
                    bg-yellow-400
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </Link>

              <Link
                href="/track-order"
                className="
                  relative
                  font-medium
                  text-gray-700
                  hover:text-black
                  transition
                  group
                "
              >
                Track Order

                <span
                  className="
                    absolute
                    left-0
                    -bottom-1
                    h-0.5
                    w-0
                    bg-yellow-400
                    transition-all
                    duration-300
                    group-hover:w-full
                  "
                />
              </Link>
            </>
          ) : (
            <Link
              href="/track-order"
              className="
                relative
                font-medium
                text-gray-700
                hover:text-black
                transition
                group
              "
            >
              Track Order

              <span
                className="
                  absolute
                  left-0
                  -bottom-1
                  h-0.5
                  w-0
                  bg-yellow-400
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </Link>
          )}

          {/* ABOUT */}
          <Link
            href="/about"
            className="
              relative
              font-medium
              text-gray-700
              hover:text-black
              transition
              group
            "
          >
            About

            <span
              className="
                absolute
                left-0
                -bottom-1
                h-0.5
                w-0
                bg-yellow-400
                transition-all
                duration-300
                group-hover:w-full
              "
            />
          </Link>

          {/* CONTACT */}
          <Link
            href="/contact"
            className="
              relative
              font-medium
              text-gray-700
              hover:text-black
              transition
              group
            "
          >
            Contact

            <span
              className="
                absolute
                left-0
                -bottom-1
                h-0.5
                w-0
                bg-yellow-400
                transition-all
                duration-300
                group-hover:w-full
              "
            />
          </Link>

          {/* SELLER */}
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="
                rounded-full
                border
                border-gray-300
                px-5
                py-2
                font-medium
                hover:bg-black
                hover:text-white
                hover:border-black
                transition
              "
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* SEARCH */}
          <button
            className="
              hidden
              lg:flex
              items-center
              justify-center
              h-10
              w-10
              rounded-full
              hover:bg-gray-100
              transition
            "
            aria-label="Search"
          >
            <Image
              src={assets.search_icon}
              alt="Search"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </button>

          {/* CART */}
          <button
            onClick={() => router.push("/cart")}
            className="
              relative
              flex
              h-10
              w-10
              sm:h-11
              sm:w-11
              items-center
              justify-center
              rounded-full
              hover:bg-gray-100
              transition
            "
            aria-label="Cart"
          >
            <CartIcon />

            {getCartCount() > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  min-w-[19px]
                  h-5
                  px-1
                  items-center
                  justify-center
                  rounded-full
                  bg-yellow-400
                  text-[11px]
                  font-bold
                  text-black
                  shadow
                "
              >
                {getCartCount()}
              </span>
            )}
          </button>

          {/* MOBILE USER */}
          <div className="lg:hidden">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button
                onClick={openSignIn}
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  hover:bg-gray-100
                  transition
                "
              >
                <Image
                  src={assets.user_icon}
                  alt="User"
                  width={22}
                  height={22}
                />
              </button>
            )}
          </div>

          {/* DESKTOP USER */}
          <div className="hidden lg:block">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button
                onClick={openSignIn}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-gray-300
                  px-4
                  py-2
                  hover:bg-black
                  hover:text-white
                  hover:border-black
                  transition
                "
              >
                <Image
                  src={assets.user_icon}
                  alt="User"
                  width={20}
                  height={20}
                />

                Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ================================================= */}

      <div className="lg:hidden">

        {/* Overlay */}
        <div
          onClick={closeSidebar}
          className={`
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            transition-opacity
            duration-300
            ${sidebarOpen
              ? "visible opacity-100"
              : "invisible opacity-0"
            }
          `}
        />

        {/* Drawer */}
        <aside
          className={`
            fixed
            left-0
            top-0
            z-50
            h-screen
            w-[85%]
            max-w-[360px]
            bg-white
            shadow-2xl
            transition-transform
            duration-300
            ease-out
            ${sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            }
          `}
        >

          {/* Drawer Header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-5
              py-4
            "
          >
            <Image
              src="/icon4.png"
              alt="Eliteo"
              width={160}
              height={70}
              className="w-[130px] object-contain"
            />

            <button
              onClick={closeSidebar}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                hover:bg-gray-100
                transition
              "
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="overflow-y-auto h-[calc(100vh-90px)] py-3">

            {/* HOME */}
            <Link
              href="/"
              onClick={closeSidebar}
              className="
                block
                px-6
                py-4
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              Home
            </Link>

            {/* MOBILE CATEGORIES */}
            <div className="border-y border-gray-100">

              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-6
                  py-4
                  font-medium
                  hover:bg-gray-50
                  transition
                "
              >
                <span>Categories</span>

                {categoryOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <div
                className={`
                  overflow-hidden
                  transition-all
                  duration-300
                  ${categoryOpen
                    ? "max-h-[600px]"
                    : "max-h-0"
                  }
                `}
              >
                <div className="space-y-1 px-3 pb-3">

                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      onClick={closeSidebar}
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        p-2
                        hover:bg-gray-50
                        transition
                      "
                    >

                      {/* Image */}
                      <div
                        className="
                          relative
                          h-14
                          w-14
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          bg-gray-100
                        "
                      >
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="56px"
                          className="
                            object-cover
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {category.name}
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          {category.description}
                        </p>
                      </div>

                      <ArrowRight
                        className="
                          h-4
                          w-4
                          text-gray-400
                        "
                      />
                    </Link>
                  ))}

                  {/* All Products */}
                  <Link
                    href="/all-products"
                    onClick={closeSidebar}
                    className="
                      mt-2
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-black
                      px-4
                      py-3
                      text-sm
                      font-medium
                      !text-white
                      transition
                      hover:bg-gray-800
                    "
                  >
                    View All Products
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>
              </div>
            </div>

            {/* ORDERS */}
            {user && (
              <Link
                href="/my-orders"
                onClick={closeSidebar}
                className="
                  block
                  px-6
                  py-4
                  font-medium
                  hover:bg-gray-50
                  transition
                "
              >
                My Orders
              </Link>
            )}

            {/* TRACK ORDER */}
            <Link
              href="/track-order"
              onClick={closeSidebar}
              className="
                block
                px-6
                py-4
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              Track Order
            </Link>

            {/* ABOUT */}
            <Link
              href="/about"
              onClick={closeSidebar}
              className="
                block
                px-6
                py-4
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              About
            </Link>

            {/* CONTACT */}
            <Link
              href="/contact"
              onClick={closeSidebar}
              className="
                block
                px-6
                py-4
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              Contact
            </Link>

            {/* SELLER */}
            {isSeller && (
              <button
                onClick={() => {
                  router.push("/seller");
                  closeSidebar();
                }}
                className="
                  w-full
                  border-t
                  border-gray-100
                  px-6
                  py-4
                  text-left
                  font-medium
                  hover:bg-gray-50
                  transition
                "
              >
                Seller Dashboard
              </button>
            )}

          </div>
        </aside>
      </div>
    </nav>
  );
};

export default Navbar;