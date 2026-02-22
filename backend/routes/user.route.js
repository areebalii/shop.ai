import express from "express";
import { adminLogin, loginUser, registerUser, googleAuth } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)
userRouter.post("/google", googleAuth);

export default userRouter;