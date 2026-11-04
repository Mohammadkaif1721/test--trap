import "./Features.css";
import { useEffect } from "react";
import {
  Code2,
  Globe,
  MessageSquareText,
  BellRing,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Languages,
  AlertTriangle,
  Search,
  FileText,
  Share2,
  Download,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Source Code Scanner",
    subtitle: "FIND VULNERABILITIES",
    description:
      "Analyze source code to detect security vulnerabilities, insecure patterns, and exposed sensitive information.",
    tags: ["Static Analysis", "Secret Detection", "Best Practices"],
    icon: Code2,
    type: "code",
    action: "Try Code Scanner",
  },
  {
    number: "02",
    title: "URL Scanner",
    subtitle: "DETECT PHISHING THREATS",
    description:
      "Examine suspicious URLs using URL analysis, reputation checks, and phishing indicators to identify potential threats.",
    tags: ["URL Analysis", "Phishing Detection", "Domain Reputation"],
    icon: Globe,
    type: "url",
    action: "Try URL Scanner",
  },
  {
    number: "03",
    title: "Message Checker",
    subtitle: "SPOT SCAMS IN SECONDS",
    description:
      "Check suspicious messages for scam language, social engineering patterns, and warning signs in multiple languages.",
    tags: ["English", "Hindi / Hinglish", "Scam Detection"],
    icon: MessageSquareText,
    type: "message",
    action: "Try Message Checker",
  },
  {
    number: "04",
    title: "Cyber Alert",
    subtitle: "STAY INFORMED",
    description:
      "Generate security reports about detected threats and share warnings with family and friends.",
    tags: ["Threat Reports", "Risk Assessment", "Report Sharing"],
    icon: BellRing,
    type: "alert",
    action: "Try Cyber Alert",
  },
];

function CodePreview() {
  return (
    <div className="preview-window code-preview">
      <div className="preview-topbar">
        <span className="window-dot red" />
        <span className="window-dot yellow" />
        <span className="window-dot green" />
        <span className="preview-filename">scanner.py</span>
      </div>

      <div className="code-content">
        <div className="code-sidebar">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>

        <div className="code-lines">
          <div className="code-line cyan w-70" />
          <div className="code-line pink w-45" />
          <div className="code-line blue w-85" />
          <div className="code-line cyan w-55" />
          <div className="code-line pink w-60" />
          <div className="code-line blue w-75" />
          <div className="code-line cyan w-40" />
          <div className="code-line pink w-65" />
          <div className="code-line blue w-50" />
          <div className="code-line cyan w-80" />
        </div>
      </div>

      <div className="vulnerability-popup">
        <AlertTriangle size={27} />
        <div>
          <p>Potential Vulnerability</p>
          <span>Example: SQL Injection Risk</span>
        </div>
      </div>
    </div>
  );
}

function UrlPreview() {
  return (
    <div className="preview-window url-preview">
      <div className="preview-topbar">
        <span className="window-dot red" />
        <span className="window-dot yellow" />
        <span className="window-dot green" />
        <span className="preview-dots">•••</span>
      </div>

      <div className="url-search">
        <span>https://suspicious-link.com</span>
        <Search size={19} />
      </div>

      <div className="url-warning">
        <AlertTriangle size={28} />
        <div>
          <p>Potential Phishing Site</p>
          <span>This URL may be suspicious.</span>
        </div>
      </div>

      <div className="url-checks">
        <div>
          <span>Domain Reputation</span>
          <i className="risk-bar red-bar" />
          <b className="risk-red">Review</b>
        </div>
        <div>
          <span>URL Structure</span>
          <i className="risk-bar green-bar" />
          <b className="risk-green">Checked</b>
        </div>
        <div>
          <span>Threat Indicators</span>
          <i className="risk-bar red-bar" />
          <b className="risk-red">Found</b>
        </div>
      </div>
    </div>
  );
}

function MessagePreview() {
  return (
    <div className="preview-window message-preview">
      <div className="preview-topbar">
        <span className="window-dot red" />
        <span className="window-dot yellow" />
        <span className="window-dot green" />
        <span className="preview-filename">Message Analysis</span>
      </div>

      <div className="message-chat">
        <div className="avatar">U</div>
        <div className="message-bubble">
          Congratulations! You've won a ₹50,000 prize!
          Click the link to claim now:
          <strong> http://scam-offer.com</strong>
        </div>
      </div>

      <div className="message-warning">
        <AlertTriangle size={27} />
        <div>
          <p>Suspicious Message</p>
          <span>Example scam indicators detected</span>
        </div>
      </div>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="preview-window report-preview">
      <div className="preview-topbar">
        <span className="window-dot red" />
        <span className="window-dot yellow" />
        <span className="window-dot green" />
        <span className="preview-dots">•••</span>
      </div>

      <div className="report-content">
        <div className="report-icon">
          <FileText size={43} />
        </div>

        <div className="report-details">
          <p>Security Report</p>
          <span />
          <span />
          <span />
          <div className="report-bars">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <div className="report-actions">
        <span><Download size={15} /> Download Report</span>
        <span><Share2 size={15} /> Share</span>
      </div>
    </div>
  );
}

function Preview({ type }) {
  switch (type) {
    case "code":
      return <CodePreview />;
    case "url":
      return <UrlPreview />;
    case "message":
      return <MessagePreview />;
    case "alert":
      return <ReportPreview />;
    default:
      return null;
  }
}

export default function Features() {
  return (
    <section
      id="features"
      className="features-section relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="features-glow" />
      <div className="features-grid-bg" />

      <div className="features-container relative z-10">

       

        {/* Feature cards */}
        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="feature-card"
              >
                <span className="feature-number">
                  {feature.number}
                </span>

                <div className="feature-accent" />

                <div className="feature-copy">
                  <div className="feature-icon">
                    <Icon size={31} strokeWidth={1.8} />
                  </div>

                  <h3>{feature.title}</h3>

                  <h4>{feature.subtitle}</h4>

                  <p>{feature.description}</p>

                  <div className="feature-tags">
                    {feature.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <a href="#signup" className="feature-link">
                    <span><ArrowRight size={19} /></span>
                    {feature.action}
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className={`feature-visual visual-${feature.type}`}>
                  <Preview type={feature.type} />
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom information bar */}
       

      </div>
    </section>
  );
}