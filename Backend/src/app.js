import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import passport from "./config/passport.js";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.set("trust proxy", 1);

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true
    })
);

// Logger
app.use(morgan("dev"));

// Body Parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(passport.initialize());

// API Routes
app.use("/api/v1", router);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use(errorHandler);

export default app;