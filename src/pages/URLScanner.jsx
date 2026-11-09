
import { useState } from "react";

import {
  Globe,
  Link as LinkIcon,
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  LoaderCircle,
} from "lucide-react";

import { logActivity } from "../utils/activityLogger";
import "./URLScanner.css";
const API_URL = "https://test-trap.onrender.com/api/url-scanner/scan";


export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyzeURL = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Backend returned invalid JSON. HTTP ${response.status}`
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "URL analysis failed."
        );
      }

      // IMPORTANT: Backend returns verdict directly in data
      const scanResult = data;

      setResult(scanResult);

      // Activity logging should not break URL scanning
      try {
        await logActivity({
          activity_type: "url_scan",
          title: "URL Scan",
          description: `Analyzed ${url.trim()}`,
          status:
            scanResult.verdict === "LIKELY_PHISHING"
              ? "threat_detected"
              : "completed",
          metadata: {
            url: url.trim(),
            verdict: scanResult.verdict,
          },
        });
      } catch (activityError) {
        console.warn(
          "Activity logging failed:",
          activityError
        );
      }
    } catch (err) {
      console.error("URL Scanner Error:", err);

      setError(
        err.message ||
          "Unable to connect to URL Scanner backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const getVerdictDetails = (verdict) => {
    switch (verdict) {
      case "VERIFIED_OFFICIAL":
        return {
          icon: ShieldCheck,
          title: "Verified Official Domain",
          className: "verified",
          description:
            "This domain matches a configured official domain.",
        };

      case "LIKELY_PHISHING":
        return {
          icon: ShieldAlert,
          title: "Likely Phishing",
          className: "danger",
          description:
            "This URL contains indicators of possible phishing.",
        };

      case "SUSPICIOUS":
        return {
          icon: AlertTriangle,
          title: "Suspicious URL",
          className: "warning",
          description:
            "This URL contains suspicious characteristics.",
        };

      default:
        return {
          icon: AlertTriangle,
          title: "Unverified Domain",
          className: "unknown",
          description:
            "This domain could not be verified as official.",
        };
    }
  };

  const verdictDetails = result
    ? getVerdictDetails(result.verdict)
    : null;

  const VerdictIcon = verdictDetails?.icon;

  return (
    <div className="url-scanner-page">
      <div className="url-scanner-container">

        {/* Header */}
        <header className="url-scanner-header">
          <div className="url-header-icon">
            <Globe size={28} />
          </div>

          <div>
            <h1>URL Scanner</h1>
            <p>
              Detect suspicious websites, fake domains,
              and brand impersonation.
            </p>
          </div>
        </header>

        {/* Scanner Card */}
        <section className="url-scanner-card">
          <div className="scanner-card-header">
            <div className="scanner-card-icon">
              <LinkIcon size={24} />
            </div>

            <div>
              <h2>Analyze a Website</h2>
              <p>
                Enter a URL to check its domain authenticity.
              </p>
            </div>
          </div>

          <form onSubmit={analyzeURL}>
            <label htmlFor="website-url">
              Website URL
            </label>

            <div className="url-input-wrapper">
              <LinkIcon size={20} />

              <input
                id="website-url"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="analyze-url-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="spin"
                    size={20}
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Analyze URL
                </>
              )}
            </button>
          </form>

          <div className="scanner-note">
            <ShieldCheck size={17} />
            <span>
              Domain analysis only. This tool does not visit
              the submitted website.
            </span>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="url-error-box">
            <AlertTriangle size={20} />
            <div>
              <strong>Scan Failed</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && verdictDetails && (
          <section
            className={`url-result-card ${verdictDetails.className}`}
          >
            <div className="result-header">
              <div className="result-icon">
                <VerdictIcon size={26} />
              </div>

              <div>
                <h2>{verdictDetails.title}</h2>
                <p>{verdictDetails.description}</p>
              </div>
            </div>

            <div className="result-url">
              <span>Analyzed URL</span>
              <p>{result.url || url}</p>
            </div>

            <div className="result-verdict">
              <span>Verdict</span>
              <strong>{result.verdict}</strong>
            </div>

            <div className="result-detail">
              <span>Risk Level</span>
              <strong>{result.riskLevel}</strong>
            </div>

            <div className="result-detail">
              <span>Risk Score</span>
              <strong>{result.score}/100</strong>
            </div>

            {result.hostname && (
              <div className="result-detail">
                <span>Hostname</span>
                <strong>{result.hostname}</strong>
              </div>
            )}

            {result.flags?.length > 0 && (
              <div className="result-reasons">
                <h3>Analysis Findings</h3>

                <ul>
                  {result.flags.map((flag, index) => (
                    <li key={index}>{flag}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.message && (
              <p className="result-message">
                {result.message}
              </p>
            )}

            <div className="result-disclaimer">
              This result is based on URL analysis rules.
              It is not a guarantee that the website is safe
              or malicious.
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
