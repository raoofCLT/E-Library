import express from "express"
import { checkIn, checkOut, createBook, deleteBook, getBook, getBooks, trendingBooks, updateBook } from "../controllers/bookController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/getbook/:id",protectRoute,getBook)
//router.get("/getbook/:username",protectRoute,getBook)
router.get("/getbooks",protectRoute,getBooks)
router.get("/trending",protectRoute,trendingBooks)
router.post("/create",protectRoute,createBook)
router.put("/update/:id",protectRoute,updateBook)
router.post("/checkin/:id",protectRoute,checkIn)
router.post("/checkout/:id",protectRoute,checkOut)
router.delete("/delete/:id",protectRoute,deleteBook)

export default router