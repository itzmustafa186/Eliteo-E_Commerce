"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Plus,
    Pencil,
    Trash2,
    X,
    ImageIcon,
    Eye,
    EyeOff,
    Upload,
    Loader2,
    ExternalLink,
} from "lucide-react";

const CarouselPage = () => {
    const [carousels, setCarousels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);
    const [order, setOrder] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [editingCarousel, setEditingCarousel] = useState(null);

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [buttonText, setButtonText] = useState("Shop Now");
    const [buttonLink, setButtonLink] = useState("/all-products");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    // =========================
    // FETCH CAROUSELS
    // =========================

    const fetchCarousels = async () => {
        try {
            setLoading(true);

            const { data } = await axios.get("/api/seller/carousel");

            if (data.success) {
                setCarousels(data.carousels || []);
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch carousels"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarousels();
    }, []);

    // =========================
    // OPEN CREATE MODAL
    // =========================

    const openCreateModal = () => {
        setEditingCarousel(null);
        setOrder(0);
        setTitle("");
        setSubtitle("");
        setButtonText("Shop Now");
        setButtonLink("/all-products");
        setImage(null);
        setPreview("");

        setShowModal(true);
    };

    // =========================
    // OPEN EDIT MODAL
    // =========================

    const openEditModal = (carousel) => {
        setEditingCarousel(carousel);
        setOrder(carousel.order || 0);
        setTitle(carousel.title || "");
        setSubtitle(carousel.subtitle || "");
        setButtonText(carousel.buttonText || "Shop Now");
        setButtonLink(carousel.buttonLink || "/all-products");

        setImage(null);
        setPreview(carousel.image || "");

        setShowModal(true);
    };

    // =========================
    // CLOSE MODAL
    // =========================

    const closeModal = () => {
        if (submitting) return;

        setShowModal(false);
        setEditingCarousel(null);
        setImage(null);
        setPreview("");
    };

    // =========================
    // IMAGE CHANGE
    // =========================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setImage(file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    // =========================
    // CREATE / UPDATE
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        if (!editingCarousel && !image) {
            toast.error("Please select an image");
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("order", order);
            formData.append("title", title.trim());
            formData.append("subtitle", subtitle.trim());
            formData.append("buttonText", buttonText.trim());
            formData.append("buttonLink", buttonLink.trim());

            if (image) {
                formData.append("image", image);
            }

            let response;

            if (editingCarousel) {
                response = await axios.put(
                    `/api/seller/carousel/${editingCarousel._id}`,
                    formData
                );
            } else {
                response = await axios.post(
                    "/api/seller/carousel",
                    formData
                );
            }

            if (response.data.success) {
                toast.success(
                    editingCarousel
                        ? "Carousel updated successfully"
                        : "Carousel created successfully"
                );

                closeModal();
                fetchCarousels();
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // DELETE
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this carousel?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            const { data } = await axios.delete(
                `/api/seller/carousel/${id}`
            );

            if (data.success) {
                toast.success("Carousel deleted successfully");

                setCarousels((prev) =>
                    prev.filter((item) => item._id !== id)
                );
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete carousel"
            );
        } finally {
            setDeletingId(null);
        }
    };

    // =========================
    // TOGGLE ACTIVE
    // =========================

    const handleToggle = async (carousel) => {
        try {
            setTogglingId(carousel._id);

            const { data } = await axios.patch(
                `/api/seller/carousel/${carousel._id}`,
                {
                    isActive: !carousel.isActive,
                }
            );

            if (data.success) {
                setCarousels((prev) =>
                    prev.map((item) =>
                        item._id === carousel._id
                            ? {
                                ...item,
                                isActive: !item.isActive,
                            }
                            : item
                    )
                );

                toast.success(
                    carousel.isActive
                        ? "Carousel deactivated"
                        : "Carousel activated"
                );
            }
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update carousel"
            );
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-6 lg:px-8">

            {/* ================= HEADER ================= */}

            <div className="mx-auto">

                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                                <ImageIcon size={18} />
                            </div>

                            <span className="text-sm font-medium text-gray-500">
                                Store Management
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Carousel
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage promotional banners displayed on your store.
                        </p>
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-[0.98]"
                    >
                        <Plus size={18} />
                        Add Carousel
                    </button>

                </div>

                {/* ================= CONTENT ================= */}

                {loading ? (

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                            >
                                <div className="h-52 animate-pulse bg-gray-200" />

                                <div className="space-y-3 p-5">
                                    <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                        ))}

                    </div>

                ) : carousels.length === 0 ? (

                    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">

                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                            <ImageIcon
                                size={28}
                                className="text-gray-400"
                            />
                        </div>

                        <h2 className="text-lg font-semibold text-gray-900">
                            No carousels yet
                        </h2>

                        <p className="mt-1 max-w-sm text-sm text-gray-500">
                            Create your first promotional banner to
                            highlight products, offers and campaigns.
                        </p>

                        <button
                            onClick={openCreateModal}
                            className="mt-6 flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            <Plus size={17} />
                            Create Carousel
                        </button>

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {carousels.map((carousel) => (

                            <div
                                key={carousel._id}
                                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >

                                {/* IMAGE */}

                                <div className="relative aspect-[16/8] overflow-hidden bg-gray-100">

                                    <Image
                                        src={carousel.image}
                                        alt={carousel.title}
                                        fill
                                        className="object-cover transition duration-500 group-hover:scale-105"
                                    />

                                    <div className="absolute left-3 top-3">
                                        <span
                                            className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${carousel.isActive
                                                ? "bg-green-500/90 text-white"
                                                : "bg-gray-900/75 text-white"
                                                }`}
                                        >
                                            {carousel.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                </div>

                                {/* INFO */}

                                <div className="p-5">

                                    <div className="mb-3">
                                        <h2 className="truncate text-lg font-semibold text-gray-900">
                                            {carousel.title}
                                        </h2>

                                        {carousel.subtitle && (
                                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                                                {carousel.subtitle}
                                            </p>
                                        )}
                                    </div>

                                    {/* BUTTON PREVIEW */}

                                    <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">

                                        <div>
                                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                                Button
                                            </p>

                                            <p className="mt-0.5 text-sm font-semibold text-gray-700">
                                                {carousel.buttonText || "Shop Now"}
                                            </p>
                                        </div>

                                        <ExternalLink
                                            size={16}
                                            className="text-gray-400"
                                        />

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() =>
                                                handleToggle(carousel)
                                            }
                                            disabled={
                                                togglingId === carousel._id
                                            }
                                            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition ${carousel.isActive
                                                ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                                }`}
                                        >
                                            {togglingId === carousel._id ? (
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : carousel.isActive ? (
                                                <>
                                                    <EyeOff size={16} />
                                                    Disable
                                                </>
                                            ) : (
                                                <>
                                                    <Eye size={16} />
                                                    Activate
                                                </>
                                            )}
                                        </button>

                                        <button
                                            onClick={() =>
                                                openEditModal(carousel)
                                            }
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(carousel._id)
                                            }
                                            disabled={
                                                deletingId === carousel._id
                                            }
                                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                                            title="Delete"
                                        >
                                            {deletingId === carousel._id ? (
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

            {/* ================= MODAL ================= */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">

                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    {editingCarousel
                                        ? "Edit Carousel"
                                        : "Create Carousel"}
                                </h2>

                                <p className="mt-0.5 text-xs text-gray-500">
                                    Add promotional content to your storefront.
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                disabled={submitting}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100"
                            >
                                <X size={19} />
                            </button>

                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-5 sm:p-6"
                        >

                            {/* IMAGE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Carousel Image
                                </label>

                                <label className="group relative block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-400">

                                    {preview ? (

                                        <div className="relative aspect-[16/7]">

                                            <Image
                                                src={preview}
                                                alt="Carousel preview"
                                                fill
                                                className="object-cover"
                                                unoptimized={preview.startsWith("blob:")}
                                            />

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
                                                <div className="rounded-lg bg-white px-4 py-2 text-sm font-medium opacity-0 shadow transition group-hover:opacity-100">
                                                    Change image
                                                </div>
                                            </div>

                                        </div>

                                    ) : (

                                        <div className="flex aspect-[16/7] flex-col items-center justify-center">

                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                                <Upload
                                                    size={20}
                                                    className="text-gray-500"
                                                />
                                            </div>

                                            <p className="text-sm font-semibold text-gray-700">
                                                Upload banner image
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                PNG, JPG or WEBP · Max 5MB
                                            </p>

                                        </div>

                                    )}

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                </label>

                                <p className="mt-2 text-xs text-gray-400">
                                    Recommended ratio: 16:7
                                </p>

                            </div>

                            {/* TITLE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. Summer Sale"
                                    maxLength={100}
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
                                />

                            </div>

                            {/* SUBTITLE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Subtitle
                                </label>

                                <textarea
                                    value={subtitle}
                                    onChange={(e) =>
                                        setSubtitle(e.target.value)
                                    }
                                    placeholder="e.g. Get up to 50% off on selected accessories"
                                    maxLength={200}
                                    rows={3}
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
                                />

                            </div>

                            {/* BUTTON */}

                            <div className="grid gap-4 sm:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                                        Button Text
                                    </label>

                                    <input
                                        type="text"
                                        value={buttonText}
                                        onChange={(e) =>
                                            setButtonText(e.target.value)
                                        }
                                        placeholder="Shop Now"
                                        className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
                                    />

                                </div>

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                                        Button Link
                                    </label>

                                    <input
                                        type="text"
                                        value={buttonLink}
                                        onChange={(e) =>
                                            setButtonLink(e.target.value)
                                        }
                                        placeholder="/all-products"
                                        className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5"
                                    />

                                </div>

                            </div>

                            {/* FOOTER */}

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            {editingCarousel
                                                ? "Updating..."
                                                : "Creating..."}
                                        </>
                                    ) : (
                                        <>
                                            {editingCarousel
                                                ? "Update Carousel"
                                                : "Create Carousel"}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default CarouselPage;