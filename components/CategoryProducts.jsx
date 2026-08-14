"use client";

import React, { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
    SlidersHorizontal,
    X,
    ChevronDown,
    RotateCcw,
} from "lucide-react";

const CategoryProducts = ({ products, categoryName }) => {
    const [mobileFilters, setMobileFilters] = useState(false);

    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState("all");
    const [availability, setAvailability] = useState("all");
    const [sort, setSort] = useState("latest");

    // Get unique brands
    const brands = useMemo(() => {
        return [
            ...new Set(
                products
                    .map((product) => product.brand)
                    .filter(Boolean)
            ),
        ].sort();
    }, [products]);

    // Filter + sort
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Brand
        if (selectedBrands.length > 0) {
            result = result.filter((product) =>
                selectedBrands.includes(product.brand)
            );
        }

        // Price
        if (priceRange === "under-2000") {
            result = result.filter(
                (product) => Number(product.offerPrice) < 2000
            );
        }

        if (priceRange === "2000-5000") {
            result = result.filter(
                (product) =>
                    Number(product.offerPrice) >= 2000 &&
                    Number(product.offerPrice) <= 5000
            );
        }

        if (priceRange === "5000-10000") {
            result = result.filter(
                (product) =>
                    Number(product.offerPrice) > 5000 &&
                    Number(product.offerPrice) <= 10000
            );
        }

        if (priceRange === "above-10000") {
            result = result.filter(
                (product) => Number(product.offerPrice) > 10000
            );
        }

        // Availability
        if (availability === "in-stock") {
            result = result.filter(
                (product) => Number(product.stock) > 0
            );
        }

        if (availability === "out-of-stock") {
            result = result.filter(
                (product) => Number(product.stock) <= 0
            );
        }

        // Sorting
        if (sort === "price-low") {
            result.sort(
                (a, b) =>
                    Number(a.offerPrice) -
                    Number(b.offerPrice)
            );
        }

        if (sort === "price-high") {
            result.sort(
                (a, b) =>
                    Number(b.offerPrice) -
                    Number(a.offerPrice)
            );
        }

        if (sort === "name") {
            result.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }

        if (sort === "latest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );
        }

        return result;
    }, [
        products,
        selectedBrands,
        priceRange,
        availability,
        sort,
    ]);

    const toggleBrand = (brand) => {
        setSelectedBrands((prev) =>
            prev.includes(brand)
                ? prev.filter((item) => item !== brand)
                : [...prev, brand]
        );
    };

    const clearFilters = () => {
        setSelectedBrands([]);
        setPriceRange("all");
        setAvailability("all");
        setSort("latest");
    };

    const hasFilters =
        selectedBrands.length > 0 ||
        priceRange !== "all" ||
        availability !== "all";

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 mb-8">

                <div>
                    <p className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-medium text-gray-900">
                            {filteredProducts.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium text-gray-900">
                            {products.length}
                        </span>{" "}
                        products
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {/* Mobile filter button */}
                    <button
                        onClick={() => setMobileFilters(true)}
                        className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 hover:bg-gray-50 transition"
                    >
                        <SlidersHorizontal size={17} />
                        Filters
                    </button>

                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="
            appearance-none
            bg-white
            border border-gray-200
            rounded-xl
            pl-4
            pr-9
            py-2.5
            text-sm
            text-gray-800
            outline-none
            cursor-pointer
            focus:border-gray-400
            max-w-[150px]
            sm:max-w-none
        "
                        >
                            <option value="latest">Latest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                        />
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">

                {/* Desktop Filters */}
                <aside className="hidden lg:block">

                    <div className="sticky top-24">

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-gray-900">
                                Filters
                            </h2>

                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-gray-500 hover:text-black flex items-center gap-1"
                                >
                                    <RotateCcw size={13} />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Brand */}
                        {brands.length > 0 && (
                            <div className="pb-7 border-b border-gray-200">

                                <h3 className="text-sm font-medium text-gray-900 mb-4">
                                    Brand
                                </h3>

                                <div className="space-y-3">
                                    {brands.map((brand) => (
                                        <label
                                            key={brand}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.includes(
                                                    brand
                                                )}
                                                onChange={() =>
                                                    toggleBrand(
                                                        brand
                                                    )
                                                }
                                                className="w-4 h-4 rounded border-gray-300 accent-black"
                                            />

                                            <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price */}
                        <div className="py-7 border-b border-gray-200">

                            <h3 className="text-sm font-medium text-gray-900 mb-4">
                                Price
                            </h3>

                            <div className="space-y-3">

                                {[
                                    ["all", "All prices"],
                                    ["under-2000", "Under Rs. 2,000"],
                                    ["2000-5000", "Rs. 2,000 – 5,000"],
                                    ["5000-10000", "Rs. 5,000 – 10,000"],
                                    ["above-10000", "Above Rs. 10,000"],
                                ].map(([value, label]) => (
                                    <label
                                        key={value}
                                        className="flex items-center gap-3 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="price"
                                            value={value}
                                            checked={
                                                priceRange ===
                                                value
                                            }
                                            onChange={(e) =>
                                                setPriceRange(
                                                    e.target.value
                                                )
                                            }
                                            className="accent-black"
                                        />

                                        <span className="text-sm text-gray-600">
                                            {label}
                                        </span>
                                    </label>
                                ))}

                            </div>
                        </div>

                        {/* Availability */}
                        <div className="py-7">

                            <h3 className="text-sm font-medium text-gray-900 mb-4">
                                Availability
                            </h3>

                            <div className="space-y-3">

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value="all"
                                        checked={
                                            availability === "all"
                                        }
                                        onChange={(e) =>
                                            setAvailability(
                                                e.target.value
                                            )
                                        }
                                        className="accent-black"
                                    />

                                    <span className="text-sm text-gray-600">
                                        All products
                                    </span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value="in-stock"
                                        checked={
                                            availability ===
                                            "in-stock"
                                        }
                                        onChange={(e) =>
                                            setAvailability(
                                                e.target.value
                                            )
                                        }
                                        className="accent-black"
                                    />

                                    <span className="text-sm text-gray-600">
                                        In stock
                                    </span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="availability"
                                        value="out-of-stock"
                                        checked={
                                            availability ===
                                            "out-of-stock"
                                        }
                                        onChange={(e) =>
                                            setAvailability(
                                                e.target.value
                                            )
                                        }
                                        className="accent-black"
                                    />

                                    <span className="text-sm text-gray-600">
                                        Out of stock
                                    </span>
                                </label>

                            </div>
                        </div>

                    </div>
                </aside>

                {/* Products */}
                <div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-[400px] bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center text-center px-6">

                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                                <SlidersHorizontal
                                    size={22}
                                    className="text-gray-500"
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                No products found
                            </h3>

                            <p className="text-sm text-gray-500 mt-2 max-w-sm">
                                Try changing your filters to find
                                products in {categoryName}.
                            </p>

                            <button
                                onClick={clearFilters}
                                className="mt-5 px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
                            >
                                Clear filters
                            </button>

                        </div>
                    )}

                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">

                    {/* Overlay */}
                    <div
                        onClick={() =>
                            setMobileFilters(false)
                        }
                        className="absolute inset-0 bg-black/40"
                    />

                    {/* Drawer */}
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto">

                        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">

                            <h2 className="text-lg font-semibold text-gray-900">
                                Filters
                            </h2>

                            <button
                                onClick={() =>
                                    setMobileFilters(false)
                                }
                                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>

                        </div>

                        <div className="p-5">

                            {/* Brand */}
                            {brands.length > 0 && (
                                <div className="pb-7 border-b border-gray-200">

                                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                                        Brand
                                    </h3>

                                    <div className="space-y-3">
                                        {brands.map((brand) => (
                                            <label
                                                key={brand}
                                                className="flex items-center gap-3"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(
                                                        brand
                                                    )}
                                                    onChange={() =>
                                                        toggleBrand(
                                                            brand
                                                        )
                                                    }
                                                    className="w-4 h-4 accent-black"
                                                />

                                                <span className="text-sm text-gray-600">
                                                    {brand}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div className="py-7 border-b border-gray-200">

                                <h3 className="text-sm font-medium text-gray-900 mb-4">
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
                                            className="flex items-center gap-3"
                                        >
                                            <input
                                                type="radio"
                                                name="mobile-price"
                                                value={value}
                                                checked={
                                                    priceRange ===
                                                    value
                                                }
                                                onChange={(e) =>
                                                    setPriceRange(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="accent-black"
                                            />

                                            <span className="text-sm text-gray-600">
                                                {label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="py-7">

                                <h3 className="text-sm font-medium text-gray-900 mb-4">
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
                                            className="flex items-center gap-3"
                                        >
                                            <input
                                                type="radio"
                                                name="mobile-availability"
                                                value={value}
                                                checked={
                                                    availability ===
                                                    value
                                                }
                                                onChange={(e) =>
                                                    setAvailability(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="accent-black"
                                            />

                                            <span className="text-sm text-gray-600">
                                                {label}
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">

                                <button
                                    onClick={clearFilters}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium"
                                >
                                    Clear
                                </button>

                                <button
                                    onClick={() =>
                                        setMobileFilters(false)
                                    }
                                    className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-medium"
                                >
                                    Apply
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