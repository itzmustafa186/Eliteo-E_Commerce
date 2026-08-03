"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { useRouter } from "next/navigation";

const HomeProducts = ({ products }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="w-full text-2xl font-medium">
        Popular Products
      </p>

      <div className="grid w-full grid-cols-2 gap-6 mt-6 pb-14 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <ProductCard
            key={product._id.toString()}
            product={product}
          />
        ))}
      </div>

      <button
        onClick={() => router.push("/all-products")}
        className="rounded border px-12 py-2.5 text-gray-600 transition hover:bg-gray-100"
      >
        See More
      </button>
    </div>
  );
};

export default HomeProducts;