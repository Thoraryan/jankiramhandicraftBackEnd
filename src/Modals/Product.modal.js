import mongoose from "mongoose";

// Product Schema
const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },

  category: {
    type: String, 
    required: true,
  },

  subCategory: {
    type: String, 
    required: true,
  },

  images: {
    type: [String], 
    validate: [arrayLimit, 'Maximum of 2 images allowed'],
  },

  description: {
    type: String, 
  },

  materialDetails: {
    type: String,
  },

  dimensionsAndWeight: {
    type: String,
  },

  pricePerUnit: {
    type: Number,
    required: true,
  },

  bulkPricing: {
    type: String, 
  },

  minimumOrderQuantity: {
    type: Number,
    required: true,
  },

  customizationOptions: {
    type: String,
  },

  shippingDetails: {
    type: String,
  },

  certifications: {
    type: String,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  }

}, {
  timestamps: true
});

function arrayLimit(val) {
  return val.length <= 2;
}

export const Product = mongoose.model("Product", ProductSchema);
