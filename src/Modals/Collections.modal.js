import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    }
}, {
    timestamps: true,
});

const Collection = mongoose.model("Collection", CollectionSchema);

export { Collection };
