
import { useState } from "react";
import { ShieldAlert, ScanSearch, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import "./MessageChecker.css";

export default function MessageChecker() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!message.trim()) {
      setError("Please enter a message to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/message-scanner/scan",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const getVerdict = () => {
    if (result?.verdict === "LIKELY_FRAUD") {
      return {
        label: "Likely Fraud",
        icon: <XCircle />,
        className: "fraud",
      };
    }

    if (result?.verdict === "SUSPICIOUS") {
      return {
        label: "Suspicious Message",
        icon: <AlertTriangle />,
        className: "suspicious",
      };
    }

    return {
      label: "Likely Genuine",
      icon: <CheckCircle />,
      className: "genuine",
    };
  };

  return (
    <div className="message-checker-page">
      <div className="message-checker-header">
        <ShieldAlert size={42} />
        <h1>Message Checker</h1>
        <p>
          Analyze suspicious messages and identify potential scams,
          phishing attempts, and social engineering attacks.
        </p>
      </div>

      <div className="message-checker-card">
        <label htmlFor="message-input">Paste Your Message</label>

        <textarea
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste an SMS, WhatsApp message, email, or suspicious message here..."
          maxLength={10000}
        />

        <div className="message-input-footer">
          <span>{message.length}/10000 characters</span>
          <span>English · Hindi · Hinglish</span>
        </div>

        {error && <p className="message-error">{error}</p>}

        <button
          className="message-scan-btn"
          onClick={handleScan}
          disabled={loading || !message.trim()}
        >
          <ScanSearch size={20} />
          {loading ? "Analyzing Message..." : "Analyze Message"}
        </button>
      </div>

      {result && (
        <div className="message-result-card">
          <h2>Analysis Results</h2>

          <div className={`message-verdict ${getVerdict().className}`}>
            {getVerdict().icon}
            <div>
              <h3>{getVerdict().label}</h3>
              <p>Risk Score: {result.score}/100</p>
            </div>
          </div>

          <div className="message-risk-bar">
            <div
              className={`message-risk-fill ${getVerdict().className}`}
              style={{ width: `${result.score}%` }}
            />
          </div>

          <h3>Detection Findings</h3>

          {result.findings?.length > 0 ? (
            <ul className="message-findings">
              {result.findings.map((finding, index) => (
                <li key={index}>
                  <AlertTriangle size={16} />
                  {finding}
                </li>
              ))}
            </ul>
          ) : (
            <p className="message-no-findings">
              No major scam indicators detected.
            </p>
          )}

          <div className="message-detected-urls">
            <h3>Detected URLs</h3>
            {result.urls?.length > 0 ? (
              result.urls.map((url, index) => (
                <p key={index}>{url}</p>
              ))
            ) : (
              <p>No URLs detected in this message.</p>
            )}
          </div>

          <div className="message-disclaimer">
            <strong>Important:</strong> This analysis is based on
            detected patterns. A low risk score does not guarantee
            that a message is genuine.
          </div>
        </div>
      )}
    </div>
  );
}
