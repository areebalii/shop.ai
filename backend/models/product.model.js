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

// Existing pre-save hook (keep it)
productSchema.pre('save', function () {
    const discountVal = Number(this.discount) || 0;
    const originalPrice = Number(this.price) || 0;
    this.discountedPrice = discountVal > 0
        ? Math.round(originalPrice - (originalPrice * discountVal / 100))
        : originalPrice;
});

// Add this: fires on findOneAndUpdate
productSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    const discount = Number(update?.discount ?? update?.$set?.discount);
    const price = Number(update?.price ?? update?.$set?.price);

    if (!isNaN(discount) && !isNaN(price)) {
        const discountedPrice = discount > 0
            ? Math.round(price - (price * discount / 100))
            : price;

        if (update.$set) {
            update.$set.discountedPrice = discountedPrice;
        } else {
            update.discountedPrice = discountedPrice;
        }
    }
});


export default mongoose.model('Product', productSchema);

