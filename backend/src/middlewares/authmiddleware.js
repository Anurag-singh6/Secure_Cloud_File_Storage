import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const Protect = async (req, resizeBy, next) => {
  try {
    const cook = req.cookies.userCookie;
    console.log("Token recevied in cookies : ", cook);

    const ver = jwt.verify(cook, process.env.JWT_SECRET);
    console.log(ver);
    if (!ver) {
      const error = new Error("Unauthorized! Login again");
      error.statuscode = 401;
      return next(error);
    }
    const verfieduser = await User.findById(ver.id);
    if (!verfieduser) {
      const error = new Error("Unauthorized Login again");
      error.statuscode = 401;
      return next(error);
    }

    req.user = verfieduser;

    next();
  } catch (error) {
    next(error);
  }
};

export const FacultyProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "Faculty") {
      const error = new Error("Unauthorized only faculty can do this.");
      error.statuscode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const StudentProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      const error = new Error("Unauthorized Only Student can do this.");
      error.statuscode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const otprotect = async (req, res, next) => {
  try {
    const token = req.cookies.otpToken;
    console.log("Token recevied in cookies: ", token);

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    if (!decode) {
      const error = new Error("Unauthorized! Please try again");
      error.statuscode = 401;
      return next(error);
    }

    const verfieduser = await User.findById(decode.id);
    if (!verfieduser) {
      const error = new Error("Unauthorized! Please try again");
      error.statuscode = 401;
      return next(error);
    }

    req.user = verfieduser;
    next();
  } catch (error) {
    next(error);
  }
};
