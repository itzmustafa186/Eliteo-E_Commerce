"use client";


import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";


const ReviewSection = ({
    productId,
    rating,
    reviewCount,
    reviews = []
}) => {
    const router = useRouter();
    const [reviewList, setReviewList] = useState(reviews);

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        userName: "",
        rating: 5,
        comment: ""
    });


    const submitReview = async (e) => {

        e.preventDefault();


        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId,
                userId: "guest",
                ...form
            })
        });


        const data = await res.json();


        if (data.success) {

            toast.success("Review added");

            setReviewList((prev) => [
                data.review,
                ...prev
            ]);

            setForm({
                userName: "",
                rating: 5,
                comment: ""
            });

            setShowForm(false);

            router.refresh();
        }

    };


    return (

        <section className="mt-16 border-t pt-10">


            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">


                <h2 className="text-2xl sm:text-3xl font-bold">
                    Customer Reviews
                </h2>

                <p className="mt-1 text-sm sm:text-base text-gray-500">
                    ⭐ {rating || 0} ({reviewCount || 0} Reviews)
                </p>





                <button
                    onClick={() => setShowForm(!showForm)}
                    className="w-full sm:w-auto rounded-xl bg-orange-600 px-6 py-3 text-white font-medium transition hover:bg-orange-700"
                >
                    Write Review
                </button>


            </div>



            {
                showForm && (

                    <form
                        onSubmit={submitReview}
                        className="mt-8 rounded-2xl border bg-white p-4 sm:p-6 space-y-4 shadow-sm"
                    >


                        <input
                            className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-500"
                            placeholder="Your name"
                            value={form.userName}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    userName: e.target.value
                                })
                            }
                        />



                        <select
                            className="w-full sm:w-48 rounded-xl border px-4 py-3 text-sm outline-none focus:border-orange-500"
                            value={form.rating}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    rating: Number(e.target.value)
                                })
                            }
                        >

                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="1">⭐</option>

                        </select>



                        <textarea
                            rows={5}
                            className="w-full rounded-xl border px-4 py-3 text-sm resize-none outline-none focus:border-orange-500"
                            placeholder="Write your review"
                            value={form.comment}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    comment: e.target.value
                                })
                            }
                        />


                        <button
                            className="w-full sm:w-auto rounded-xl bg-orange-600 px-8 py-3 font-medium text-white transition hover:bg-orange-700"
                        >
                            Submit Review
                        </button>


                    </form>

                )
            }



            {reviewList.length === 0 ? (
                <div className="rounded-2xl border border-dashed p-10 text-center">
                    <h3 className="text-lg font-semibold">
                        No Reviews Yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Be the first customer to review this product.
                    </p>
                </div>
            ) : (
                <div className="mt-8 space-y-5">

                    {
                        reviewList.map((review) => (
                            <div
                                key={review._id}
                                className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
                            >
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                    <h3 className="text-base font-semibold text-gray-900">
                                        {review.userName}
                                    </h3>

                                    <span className="text-yellow-500 text-sm">
                                        {"⭐".repeat(review.rating)}
                                    </span>

                                </div>

                                <p className="mt-3 text-sm leading-6 text-gray-600">
                                    {review.comment}
                                </p>


                            </div>
                        ))
                    }

                </div>
            )}
            <div className="mt-8 space-y-5">

                {
                    reviewList.map((review) => (
                        <div
                            key={review._id}
                            className="rounded-2xl border bg-white p-4 sm:p-6 shadow-sm"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                                <h3 className="text-base font-semibold text-gray-900">
                                    {review.userName}
                                </h3>

                                <span className="text-yellow-500 text-sm">
                                    {"⭐".repeat(review.rating)}
                                </span>

                            </div>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                {review.comment}
                            </p>


                        </div>
                    ))
                }

            </div>


        </section>

    );

};


export default ReviewSection;