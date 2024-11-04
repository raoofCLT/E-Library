import express from "express";
import connectDB from "./db/mongodbConnect.js";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import {v2 as cloudinary} from "cloudinary"

dotenv.config();
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () =>  console.log(`Server is running on ${PORT}`));
