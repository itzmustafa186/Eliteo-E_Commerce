import connectDB from "@/config/db";
import Product from "@/models/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryProducts from "@/components/CategoryProducts";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }) {
    const { slug } = await params;

    // Convert URL slug → DB category
    const categoryMap = {
        earbuds: "Earbuds",
        headphones: "Headphones",
        chargers: "Chargers",
        cables: "Cables",
        powerbanks: "Powerbanks",
        handsfree: "Handsfree",
        smartwatches: "Smartwatches",
    };

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