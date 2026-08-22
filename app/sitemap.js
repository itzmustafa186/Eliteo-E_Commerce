import connectDB from "@/config/db";
import Product from "@/models/product";

export default async function sitemap() {
    const baseUrl = "https://www.eliteo.pk";

    await connectDB();

    const products = await Product.find({
        isActive: true,
        slug: { $exists: true, $ne: "" },
    })
        .select("slug updatedAt")
        .lean();

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt
            ? new Date(product.updatedAt)
            : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    const categories = [
        "headphones",
        "earbuds",
        "chargers",
        "powerbanks",
        "cables",
        "smartwatches",
    ];

    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },

        {
            url: `${baseUrl}/all-products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },

        ...categoryUrls,
        ...productUrls,
    ];
}