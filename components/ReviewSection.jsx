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


            <div className="flex justify-between items-center">


                <div>
                    <h2 className="text-3xl font-bold">
                        Customer Reviews
                    </h2>

                    <p className="text-gray-500">
                        ⭐ {rating || 0} ({reviewCount || 0} Reviews)
                    </p>

                   

                </div>





                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-orange-500 text-white px-6 py-3 rounded-full"
                >
                    Write Review
                </button>


            </div>



            {
                showForm && (

                    <form
                        onSubmit={submitReview}
                        className="mt-8 border rounded-xl p-6 space-y-4"
                    >


                        <input
                            className="border p-3 w-full rounded"
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
                            className="border p-3 rounded"
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
                            className="border p-3 w-full rounded"
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
                            className="bg-orange-600 text-white px-6 py-3 rounded"
                        >
                            Submit Review
                        </button>


                    </form>

                )
            }




            <div className="mt-8 space-y-5">

                {
                    reviewList.map((review) => (
                        <div
                            key={review._id}
                            className="border rounded-xl p-5"
                        >

                            <h3 className="font-semibold">
                                {review.userName}
                            </h3>


                            <p className="text-yellow-500">
                                {"⭐".repeat(review.rating)}
                            </p>


                            <p className="text-gray-600">
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