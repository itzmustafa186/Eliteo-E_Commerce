"use client";

import React from "react";
import {
    Truck,
    ShieldCheck,
    Banknote,
    RotateCcw,
} from "lucide-react";

const WhyChooseEliteo = () => {
    const features = [
        {
            icon: Truck,
            title: "Fast & Reliable Delivery",
            description:
                "Get your order delivered quickly and safely anywhere across Pakistan.",
        },
        {
            icon: ShieldCheck,
            title: "Quality You Can Trust",
            description:
                "We carefully select products to give you quality you can depend on.",
        },
        {
            icon: Banknote,
            title: "Cash on Delivery",
            description:
                "Shop with confidence and pay conveniently when your order arrives.",
        },
        {
            icon: RotateCcw,
            title: "Easy Returns",
            description:
                "A simple return process for eligible products when you need it.",
        },
    ];

    return (
        <section className="w-full bg-[#FCFBF8] py-20 md:py-24">

            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                {/* Heading */}
                <div className="mx-auto mb-14 max-w-2xl text-center">

                    <div className="mb-4 flex items-center justify-center gap-3">

                        <span className="h-px w-8 bg-[#C8A96B]" />

                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9B7A42]">
                            Why Eliteo
                        </p>

                        <span className="h-px w-8 bg-[#C8A96B]" />

                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl md:text-[42px]">
                        Why Choose Eliteo?
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#687080] sm:text-base">
                        Everything we do is designed to make your shopping
                        experience simple, secure, and enjoyable.
                    </p>

                </div>


                {/* Features */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {features.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={index}
                                className="
                                    group
                                    rounded-[24px]
                                    border
                                    border-[#E8E1D6]
                                    bg-white
                                    p-7
                                    text-center
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-[#D9C49B]
                                    hover:shadow-[0_15px_40px_rgba(23,32,51,0.07)]
                                "
                            >

                                {/* Icon */}
                                <div
                                    className="
                                        mx-auto
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-[#E5D8C1]
                                        bg-[#F4EFE6]
                                        text-[#9B7A42]
                                        transition-all
                                        duration-300
                                        group-hover:scale-105
                                        group-hover:bg-[#EDE2CF]
                                    "
                                >
                                    <Icon
                                        size={25}
                                        strokeWidth={1.6}
                                    />
                                </div>


                                {/* Title */}
                                <h3 className="mt-6 text-lg font-semibold text-[#172033]">
                                    {feature.title}
                                </h3>


                                {/* Description */}
                                <p className="mt-3 text-sm leading-6 text-[#687080]">
                                    {feature.description}
                                </p>

                            </div>
                        );
                    })}

                </div>


                {/* Bottom Accent */}
                <div className="mx-auto mt-12 flex items-center justify-center gap-3">

                    <span className="h-px w-16 bg-[#E8E1D6]" />

                    <span className="h-1.5 w-1.5 rounded-full bg-[#C8A96B]" />

                    <span className="h-px w-16 bg-[#E8E1D6]" />

                </div>

            </div>

        </section>
    );
};

export default WhyChooseEliteo;