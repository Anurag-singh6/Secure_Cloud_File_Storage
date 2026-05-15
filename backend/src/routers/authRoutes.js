import express from "express";
import { register, login, UserLogout, UserForgetPassword, UserVerfiyOtp, UserGenOTP } from "../controllers/authController.js";
import {otprotect} from "../middlewares/authmiddleware.js"

const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.get("/logout", UserLogout);

router.post("/forgetPassword", otprotect, UserForgetPassword);
router.post("/verifyOtp", UserVerfiyOtp);
router.post("/genOtp", UserGenOTP);


export default router;
