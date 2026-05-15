import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
};

export const genToken = (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); //s, m

    console.log(token);

    res.cookie("userCookie", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    });
  } catch (error) {
    throw error;
  }
};

export const getotptoken = (user, res) => {
  try {
    const payload = {
      id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "10m",
    }); //s, m

    console.log(token);

    res.cookie("otpToken", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 10,
    });
  } catch (error) {
    throw error;
  }
};
