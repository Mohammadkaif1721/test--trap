
import express from "express";
import { parse } from "tldts";

const router = express.Router();

// Known official domains
const verifiedBrands = {
  google: ["google.com"],
  amazon: ["amazon.in", "amazon.com"],
  microsoft: ["microsoft.com"],
  paypal: ["paypal.com"],
  apple: ["apple.com"],
  instagram: ["instagram.com"],
  facebook: ["facebook.com"],
  netflix: ["netflix.com"],
  flipkart: ["flipkart.com"],
  whatsapp: ["whatsapp.com"],
};

// Suspicious URL keywords
const suspiciousKeywords = [
  "login",
  "verify",
  "verification",
  "secure",
  "account",
  "update",
  "password",
  "banking",
  "confirm",
  "signin",
];

// POST /api/url-scanner/scan
router.post("/scan", (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL",
      });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`
      );
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format",
      });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const domainInfo = parse(hostname);
    const domain = domainInfo.domain;
    const protocol = parsedUrl.protocol;

    const flags = [];
    let score = 0;

    // IP address instead of domain
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      flags.push("URL uses an IP address instead of a domain");
      score += 35;
    }

    // HTTP instead of HTTPS
    if (protocol === "http:") {
      flags.push("Website uses HTTP instead of HTTPS");
      score += 15;
    }

    // Suspicious words in URL
    const lowerUrl = url.toLowerCase();

    suspiciousKeywords.forEach((keyword) => {
      if (lowerUrl.includes(keyword)) {
        flags.push(`Suspicious keyword detected: ${keyword}`);
        score += 5;
      }
    });

    // Brand impersonation / lookalike detection
    for (const [brand, domains] of Object.entries(verifiedBrands)) {
      const brandMentioned = hostname.includes(brand);

      const isOfficial = domains.some(
        (officialDomain) =>
          hostname === officialDomain ||
          hostname.endsWith(`.${officialDomain}`)
      );

      if (brandMentioned && !isOfficial) {
        flags.push(`Possible ${brand} impersonation`);
        score += 40;
      }
    }

    // Excessive subdomains
    if (hostname.split(".").length > 4) {
      flags.push("Excessive subdomains detected");
      score += 15;
    }

    // Long URL
    if (url.length > 100) {
      flags.push("Unusually long URL");
      score += 10;
    }

    // Determine verdict
    let verdict;
    let riskLevel;

    if (score >= 50) {
      verdict = "LIKELY_PHISHING";
      riskLevel = "HIGH";
    } else if (score >= 20) {
      verdict = "SUSPICIOUS";
      riskLevel = "MEDIUM";
    } else {
      verdict = "UNVERIFIED";
      riskLevel = "LOW";
    }

    // Exact official domain check
    for (const domains of Object.values(verifiedBrands)) {
      if (domains.includes(domain)) {
        verdict = "VERIFIED_OFFICIAL";
        riskLevel = "LOW";
        break;
      }
    }

    return res.json({
      success: true,
      url,
      hostname,
      verdict,
      riskLevel,
      score: Math.min(score, 100),
      flags,
      scannedAt: new Date().toISOString(),
      message:
        verdict === "VERIFIED_OFFICIAL"
          ? "Domain matches a configured official brand domain."
          : verdict === "LIKELY_PHISHING"
          ? "Multiple phishing indicators detected."
          : verdict === "SUSPICIOUS"
          ? "Potentially suspicious URL detected."
          : "No major indicators detected, but the URL is not verified.",
    });
  } catch (error) {
    console.error("URL Scanner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal URL Scanner error",
    });
  }
});

export default router;
