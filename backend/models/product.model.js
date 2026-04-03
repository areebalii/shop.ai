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
    discount: {
        type: Number,
        default: 0
    }, // Store as 13 for 13%
    discountedPrice: {
        type: Number
    },      // Calculated value
    date: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Pre-save middleware to automatically calculate discountedPrice
productSchema.pre('save', async function () {
    const discountVal = Number(this.discount) || 0;
    const originalPrice = Number(this.price) || 0;

    if (discountVal > 0) {
        // Round to 2 decimal places to avoid long floating numbers like 87.000000001
        const calc = originalPrice - (originalPrice * discountVal / 100);
        this.discountedPrice = Math.round(calc);
    } else {
        this.discountedPrice = originalPrice;
    }
});

export default mongoose.model('Product', productSchema);

