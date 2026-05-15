import express from "express";
import {UserContact} from "../controllers/publicController.js";

const router = express.Router();
router.post("/contact", UserContact);

export default router;