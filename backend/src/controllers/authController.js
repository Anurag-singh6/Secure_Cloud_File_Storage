import User from "../models/User.js";
import bcrypt from "bcrypt";
import { genToken, getotptoken } from "../utils/authToken.js";
import { sendotpemail } from "../utils/emailservice.js";
import OTP from "../models/otpmodel.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, phoneno, password, role } = req.body;

    if (!name || !email || !phoneno || !password || !role) {
      const error = new Error("All Fields Required");
      error.statuscode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email }); //check if email already exists
    if (existingUser) {
      const error = new Error("Email Already Registered");
      error.statuscode = 409;
      return next(error);
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    //save photo
    const photoURL = `https://placehold.co/600x400?text=${name
      .charAt(0)
      .toUpperCase()}`;
    const photo = {
      url: photoURL,
    };

    //check new user
    const NewUser = await User.create({
      name,
      email,
      phoneno,
      password: hashpassword,
      role,
      photo,
    });
    console.log(NewUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All Fields Required");
      error.statuscode = 400;
      return next(error);
    }
    //Find user
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Email not registered");
      error.statuscode = 401;
      return next(error);
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("User Not Authorized");
      error.statuscode = 401;
      return next(error);
    }

    // Check if MFA is enabled
    if (user.mfaEnabled) {
      return res.status(200).json({
        message: "Password verified, MFA required",
        data: {
          requiresMFA: true,
          email: user.email,
          userId: user._id,
        },
      });
    }

    //generate JWT if MFA is not enabled
    genToken(user, res);

    res.status(200).json({ message: "Login Sucessfully", data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserLogout = async (req, res, next) => {
  try {
    res.clearCookie("secureZilla_User");
    res.status(200).json({ message: "Logout Successfull...!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserForgetPassword = async (req, res, next) => {
  try {
    const { newpassword } = req.body;
    const currentuser = req.user;

    if (!newpassword) {
      const error = new Error("All fields Required");
      error.statuscode = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(newpassword, salt);

    currentuser.password = hashpass;
    await currentuser.save();

    res
      .status(200)
      .clearCookie("otpToken")
      .json({ message: "Password Changed. Please Login again" });
  } catch (error) {
    next(error);
  }
};

export const UserVerfiyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      const error = new Error("All Fields Required");
      error.statuscode = 400;
      return next(error);
    }

    //check db otp
    const existinguserOtp = await OTP.findOne({ email });
    if (!existinguserOtp) {
      const error = new Error("OTP Match error. Please Retry");
      error.statuscode = 401;
      return next(error);
    }

    //otp verfiy with db

    const isverfiy = await bcrypt.compare(otp, existinguserOtp.otp);
    if (!isverfiy) {
      const error = new Error("OTP Match error. Please Retry");
      error.statuscode = 401;
      return next(error);
    }
    await existinguserOtp.deleteOne();

    const existinguser = await User.findOne({ email });
    if (!existinguser) {
      const error = new Error("Email not registered");
      error.statuscode = 401;
      return next(error);
    }

    //token genration
    getotptoken(existinguser, res);

    //send message to frontend
    res.status(200).json({ message: "OTP verfied successfull" });
  } catch (error) {
    next(error);
  }
};

export const UserGenOTP = async (req, res, next) => {
  try {
    //fetch data from frontend
    const { email } = req.body;

    if (!email) {
      const error = new Error("All fields required");
      error.statuscode = 400;
      return next(error);
    }

    //check user registed or not
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("Email not registered");
      error.statuscode = 401;
      return next(error);
    }

    const otp = Math.floor(Math.random() * 10000000).toString();
    console.log(typeof otp);

    //encrypt the otp
    const salt = await bcrypt.genSalt(10);
    const hashotp = await bcrypt.hash(otp, salt);

    console.log(hashotp);

    await OTP.create({
      email,
      otp: hashotp,
      createdAt: new Date(),
    });

    await sendotpemail(email, otp);

    res.status(200).json({ message: "OTP send on registered email" });
  } catch (error) {
    next(error);
  }
};
