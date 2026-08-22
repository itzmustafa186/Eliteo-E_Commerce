import Link from "next/link";
import {
    ArrowLeft,
    Home,
    Search,
    ShoppingBag,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-[#FAF8F4] text-[#172033]">

            {/* ================= NAVBAR ================= */}
            <Navbar />

            {/* ================= MAIN ================= */}
            <main className="flex flex-1 items-center justify-center px-5 py-20 sm:px-8 lg:px-12">

                <div className="w-full max-w-3xl text-center">

                    {/* Small Label */}
                    <div className="mb-7 flex items-center justify-center gap-3">
                        <span className="h-px w-10 bg-[#DCCBAA]" />

                        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#9B7A42]">
                            Eliteo Collection
                        </span>

                        <span className="h-px w-10 bg-[#DCCBAA]" />
                    </div>


                    {/* ================= 404 ================= */}
                    <div className="relative mx-auto mb-8 inline-block">

                        <h1
                            className="
                                select-none
                                text-[120px]
                                font-semibold
                                leading-none
                                tracking-[-0.08em]
                                text-[#EDE7DC]
                                sm:text-[170px]
                                lg:text-[210px]
                            "
                        >
                            404
                        </h1>

                        {/* Center Logo Text */}
                        <div className="absolute inset-0 flex items-center justify-center">

                            <div className="rounded-full border border-[#DCCBAA] bg-[#FAF8F4] px-5 py-2 shadow-sm">

                                <span className="text-xs font-bold uppercase tracking-[0.35em] text-[#9B7A42]">
                                    Eliteo
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ================= CONTENT ================= */}

                    <h2
                        className="
                            text-3xl
                            font-semibold
                            tracking-tight
                            text-[#172033]
                            sm:text-4xl
                        "
                    >
                        This page doesn't exist
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-4
                            max-w-lg
                            text-sm
                            leading-7
                            text-[#687080]
                            sm:text-base
                        "
                    >
                        The page you're looking for may have been moved,
                        removed, or the link you followed may be incorrect.
                    </p>


                    {/* ================= ACTIONS ================= */}

                    <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">

                        {/* Home */}
                        <Link
                            href="/"
                            className="
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                gap-2.5
                                rounded-xl
                                border
                                border-[#9B7A42]
                                bg-[#9B7A42]
                                px-7
                                py-3.5
                                text-sm
                                font-semibold
                                text-white
                                shadow-[0_8px_25px_rgba(155,122,66,0.16)]
                                transition-all
                                duration-300
                                hover:bg-[#856631]
                                hover:shadow-[0_12px_30px_rgba(155,122,66,0.22)]
                                sm:w-auto
                            "
                        >
                            <Home size={17} strokeWidth={1.8} />

                            Back to Home
                        </Link>


                        {/* Products */}
                        <Link
                            href="/all-products"
                            className="
                                inline-flex
                                w-full
                                items-center
                                justify-center
                                gap-2.5
                                rounded-xl
                                border
                                border-[#E2DBCF]
                                bg-white
                                px-7
                                py-3.5
                                text-sm
                                font-semibold
                                text-[#172033]
                                transition-all
                                duration-300
                                hover:border-[#C8A96B]
                                hover:bg-[#FCFBF8]
                                hover:text-[#9B7A42]
                                sm:w-auto
                            "
                        >
                            <ShoppingBag
                                size={17}
                                strokeWidth={1.8}
                            />

                            Browse Products
                        </Link>

                    </div>


                    {/* ================= SECONDARY LINK ================= */}

                    <Link
                        href="/"
                        className="
                            group
                            mt-8
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-[#8A8E96]
                            transition-colors
                            duration-200
                            hover:text-[#9B7A42]
                        "
                    >
                        <ArrowLeft
                            size={15}
                            className="transition-transform duration-200 group-hover:-translate-x-1"
                        />

                        Return to Eliteo
                    </Link>


                    {/* ================= DECORATIVE LINE ================= */}

                    <div className="mx-auto mt-12 flex max-w-xs items-center justify-center gap-3">

                        <span className="h-px flex-1 bg-[#E8E1D6]" />

                        <span className="h-1.5 w-1.5 rounded-full bg-[#C8A96B]" />

                        <span className="h-px flex-1 bg-[#E8E1D6]" />

                    </div>

                </div>

            </main>


            {/* ================= FOOTER ================= */}

            <Footer />

        </div>
    );
}