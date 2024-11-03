import express from "express";
import { loginUser, signupUser,logoutUser,getUsers, getUser, updateUser, deleteUser, searchUser } from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";


const router = express.Router()


router.get("/getuser/:id",protectRoute,getUser)
router.get("/searchuser/:username",protectRoute,searchUser)
router.get("/getusers",protectRoute,getUsers)
router.post("/signup",signupUser)
router.post("/login",loginUser)
router.put("/update/:id",protectRoute,updateUser)
router.post("/logout",logoutUser)
router.delete("/delete/:id",protectRoute,deleteUser)

export default router