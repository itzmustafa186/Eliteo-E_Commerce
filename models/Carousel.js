import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    image: {
      type: String,
      required: true,
    },

    buttonText: {
      type: String,
      default: "Shop Now",
      trim: true,
    },

    buttonLink: {
      type: String,
      default: "/all-products",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Carousel =
  mongoose.models.Carousel ||
  mongoose.model("Carousel", carouselSchema);

export default Carousel;