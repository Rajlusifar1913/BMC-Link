import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import passport from "./config/passport.js";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import paymentRoutes from "./modules/payments/payment.routes.js";

const app = express();

app.set("trust proxy", 1);

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Logger
app.use(morgan("dev"));

// Body Parsers
app.use(
  "/api/v1/payments/razorpay/webhook",
  express.raw({ type: "application/json" }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(
  "/storage/public",
  express.static(path.join(process.cwd(), "storage/public")),
);
app.use(cookieParser());

app.use(passport.initialize());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "BMC-Link API Docs",
  }),
);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// API Routes
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1", router);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
