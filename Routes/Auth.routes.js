import express from "express"
import { loginUser, logoutUser, registerUser, resetPassword, sendOtp, verifyOtp } from "../Controllers/Auth.Controllers.js"
import { upload } from "../Middlewares/Multer.js"
// import { registerUser, loginUser, getCurrentUser } from "../Controllers/Auth.controller"

const authrouter = express.Router()

authrouter.post("/register", upload.single("profileimage"), registerUser)
authrouter.post("/login", loginUser)
authrouter.post("/logout", logoutUser)
authrouter.post("/send-otp", sendOtp)
authrouter.post("/verify-otp", verifyOtp)
authrouter.post("/reset", resetPassword)

export default authrouter