import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: Array,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: {
        type: Array,
        required: true
    },
    bestSeller: {
        type: Boolean,
        default: false
    },
    reviews: [
        {
            userId: { type: String, required: true },
            userName: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    date: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);