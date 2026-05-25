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
const allowedOrigins = [
    'https://shop-ai-ui.vercel.app', 
    'http://localhost:5173',
    'http://localhost:5174',        
    'http://localhost:3000'          
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Add this if you plan on using cookies or sessions
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