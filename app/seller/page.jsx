'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
const categories = {
  Earbuds: [
    "Gaming",
    "Wireless",
    "ANC",
    "TWS",
  ],
  Headphones: [
    "Gaming",
    "Studio",
    "Bluetooth",
    "Noise Cancelling",
  ],
  Chargers: [
    "20W",
    "33W",
    "45W",
    "65W",
  ],
  Cables: [
    "Type-C",
    "Lightning",
    "Micro USB",
    "Fast Charging",
  ],
  PowerBanks: [
    "10000mAh",
    "20000mAh",
    "Wireless",
    "Fast Charging",
  ],
  MobileCases: [
    "Silicone",
    "Transparent",
    "Shockproof",
    "Leather",
  ],
  ScreenProtectors: [
    "Tempered Glass",
    "Privacy Glass",
    "Matte",
  ],
  SmartWatches: [
    "Fitness",
    "AMOLED",
    "Calling",
    "Sports",
  ],

  GamingAccessories: [
    "Triggers",
    "Cooling Fan",
    "Gamepad",
  ],
};

const AddProduct = () => {
  const { getToken } = useAppContext();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earbuds');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("brand", brand);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("stock", stock);

      for (const file of files) {
        if (file) formData.append("images", file);
      }



      const token = await getToken();

      const { data } = await axios.post(
        "/api/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        console.timeEnd("Upload Request");

        setFiles([]);
        setName("");
        setDescription("");
        setCategory("Earbuds");
        setPrice("");
        setOfferPrice("");
        setBrand("");
        setSubCategory("");
        setStock("");
        router.refresh();
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

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>

            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => {
                setCategory(e.target.value);
                
              }}
              value={category}
            >
              <option value="">Select Category</option>

              {Object.keys(categories).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>


          <div className="flex flex-col gap-1 w-52">
            <label className="text-base font-medium" htmlFor="subCategory">
              Sub Category
            </label>

            <select
              id="subCategory"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category}
            >
              <option value="">Select Sub Category</option>

              {category &&
                categories[category].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              step="0.01"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-52">
            <label className="text-base font-medium">
              Brand
            </label>

            <input
              type="text"
              placeholder="Apple, Samsung..."
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium">
              Stock
            </label>

            <input
              type="number"
              min="0"
              placeholder="100"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-2 ${loading
            ? "bg-orange-400 cursor-not-allowed"
            : "bg-orange-600 hover:bg-orange-700"
            }`}
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "ADD PRODUCT"
          )}
        </button>
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;