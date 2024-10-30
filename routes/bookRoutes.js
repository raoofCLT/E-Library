import express from "express"
import { createBook } from "../controllers/bookController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.post("/create",protectRoute,createBook)

export default router