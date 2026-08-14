"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const ProductList = () => {
  const { router, user, getToken } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const { data } = await axios.get("/api/product/seller-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id, currentValue) => {
    try {
      const token = await getToken();

      const { data } = await axios.patch(
        `/api/product/featured/${id}`,
        {
          featured: !currentValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(
          !currentValue
            ? "Product added to featured"
            : "Product removed from featured"
        );

        setProducts((prev) =>
          prev.map((product) =>
            product._id === id
              ? {
                ...product,
                featured: !currentValue,
              }
              : product
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update featured status"
      );
    }
  };

  const toggleProduct = async (id) => {
    try {
      const token = await getToken();

      const { data } = await axios.patch(
        `/api/product/active/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchSellerProduct();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-6 shadow-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your products, inventory and store visibility.
          </p>
        </div>

        {/* Mobile Products */}
        <div className="grid gap-5 md:hidden">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl border border-gray-200 p-5 shadow-md hover:shadow-xl transition"
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded-2xl bg-gray-50 border flex items-center justify-center">
                  <Image
                    src={product.images?.[0]}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {product.category}
                  </p>

                  <div className="mt-2">
                    <span className="text-xl font-bold text-orange-600">
                      Rs.{" "}
                      {product.offerPrice?.toLocaleString()}
                    </span>

                    <p className="text-xs text-gray-400 line-through">
                      Rs.{" "}
                      {product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-2 mt-5 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {product.stock > 0
                    ? `${product.stock} Stock`
                    : "Out"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {product.isActive
                    ? "Active"
                    : "Inactive"}
                </span>

                <button
                  onClick={() =>
                    toggleFeatured(
                      product._id,
                      product.featured
                    )
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${product.featured
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {product.featured
                    ? "★ Featured"
                    : "☆ Feature"}
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <button
                  onClick={() =>
                    router.push(
                      `/seller/edit-product/${product._id}`
                    )
                  }
                  className="rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    toggleProduct(product._id)
                  }
                  className={`rounded-xl py-2.5 text-sm font-semibold text-white transition ${product.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {product.isActive
                    ? "Disable"
                    : "Enable"}
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/product/${product.slug}`
                    )
                  }
                  className="rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-black transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-hidden rounded-3xl border border-gray-200 bg-white/90 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm">
                  <th className="px-6 py-5 text-left">
                    Product
                  </th>

                  <th className="px-6 py-5">
                    Category
                  </th>

                  <th className="px-6 py-5">
                    Stock
                  </th>

                  <th className="px-6 py-5">
                    Price
                  </th>

                  <th className="px-6 py-5">
                    Featured
                  </th>

                  <th className="px-6 py-5">
                    Status
                  </th>

                  <th className="px-6 py-5">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="border-t hover:bg-orange-50 transition"
                  >
                    {/* Product */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-50 border flex items-center justify-center">
                          <Image
                            src={
                              product.images?.[0]
                            }
                            alt={product.name}
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 text-center">
                      {product.category}
                    </td>

                    {/* Stock */}
                    <td className="px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {product.stock > 0
                          ? product.stock
                          : "Out"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 text-center">
                      <p className="font-bold text-orange-600">
                        Rs.{" "}
                        {product.offerPrice?.toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-400 line-through">
                        Rs.{" "}
                        {product.price?.toLocaleString()}
                      </p>
                    </td>

                    {/* Featured */}
                    <td className="px-6 text-center">
                      <button
                        onClick={() =>
                          toggleFeatured(
                            product._id,
                            product.featured
                          )
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${product.featured
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                      >
                        {product.featured
                          ? "★ Featured"
                          : "☆ Feature"}
                      </button>
                    </td>

                    {/* Status */}
                    <td className="px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {product.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/seller/edit-product/${product._id}`
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleProduct(
                              product._id
                            )
                          }
                          className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition ${product.isActive
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                          {product.isActive
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          onClick={() =>
                            router.push(
                              `/product/${product.slug}`
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {!products.length && (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Add your first product to start selling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;