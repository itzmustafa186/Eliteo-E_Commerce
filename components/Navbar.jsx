"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { assets, CartIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import { ChevronDown, ChevronUp } from "lucide-react";
const Navbar = () => {
  const { isSeller, router, user, getCartCount } = useAppContext();
  const { openSignIn } = useClerk();
  const categories = [
    "Electronics",
    "Fashion",
    "Accessories",
    "Shoes",
    "Beauty",
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm " >
      <div className="max-w-7xl mx-auto h-28 px-5 lg:px-8 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>

        {/* Logo */}
        <Link href={"/"}>
          <div

            className="cursor-pointer flex-1 lg:flex-none flex justify-center lg:justify-start"
          >


            <Image
              src="/icon4.png"
              alt="Eliteo"
              width={180}
              height={100}
              priority

            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden text-xl lg:flex items-center gap-8">
          <Link
            href="/"
            className="relative font-medium text-gray-700 hover:text-black transition group"
          >
            Home
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <div className="relative group">
            <button className="font-medium text-gray-700 hover:text-black transition">
              Products
            </button>

            <div className="absolute left-0 top-full mt-3 w-52 rounded-xl bg-white shadow-lg border opacity-0 invisible translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/my-orders"
            className="relative font-medium text-gray-700 hover:text-black transition group"
          >
            My orders
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/about"
            className="relative font-medium text-gray-700 hover:text-black transition group"
          >
            About
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link
            href="/contact"
            className="relative font-medium text-gray-700 hover:text-black transition group"
          >
            Contact
            <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="rounded-full border px-5 py-2 font-medium hover:bg-black hover:text-white transition"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Right Icons */}
        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search - Desktop Only */}
          <button className="hidden lg:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 transition">
            <Image
              src={assets.search_icon}
              alt="search"
              className="w-5 h-5"
            />
          </button>

          {/* Cart */}
          <button
            onClick={() => router.push("/cart")}
            className="relative h-11 w-11 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
          >
            <CartIcon />

            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-[20px] h-5 px-1 items-center justify-center rounded-full bg-yellow-400 text-xs font-semibold shadow">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* User Icon - Mobile */}
          <div className="lg:hidden">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button onClick={openSignIn}>
                <Image
                  src={assets.user_icon}
                  alt="User"
                  width={22}
                  height={22}
                />
              </button>
            )}
          </div>

          {/* User Icon - Desktop */}
          <div className="hidden lg:block">
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <button
                onClick={openSignIn}
                className="hidden lg:flex items-center gap-2 rounded-full border px-4 py-2 hover:bg-black hover:text-white transition"
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

      {/* Mobile Menu */}
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${sidebarOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
            }`}
        />

        {/* Drawer */}
        <aside
          className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white shadow-2xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <Image
              src="/icon4.png"
              alt="Eliteo"
              width={180}
              height={100}
              priority

            />

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="py-4">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="block px-6 py-4 hover:bg-gray-100"
            >
              Home
            </Link>

            <div className="border-t">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition"
              >
                <span className="font-medium">Categories</span>

                {categoryOpen ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${categoryOpen ? "max-h-96" : "max-h-0"
                  }`}
              >
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    onClick={() => {
                      setSidebarOpen(false);
                      setCategoryOpen(false);
                    }}
                    className="block pl-12 pr-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-black transition"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/my-orders"
              onClick={() => setSidebarOpen(false)}
              className="block px-6 py-4 hover:bg-gray-100"
            >
              My Orders
            </Link>

            <Link
              href="/about"
              onClick={() => setSidebarOpen(false)}
              className="block px-6 py-4 hover:bg-gray-100"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setSidebarOpen(false)}
              className="block px-6 py-4 hover:bg-gray-100"
            >
              Contact
            </Link>

            {isSeller && (
              <button
                onClick={() => {
                  router.push("/seller");
                  setSidebarOpen(false);
                }}
                className="w-full px-6 py-4 text-left hover:bg-gray-100"
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