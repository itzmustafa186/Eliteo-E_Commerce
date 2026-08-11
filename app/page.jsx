import connectDB from "@/config/db";
import Product from "@/models/product";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import FeaturedProduct from "@/components/FeaturedProduct";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import Carousel from "@/models/Carousel";

export const revalidate = 60;

export default async function Home() {
  await connectDB();

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const products = (
    await Product.find({
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean()
  ).map((product) => ({
    ...product,
    _id: product._id.toString(),
  }));

  // ==========================================
  // FETCH ACTIVE CAROUSELS
  // ==========================================

  const carousels = (
    await Carousel.find({
      isActive: true,
    })
      .sort({ order: 1 })
      .lean()
  ).map((carousel) => ({
    ...carousel,
    _id: carousel._id.toString(),
  }));

  return (
    <>
      <Navbar />

      <HeaderSlider carousels={carousels} />

      <div className="px-6 md:px-16 lg:px-32">
        <HomeProducts products={products} />

        <FeaturedProduct />

        <Banner />

        <NewsLetter />
      </div>

      <Footer />
    </>
  );
}