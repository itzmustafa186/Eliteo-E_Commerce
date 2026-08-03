import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        // Null if guest
        userId: {
            type: String,
            default: null,
        },

        // Guest or logged-in
        isGuest: {
            type: Boolean,
            default: false,
        },

        // Customer Information
        customer: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
        },

        // Delivery Address
        address: {
            country: {
                type: String,
                default: "Pakistan",
            },
            city: {
                type: String,
                required: true,
            },
            area: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true,
            },
            apartment: {
                type: String,
                default: "",
            },
            postalCode: {
                type: String,
                default: "",
            },
            notes: {
                type: String,
                default: "",
            },
        },

        // Ordered Products
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],

        // Prices
        subtotal: {
            type: Number,
            required: true,
        },

        shipping: {
            type: Number,
            default: 250,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        // Payment
        paymentMethod: {
            type: String,
            enum: [
                "Cash on Delivery",
                "JazzCash",
                "EasyPaisa",
                "Card",
            ],
            default: "Cash on Delivery",
        },

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
            ],
            default: "Pending",
        },

        // Order Status
        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },
        date:{
            type:Number,
            required:true
        }

    },
    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.order ||
    mongoose.model("order", orderSchema);

export default Order;