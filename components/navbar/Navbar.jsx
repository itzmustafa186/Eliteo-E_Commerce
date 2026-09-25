"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { assets, CartIcon } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import { useClerk, UserButton } from "@clerk/nextjs";
import { getNavbarCategories } from "@/app/actions/company";
import DesktopMenu from "./DesktopMenu";
import MobileDrawer from "./MobileDrawer";

const Navbar = () => {
    const { isSeller, router, user, getCartCount } = useAppContext();
    const { openSignIn } = useClerk();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await getNavbarCategories();

                if (result.success) {
                    setCategories(result.categories || []);
                }
            } catch (error) {
                console.error("NAVBAR CATEGORY ERROR:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-sm backdrop-blur-xl">
                <div className="mx-auto flex h-16 items-center justify-between px-4 sm:h-18 sm:px-6 md:h-20 lg:h-22 lg:px-8 xl:h-24">

                    {/* Mobile Menu */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex flex-1 items-center justify-center lg:flex-none lg:justify-start"
                    >
                        <Image
                            src="/icon4.png"
                            alt="Eliteo"
                            width={220}
                            height={100}
                            priority
                            className="h-auto w-[120px] object-contain sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px] 2xl:w-[220px]"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <DesktopMenu
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        user={user}
                        isSeller={isSeller}
                        router={router}
                    />

                    {/* Right Side */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* Search */}
                        <button
                            className="hidden h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 lg:flex"
                            aria-label="Search"
                        >
                            <Image
                                src={assets.search_icon}
                                alt="Search"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                            />
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => router.push("/cart")}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100 sm:h-11 sm:w-11"
                            aria-label="Cart"
                        >
                            <CartIcon />

                            {getCartCount() > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-[19px] items-center justify-center rounded-full bg-yellow-400 px-1 text-[11px] font-bold text-black shadow">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>

                        {/* Mobile Account */}
                        <div className="lg:hidden">
                            {user ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <button
                                    onClick={openSignIn}
                                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
                                    aria-label="Account"
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

                        {/* Desktop Account */}
                        <div className="hidden lg:block">
                            {user ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <button
                                    onClick={openSignIn}
                                    className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 transition hover:border-black hover:bg-black hover:text-white"
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
            </nav>

            {/* Mobile Drawer */}
            <MobileDrawer
                open={sidebarOpen}
                closeSidebar={closeSidebar}
                categories={categories}
                categoriesLoading={categoriesLoading}
                user={user}
                isSeller={isSeller}
                router={router}
            />
        </>
    );
};

export default Navbar;