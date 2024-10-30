import express from "express";
import connectDB from "./db/mongodbConnect.js";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () =>  console.log(`Server is running on ${PORT}`));
