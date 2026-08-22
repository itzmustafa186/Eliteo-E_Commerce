import connectDB from "@/config/db";
import Product from "@/models/product";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";
import Review from "@/models/review";

const baseUrl = "https://www.eliteo.pk";

// ======================================================
// SEO METADATA
// ======================================================

export async function generateMetadata({ params }) {
    const { slug } = await params;

    await connectDB();

    const product = await Product.findOne({
        slug,
        isActive: true,
    })
        .select(
            "name description images category brand slug offerPrice price stock rating reviewCount sku"
        )
        .lean();

    if (!product) {
        return {
            title: "Product Not Found | Eliteo",
            description: "The requested product could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    // Remove HTML from description
    const cleanDescription =
        product.description
            ?.replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim() || "";

    const description =
        cleanDescription.length > 155
            ? `${cleanDescription.slice(0, 152)}...`
            : cleanDescription ||
              `Buy ${product.name} online in Pakistan at Eliteo.`;

    const productUrl = `${baseUrl}/product/${product.slug}`;

    const imageUrl = product.images?.[0] || `${baseUrl}/og-image.jpg`;

    return {
        title: `Buy ${product.name} Online in Pakistan`,

        description,

        alternates: {
            canonical: productUrl,
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
            title: `${product.name} | Eliteo`,

            description,

            url: productUrl,

            siteName: "Eliteo",

            type: "website",

            locale: "en_PK",

            images: [
                {
                    url: imageUrl,
                    width: 800,
                    height: 800,
                    alt: product.name,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",

            title: `${product.name} | Eliteo`,

            description,

            images: [imageUrl],
        },
    };
}


// ======================================================
// PRODUCT PAGE
// ======================================================

export default async function ProductPage({ params }) {

    const { slug } = await params;

    await connectDB();

    const productData = await Product.findOne({
        slug,
        isActive: true,
    })
        .select(
            "name description images offerPrice price category brand slug rating reviewCount stock sku"
        )
        .lean();

    if (!productData) {
        notFound();
    }


    // ==================================================
    // RELATED PRODUCTS
    // ==================================================

    const featuredProducts = await Product.find({
        category: productData.category,

        _id: {
            $ne: productData._id,
        },

        isActive: true,
    })
        .limit(5)
        .lean();


    // ==================================================
    // REVIEWS
    // ==================================================

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


    // ==================================================
    // PRODUCT JSON-LD
    // ==================================================

    const productUrl =
        `${baseUrl}/product/${productData.slug}`;

    const imageUrl =
        productData.images?.[0] ||
        `${baseUrl}/og-image.jpg`;

    const price =
        productData.offerPrice ||
        productData.price;

    const cleanDescription =
        productData.description
            ?.replace(/<[^>]*>/g, "")
            .replace(/\s+/g, " ")
            .trim() ||
        `Buy ${productData.name} online in Pakistan at Eliteo.`;


    const productSchema = {

        "@context": "https://schema.org",

        "@type": "Product",

        name: productData.name,

        description: cleanDescription,

        image: productData.images || [imageUrl],

        url: productUrl,

        brand: productData.brand
            ? {
                "@type": "Brand",
                name: productData.brand,
            }
            : undefined,

        category: productData.category,

        sku: productData.sku || undefined,

        offers: {
            "@type": "Offer",

            url: productUrl,

            priceCurrency: "PKR",

            price: price,

            availability:
                productData.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",

            itemCondition:
                "https://schema.org/NewCondition",

            seller: {
                "@type": "Organization",
                name: "Eliteo",
                url: baseUrl,
            },
        },

        aggregateRating:
            productData.reviewCount > 0 &&
            productData.rating > 0
                ? {
                    "@type": "AggregateRating",

                    ratingValue:
                        productData.rating,

                    reviewCount:
                        productData.reviewCount,

                    bestRating: 5,

                    worstRating: 1,
                }
                : undefined,
    };


    // Remove undefined values
    const cleanSchema = JSON.parse(
        JSON.stringify(productSchema)
    );


    return (
        <>

            {/* =========================================
                PRODUCT STRUCTURED DATA
            ========================================= */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(cleanSchema),
                }}
            />


            {/* =========================================
                PRODUCT UI
            ========================================= */}

            <ProductDetailsClient

                productData={{
                    ...productData,

                    _id:
                        productData._id.toString(),
                }}

                featuredProducts={featuredProducts.map(
                    (product) => ({
                        ...product,

                        _id:
                            product._id.toString(),
                    })
                )}

                reviews={reviews}
            />

        </>
    );
}