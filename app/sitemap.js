import connectDB from "@/config/db";
import Product from "@/models/product";

export default async function sitemap() {
    const baseUrl = "https://eliteo.pk";

    await connectDB();

    const products = await Product.find({ isActive: true })
        .select("slug")
        .lean();

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
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

        ...productUrls,
    ];
}