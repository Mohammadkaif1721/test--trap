
import express from "express";
import multer from "multer";
import AdmZip from "adm-zip";
import path from "path";

import { scanSecrets } from "../scanners/secrets.js";
import { scanJavaScript } from "../scanners/javascriptScanner.js";
import { scanPython } from "../scanners/pythonScanner.js";
import { getSeverityCounts } from "../scanners/utils.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const SUPPORTED_EXTENSIONS = new Set([
  ".js", ".jsx", ".mjs", ".cjs",
  ".ts", ".tsx",
  ".py",
]);

const IGNORED_DIRS = new Set([
  "node_modules",
  "vendor",
  "dist",
  "build",
  ".git",
  ".next",
  "coverage",
  "__pycache__",
]);

function isIgnoredPath(filePath) {
  const segments = filePath.split(/[\\/]/);

  return segments.some((segment) =>
    IGNORED_DIRS.has(segment.toLowerCase())
  );
}

function analyzeFile(fileName, code) {
  const extension = path.extname(fileName).toLowerCase();

  let findings = [];

  findings.push(...scanSecrets(code));

  if ([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"].includes(extension)) {
    findings.push(...scanJavaScript(code));
  }

  if (extension === ".py") {
    findings.push(...scanPython(code));
  }

  findings = findings.map((finding) => ({
    ...finding,
    file: fileName,
  }));

  return findings;
}

function createSummary(findings) {
  const severity = getSeverityCounts(findings);

  return {
    total: findings.length,
    ...severity,
  };
}

// Single source code scan
router.post("/scan", upload.single("file"), (req, res) => {
  try {
    const code = req.body.code || req.file?.buffer.toString("utf8");

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Provide source code or upload a file.",
      });
    }

    const fileName = req.file?.originalname || "source.js";
    const findings = analyzeFile(fileName, code);

    return res.json({
      success: true,
      scanner: "Test Trap Advanced SAST",
      version: "2.0",
      summary: createSummary(findings),
      findings,
    });
  } catch (error) {
    console.error("Single scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to scan source code.",
    });
  }
});

// ZIP scan
router.post("/scan-zip", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Upload a ZIP file.",
      });
    }

    const zip = new AdmZip(req.file.buffer);
    const entries = zip.getEntries();

    if (entries.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "ZIP contains too many entries (maximum 1000).",
      });
    }

    const findings = [];
    const scannedFiles = [];
    const skippedFiles = [];

    let totalExtractedBytes = 0;
    const MAX_FILE_SIZE = 1024 * 1024;
    const MAX_TOTAL_SIZE = 30 * 1024 * 1024;

    for (const entry of entries) {
      if (entry.isDirectory) continue;

      const entryName = entry.entryName.replace(/\\/g, "/");

      // Reject path traversal.
      if (
        entryName.startsWith("/") ||
        entryName.split("/").includes("..")
      ) {
        skippedFiles.push({
          file: entryName,
          reason: "Unsafe ZIP path",
        });
        continue;
      }

      if (isIgnoredPath(entryName)) {
        skippedFiles.push({
          file: entryName,
          reason: "Ignored dependency/generated directory",
        });
        continue;
      }

      const extension = path.extname(entryName).toLowerCase();

      if (!SUPPORTED_EXTENSIONS.has(extension)) {
        skippedFiles.push({
          file: entryName,
          reason: "Unsupported file type",
        });
        continue;
      }

      if (entry.header.size > MAX_FILE_SIZE) {
        skippedFiles.push({
          file: entryName,
          reason: "File exceeds 1 MB",
        });
        continue;
      }

      totalExtractedBytes += entry.header.size;

      if (totalExtractedBytes > MAX_TOTAL_SIZE) {
        skippedFiles.push({
          file: entryName,
          reason: "ZIP extraction limit reached",
        });
        break;
      }

      const buffer = entry.getData();

      if (buffer.includes(0)) {
        skippedFiles.push({
          file: entryName,
          reason: "Binary file",
        });
        continue;
      }

      const code = buffer.toString("utf8");

      try {
        const fileFindings = analyzeFile(entryName, code);

        findings.push(...fileFindings);
        scannedFiles.push(entryName);
      } catch {
        skippedFiles.push({
          file: entryName,
          reason: "Analysis failed",
        });
      }
    }

    return res.json({
      success: true,
      scanner: "Test Trap Advanced SAST",
      version: "2.0",
      summary: createSummary(findings),
      scannedFiles,
      skippedFiles,
      findings,
    });
  } catch (error) {
    console.error("ZIP scan error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to scan ZIP file.",
    });
  }
});

export default router;
