import express from "express"
import { checkIn, checkOut, createBook, deleteBook, getBook, getBooks, popularBooks, suggestedBooks, updateBook } from "../controllers/bookController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/getbook/:id",protectRoute,getBook)
router.get("/getbooks",protectRoute,getBooks)
router.get("/popular",protectRoute,popularBooks)
router.get("/suggested",protectRoute,suggestedBooks)
router.post("/create",protectRoute,createBook)
router.put("/update/:id",protectRoute,updateBook)
router.post("/checkIn/:id",protectRoute,checkIn)
router.post("/checkOut/:id",protectRoute,checkOut)
router.delete("/delete/:id",protectRoute,deleteBook)

export default router