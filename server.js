import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import authRoutes from './routes/Auth.js'
import productRoutes from './routes/Product.js'
import orderRoutes from './routes/Order.js'
import cartRoutes from './routes/Cart.js'
import brandRoutes from './routes/Brand.js'
import categoryRoutes from './routes/Category.js'
import userRoutes from './routes/User.js'
import addressRoutes from './routes/Address.js'
import reviewRoutes from './routes/Review.js'
import wishlistRoutes from './routes/Wishlist.js'
import contactRoutes from "./routes/contact.js";
import { connectToDB } from "./database/db.js";
import payfastRoutes from "./routes/payfast.js";
//PORT

const port = process.env.PORT || 3000;

//server init
const server = express();

//db connection

connectToDB();

//middleware
server.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  exposedHeaders: ['X-Total-Count'],
  methods: ['GET','POST','PATCH','DELETE']
}));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(morgan("dev"));

//routes middleware

server.use('/auth',authRoutes)
server.use('/users',userRoutes)
server.use('/products',productRoutes)
server.use('/orders',orderRoutes)
server.use('/cart',cartRoutes)
server.use('/brands',brandRoutes)
server.use('/categories',categoryRoutes)
server.use('/address',addressRoutes)
server.use('/reviews',reviewRoutes)
server.use('/wishlist',wishlistRoutes)
server.use("/api/contact", contactRoutes);
server.use("/payfast", payfastRoutes);
//Health check
server.get("/",(req,res)=>{
    res.status(200).json({message:'running'})
})

server.listen(port,()=>{
    console.log(`server [STARTED] ~ http://localhost:${port}`);
})
