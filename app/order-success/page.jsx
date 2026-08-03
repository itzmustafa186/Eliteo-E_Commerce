"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrderSuccess() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/my-orders");
        }, 2500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">

                <CheckCircle2 className="mx-auto h-24 w-24 text-green-500 animate-bounce" />

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Order Placed!
                </h1>

                <p className="mt-3 text-gray-600">
                    Your order has been placed successfully.
                </p>

                <div className="mt-8">
                    <div className="mx-auto h-2 w-52 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-full animate-pulse rounded-full bg-orange-500"></div>
                    </div>

                    <p className="mt-4 text-sm text-gray-500">
                        Redirecting to My Orders...
                    </p>
                </div>
            </div>
        </div>
    );
}