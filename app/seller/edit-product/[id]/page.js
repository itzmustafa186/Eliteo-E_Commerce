'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { PencilLine } from "lucide-react";


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

const EditProduct = () => {



    const { id } = useParams();

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

    const fetchProduct = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get(`/api/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                const product = data.product;
                console.log(data.product);
                setName(product.name);
                setDescription(product.description);
                setCategory(product.category);
                setSubCategory(product.subCategory);
                setBrand(product.brand);
                setPrice(product.price);
                setOfferPrice(product.offerPrice);
                setStock(product.stock);

                // old images
                setFiles(product.images);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
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

            files.forEach((file) => {
                if (file instanceof File) {
                    formData.append("images", file);
                }
            });



            const token = await getToken();

            const { data } = await axios.put(`/api/product/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                if (data.success) {
                    toast.success("Product updated successfully");

                    router.push("/seller/product-list");
                    router.refresh();
                }

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
    useEffect(() => {
        fetchProduct();
    }, []);

   return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 p-4 md:p-8">
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-orange-100 shadow-sm">
          <PencilLine className="w-7 h-7 text-orange-600" />
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Update Product
          </h1>
          <p className="text-gray-500 mt-1">
            Edit product details, images, pricing and inventory.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-5 md:p-10 space-y-8"
      >

        {/* Images */}
        <div>
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            Product Images
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <label
                key={index}
                htmlFor={`image${index}`}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-orange-500 bg-gray-50 cursor-pointer transition group"
              >
                <input
                  hidden
                  type="file"
                  id={`image${index}`}
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                />

                <Image
                  src={
                    files[index]
                      ? typeof files[index] === "string"
                        ? files[index]
                        : URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt=""
                  fill
                  className="object-contain p-5 group-hover:scale-105 transition"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Main Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="input-label">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="input-style"
              required
            />
          </div>

          <div>
            <label className="input-label">
              Brand
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Apple, Samsung..."
              className="input-style"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="input-label">
            Product Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product details..."
            className="input-style resize-none"
            required
          />
        </div>

        {/* Product Details */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div>
            <label className="input-label">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-style"
            >
              {Object.keys(categories).map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">
              Sub Category
            </label>

            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="input-style"
            >
              <option>Select</option>

              {category &&
                categories[category]?.map(item => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="input-label">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-style"
            />
          </div>

          <div>
            <label className="input-label">
              Offer Price
            </label>

            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              className="input-style"
            />
          </div>

        </div>

        {/* Stock */}
        <div className="max-w-xs">
          <label className="input-label">
            Stock Quantity
          </label>

          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="input-style"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold shadow-lg hover:shadow-orange-300 hover:scale-[1.02] transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>

      </form>

    </div>
  </div>
);
};

export default EditProduct;