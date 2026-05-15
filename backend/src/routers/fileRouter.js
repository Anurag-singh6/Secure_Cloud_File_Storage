import express from "express";
import multer from "multer";
import { Protect } from "../middlewares/authmiddleware.js";
import {
  uploadFile,
  getUserFiles,
  deleteFile,
  downloadFile,
  getStorageInfo,
} from "../controllers/fileController.js";

const router = express.Router();
const upload = multer();

// Upload file
router.post("/upload", Protect, upload.single("file"), uploadFile);

// Get all user files
router.get("/", Protect, getUserFiles);

// Get storage info
router.get("/storage/info", Protect, getStorageInfo);

// Get download URL (must come before /:fileId to avoid route conflicts)
router.get("/download/:fileId", Protect, downloadFile);

// Delete file
router.delete("/:fileId", Protect, deleteFile);

export default router;
