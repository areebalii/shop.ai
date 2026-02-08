import { v2 as cloudinary } from 'cloudinary'

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
      secure: true
    })
  } catch (error) {
    console.error("Cloudinary Configuration Failed:", error.message);
  }
}
export default connectCloudinary;