import express from "express"
import { createBook, deleteBook, updateBook } from "../controllers/bookController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.post("/create",protectRoute,createBook)
router.post("/update/:id",protectRoute,updateBook)
router.delete("/delete/:id",protectRoute,deleteBook)

export default router