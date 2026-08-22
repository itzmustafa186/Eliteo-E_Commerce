import connectDB from "@/config/db";
import Product from "@/models/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryProducts from "@/components/CategoryProducts";
import { notFound } from "next/navigation";

const baseUrl = "https://www.eliteo.pk";

const categoryMap = {
    earbuds: "Earbuds",
    headphones: "Headphones",
    chargers: "Chargers",
    cables: "Cables",
    powerbanks: "Powerbanks",
    handsfree: "Handsfree",
    smartwatches: "Smartwatches",
};

const categorySEO = {
    earbuds: {
        title: "Earbuds in Pakistan | Buy Wireless Earbuds Online - Eliteo",
        description:
            "Shop wireless earbuds and TWS earbuds online in Pakistan at Eliteo. Explore quality earbuds with great sound, stylish designs and affordable prices.",
        heading:
            "Wireless Earbuds in Pakistan",
        intro:
            "Shop wireless and TWS earbuds online in Pakistan. Explore quality earbuds for music, calls, gaming and everyday use at Eliteo.",
    },

    headphones: {
        title: "Headphones in Pakistan | Buy Headphones Online - Eliteo",
        description:
            "Shop headphones online in Pakistan at Eliteo. Explore wireless, wired and gaming headphones for music, calls and everyday use at affordable prices.",
        heading:
            "Headphones in Pakistan",
        intro:
            "Explore headphones for music, gaming, calls and everyday listening. Shop quality headphones online in Pakistan at Eliteo.",
    },

    chargers: {
        title: "Mobile Chargers in Pakistan | Fast Chargers - Eliteo",
        description:
            "Shop mobile chargers and fast chargers online in Pakistan at Eliteo. Find reliable charging accessories for smartphones, tablets and other devices.",
        heading:
            "Mobile Chargers in Pakistan",
        intro:
            "Find reliable mobile chargers and fast charging accessories for your devices. Shop chargers online in Pakistan at Eliteo.",
    },

    cables: {
        title: "USB & Charging Cables in Pakistan | Eliteo",
        description:
            "Shop USB, charging and mobile cables online in Pakistan at Eliteo. Find quality cables for charging, data transfer and everyday use.",
        heading:
            "USB & Charging Cables in Pakistan",
        intro:
            "Shop charging, USB and mobile cables for your everyday devices. Find quality cables for charging and data transfer at Eliteo.",
    },

    powerbanks: {
        title: "Power Banks in Pakistan | Buy Portable Chargers - Eliteo",
        description:
            "Shop power banks and portable chargers online in Pakistan at Eliteo. Find convenient charging solutions for smartphones and other devices.",
        heading:
            "Power Banks in Pakistan",
        intro:
            "Stay powered wherever you go with portable power banks. Explore power banks and charging solutions online in Pakistan at Eliteo.",
    },

    handsfree: {
        title: "Handsfree in Pakistan | Buy Handsfree Online - Eliteo",
        description:
            "Shop handsfree and wired audio accessories online in Pakistan at Eliteo. Discover quality handsfree options for calls, music and everyday use.",
        heading:
            "Handsfree in Pakistan",
        intro:
            "Shop handsfree for calls, music and everyday listening. Explore wired audio accessories online in Pakistan at Eliteo.",
    },

    smartwatches: {
        title: "Smart Watches in Pakistan | Buy Smartwatch Online - Eliteo",
        description:
            "Shop smart watches online in Pakistan at Eliteo. Explore stylish and feature-packed smartwatches for everyday use at affordable prices.",
        heading:
            "Smart Watches in Pakistan",
        intro:
            "Explore stylish and feature-packed smartwatches for everyday use. Shop smart watches online in Pakistan at Eliteo.",
    },
};


// ======================================================
// SEO METADATA
// ======================================================

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const seo = categorySEO[slug];

    if (!seo || !categoryMap[slug]) {
        return {
            title: "Category Not Found | Eliteo",

            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const canonicalUrl = `${baseUrl}/category/${slug}`;

    return {
        title: seo.title,

        description: seo.description,

        alternates: {
            canonical: canonicalUrl,
        },

        robots: {
            index: true,
            follow: true,

            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },

        openGraph: {
            title: seo.title,

            description: seo.description,

            url: canonicalUrl,

            siteName: "Eliteo",

            type: "website",

            locale: "en_PK",

            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${categoryMap[slug]} - Eliteo`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",

            title: seo.title,

            description: seo.description,

            images: ["/og-image.jpg"],
        },
    };
}


// ======================================================
// CATEGORY PAGE
// ======================================================

export default async function CategoryPage({ params }) {
    const { slug } = await params;

    const categoryName = categoryMap[slug];

    const seo = categorySEO[slug];

    if (!categoryName || !seo) {
        notFound();
    }

    await connectDB();

    const products = await Product.find({
        category: categoryName,
        isActive: true,
    })
        .sort({ createdAt: -1 })
        .lean();

    if (!products.length) {
        notFound();
    }


    // ==================================================
    // SERIALIZE PRODUCTS
    // ==================================================

    const serializedProducts = products.map((product) => ({
        ...product,

        _id: product._id.toString(),

        createdAt:
            product.createdAt?.toISOString(),

        updatedAt:
            product.updatedAt?.toISOString(),
    }));


    const canonicalUrl =
        `${baseUrl}/category/${slug}`;


    // ==================================================
    // BREADCRUMB SCHEMA
    // ==================================================

    const breadcrumbSchema = {
        "@context": "https://schema.org",

        "@type": "BreadcrumbList",

        itemListElement: [
            {
                "@type": "ListItem",

                position: 1,

                name: "Home",

                item: baseUrl,
            },

            {
                "@type": "ListItem",

                position: 2,

                name: categoryName,

                item: canonicalUrl,
            },
        ],
    };


    // ==================================================
    // CATEGORY / COLLECTION SCHEMA
    // ==================================================

    const categorySchema = {
        "@context": "https://schema.org",

        "@type": "CollectionPage",

        name: seo.heading,

        description: seo.description,

        url: canonicalUrl,

        isPartOf: {
            "@type": "WebSite",

            name: "Eliteo",

            url: baseUrl,
        },

        mainEntity: {
            "@type": "ItemList",

            numberOfItems: serializedProducts.length,

            itemListElement: serializedProducts
                .slice(0, 50)
                .map((product, index) => ({
                    "@type": "ListItem",

                    position: index + 1,

                    url:
                        `${baseUrl}/product/${product.slug}`,

                    name: product.name,
                })),
        },
    };


    return (
        <>
            {/* =========================================
                BREADCRUMB STRUCTURED DATA
            ========================================= */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(breadcrumbSchema),
                }}
            />


            {/* =========================================
                CATEGORY STRUCTURED DATA
            ========================================= */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(categorySchema),
                }}
            />


            <Navbar />

            <main className="min-h-screen bg-[#fafafa]">

                {/* =====================================
                    CATEGORY HEADER
                ===================================== */}

                <section className="bg-white border-b border-gray-100">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Breadcrumb */}

                        <nav
                            aria-label="Breadcrumb"
                            className="pt-6"
                        >
                            <ol className="flex items-center text-sm text-gray-400">

                                <li>
                                    <a
                                        href="/"
                                        className="hover:text-gray-700"
                                    >
                                        Home
                                    </a>
                                </li>

                                <li
                                    aria-hidden="true"
                                    className="mx-2"
                                >
                                    /
                                </li>

                                <li
                                    className="text-gray-600"
                                    aria-current="page"
                                >
                                    {categoryName}
                                </li>

                            </ol>
                        </nav>


                        {/* Heading */}

                        <div className="py-10 sm:py-14">

                            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">
                                Eliteo Collection
                            </p>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900">
                                {seo.heading}
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7 text-gray-500">
                                {seo.intro}
                            </p>

                        </div>

                    </div>

                </section>


                {/* =====================================
                    PRODUCTS
                ===================================== */}

                <CategoryProducts
                    products={serializedProducts}
                    categoryName={categoryName}
                />


                {/* =====================================
                    SEO CONTENT
                ===================================== */}

                <section className="bg-white border-t border-gray-100">

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                        <h2 className="text-2xl font-semibold text-gray-900">
                            {categoryName} Online in Pakistan
                        </h2>

                        <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
                            Explore Eliteo's collection of{" "}
                            {categoryName.toLowerCase()} available
                            online in Pakistan. We offer a range of
                            products designed for everyday use, whether
                            you are looking for reliable accessories,
                            modern designs or convenient technology.
                        </p>

                        <p className="mt-4 text-sm sm:text-base leading-7 text-gray-600">
                            Browse our latest products, compare available
                            options and find the right{" "}
                            {categoryName.toLowerCase()} for your needs.
                            Eliteo makes it easy to discover mobile and
                            technology accessories online.
                        </p>

                    </div>

                </section>

            </main>

            <Footer />
        </>
    );
}