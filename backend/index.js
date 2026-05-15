import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import cloudinary from "./src/config/cloudinary.js";
import AuthRouter from "./src/routers/authRoutes.js";
import UserRouter from "./src/routers/userRouter.js";
import PublicRouter from "./src/routers/publicRouter.js";
import FileRouter from "./src/routers/fileRouter.js";
import MfaRouter from "./src/routers/mfaRouter.js";
import connectdb from "./src/config/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
// log incoming requests and their Origin header to help debug CORS issues
app.use((req, res, next) => {
  console.log("[REQ]", req.method, req.originalUrl, "Origin:", req.headers.origin);
  next();
});
// Build whitelist from env (comma-separated) and include local dev origins
const rawWhitelist = process.env.CORS_WHITELIST || process.env.FRONTEND_URL || process.env.REACT_APP_API_URL || "";
const whitelist = rawWhitelist
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .concat(["http://localhost:5173", "http://localhost:5174"]);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/public", PublicRouter);
app.use("/files", FileRouter);
app.use("/mfa", MfaRouter);

app.get("/", (req, res) => {
  console.log("Server is Running");
  res.json({ message: "server is running" });
});

app.use((err, req, res, next) => {
  const errormess = err.message || "Internal Server Error";
  const statuscode = err.statuscode || 500;

  res.status(statuscode).json({ message: errormess });
});

const port = process.env.PORT || 4500;
app.listen(port, async () => {
  console.log("server started at port ", port);
  connectdb();
  // cloub blob
  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary api is working ", res);
  } catch (error) {
    console.error("Error in connecting cloudinary api ", error);
  }
});
