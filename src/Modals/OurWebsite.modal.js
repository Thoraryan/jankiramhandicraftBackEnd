import mongoose from "mongoose";

const OurWebsiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    video: {
        type: String, // URL or file path to the video
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
});

export const OurWebsite = mongoose.model('OurWebsite', OurWebsiteSchema);
