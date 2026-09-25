"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    X,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    ArrowLeft,
} from "lucide-react";

const MobileDrawer = ({
    open,
    closeSidebar,
    categories,
    categoriesLoading,
    user,
    isSeller,
    router,
}) => {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [view, setView] = useState("categories");

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);

    /* =========================================================
       CLOSE DRAWER
    ========================================================= */

    const close = () => {
        setCategoryOpen(false);
        setView("categories");
        setSelectedCategory(null);
        setSelectedCompany(null);

        closeSidebar();
    };

    /* =========================================================
       OPEN CATEGORY
       Category → Company
    ========================================================= */

    const openCategory = (category) => {
        setSelectedCategory(category);
        setSelectedCompany(null);
        setView("companies");
    };

    /* =========================================================
       OPEN COMPANY
       Company → Products
    ========================================================= */

    const openCompany = (company) => {
        setSelectedCompany(company);
        setView("products");
    };

    /* =========================================================
       BACK TO CATEGORIES
    ========================================================= */

    const backToCategories = () => {
        setSelectedCategory(null);
        setSelectedCompany(null);
        setView("categories");
    };

    /* =========================================================
       BACK TO COMPANIES
    ========================================================= */

    const backToCompanies = () => {
        setSelectedCompany(null);
        setView("companies");
    };

    return (
        <div className="lg:hidden">

            {/* =================================================
                OVERLAY
            ================================================= */}

            <div
                onClick={close}
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    open
                        ? "visible opacity-100"
                        : "invisible opacity-0"
                }`}
            />

            {/* =================================================
                DRAWER
            ================================================= */}

            <aside
                className={`fixed left-0 top-0 z-50 h-screen w-[85%] max-w-[360px] bg-white shadow-2xl transition-transform duration-300 ease-out ${
                    open
                        ? "translate-x-0"
                        : "-translate-x-full"
                }`}
            >

                <DrawerHeader close={close} />

                <div className="h-[calc(100vh-90px)] overflow-y-auto">

                    {/* =================================================
                        CATEGORIES
                    ================================================= */}

                    {view === "categories" && (
                        <CategoriesView
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                            categoryOpen={categoryOpen}
                            setCategoryOpen={setCategoryOpen}
                            openCategory={openCategory}
                            close={close}
                            user={user}
                            isSeller={isSeller}
                            router={router}
                        />
                    )}

                    {/* =================================================
                        COMPANIES
                    ================================================= */}

                    {view === "companies" && selectedCategory && (
                        <CompaniesView
                            category={selectedCategory}
                            back={backToCategories}
                            openCompany={openCompany}
                        />
                    )}

                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    {view === "products" && selectedCompany && (
                        <ProductsView
                            category={selectedCategory}
                            company={selectedCompany}
                            back={backToCompanies}
                            close={close}
                        />
                    )}

                </div>
            </aside>
        </div>
    );
};

/* =============================================================
   DRAWER HEADER
============================================================= */

const DrawerHeader = ({ close }) => {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

            <Image
                src="/icon4.png"
                alt="Eliteo"
                width={160}
                height={70}
                className="w-[130px] object-contain"
            />

            <button
                onClick={close}
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-100"
                aria-label="Close menu"
            >
                <X className="h-6 w-6" />
            </button>
        </div>
    );
};

/* =============================================================
   CATEGORIES VIEW
============================================================= */

const CategoriesView = ({
    categories,
    categoriesLoading,
    categoryOpen,
    setCategoryOpen,
    openCategory,
    close,
    user,
    isSeller,
    router,
}) => {
    return (
        <div className="py-3">

            <MobileLink href="/" onClick={close}>
                Home
            </MobileLink>

            {/* CATEGORY SECTION */}

            <div className="border-y border-gray-100">

                <button
                    onClick={() =>
                        setCategoryOpen(!categoryOpen)
                    }
                    className="flex w-full items-center justify-between px-6 py-4 font-medium text-[#172033] transition hover:bg-[#F7F3EA]"
                >
                    <span>Categories</span>

                    {categoryOpen ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>

                {categoryOpen && (
                    <div className="space-y-1 px-3 pb-3">

                        {categoriesLoading ? (
                            <CategoryLoading />
                        ) : categories.length === 0 ? (
                            <p className="px-3 py-5 text-sm text-gray-500">
                                No products available yet.
                            </p>
                        ) : (
                            categories.map((category) => (
                                <CategoryItem
                                    key={category.slug}
                                    category={category}
                                    onClick={() =>
                                        openCategory(category)
                                    }
                                />
                            ))
                        )}

                        <Link
                            href="/all-products"
                            onClick={close}
                            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#172033] px-4 py-3 text-sm font-medium !text-white transition hover:bg-[#9B7A42]"
                        >
                            View All Products

                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>

            {/* ORDERS */}

            {user && (
                <MobileLink
                    href="/my-orders"
                    onClick={close}
                >
                    My Orders
                </MobileLink>
            )}

            <MobileLink
                href="/track-order"
                onClick={close}
            >
                Track Order
            </MobileLink>

            <MobileLink
                href="/about"
                onClick={close}
            >
                About
            </MobileLink>

            <MobileLink
                href="/contact"
                onClick={close}
            >
                Contact
            </MobileLink>

            {/* SELLER */}

            {isSeller && (
                <button
                    onClick={() => {
                        router.push("/seller");
                        close();
                    }}
                    className="w-full border-t border-gray-100 px-6 py-4 text-left font-medium transition hover:bg-gray-50"
                >
                    Seller Dashboard
                </button>
            )}
        </div>
    );
};

/* =============================================================
   CATEGORY ITEM
============================================================= */

const CategoryItem = ({ category, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-[#F7F3EA]"
        >

            {/* CATEGORY IMAGE */}

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E8E1D6] bg-white">
                {category.image ? (
                    <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F7F3EA] text-xs font-semibold text-[#9B7A42]">
                        {category.name?.charAt(0)}
                    </div>
                )}
            </div>

            {/* CATEGORY NAME */}

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#172033]">
                    {category.name}
                </p>

                <p className="text-xs text-gray-400">
                    Browse brands
                </p>
            </div>

            <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>
    );
};

/* =============================================================
   COMPANIES VIEW
============================================================= */

const CompaniesView = ({
    category,
    back,
    openCompany,
}) => {
    return (
        <div className="min-h-full bg-white">

            <ViewHeader
                title={category.name}
                subtitle="Select a company"
                back={back}
            />

            <div className="space-y-2 p-3">

                {category.companies?.length > 0 ? (
                    category.companies.map((company) => (
                        <CompanyItem
                            key={company._id}
                            company={company}
                            onClick={() =>
                                openCompany(company)
                            }
                        />
                    ))
                ) : (
                    <EmptyState text="No companies available." />
                )}

            </div>
        </div>
    );
};

/* =============================================================
   COMPANY ITEM
============================================================= */

const CompanyItem = ({ company, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-xl border border-[#E8E1D6] bg-[#FCFBF8] p-3 text-left transition hover:border-[#D8C29A] hover:bg-[#F7F3EA]"
        >

            {/* COMPANY LOGO */}

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E8E1D6] bg-white">

                {company.logo ? (
                    <Image
                        src={company.logo}
                        alt={company.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F7F3EA] text-sm font-bold text-[#9B7A42]">
                        {company.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>
                )}

            </div>

            {/* COMPANY NAME */}

            <div className="min-w-0 flex-1">

                <p className="text-sm font-semibold text-[#172033]">
                    {company.name}
                </p>

                <p className="text-xs text-gray-400">
                    {company.products?.length || 0}{" "}
                    products
                </p>

            </div>

            <ArrowRight className="h-4 w-4 text-gray-400" />
        </button>
    );
};

/* =============================================================
   PRODUCTS VIEW
============================================================= */

const ProductsView = ({
    category,
    company,
    back,
    close,
}) => {
    return (
        <div className="min-h-full bg-white">

            <ViewHeader
                title={company.name}
                subtitle={`${category.name} products`}
                back={back}
            />

            <div className="space-y-2 p-3">

                {company.products?.length > 0 ? (
                    company.products.map((product) => (
                        <ProductItem
                            key={product._id}
                            product={product}
                            close={close}
                        />
                    ))
                ) : (
                    <EmptyState text="No products available." />
                )}

            </div>
        </div>
    );
};

/* =============================================================
   PRODUCT ITEM
============================================================= */

const ProductItem = ({ product, close }) => {
    const image = product.images?.[0];

    return (
        <Link
            href={`/product/${product.slug}`}
            onClick={close}
            className="flex items-center gap-3 rounded-xl border border-[#E8E1D6] bg-[#FCFBF8] p-2.5 transition hover:border-[#D8C29A] hover:bg-[#F7F3EA]"
        >

            {/* PRODUCT IMAGE */}

            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">

                {image ? (
                    <Image
                        src={image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
                        No Image
                    </div>
                )}

            </div>

            {/* PRODUCT DETAILS */}

            <div className="min-w-0 flex-1">

                <p className="line-clamp-2 text-sm font-medium leading-5 text-[#172033]">
                    {product.name}
                </p>

                {product.offerPrice ? (
                    <p className="mt-1 text-xs font-semibold text-[#9B7A42]">
                        Rs. {product.offerPrice.toLocaleString()}
                    </p>
                ) : product.price ? (
                    <p className="mt-1 text-xs font-semibold text-[#9B7A42]">
                        Rs. {product.price.toLocaleString()}
                    </p>
                ) : null}

            </div>

            <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
        </Link>
    );
};

/* =============================================================
   VIEW HEADER
============================================================= */

const ViewHeader = ({
    title,
    subtitle,
    back,
}) => {
    return (
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-gray-100 bg-white px-4 py-4">

            <button
                onClick={back}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7F3EA] text-[#172033] transition hover:bg-[#EDE5D7]"
                aria-label="Go back"
            >
                <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-[#172033]">
                    {title}
                </p>

                <p className="text-[11px] text-gray-400">
                    {subtitle}
                </p>

            </div>
        </div>
    );
};

/* =============================================================
   MOBILE LINK
============================================================= */

const MobileLink = ({
    href,
    onClick,
    children,
}) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block px-6 py-4 font-medium transition hover:bg-gray-50"
        >
            {children}
        </Link>
    );
};

/* =============================================================
   LOADING
============================================================= */

const CategoryLoading = () => {
    return (
        <div className="space-y-2 px-3 py-3">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="h-14 animate-pulse rounded-xl bg-gray-100"
                />
            ))}
        </div>
    );
};

/* =============================================================
   EMPTY STATE
============================================================= */

const EmptyState = ({ text }) => {
    return (
        <div className="py-10 text-center">
            <p className="text-sm text-gray-500">
                {text}
            </p>
        </div>
    );
};

export default MobileDrawer;