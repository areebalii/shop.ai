import User from "../models/user.model.js";


// add product to user cart
export const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await User.findById(userId);
    const cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json(new ApiResponse(200, null, "Product added to cart"));

  } catch (error) {
    console.log(error)
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}

// update cart
export const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await User.findById(userId);
    const cartData = await userData.cartData;
    cartData[itemId][size] = quantity;

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json(new ApiResponse(200, null, "Cart updated successfully"));

  } catch (error) {
    console.log(error)
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}

// get user cart
export const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId);
    const cartData = await userData.cartData;
    res.status(200).json(new ApiResponse(200, cartData, "Cart fetched successfully"));

  } catch (error) {
    console.log(error)
    res.status(500).json(new ApiResponse(500, null, "Internal server error"));
  }
}