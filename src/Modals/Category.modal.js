import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Path or URL to image
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
});

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Path or URL to image
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    subcategories: [SubCategorySchema],
}, {
    timestamps: true,
});

export const Category = mongoose.model('Category', CategorySchema);

