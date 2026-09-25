"use client";

import React, { useState } from "react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import {
    SlidersHorizontal,
    X,
    ChevronDown,
    RotateCcw,
} from "lucide-react";

const CategoryProducts = ({
    products = [],
    categoryName,
}) => {
    const [mobileFilters, setMobileFilters] = useState(false);

    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [priceRange, setPriceRange] = useState("all");
    const [availability, setAvailability] = useState("all");
    const [sort, setSort] = useState("latest");

    /*
    |--------------------------------------------------------------------------
    | GET UNIQUE COMPANIES
    |--------------------------------------------------------------------------
    */

    const companyMap = new Map();

    products.forEach((product) => {
        const company = product.company;

        if (
            company &&
            typeof company === "object" &&
            company._id
        ) {
            companyMap.set(
                company._id.toString(),
                company
            );
        }
    });

    const companies = Array.from(
        companyMap.values()
    ).sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
    );

    /*
    |--------------------------------------------------------------------------
    | FILTER + SORT PRODUCTS
    |--------------------------------------------------------------------------
    */

    let filteredProducts = [...products];

    // COMPANY
    if (selectedCompanies.length > 0) {
        filteredProducts = filteredProducts.filter(
            (product) => {
                if (
                    !product.company ||
                    typeof product.company !== "object"
                ) {
                    return false;
                }

                return selectedCompanies.includes(
                    product.company._id?.toString()
                );
            }
        );
    }

    // PRICE
    if (priceRange === "under-2000") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                Number(product.offerPrice) < 2000
        );
    } else if (priceRange === "2000-5000") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                Number(product.offerPrice) >= 2000 &&
                Number(product.offerPrice) <= 5000
        );
    } else if (priceRange === "5000-10000") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                Number(product.offerPrice) > 5000 &&
                Number(product.offerPrice) <= 10000
        );
    } else if (priceRange === "above-10000") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                Number(product.offerPrice) > 10000
        );
    }

    // AVAILABILITY
    if (availability === "in-stock") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                Number(product.stock) > 0
        );
    } else if (availability === "out-of-stock") {
        filteredProducts = filteredProducts.filter(
            (product) =>
                Number(product.stock) <= 0
        );
    }

    // SORT
    if (sort === "price-low") {
        filteredProducts.sort(
            (a, b) =>
                Number(a.offerPrice) -
                Number(b.offerPrice)
        );
    } else if (sort === "price-high") {
        filteredProducts.sort(
            (a, b) =>
                Number(b.offerPrice) -
                Number(a.offerPrice)
        );
    } else if (sort === "name") {
        filteredProducts.sort((a, b) =>
            (a.name || "").localeCompare(
                b.name || ""
            )
        );
    } else if (sort === "latest") {
        filteredProducts.sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        );
    }

    /*
    |--------------------------------------------------------------------------
    | TOGGLE COMPANY
    |--------------------------------------------------------------------------
    */

    const toggleCompany = (companyId) => {
        const id = companyId.toString();

        setSelectedCompanies((previous) =>
            previous.includes(id)
                ? previous.filter(
                      (item) => item !== id
                  )
                : [...previous, id]
        );
    };

    /*
    |--------------------------------------------------------------------------
    | CLEAR FILTERS
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {
        setSelectedCompanies([]);
        setPriceRange("all");
        setAvailability("all");
        setSort("latest");
    };

    const hasFilters =
        selectedCompanies.length > 0 ||
        priceRange !== "all" ||
        availability !== "all";

    /*
    |--------------------------------------------------------------------------
    | FILTER CONTENT
    |--------------------------------------------------------------------------
    */

    const renderFilterContent = () => (
        <>
            {/* COMPANIES */}
            {companies.length > 0 && (
                <div className="border-b border-[#E8E1D6] pb-7">
                    <h3 className="mb-4 text-sm font-semibold text-[#172033]">
                        Company
                    </h3>

                    <div className="space-y-3">
                        {companies.map((company) => {
                            const companyId =
                                company._id.toString();

                            return (
                                <label
                                    key={companyId}
                                    className="group flex cursor-pointer items-center gap-3"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCompanies.includes(
                                            companyId
                                        )}
                                        onChange={() =>
                                            toggleCompany(
                                                companyId
                                            )
                                        }
                                        className="h-4 w-4 rounded border-gray-300 accent-[#9B7A42]"
                                    />

                                    {company.logo ? (
                                        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-[#E8E1D6] bg-white">
                                            <Image
                                                src={
                                                    company.logo
                                                }
                                                alt={
                                                    company.name ||
                                                    "Company"
                                                }
                                                fill
                                                sizes="24px"
                                                className="object-contain p-0.5"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#F0E8D9] text-[10px] font-bold text-[#9B7A42]">
                                            {(
                                                company.name ||
                                                "C"
                                            )
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <span className="text-sm text-[#5F6470] transition-colors group-hover:text-[#172033]">
                                        {company.name}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* PRICE RANGE */}
            <div className="border-b border-[#E8E1D6] py-7">
                <h3 className="mb-4 text-sm font-semibold text-[#172033]">
                    Price
                </h3>

                <div className="space-y-3">
                    {[
                        ["all", "All prices"],
                        [
                            "under-2000",
                            "Under Rs. 2,000",
                        ],
                        [
                            "2000-5000",
                            "Rs. 2,000 – 5,000",
                        ],
                        [
                            "5000-10000",
                            "Rs. 5,000 – 10,000",
                        ],
                        [
                            "above-10000",
                            "Above Rs. 10,000",
                        ],
                    ].map(([value, label]) => (
                        <label
                            key={value}
                            className="flex cursor-pointer items-center gap-3"
                        >
                            <input
                                type="radio"
                                name="price"
                                value={value}
                                checked={
                                    priceRange === value
                                }
                                onChange={(e) =>
                                    setPriceRange(
                                        e.target.value
                                    )
                                }
                                className="accent-[#9B7A42]"
                            />

                            <span className="text-sm text-[#5F6470]">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* AVAILABILITY */}
            <div className="py-7">
                <h3 className="mb-4 text-sm font-semibold text-[#172033]">
                    Availability
                </h3>

                <div className="space-y-3">
                    {[
                        ["all", "All products"],
                        ["in-stock", "In stock"],
                        [
                            "out-of-stock",
                            "Out of stock",
                        ],
                    ].map(([value, label]) => (
                        <label
                            key={value}
                            className="flex cursor-pointer items-center gap-3"
                        >
                            <input
                                type="radio"
                                name="availability"
                                value={value}
                                checked={
                                    availability === value
                                }
                                onChange={(e) =>
                                    setAvailability(
                                        e.target.value
                                    )
                                }
                                className="accent-[#9B7A42]"
                            />

                            <span className="text-sm text-[#5F6470]">
                                {label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </>
    );

    return (
        <section className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {/* TOP BAR */}
            <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-[#777C85]">
                        Showing{" "}
                        <span className="font-semibold text-[#172033]">
                            {filteredProducts.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-[#172033]">
                            {products.length}
                        </span>{" "}
                        products
                    </p>

                    {categoryName && (
                        <p className="mt-1 text-xs text-[#9B7A42]">
                            {categoryName}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {/* MOBILE FILTER BUTTON */}
                    <button
                        type="button"
                        onClick={() =>
                            setMobileFilters(true)
                        }
                        className="flex items-center gap-2 rounded-xl border border-[#E8E1D6] bg-white px-4 py-2.5 text-sm font-medium text-[#172033] transition hover:bg-[#F7F3EA] lg:hidden"
                    >
                        <SlidersHorizontal
                            size={17}
                        />
                        Filters
                    </button>

                    {/* SORT */}
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value)
                            }
                            className="cursor-pointer appearance-none rounded-xl border border-[#E8E1D6] bg-white py-2.5 pl-4 pr-10 text-sm text-[#172033] outline-none transition focus:border-[#C8A96B]"
                        >
                            <option value="latest">
                                Latest
                            </option>
                            <option value="price-low">
                                Price: Low to High
                            </option>
                            <option value="price-high">
                                Price: High to Low
                            </option>
                            <option value="name">
                                Name
                            </option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F97]"
                        />
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
                {/* DESKTOP FILTER SIDEBAR */}
                <aside className="hidden lg:block">
                    <div className="sticky top-24">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-semibold text-[#172033]">
                                Filters
                            </h2>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-xs text-[#777C85] transition hover:text-[#9B7A42]"
                                >
                                    <RotateCcw
                                        size={13}
                                    />
                                    Clear
                                </button>
                            )}
                        </div>

                        {renderFilterContent()}
                    </div>
                </aside>

                {/* PRODUCT GRID / EMPTY STATE */}
                <main>
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 xl:grid-cols-4">
                            {filteredProducts.map(
                                (product) => (
                                    <ProductCard
                                        key={
                                            product._id ||
                                            product.id
                                        }
                                        product={product}
                                    />
                                )
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8E1D6] bg-[#FAF8F5] px-4 py-16 text-center">
                            <p className="text-base font-semibold text-[#172033]">
                                No products match
                                your filters
                            </p>

                            <p className="mt-1 text-sm text-[#777C85]">
                                Try broadening your
                                search or resetting
                                your filter choices.
                            </p>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#172033] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9B7A42]"
                                >
                                    <RotateCcw
                                        size={15}
                                    />
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* MOBILE FILTER DRAWER */}
            {mobileFilters && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    {/* BACKDROP */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() =>
                            setMobileFilters(false)
                        }
                    />

                    {/* DRAWER */}
                    <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#E8E1D6] pb-4">
                            <h2 className="text-lg font-semibold text-[#172033]">
                                Filters
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setMobileFilters(
                                        false
                                    )
                                }
                                className="rounded-lg p-1 text-[#777C85] hover:bg-[#F7F3EA] hover:text-[#172033]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* SCROLLABLE FILTERS */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {renderFilterContent()}
                        </div>

                        {/* FOOTER */}
                        <div className="border-t border-[#E8E1D6] pt-4">
                            <div className="flex gap-3">
                                {hasFilters && (
                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="flex-1 rounded-xl border border-[#E8E1D6] py-3 text-sm font-medium text-[#172033] hover:bg-[#F7F3EA]"
                                    >
                                        Clear
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMobileFilters(
                                            false
                                        )
                                    }
                                    className="flex-1 rounded-xl bg-[#172033] py-3 text-sm font-medium text-white hover:bg-[#9B7A42]"
                                >
                                    Show (
                                    {
                                        filteredProducts.length
                                    }
                                    )
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CategoryProducts;