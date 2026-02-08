import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/user.route.js'
import productRouter from './routes/product.route.js'


// App Config
const app = express()
const port = process.env.PORT || 4000

// Database Connection
connectDB()
// connect cloudinary
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})