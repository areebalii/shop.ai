import userModel from "../models/user.model.js";

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    let wishlistData = userData.wishlistData;

    if (!wishlistData.includes(itemId)) {
      wishlistData.push(itemId);
    }

    await userModel.findByIdAndUpdate(userId, { wishlistData });
    res.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    let wishlistData = userData.wishlistData.filter(id => id !== itemId);

    await userModel.findByIdAndUpdate(userId, { wishlistData });
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

// Get user wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    res.json({ success: true, wishlistData: userData.wishlistData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export { addToWishlist, removeFromWishlist, getUserWishlist };