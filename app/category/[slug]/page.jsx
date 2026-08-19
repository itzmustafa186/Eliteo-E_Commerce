import connectDB from "@/config/db";
import Product from "@/models/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryProducts from "@/components/CategoryProducts";
import { notFound } from "next/navigation";

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
        title: "Earbuds in Pakistan | Wireless Earbuds - Eliteo",
        description:
            "Shop wireless earbuds and TWS earbuds in Pakistan at Eliteo. Discover quality earbuds with great sound, stylish designs and affordable prices.",
        keywords: [
            "earbuds Pakistan",
            "wireless earbuds Pakistan",
            "TWS earbuds Pakistan",
            "buy earbuds online Pakistan",
            "best earbuds Pakistan",
            "Eliteo earbuds",
        ],
    },

    headphones: {
        title: "Headphones in Pakistan | Buy Headphones Online - Eliteo",
        description:
            "Shop headphones online in Pakistan at Eliteo. Explore quality headphones for music, gaming, calls and everyday use at affordable prices.",
        keywords: [
            "headphones Pakistan",
            "headphones online Pakistan",
            "buy headphones Pakistan",
            "wireless headphones Pakistan",
            "gaming headphones Pakistan",
            "Eliteo headphones",
        ],
    },

    chargers: {
        title: "Mobile Chargers in Pakistan | Fast Chargers - Eliteo",
        description:
            "Shop mobile chargers and fast chargers online in Pakistan at Eliteo. Find reliable charging accessories for your smartphones and devices.",
        keywords: [
            "mobile chargers Pakistan",
            "fast charger Pakistan",
            "charger online Pakistan",
            "phone charger Pakistan",
            "buy charger online Pakistan",
            "Eliteo chargers",
        ],
    },

    cables: {
        title: "Mobile Cables in Pakistan | USB & Charging Cables - Eliteo",
        description:
            "Shop USB, charging and mobile cables online in Pakistan at Eliteo. Find quality cables for charging, data transfer and everyday use.",
        keywords: [
            "mobile cables Pakistan",
            "USB cables Pakistan",
            "charging cables Pakistan",
            "USB cable online Pakistan",
            "phone cable Pakistan",
            "Eliteo cables",
        ],
    },

    powerbanks: {
        title: "Power Banks in Pakistan | Portable Chargers - Eliteo",
        description:
            "Shop power banks and portable chargers online in Pakistan at Eliteo. Find convenient charging solutions for smartphones and other devices.",
        keywords: [
            "power banks Pakistan",
            "powerbank Pakistan",
            "portable charger Pakistan",
            "power bank online Pakistan",
            "buy power bank Pakistan",
            "Eliteo power banks",
        ],
    },

    handsfree: {
        title: "Handsfree in Pakistan | Buy Handsfree Online - Eliteo",
        description:
            "Shop handsfree and wired audio accessories online in Pakistan at Eliteo. Discover quality handsfree options for calls, music and everyday use.",
        keywords: [
            "handsfree Pakistan",
            "handsfree online Pakistan",
            "wired handsfree Pakistan",
            "mobile handsfree Pakistan",
            "buy handsfree online Pakistan",
            "Eliteo handsfree",
        ],
    },

    smartwatches: {
        title: "Smart Watches in Pakistan | Buy Smartwatch Online - Eliteo",
        description:
            "Shop smart watches online in Pakistan at Eliteo. Explore stylish and feature-packed smartwatches for everyday use at affordable prices.",
        keywords: [
            "smart watches Pakistan",
            "smartwatch Pakistan",
            "smartwatch online Pakistan",
            "buy smartwatch Pakistan",
            "smart watch price Pakistan",
            "Eliteo smartwatches",
        ],
    },
};

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const seo = categorySEO[slug];

    // Invalid category
    if (!seo || !categoryMap[slug]) {
        return {
            title: "Category Not Found | Eliteo",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const canonicalUrl = `https://eliteo.pk/category/${slug}`;

    return {
        title: seo.title,

        description: seo.description,

        keywords: seo.keywords,

        alternates: {
            canonical: canonicalUrl,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },

        openGraph: {
            title: seo.title,
            description: seo.description,
            url: canonicalUrl,
            siteName: "Eliteo",
            type: "website",
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;

    const categoryName = categoryMap[slug];

    if (!categoryName) {
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

    const serializedProducts = products.map((product) => ({
        ...product,
        _id: product._id.toString(),
        createdAt: product.createdAt?.toISOString(),
        updatedAt: product.updatedAt?.toISOString(),
    }));

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#fafafa]">

                {/* Category Header */}
                <section className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                        {/* Breadcrumb */}
                        <div className="pt-6">
                            <p className="text-sm text-gray-400">
                                Home
                                <span className="mx-2">/</span>
                                {categoryName}
                            </p>
                        </div>

                        {/* Heading */}
                        <div className="py-10 sm:py-14">
                            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-3">
                                Collection
                            </p>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900">
                                {categoryName}
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm sm:text-base text-gray-500">
                                Explore our collection of premium{" "}
                                {categoryName.toLowerCase()}.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products */}
                <CategoryProducts
                    products={serializedProducts}
                    categoryName={categoryName}
                />

            </main>

            <Footer />
        </>
    );
}