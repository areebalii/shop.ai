import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "../utils/apiResponse.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

// function to add products
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0]
    const image2 = req.files.image2 && req.files.image2[0]
    const image3 = req.files.image3 && req.files.image3[0]
    const image4 = req.files.image4 && req.files.image4[0]

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image", folder: "ecommerce/products" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
      image: imagesUrl,
      date: Date.now(),
    };
    const product = new Product(productData);
    await product.save();


    res.status(201).json(new ApiResponse(201, product, "Product added successfully"));
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// function for list products
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// function to get single product info
export const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json(new ApiResponse(400, null, "Product ID is required"));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {

  }
}

// function to remove product details
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json(new ApiResponse(400, null, "Product ID is required"));
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json(new ApiResponse(404, null, "Product not found"));
    }

    return res.status(200).json(new ApiResponse(200, null, "Product removed successfully"));

  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// add review
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;

    // 1. Use userModel (matches your import at top)
    const user = await User.findById(userId);

    // 2. Use Product (matches your import 'import Product from...')
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const newReview = {
      userId,
      userName: user.name,
      rating: Number(rating),
      comment,
      date: Date.now()
    };

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(r => r.userId === userId);

    if (alreadyReviewed) {
      return res.json({ success: false, message: "Product already reviewed by you" });
    }

    product.reviews.push(newReview);

    // Calculate Average
    const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
    product.averageRating = totalRating / product.reviews.length;

    await product.save();
    res.json({ success: true, message: "Review added successfully!" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;
    const product = await Product.findById(productId);

    const reviewIndex = product.reviews.findIndex(r => r.userId === userId);

    if (reviewIndex > -1) {
      // Update the specific review fields
      product.reviews[reviewIndex].rating = Number(rating);
      product.reviews[reviewIndex].comment = comment;
      product.reviews[reviewIndex].date = Date.now();

      // Recalculate Average
      const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
      product.averageRating = totalRating / product.reviews.length;

      await product.save();
      res.json({ success: true, message: "Review updated successfully" });
    } else {
      res.json({ success: false, message: "Review not found or unauthorized" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    const product = await Product.findById(productId);

    // Filter out the review belonging to this user
    product.reviews = product.reviews.filter(r => r.userId !== userId);

    // Recalculate Average (handle division by zero if no reviews left)
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((acc, item) => item.rating + acc, 0);
      product.averageRating = totalRating / product.reviews.length;
    } else {
      product.averageRating = 0;
    }

    await product.save();
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, subCategory, sizes, bestSeller } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    // 1. Get existing images from the database
    let currentImages = [...product.image];

    // 2. Map through the 4 possible image slots
    const imageKeys = ['image1', 'image2', 'image3', 'image4'];

    for (let i = 0; i < imageKeys.length; i++) {
      const file = req.files[imageKeys[i]] && req.files[imageKeys[i]][0];

      if (file) {
        // If a new file was uploaded for this slot, upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: 'image',
          folder: "ecommerce/products"
        });

        // Replace the specific index in the array
        currentImages[i] = result.secure_url;
      }
      // If no file was uploaded for this slot, currentImages[i] remains as it was
    }

    // 3. Clean up the array (remove any null/undefined if you want a tight array)
    const updatedImagesUrl = currentImages.filter(img => img !== null && img !== undefined);

    const updateData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: updatedImagesUrl
    };

    await Product.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: "Product Updated Successfully" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const categoryData = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.amount, 0);

    // 4. Sales Trend (Line Chart - Last 7 Days) - FIXED VERSION
    const salesData = await Order.aggregate([
      {
        // Step 1: Filter out any orders that don't have a date field
        $match: { date: { $exists: true, $ne: null } }
      },
      {
        // Step 2: Ensure 'date' is a Date object, even if stored as a Timestamp/String
        $addFields: {
          convertedDate: { $toDate: "$date" }
        }
      },
      {
        // Step 3: Now format and group
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$convertedDate" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id": 1 } },
      { $limit: 7 }
    ]);

    const stats = {
      totalProducts,
      totalOrders,
      totalRevenue,
      categoryData,
      salesData
    };

    // Use your ApiResponse class here
    return res.status(200).json(
      new ApiResponse(200, stats, "Stats fetched successfully")
    );

  } catch (error) {
    console.log(error);
    // Ensure you return a standard error format if stats fail
    res.status(500).json({ success: false, message: error.message });
  }
}