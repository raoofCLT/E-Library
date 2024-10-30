import express from "express"
import { createBook, updateBook } from "../controllers/bookController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.post("/create",protectRoute,createBook)
router.post("/update/:id",protectRoute,updateBook)

export default router