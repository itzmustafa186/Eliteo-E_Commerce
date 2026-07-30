"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { assets, CartIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-8 flex items-center justify-between">
        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer flex-1 lg:flex-none flex justify-center lg:justify-start"
        >
          <h1
            onClick={() => router.push("/")}
            className="cursor-pointer text-4xl font-bold bg-gradient-to-r from-black via-gray-700 to-yellow-500 bg-clip-text text-transparent"
          >
            Eliteo
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="hover:text-yellow-500 transition">
            Home
          </Link>

          <Link
            href="/all-products"
            className="hover:text-yellow-500 transition"
          >
            Shop
          </Link>

          <Link
            href="/my-orders"
            className="hover:text-yellow-500 transition"
          >
            My Orders
          </Link>

          <Link href="/about" className="hover:text-yellow-500 transition">
            About
          </Link>

          <Link href="/contact" className="hover:text-yellow-500 transition">
            Contact
          </Link>

          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className="border rounded-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              Seller Dashboard
            </button>
          )}
        </div>

        {/* Right Icons */}
        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Search - Desktop Only */}
          <Image
            src={assets.search_icon}
            alt="Search"
            className="hidden lg:block w-5 h-5 cursor-pointer"
          />

          {/* Cart */}
          <button
            onClick={() => router.push("/cart")}
            className="relative"
          >
            <CartIcon />
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-yellow-400 text-xs flex items-center justify-center">
              0
            </span>
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
                className="flex items-center gap-2"
              >
                <Image
                  src={assets.user_icon}
                  alt="User"
                  width={20}
                  height={20}
                />
                <span>Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[600px]" : "max-h-0"
          }`}
      >
        <div className="bg-white border-t">



          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            Home
          </Link>

          <Link
            href="/all-products"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            Shop
          </Link>

          <Link
            href="/my-orders"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            My Orders
          </Link>

          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            About
          </Link>

          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="block px-6 py-4 hover:bg-gray-100"
          >
            Contact
          </Link>

          {isSeller && (
            <button
              onClick={() => {
                router.push("/seller");
                setMenuOpen(false);
              }}
              className="w-full text-left px-6 py-4 hover:bg-gray-100"
            >
              Seller Dashboard
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;