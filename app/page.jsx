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
import CategorySection from "@/components/CategorySection";
import HeadlineSection from "@/components/HeadlineSection";

export const revalidate = 60;

const baseUrl = "https://www.eliteo.pk";

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


  // ==========================================
  // WEBSITE SCHEMA
  // ==========================================

  const websiteSchema = {
    "@context": "https://schema.org",

    "@type": "WebSite",

    name: "Eliteo",

    url: baseUrl,

    description:
      "Eliteo is an online store for mobile and tech accessories in Pakistan.",

    publisher: {
      "@type": "Organization",
      name: "Eliteo",
      url: baseUrl,
    },
  };


  // ==========================================
  // ORGANIZATION SCHEMA
  // ==========================================

  const organizationSchema = {
    "@context": "https://schema.org",

    "@type": "Organization",

    name: "Eliteo",

    url: baseUrl,

    logo: `${baseUrl}/logo.png`,

    description:
      "Eliteo offers mobile and technology accessories including earbuds, headphones, chargers, power banks, cables, handsfree and smartwatches in Pakistan.",

    sameAs: [
      // Add your official social media URLs here later
      // "https://www.instagram.com/eliteo",
      // "https://www.facebook.com/eliteo",
    ],
  };


  return (
    <>
      {/* ==========================================
          WEBSITE SCHEMA
      ========================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />


      {/* ==========================================
          ORGANIZATION SCHEMA
      ========================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />


      <Navbar />

      <HeadlineSection />

      <HeaderSlider carousels={carousels} />

      <CategorySection />

      <div>
        <HomeProducts products={products} />

        <FeaturedProduct />

        <Banner />

        <NewsLetter />
      </div>

      <Footer />
    </>
  );
}