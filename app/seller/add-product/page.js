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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Add New Product
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Create and publish a new product to your Eliteo store.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-5 md:p-10 space-y-8"
                >

                    {/* Images */}
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800 mb-4">
                            Product Images
                        </h2>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, index) => (
                                <label
                                    key={index}
                                    htmlFor={`image${index}`}
                                    className="group relative aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-500 transition cursor-pointer overflow-hidden bg-gray-50"
                                >
                                    <input
                                        id={`image${index}`}
                                        type="file"
                                        hidden
                                        onChange={(e) => {
                                            const updatedFiles = [...files];
                                            updatedFiles[index] = e.target.files[0];
                                            setFiles(updatedFiles);
                                        }}
                                    />

                                    <Image
                                        src={
                                            files[index]
                                                ? URL.createObjectURL(files[index])
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

                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div>
                            <label className="input-label">
                                Product Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter product name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                placeholder="Apple, Samsung..."
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
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
                            placeholder="Write detailed product description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input-style resize-none"
                            required
                        />
                    </div>

                    {/* Category Section */}
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
                                    <option key={item}>
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

                                {categories[category]?.map(item => (
                                    <option key={item}>
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
                                placeholder="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="input-style"
                                required
                            />
                        </div>

                        <div>
                            <label className="input-label">
                                Offer Price
                            </label>

                            <input
                                type="number"
                                placeholder="0"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                className="input-style"
                                required
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
                            placeholder="100"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="input-style"
                        />
                    </div>

                    {/* Button */}
                    <button
                        disabled={loading}
                        className="w-full md:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-700 text-white font-semibold shadow-lg hover:shadow-orange-300 hover:scale-[1.02] transition disabled:opacity-60"
                    >
                        {loading ? "Uploading..." : "Add Product"}
                    </button>

                </form>

            </div>
        </div>
    );
};

export default AddProduct;