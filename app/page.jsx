import connectDB from "@/config/db";
import Product from "@/models/product";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import FeaturedProduct from "@/components/FeaturedProduct";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";

export default async function Home() {
  await connectDB();

  const products = (await Product.find({})
    .sort({ date: -1 })
    .lean()).map((product) => ({
      ...product,
      _id: product._id.toString(),
    }));

  return (
    <>
      <Navbar />

      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />

        <HomeProducts products={products} />

        <FeaturedProduct />

        <Banner />

        <NewsLetter />
      </div>

      <Footer />
    </>
  );
}