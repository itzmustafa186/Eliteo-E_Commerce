"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const ReviewSection = ({
    productId,
    rating,
    reviewCount,
    reviews = [],
}) => {
    const router = useRouter();

    const [reviewList, setReviewList] = useState(reviews);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        userName: "",
        rating: 5,
        comment: "",
    });

    const submitReview = async (e) => {
        e.preventDefault();

        if (!form.userName.trim()) {
            toast.error("Please enter your name");
            return;
        }

        if (!form.comment.trim()) {
            toast.error("Please write a review");
            return;
        }

        try {
            setSubmitting(true);

            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    userId: "guest",
                    ...form,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Failed to add review");
                return;
            }

            toast.success("Review added successfully");

            setReviewList((prev) => [data.review, ...prev]);

            setForm({
                userName: "",
                rating: 5,
                comment: "",
            });

            setShowForm(false);

            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="mt-16 border-t border-slate-200 pt-12">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">
                        Customer Experience
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Customer Reviews
                    </h2>

                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5">
                            <span className="text-sm text-amber-500">
                                ★
                            </span>

                            <span className="text-sm font-semibold text-slate-800">
                                {rating || 0}
                            </span>
                        </div>

                        <span className="text-sm text-slate-500">
                            {reviewCount || 0} Reviews
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setShowForm(!showForm)}
                    className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-100 sm:w-auto"
                >
                    {showForm ? "Cancel Review" : "Write a Review"}
                </button>
            </div>

            {/* Review Form */}
            {showForm && (
                <form
                    onSubmit={submitReview}
                    className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Share your experience
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Tell other customers what you think about this product.
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Your Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={form.userName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        userName: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Your Rating
                            </label>

                            <select
                                value={form.rating}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        rating: Number(e.target.value),
                                    })
                                }
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 sm:w-56"
                            >
                                <option value="5">★★★★★ — Excellent</option>
                                <option value="4">★★★★☆ — Very Good</option>
                                <option value="3">★★★☆☆ — Good</option>
                                <option value="2">★★☆☆☆ — Fair</option>
                                <option value="1">★☆☆☆☆ — Poor</option>
                            </select>
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Your Review
                            </label>

                            <textarea
                                rows={5}
                                placeholder="Write your experience with this product..."
                                value={form.comment}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        comment: e.target.value,
                                    })
                                }
                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews */}
            <div className="mt-10">
                {reviewList.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                            ★
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-slate-900">
                            No Reviews Yet
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            Be the first customer to share your experience with this product.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                            Write the first review →
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviewList.map((review) => (
                            <div
                                key={review._id}
                                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                                            {review.userName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {review.userName}
                                            </h3>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Verified Customer
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map(
                                            (_, index) => (
                                                <span
                                                    key={index}
                                                    className={
                                                        index < review.rating
                                                            ? "text-amber-400"
                                                            : "text-slate-200"
                                                    }
                                                >
                                                    ★
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <p className="mt-5 text-sm leading-7 text-slate-600">
                                    {review.comment}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;