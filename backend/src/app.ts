import express, { Application } from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "@config/env";
import authRoutes from "@routes/auth.routes";
import companyRoutes from "@routes/company.routes";
import jobRoutes from "@routes/job.routes";
import studentRoutes from "@routes/student.routes";
import { errorHandler, notFoundHandler } from "@middleware/error.middleware";
import { sanitizeRequest } from "@middleware/sanitize.middleware";

const app: Application = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitizeRequest); // sanitizes req.body/params against XSS payloads

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Global rate limiter (auth routes have their own stricter one)
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/students", studentRoutes);
// Future routes will be mounted here as features are built:
// app.use("/api/applications", applicationRoutes);
// app.use("/api/admin", adminRoutes);

// Serve uploaded resumes. In production this should be swapped for
// Cloudinary URLs (see src/middleware/upload.middleware.ts) rather than
// serving local disk files directly.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --- Error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
