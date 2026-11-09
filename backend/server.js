
import express from "express";
import cors from "cors";

import scannerRoutes from "./routes/scanner.js";
import urlScannerRoutes from "./routes/urlScanner.js";
import messageScannerRoutes from "./routes/messageScanner.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Code Scanner API
app.use("/api/scanner", scannerRoutes);

// URL Scanner API
app.use("/api/url-scanner", urlScannerRoutes);

// Message Checker API
app.use("/api/message-scanner", messageScannerRoutes);

// Code Scanner Health Check
app.get("/api/scanner/health", (req, res) => {
  res.json({
    success: true,
    service: "Test Trap Advanced SAST",
    version: "2.0",
    status: "running",
  });
});

// URL Scanner Health Check
app.get("/api/url-scanner/health", (req, res) => {
  res.json({
    success: true,
    service: "Test Trap URL Scanner",
    version: "1.0",
    status: "running",
  });
});

// Message Checker Health Check
app.get("/api/message-scanner/health", (req, res) => {
  res.json({
    success: true,
    service: "Test Trap Message Checker",
    version: "1.0",
    status: "running",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Test Trap backend running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Test Trap API is running 🚀",
  });
});