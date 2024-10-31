import express from "express"
import { checkIn, createBook, deleteBook, getBook, getBooks, updateBook } from "../controllers/bookController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/getbook/:id",protectRoute,getBook)
router.get("/getbooks",protectRoute,getBooks)
router.post("/create",protectRoute,createBook)
router.post("/update/:id",protectRoute,updateBook)
router.post("/checkIn/:id",protectRoute,checkIn)
router.delete("/delete/:id",protectRoute,deleteBook)

export default router