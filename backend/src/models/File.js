import mongoose from "mongoose";

const fileSchema = mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encryptionKey: {
      type: String,
      required: true,
    },
    encryptionIV: {
      type: String,
      required: true,
    },
    cloudPath: {
      type: String,
      required: true,
    },
    accessRoles: {
      type: [String],
      enum: ["Faculty", "Student"],
      default: ["Faculty", "Student"],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;
