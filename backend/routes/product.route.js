import express from "express";
import { addProduct, listProducts, removeProduct, singleProduct, addReview, updateReview, deleteReview } from "../controllers/product.controller.js";
import upload from "../middleware/multer.middleware.js";
import { adminAuth } from "../middleware/adminAuth.middleware.js";
import { authUser } from "../middleware/Auth.middleware.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]), addProduct)
productRouter.post("/remove", adminAuth, removeProduct)
productRouter.post("/single", singleProduct)
productRouter.get("/list", listProducts)
productRouter.post("/review", authUser, addReview)
productRouter.post('/update-review', authUser, updateReview);
productRouter.post('/delete-review', authUser, deleteReview);

export default productRouter;