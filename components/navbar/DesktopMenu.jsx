"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    ChevronDown,
    ArrowRight,
} from "lucide-react";

const navLink =
    "group relative font-medium text-gray-700 transition hover:text-black";

const DesktopMenu = ({
    categories,
    categoriesLoading,
    user,
    isSeller,
    router,
}) => {
    return (
        <div className="hidden items-center gap-5 lg:flex xl:gap-7 2xl:gap-9">

            <NavLink href="/">Home</NavLink>

            {/* Products */}
            <div className="group relative">
                <button className="flex items-center gap-1.5 py-3 font-medium text-gray-700 transition hover:text-black">
                    Products

                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-[700px] -translate-x-1/2 translate-y-3 rounded-2xl border border-gray-100 bg-white p-5 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                    <div className="mb-5 flex items-center justify-between px-2">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Shop Categories
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Explore products by category and company
                            </p>
                        </div>

                        <Link
                            href="/all-products"
                            className="flex items-center gap-1 text-sm font-medium text-gray-700 transition hover:text-black"
                        >
                            View All
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {categoriesLoading ? (
                        <LoadingCategories />
                    ) : categories.length === 0 ? (
                        <EmptyCategories />
                    ) : (
                        <CategoryGrid categories={categories} />
                    )}
                </div>
            </div>

            {user ? (
                <>
                    <NavLink href="/my-orders">My Orders</NavLink>
                    <NavLink href="/track-order">Track Order</NavLink>
                </>
            ) : (
                <NavLink href="/track-order">Track Order</NavLink>
            )}

            <NavLink href="/about">About</NavLink>

            <NavLink href="/contact">Contact</NavLink>

            {isSeller && (
                <button
                    onClick={() => router.push("/seller")}
                    className="rounded-full border border-gray-300 px-5 py-2 font-medium transition hover:border-black hover:bg-black hover:text-white"
                >
                    Seller Dashboard
                </button>
            )}
        </div>
    );
};

const NavLink = ({ href, children }) => (
    <Link href={href} className={navLink}>
        {children}

        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full" />
    </Link>
);

const LoadingCategories = () => (
    <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
                key={item}
                className="animate-pulse rounded-xl border border-gray-100 p-3"
            >
                <div className="mb-3 h-4 w-24 rounded bg-gray-100" />

                <div className="space-y-2">
                    <div className="h-3 w-20 rounded bg-gray-100" />
                    <div className="h-3 w-16 rounded bg-gray-100" />
                </div>
            </div>
        ))}
    </div>
);

const EmptyCategories = () => (
    <div className="py-10 text-center">
        <p className="text-sm text-gray-500">
            No products available yet.
        </p>
    </div>
);

const CategoryGrid = ({ categories }) => (
    <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
            <div
                key={category.slug}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition hover:border-gray-200 hover:bg-white"
            >
                <Link
                    href={`/category/${category.slug}`}
                    className="group/category mb-3 flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">

                        {category.image && (
                            <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-white">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="32px"
                                    className="object-contain p-1"
                                />
                            </div>
                        )}

                        <h4 className="font-semibold text-gray-900">
                            {category.name}
                        </h4>
                    </div>

                    <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover/category:text-gray-700" />
                </Link>

                <div className="space-y-1">
                    {category.companies?.map((company) => (
                        <Link
                            key={company._id}
                            href={`/category/${category.slug}?company=${company.slug}`}
                            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-white">
                                {company.logo ? (
                                    <Image
                                        src={company.logo}
                                        alt={company.name}
                                        fill
                                        sizes="24px"
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-gray-400">
                                        {company.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <span className="truncate">
                                {company.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

export default DesktopMenu;