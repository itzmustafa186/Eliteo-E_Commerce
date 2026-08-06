import Product from "@/models/product";
import connectDB from "@/config/db";

import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function AllProducts() {
    await connectDB();

    const products = await Product.find({})
        .sort({ date: -1 })
        .lean();
    console.log("Products Count:", products.length);
    console.log(products);
    return (
        <>
            <Navbar />

            <div className="px-6 md:px-16 lg:px-32">
                <div className="pt-12">
                    <p className="text-2xl font-medium">
                        All Products
                    </p>

                    <div className="w-16 h-0.5 bg-orange-600 rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mt-12 pb-14">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id.toString()}
                            product={JSON.parse(JSON.stringify(product))}
                        />
                    ))}
                </div>
            </div>

            <Footer />
        </>
    );
}