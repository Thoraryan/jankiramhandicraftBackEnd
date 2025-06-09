import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ["active", "inactive"], // Example values
        },
    },
    { timestamps: true }
);

export const Banner = mongoose.model("Banner", bannerSchema);
