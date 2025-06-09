import mongoose from "mongoose";

const productRequestQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
    },
    mobile_no: {
      type: Number,
      required: true,
      unique: false,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "responded", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const ProductRequestQuery = mongoose.model(
  "ProductRequestQuery",
  productRequestQuerySchema
);
