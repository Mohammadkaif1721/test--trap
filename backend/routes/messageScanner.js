
import express from "express";
import { analyzeMessage } from "../services/messageAnalysis.js";

const router = express.Router();

router.post("/scan", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a message to analyze.",
      });
    }

    if (message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message is too short to analyze.",
      });
    }

    if (message.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Message exceeds the 10000 character limit.",
      });
    }

    const result = analyzeMessage(message);

    return res.json({
      success: true,
      originalMessage: message,
      ...result,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Message Scanner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Message analysis failed.",
    });
  }
});

export default router;
