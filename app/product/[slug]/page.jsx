import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";
import Review from "@/models/review";

const baseUrl = "https://eliteo.pk";

// ===============================
// SEO Metadata for Every Product
// ===============================
export async function generateMetadata({ params }) {
    const { slug } = await params;

    await connectDB();

    const product = await Product.findOne({
        slug,
        isActive: true,
    })
        .select("name description images category brand slug")
        .lean();

    if (!product) {
        return {
            title: "Product Not Found | Eliteo",
            description: "The requested product could not be found.",
        };
    }

    const description =
        product.description?.replace(/<[^>]*>/g, "").slice(0, 155) ||
        `Buy ${product.name} online in Pakistan at Eliteo.`;

    return {
        title: `Buy ${product.name} Online in Pakistan`,

        description,

        keywords: [
            product.name,
            product.brand,
            product.category,
            `${product.name} Pakistan`,
            `buy ${product.name} online`,
            "Eliteo",
        ].filter(Boolean),

        alternates: {
            canonical: `${baseUrl}/product/${product.slug}`,
        },

        openGraph: {
            title: `${product.name} | Eliteo`,
            description,
            url: `${baseUrl}/product/${product.slug}`,
            siteName: "Eliteo",
            type: "website",

            images: product.images?.[0]
                ? [
                      {
                          url: product.images[0],
                          width: 800,
                          height: 800,
                          alt: product.name,
                      },
                  ]
                : [],
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}


// ===============================
// Product Page
// ===============================
export default async function ProductPage({ params }) {

    const { slug } = await params;

    await connectDB();

    const productData = await Product.findOne({
        slug: slug,
        isActive: true,
    })
        .select(
            "name description images offerPrice price category brand slug rating reviewCount stock"
        )
        .lean();

    if (!productData) {
        notFound();
    }

    // ===============================
    // Related Products
    // ===============================

    const featuredProducts = await Product.find({
        category: productData.category,
        _id: { $ne: productData._id },
        isActive: true,
    })
        .limit(5)
        .lean();

    // ===============================
    // Reviews
    // ===============================

    const reviews = (
        await Review.find({
            productId: productData._id,
        })
            .sort({
                createdAt: -1,
            })
            .lean()
    ).map((review) => ({
        ...review,
        _id: review._id.toString(),
        productId: review.productId.toString(),
    }));

    return (
        <ProductDetailsClient
            productData={{
                ...productData,
                _id: productData._id.toString(),
            }}
            featuredProducts={featuredProducts.map((product) => ({
                ...product,
                _id: product._id.toString(),
            }))}
            reviews={reviews}
        />
    );
}