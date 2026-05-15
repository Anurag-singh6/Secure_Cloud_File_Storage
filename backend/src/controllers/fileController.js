import File from "../models/File.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import crypto from "crypto";

export const uploadFile = async (req, res, next) => {
  try {
    const { filename, fileType, encryptionKey, encryptionIV } = req.body;
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      const error = new Error("File is required");
      error.statuscode = 400;
      return next(error);
    }

    if (!filename || !fileType || !encryptionKey || !encryptionIV) {
      const error = new Error("Filename, file type, encryption key, and IV are required");
      error.statuscode = 400;
      return next(error);
    }

    // Get user to check storage quota
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    // Check if file size exceeds available storage
    const availableStorage = user.totalStorage - user.usedStorage;
    if (file.size > availableStorage) {
      const error = new Error(
        `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds available storage (${(availableStorage / (1024 * 1024)).toFixed(2)} MB). Total storage: 2GB`
      );
      error.statuscode = 413; // Payload Too Large
      return next(error);
    }

    // Convert buffer to base64 data URI for Cloudinary
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "secureZilla/Files",
      resource_type: "auto",
      public_id: `file_${Date.now()}`,
    });

    // Save file metadata to database with encryption info
    const fileData = new File({
      filename,
      fileType,
      fileSize: file.size,
      owner: userId,
      encryptionKey,
      encryptionIV,
      cloudPath: result.public_id,
    });

    await fileData.save();

    // Update user's used storage
    user.usedStorage += file.size;
    await user.save();

    res.status(201).json({
      message: "File uploaded successfully",
      data: {
        _id: fileData._id,
        filename: fileData.filename,
        fileType: fileData.fileType,
        fileSize: fileData.fileSize,
        url: result.secure_url,
        uploadedAt: fileData.uploadedAt,
      },
    });
  } catch (error) {
    console.error("File upload error:", error);
    next(error);
  }
};

export const getUserFiles = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const files = await File.find({ owner: userId }).sort({ uploadedAt: -1 });

    if (!files || files.length === 0) {
      return res.status(200).json({
        message: "No files found",
        data: [],
      });
    }

    // Get Cloudinary URLs for all files
    const filesWithUrls = files.map((file) => {
      const cloudinaryUrl = cloudinary.url(file.cloudPath, {
        secure: true,
      });

      return {
        _id: file._id,
        filename: file.filename,
        fileType: file.fileType,
        fileSize: file.fileSize,
        url: cloudinaryUrl,
        uploadedAt: file.uploadedAt,
      };
    });

    res.status(200).json({
      message: "Files retrieved successfully",
      data: filesWithUrls,
    });
  } catch (error) {
    console.error("Get files error:", error);
    next(error);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;

    // Validate ObjectId format
    if (!fileId.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error("Invalid file ID format");
      error.statuscode = 400;
      return next(error);
    }

    const file = await File.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statuscode = 404;
      return next(error);
    }

    if (file.owner.toString() !== userId.toString()) {
      const error = new Error("Unauthorized to delete this file");
      error.statuscode = 403;
      return next(error);
    }

    // Delete from Cloudinary (don't fail if this fails)
    try {
      if (file.cloudPath) {
        await cloudinary.uploader.destroy(file.cloudPath);
        console.log(`Cloudinary file deleted: ${file.cloudPath}`);
      }
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await File.findByIdAndDelete(fileId);

    // Update user's used storage
    const user = await User.findById(userId);
    if (user) {
      user.usedStorage = Math.max(0, user.usedStorage - file.fileSize);
      await user.save();
    }

    res.status(200).json({
      message: "File deleted successfully",
      data: { fileId },
    });
  } catch (error) {
    console.error("Delete file error:", error);
    const err = new Error(error.message || "Failed to delete file");
    err.statuscode = 500;
    next(err);
  }
};

export const downloadFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;

    const file = await File.findById(fileId);

    if (!file) {
      const error = new Error("File not found");
      error.statuscode = 404;
      return next(error);
    }

    if (
      file.owner.toString() !== userId.toString() &&
      !file.accessRoles.includes(req.user.role)
    ) {
      const error = new Error("Unauthorized to download this file");
      error.statuscode = 403;
      return next(error);
    }

    // Generate Cloudinary download URL
    const downloadUrl = cloudinary.url(file.cloudPath, {
      secure: true,
      resource_type: "auto",
    });

    res.status(200).json({
      message: "Download URL generated",
      data: {
        url: downloadUrl,
        filename: file.filename,
        encryptionKey: file.encryptionKey,
        encryptionIV: file.encryptionIV,
      },
    });
  } catch (error) {
    console.error("Download file error:", error);
    next(error);
  }
};

export const getStorageInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statuscode = 404;
      return next(error);
    }

    const usedStorageGB = user.usedStorage / (1024 * 1024 * 1024);
    const totalStorageGB = user.totalStorage / (1024 * 1024 * 1024);
    const availableStorageGB =
      (user.totalStorage - user.usedStorage) / (1024 * 1024 * 1024);
    const usagePercentage =
      ((user.usedStorage / user.totalStorage) * 100).toFixed(2);

    res.status(200).json({
      message: "Storage info retrieved successfully",
      data: {
        usedStorage: user.usedStorage,
        totalStorage: user.totalStorage,
        availableStorage: user.totalStorage - user.usedStorage,
        usedStorageGB: usedStorageGB.toFixed(2),
        totalStorageGB: totalStorageGB.toFixed(2),
        availableStorageGB: availableStorageGB.toFixed(2),
        usagePercentage: usagePercentage,
      },
    });
  } catch (error) {
    console.error("Get storage info error:", error);
    next(error);
  }
};
