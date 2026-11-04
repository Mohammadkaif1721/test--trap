
import express from "express";
import { analyzeUrl } from "../services/urlAnalysis.js";

const router = express.Router();

router.post("/scan", (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const result = analyzeUrl(url);

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("URL Scanner error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "URL analysis failed",
    });
  }
});

export default router;
