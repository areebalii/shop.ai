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
import chatbot from './routes/chatbot.js'
import chatRouter from './routes/chatRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

// Database & Cloudinary Connection
connectDB()
connectCloudinary()

// 1. CORS must run before all other middleware and routes
const allowedOrigins = [
    'https://shop-ai-ui.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
]

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        // Return false instead of throwing new Error()
        return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'] // 'token' is critical for cart/auth headers
}))

// 2. Body parser
app.use(express.json())

// 3. API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/chat', chatRouter)

app.get('/', (req, res) => {
    res.send('API is running!')
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;