"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const headlines = [
    "Smart Tech. Better Living.",
    "Discover Premium Tech Accessories",
    "Upgrade Your Everyday",
    
    
];

const HeadlineSection = () => {
    return (
        <section className="overflow-hidden border-y border-slate-200 bg-slate-950 text-white">
            <div className="flex h-11 items-center">
                {/* Fixed Label */}
                <div className="relative z-10 flex h-full shrink-0 items-center gap-2 bg-slate-950 px-4 sm:px-6">
                    <Sparkles
                        size={14}
                        className="text-indigo-400"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs">
                        Eliteo
                    </span>

                    <span className="hidden h-4 w-px bg-slate-700 sm:block" />
                </div>

                {/* Moving Content */}
                <div className="relative min-w-0 flex-1 overflow-hidden">
                    <div className="headline-track flex w-max items-center">
                        {[...headlines, ...headlines].map(
                            (headline, index) => (
                                <Link
                                    key={index}
                                    href="/all-products"
                                    className="flex shrink-0 items-center gap-3 px-6 text-xs font-medium text-slate-300 transition hover:text-white sm:px-8 sm:text-sm"
                                >
                                    <span>{headline}</span>

                                    <span className="text-indigo-400">
                                        •
                                    </span>

                                    <ArrowRight
                                        size={13}
                                        className="text-slate-500"
                                    />
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeadlineSection;