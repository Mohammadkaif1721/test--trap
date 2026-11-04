
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import urlScannerRouter from "./routes/urlScanner.js";

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Test Trap Backend is running",
  });
});

// URL Scanner API
app.use("/api/url-scanner", urlScannerRouter);

// Unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Test Trap Backend running at http://localhost:${PORT}`);
  console.log("URL Scanner API: POST /api/url-scanner/scan");
});
