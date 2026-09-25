import Product from "@/models/product";
import Company from "@/models/Company";
import connectDB from "@/config/db";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

export default async function AllProducts() {
    await connectDB();

    const products = await Product.find({ isActive: true })
        .populate("company", "name logo")
        .sort({ createdAt: -1 })
        .lean();

    console.log("Products Count:", products.length);

    return (
        <>
            <Navbar />

            <main className="px-6 md:px-16 lg:px-32">
                <div className="pt-12">
                    <p className="text-2xl font-medium">
                        All Products
                    </p>

                    <div className="mt-2 h-0.5 w-16 rounded-full bg-yellow-400" />
                </div>

                {products.length > 0 ? (
                    <div className="mt-12 grid grid-cols-2 gap-6 pb-14 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
                        {products.map((product) => (
                            <div key={product._id.toString()}>
                                <ProductCard
                                    product={JSON.parse(
                                        JSON.stringify(product)
                                    )}
                                />

                           
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[400px] items-center justify-center">
                        <p className="text-gray-500">
                            No products available.
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}