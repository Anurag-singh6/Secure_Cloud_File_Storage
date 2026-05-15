import express from "express";
import { UserChangePhoto, UserResetPassword } from "../controllers/userController.js";
import { Protect } from "../middlewares/authmiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.patch("/changePhoto", Protect, upload.single("image"), UserChangePhoto);
router.patch("/resetpassword", Protect, UserResetPassword);

export default router;
