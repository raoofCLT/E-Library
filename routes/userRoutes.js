import express from "express";
import { loginUser, signupUser,logoutUser,getUsers } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";


const router = express.Router()


router.get("/getusers",protectRoute,getUsers)
router.post("/signup",signupUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)

export default router