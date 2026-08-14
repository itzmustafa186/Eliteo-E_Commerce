import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        sellerId: {
            type: String,
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            index: true,
        },

        subCategory: {
            type: String,
            default: "",
            index: true,
        },

        brand: {
            type: String,
            default: "",
        },

        images: [
            {
                type: String,
                required: true,
            },
        ],

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        offerPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        sku: {
            type: String,
            unique: true,
            sparse: true,
        },

        rating: {
            type: Number,
            default: 0,
        },

        reviewCount: {
            type: Number,
            default: 0,
        },

        sold: {
            type: Number,
            default: 0,
        },

        featured: {
            type: Boolean,
            default: false,
            index: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ createdAt: -1 });

const Product =
    mongoose.models.Product ||
    mongoose.model("Product", productSchema);

export default Product;