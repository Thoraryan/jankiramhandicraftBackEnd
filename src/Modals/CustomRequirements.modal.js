// models/CustomRequirement.js
import mongoose from "mongoose";

const customRequirementSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        mobile_no: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export const CustomRequirement = mongoose.model(
    "CustomRequirement",
    customRequirementSchema
);
