"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#FCFBF8] text-[#172033]">

            {/* Newsletter */}
            <div className="border-b border-[#E8E1D6]">
                <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">

                    <div className="flex flex-col gap-8 rounded-[28px] border border-[#E8E1D6] bg-[#F4EFE6] p-7 sm:p-9 md:flex-row md:items-center md:justify-between md:p-10">

                        <div className="max-w-xl">

                            <div className="mb-3 flex items-center gap-3">
                                <span className="h-px w-7 bg-[#C8A96B]" />

                                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9B7A42]">
                                    Stay Connected
                                </span>
                            </div>

                            <h2 className="text-2xl font-semibold tracking-tight text-[#172033] md:text-3xl">
                                Get the latest from Eliteo.
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-[#687080]">
                                New products, exclusive offers and the latest
                                tech accessories, delivered straight to your
                                inbox.
                            </p>

                        </div>


                        <div className="flex w-full max-w-md">

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="min-w-0 flex-1 rounded-l-xl border border-[#E8E1D6] bg-white px-4 py-3.5 text-sm text-[#172033] outline-none placeholder:text-[#9A9DA4] focus:border-[#C8A96B]"
                            />

                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-r-xl bg-[#9B7A42] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#856631]"
                            >
                                Subscribe
                                <ArrowUpRight size={16} />
                            </button>

                        </div>

                    </div>

                </div>
            </div>


            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 md:py-16 lg:px-8">

                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div>

                        <Link href="/" className="inline-block">
                            <Image
                                src="/icon4.png"
                                alt="Eliteo"
                                width={110}
                                height={50}
                                className="h-auto w-[100px] object-contain"
                            />
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-[#687080]">
                            Your destination for premium mobile and tech
                            accessories. Discover quality products designed
                            for your everyday digital lifestyle.
                        </p>


                        {/* Social Icons */}
                        <div className="mt-6 flex items-center gap-3">

                            {/* Facebook */}
                            <a
                                href="https://facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E1D6] bg-white transition-all duration-300 hover:border-[#C8A96B] hover:bg-[#F4EFE6]"
                            >
                                <Image
                                    src="/social/facebook.svg"
                                    alt="Facebook"
                                    width={18}
                                    height={18}
                                    className="object-contain opacity-70 transition group-hover:opacity-100"
                                />
                            </a>


                            {/* Instagram */}
                            <a
                                href="https://instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E1D6] bg-white transition-all duration-300 hover:border-[#C8A96B] hover:bg-[#F4EFE6]"
                            >
                                <Image
                                    src="/social/instagram.png"
                                    alt="Instagram"
                                    width={18}
                                    height={18}
                                    className="object-contain opacity-70 transition group-hover:opacity-100"
                                />
                            </a>


                            {/* TikTok */}
                            <a
                                href="https://tiktok.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="TikTok"
                                className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E1D6] bg-white transition-all duration-300 hover:border-[#C8A96B] hover:bg-[#F4EFE6]"
                            >
                                <Image
                                    src="/social/tiktok.png"
                                    alt="TikTok"
                                    width={18}
                                    height={18}
                                    className="object-contain opacity-70 transition group-hover:opacity-100"
                                />
                            </a>

                        </div>

                    </div>


                    {/* Explore */}
                    <div>

                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7A42]">
                            Explore
                        </h3>

                        <ul className="mt-6 space-y-3.5 text-sm">

                            <li>
                                <Link
                                    href="/"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/all-products"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    All Products
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/category/earbuds"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Earbuds
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/category/headphones"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Headphones
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/category/chargers"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Chargers
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* Company */}
                    <div>

                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7A42]">
                            Company
                        </h3>

                        <ul className="mt-6 space-y-3.5 text-sm">

                            <li>
                                <Link
                                    href="/about"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    About Eliteo
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/contact"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Contact Us
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/privacy-policy"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Privacy Policy
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/terms"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/refund-policy"
                                    className="text-[#687080] transition hover:text-[#9B7A42]"
                                >
                                    Refund Policy
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* Contact */}
                    <div>

                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9B7A42]">
                            Get In Touch
                        </h3>

                        <div className="mt-6 space-y-5">

                            {/* Phone */}
                            <a
                                href="tel:03091214625"
                                className="group flex items-start gap-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8E1D6] bg-white text-[#9B7A42] transition group-hover:border-[#C8A96B] group-hover:bg-[#F4EFE6]">
                                    <Phone size={16} />
                                </div>

                                <div>
                                    <p className="text-xs text-[#9A9DA4]">
                                        Call us
                                    </p>

                                    <p className="mt-1 text-sm text-[#687080] transition group-hover:text-[#172033]">
                                        0309 1214625
                                    </p>
                                </div>
                            </a>


                            {/* Email */}
                            <a
                                href="mailto:itzmustafa186@gmail.com"
                                className="group flex items-start gap-3"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8E1D6] bg-white text-[#9B7A42] transition group-hover:border-[#C8A96B] group-hover:bg-[#F4EFE6]">
                                    <Mail size={16} />
                                </div>

                                <div>
                                    <p className="text-xs text-[#9A9DA4]">
                                        Email us
                                    </p>

                                    <p className="mt-1 break-all text-sm text-[#687080] transition group-hover:text-[#172033]">
                                        itzmustafa186@gmail.com
                                    </p>
                                </div>
                            </a>


                            {/* Location */}
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8E1D6] bg-white text-[#9B7A42]">
                                    <MapPin size={16} />
                                </div>

                                <div>
                                    <p className="text-xs text-[#9A9DA4]">
                                        Location
                                    </p>

                                    <p className="mt-1 text-sm text-[#687080]">
                                        Pakistan
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Bottom Bar */}
            <div className="border-t border-[#E8E1D6]">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-[#8A8F97] sm:px-6 md:flex-row lg:px-8">

                    <p>
                        © {new Date().getFullYear()} Eliteo. All rights reserved.
                    </p>

                    <div className="flex items-center gap-5">

                        <span>
                            Premium Tech Accessories
                        </span>

                        <span className="hidden h-1 w-1 rounded-full bg-[#C8A96B] sm:block" />

                        <span>
                            Made for your everyday
                        </span>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;