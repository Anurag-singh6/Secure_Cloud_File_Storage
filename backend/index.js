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
app.use(
  cors({
    origin: [process.env.REACT_APP_API_URL || "http://localhost:5173" || "http://localhost:5174"],
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
  try{
    const res = await cloudinary.api.ping();
    console.log("Cloudinary api is working ",res);
  }catch(error){
    console.error("Error in connecting cloudinary api ",error);
  }
});
