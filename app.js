import express from "express";
import connectDB from "./db/mongodbConnect.js";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.listen(PORT, () =>  console.log(`Server is running on ${PORT}`));
