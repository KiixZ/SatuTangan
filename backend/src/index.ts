import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import databaseService from "./services/databaseService";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middlewares/errorMiddleware";
import { logger } from "./utils/logger";
import campaignService from "./services/campaignService";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Request logging middleware
app.use(requestLogger);

// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: [
      // Production domains
      "https://satutangan.my.id",
      "http://satutangan.my.id",
      "https://admin.satutangan.my.id",
      "http://admin.satutangan.my.id",
      "https://api.satutangan.my.id",
      "http://api.satutangan.my.id",
      // Development localhost
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
const uploadSubDirs = ["banners", "campaigns", "profiles", "verifications"];

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  logger.info(`Created uploads directory at ${uploadsDir}`);
}

// Create subdirectories
uploadSubDirs.forEach((subDir) => {
  const subDirPath = path.join(uploadsDir, subDir);
  if (!fs.existsSync(subDirPath)) {
    fs.mkdirSync(subDirPath, { recursive: true });
    logger.info(`Created uploads subdirectory at ${subDirPath}`);
  }
});

// Static files - serve with proper headers and aggressive caching
app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "7d", // Cache for 7 days
    etag: true, // Enable ETag for conditional requests
    lastModified: true, // Enable Last-Modified header
    immutable: true, // Tell browser the file will never change
    setHeaders: (res, filePath) => {
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
      res.set("Access-Control-Allow-Origin", "*");

      // More aggressive caching for banner images
      if (filePath.includes("/banners/")) {
        res.set("Cache-Control", "public, max-age=604800, immutable"); // 7 days
      } else {
        res.set("Cache-Control", "public, max-age=86400"); // 1 day for other uploads
      }
    },
  }),
);

// Health check
app.get("/health", async (_req, res) => {
  const dbConnected = await databaseService.testConnection();
  res.json({
    status: "ok",
    message: "Server is running",
    database: dbConnected ? "connected" : "disconnected",
  });
});

// Routes
import authRoutes from "./routes/authRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import donationRoutes from "./routes/donationRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import userRoutes from "./routes/userRoutes";
import withdrawalRoutes from "./routes/withdrawalRoutes";
import reportRoutes from "./routes/reportRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import contentRoutes from "./routes/contentRoutes";
import prayerRoutes from "./routes/prayerRoutes";
import contactRoutes from "./routes/contactRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await databaseService.testConnection();
    if (dbConnected) {
      logger.info("Database connected successfully");
    } else {
      logger.warn("Database connection failed");
    }

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);

      // Start campaign expiration checker (every 60 seconds)
      setInterval(async () => {
        try {
          const updatedCount = await campaignService.checkAndCompleteExpiredCampaigns();
          if (updatedCount > 0) {
            logger.info(`Auto-completed ${updatedCount} expired campaigns`);
          }
        } catch (error) {
          logger.error("Error checking expired campaigns", error);
        }
      }, 60000);
      logger.info("Campaign expiration checker started");
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Promise Rejection", reason);
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", error);
  // Exit process as the application is in an undefined state
  process.exit(1);
});

startServer();

export default app;
