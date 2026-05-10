import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/user.route.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import orderRouter from './routes/order.route.js'
import wishlistRouter from './routes/wishlist.route.js'
// import chatRouter from './routes/chatRoute.js'
import chatbot from './routes/chatbot.js'


// App Config
const app = express()
const port = process.env.PORT || 4000

// Database Connection
connectDB()
// connect cloudinary
connectCloudinary()

// middlewares
app.use(express.json())
// app.use(cors())
app.use(cors({
    origin: 'https://shop-ai-ui.vercel.app/'
}));

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use('/api/wishlist', wishlistRouter)
// app.use('/api/chat', chatRouter)
app.use('/api/chatbot', chatbot)

app.get('/', (req, res) => {
    res.send('API is running!')
})

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})