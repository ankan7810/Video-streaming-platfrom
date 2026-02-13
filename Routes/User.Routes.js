import express from "express";
import { getcurrentUser, getUserChannelProfile, getWatchHistory, updateAccountDetails } from "../Controllers/User.Controller.js";
import isAuth from "../Middlewares/isAuth.js";
import { upload } from "../Middlewares/Multer.js";

const usserrouter = express.Router();

usserrouter.get("/current",isAuth,getcurrentUser)
usserrouter.get("/channel/:username",isAuth,getUserChannelProfile)
usserrouter.get("/watchHistory", isAuth,getWatchHistory)
usserrouter.get("/updateaccount",isAuth,upload.single("profileimage"),updateAccountDetails)
//views for future work

export default usserrouter;