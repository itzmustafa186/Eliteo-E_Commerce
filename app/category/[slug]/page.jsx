import connectDB from "@/config/db";
import Product from "@/models/product";
import Company from "@/models/Company";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
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
        heading: "Wireless Earbuds in Pakistan",
        intro:
            "Shop wireless and TWS earbuds online in Pakistan. Explore quality earbuds for music, calls, gaming and everyday use at Eliteo.",
    },

    headphones: {
        title: "Headphones in Pakistan | Buy Headphones Online - Eliteo",
        description:
            "Shop headphones online in Pakistan at Eliteo. Explore wireless, wired and gaming headphones for music, calls and everyday use at affordable prices.",
        heading: "Headphones in Pakistan",
        intro:
            "Explore headphones for music, gaming, calls and everyday listening. Shop quality headphones online in Pakistan at Eliteo.",
    },

    chargers: {
        title: "Mobile Chargers in Pakistan | Fast Chargers - Eliteo",
        description:
            "Shop mobile chargers and fast chargers online in Pakistan at Eliteo. Find reliable charging accessories for smartphones, tablets and other devices.",
        heading: "Mobile Chargers in Pakistan",
        intro:
            "Find reliable mobile chargers and fast charging accessories for your devices. Shop chargers online in Pakistan at Eliteo.",
    },

    cables: {
        title: "USB & Charging Cables in Pakistan | Eliteo",
        description:
            "Shop USB, charging and mobile cables online in Pakistan at Eliteo. Find quality cables for charging, data transfer and everyday use.",
        heading: "USB & Charging Cables in Pakistan",
        intro:
            "Shop charging, USB and mobile cables for your everyday devices. Find quality cables for charging and data transfer at Eliteo.",
    },

    powerbanks: {
        title: "Power Banks in Pakistan | Buy Portable Chargers - Eliteo",
        description:
            "Shop power banks and portable chargers online in Pakistan at Eliteo. Find convenient charging solutions for smartphones and other devices.",
        heading: "Power Banks in Pakistan",
        intro:
            "Stay powered wherever you go with portable power banks. Explore power banks and charging solutions online in Pakistan at Eliteo.",
    },

    handsfree: {
        title: "Handsfree in Pakistan | Buy Handsfree Online - Eliteo",
        description:
            "Shop handsfree and wired audio accessories online in Pakistan at Eliteo. Discover quality handsfree options for calls, music and everyday use.",
        heading: "Handsfree in Pakistan",
        intro:
            "Shop handsfree for calls, music and everyday listening. Explore wired audio accessories online in Pakistan at Eliteo.",
    },

    smartwatches: {
        title: "Smart Watches in Pakistan | Buy Smartwatch Online - Eliteo",
        description:
            "Shop smart watches online in Pakistan at Eliteo. Explore stylish and feature-packed smartwatches for everyday use at affordable prices.",
        heading: "Smart Watches in Pakistan",
        intro:
            "Explore stylish and feature-packed smartwatches for everyday use. Shop smart watches online in Pakistan at Eliteo.",
    },
};

// ======================================================
// SEO METADATA
// ======================================================

export async function generateMetadata({ params, searchParams }) {
    const { slug } = await params;
    const { company: companySlug } = await searchParams;

    const seo = categorySEO[slug];
    const categoryName = categoryMap[slug];

    if (!seo || !categoryName) {
        return {
            title: "Category Not Found | Eliteo",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    let title = seo.title;
    let description = seo.description;

    if (companySlug) {
        await connectDB();

        const company = await Company.findOne({
            slug: companySlug,
            isActive: true,
        })
            .select("name slug")
            .lean();

        if (company) {
            title = `${company.name} ${categoryName} in Pakistan | Eliteo`;

            description = `Shop ${company.name} ${categoryName.toLowerCase()} online in Pakistan at Eliteo. Explore quality ${categoryName.toLowerCase()} from ${company.name} at great prices.`;
        }
    }

    const canonicalUrl = `${baseUrl}/category/${slug}`;

    return {
        title,
        description,

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
            title,
            description,
            url: canonicalUrl,
            siteName: "Eliteo",
            type: "website",
            locale: "en_PK",

            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: `${categoryName} - Eliteo`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },
    };
}

// ======================================================
// CATEGORY PAGE
// ======================================================

export default async function CategoryPage({
    params,
    searchParams,
}) {
    const { slug } = await params;
    const { company: companySlug } = await searchParams;

    const categoryName = categoryMap[slug];
    const seo = categorySEO[slug];

    // ==================================================
    // INVALID CATEGORY
    // ==================================================

    if (!categoryName || !seo) {
        notFound();
    }

    await connectDB();

    // ==================================================
    // COMPANY
    // ==================================================

    let company = null;

    if (companySlug) {
        company = await Company.findOne({
            slug: companySlug,
            isActive: true,
        })
            .select("name slug logo")
            .lean();

        if (!company) {
            notFound();
        }
    }

    // ==================================================
    // PRODUCT QUERY
    // ==================================================

    const productQuery = {
        category: categoryName,
        isActive: true,
    };

    if (company) {
        productQuery.company = company._id;
    }

    // ==================================================
    // PRODUCTS
    // ==================================================

    const products = await Product.find(productQuery)
        .populate({
            path: "company",
            select: "name slug logo",
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

        sellerId: product.sellerId
            ? product.sellerId.toString()
            : null,

        company:
            product.company &&
            typeof product.company === "object"
                ? {
                      _id: product.company._id.toString(),
                      name: product.company.name || "",
                      slug: product.company.slug || "",
                      logo: product.company.logo || "",
                  }
                : null,

        createdAt: product.createdAt
            ? product.createdAt.toISOString()
            : null,

        updatedAt: product.updatedAt
            ? product.updatedAt.toISOString()
            : null,
    }));

    // ==================================================
    // CANONICAL URL
    // ==================================================

    const canonicalUrl = `${baseUrl}/category/${slug}`;

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
    // CATEGORY SCHEMA
    // ==================================================

    const categorySchema = {
        "@context": "https://schema.org",

        "@type": "CollectionPage",

        name: company
            ? `${company.name} ${categoryName} in Pakistan`
            : seo.heading,

        description: company
            ? `Explore ${company.name} ${categoryName.toLowerCase()} online in Pakistan at Eliteo.`
            : seo.description,

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

                    url: `${baseUrl}/product/${product.slug}`,

                    name: product.name,
                })),
        },
    };

    // ==================================================
    // RENDER
    // ==================================================

    return (
        <>
            {/* ==================================================
                BREADCRUMB SCHEMA
            ================================================== */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        breadcrumbSchema
                    ),
                }}
            />

            {/* ==================================================
                CATEGORY SCHEMA
            ================================================== */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        categorySchema
                    ),
                }}
            />

            <Navbar />

            <main className="min-h-screen bg-[#fafafa]">

                {/* ==================================================
                    CATEGORY HEADER
                ================================================== */}

                <section className="border-b border-gray-100 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                        {/* BREADCRUMB */}

                        <nav
                            aria-label="Breadcrumb"
                            className="pt-6"
                        >
                            <ol className="flex items-center text-sm text-gray-400">

                                <li>
                                    <Link
                                        href="/"
                                        className="transition hover:text-gray-700"
                                    >
                                        Home
                                    </Link>
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
                                    {company
                                        ? company.name
                                        : categoryName}
                                </li>

                            </ol>
                        </nav>

                        {/* HEADING */}

                        <div className="py-10 sm:py-14">

                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                                Eliteo Collection
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                {company
                                    ? `${company.name} ${categoryName} in Pakistan`
                                    : seo.heading}
                            </h1>

                            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-500 sm:text-base">
                                {company
                                    ? `Explore ${company.name} ${categoryName.toLowerCase()} available online in Pakistan at Eliteo.`
                                    : seo.intro}
                            </p>

                        </div>
                    </div>
                </section>

                {/* ==================================================
                    PRODUCTS
                ================================================== */}

                <CategoryProducts
                    products={serializedProducts}
                    categoryName={categoryName}
                />

                {/* ==================================================
                    SEO CONTENT
                ================================================== */}

                <section className="border-t border-gray-100 bg-white">
                    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

                        <h2 className="text-2xl font-semibold text-gray-900">
                            {company
                                ? `${company.name} ${categoryName} Online in Pakistan`
                                : `${categoryName} Online in Pakistan`}
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                            Explore Eliteo collection of{" "}
                            {company
                                ? `${company.name} ${categoryName.toLowerCase()}`
                                : categoryName.toLowerCase()}{" "}
                            available online in Pakistan. Browse
                            quality products for everyday use,
                            modern designs and convenient
                            technology.
                        </p>

                        <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                            Browse our latest products, compare
                            available options and find the right{" "}
                            {categoryName.toLowerCase()} for your
                            needs. Eliteo makes it easy to discover
                            mobile and technology accessories online.
                        </p>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}