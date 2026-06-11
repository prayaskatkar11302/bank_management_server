import express from "express"
import { userLogin, userRegister, getProfile, updateProfile } from "../Controllers/User.js";
import auth from "../Middleware/auth.js";
import upload from "../Middleware/upload.js";
const router = express.Router()


router.post("/register",  upload.single("profileImage"), userRegister)
router.post("/login", userLogin)
router.get("/profile",auth, getProfile)
router.put("/update-profile", auth, upload.single("profileImage"), updateProfile)

export default router