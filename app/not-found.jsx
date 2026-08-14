import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-[70vh] bg-[#fafafa] flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-xl text-center">

                {/* 404 */}
                <div className="relative inline-block mb-6">
                    <h1 className="text-[110px] sm:text-[150px] font-bold leading-none tracking-[-0.08em] text-gray-100 select-none">
                        404
                    </h1>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-semibold tracking-[0.3em] uppercase text-gray-900">
                            Eliteo
                        </span>
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                    Page not found
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-6 text-gray-500 max-w-md mx-auto">
                    Sorry, the page you're looking for doesn't exist or may
                    have been moved.
                </p>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">

                    <Link
                        href="/"
                        className="
                            
                            w-full
                            sm:w-auto
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-6
                            py-3
                            rounded-xl
                        
                            border
                            border-gray-200
                            text-gray-800
                            text-sm
                            font-medium
                            hover:border-gray-400
                            transition
                        "
                    >
                        <Home size={17} />
                        Back to Home
                    </Link>

                    <Link
                        href="/all-products"
                        className="
                            w-full
                            sm:w-auto
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            px-6
                            py-3
                            rounded-xl
                            bg-white
                            border
                            border-gray-200
                            text-gray-800
                            text-sm
                            font-medium
                            hover:border-gray-400
                            transition
                        "
                    >
                        <Search size={17} />
                        Browse Products
                    </Link>

                </div>

                {/* Secondary navigation */}
                <Link
                    href="/"
                    className="mt-7 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition"
                >
                    <ArrowLeft size={15} />
                    Return to Eliteo
                </Link>

            </div>
        </main>
    );
}