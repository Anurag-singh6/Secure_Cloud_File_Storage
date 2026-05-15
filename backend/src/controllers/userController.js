import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import bcrypt from "bcrypt";

export const UserChangePhoto = async (req, res, next) => {
  try {
    const currentuser = req.user;
    const dp = req.file;
    console.log("file: ", req.file);

    if (!dp) {
      const error = new Error("Profile Picture Required");
      error.statuscode(400);
      return next(error);
    }
    if (currentuser.photo.publicID) {
      //delete the old photo from cloudinary
      await cloudinary.uploader.destroy(currentuser.photo.publicID);
    }

    //upload the photo from cloudinary
    const b64 = Buffer.from(dp.buffer).toString("base64");
    console.log(b64.slice(0, 100));
    const dataURI = `data:${dp.mimetype};base64,${b64}`;
    console.log("data", dataURI.slice(0, 100));

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "secureZilla/User",
      width: 500,
      height: 500,
      crop: "fill",
    });

    console.log("Image upload successfully ", result);
    currentuser.photo.url = result.secure_url;
    currentuser.photo.publicID = result.public_id;

    await currentuser.save();

    res.status(200).json({ message: "Photo Updated", data: currentuser });
  } catch (error) {
    next(error);
  }
};

export const UserResetPassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const currentuser = req.user;

    if (!oldpassword || !newpassword) {
      const error = new Error("All fields required");
      error.statuscode = 400;
      return next(error);
    }

    const isverified = await bcrypt.compare(oldpassword, currentuser.password);
    if (!isverified) {
      const error = new Error("Old password didn't match");
      error.statuscode = 401;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(newpassword, salt);

    currentuser.password = hashpass;
    await currentuser.save();

    res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    next(error);
  }
};
