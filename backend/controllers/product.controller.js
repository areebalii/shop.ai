import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "../utils/apiResponse.js";
import Product from "../models/product.model.js";

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