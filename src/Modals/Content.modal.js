import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    key: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
}, {
    timestamps: true,
});

const Content = mongoose.model("Content", contentSchema);

export default Content;
