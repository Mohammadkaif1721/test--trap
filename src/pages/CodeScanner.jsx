
import { useState, useCallback, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Scan,
  Upload,
  FileCode2,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  Bug,
  ChevronDown,
  ChevronUp,
  X,
  Terminal,
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  FolderArchive,
} from "lucide-react";
import "./CodeScanner.css";
import { supabase } from "../lib/supabase";

const API_BASE = "http://localhost:5000/api/scanner";

const SEVERITY_ORDER = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4,
};

const DEMO_CODE = `// Test Trap - Security Scanner Test
const userInput = location.hash;

// Test 1: Unsafe eval
eval(userInput);

// Test 2: Potential DOM XSS
document.body.innerHTML = userInput;

// Test 3: Hardcoded credential
const password = "SuperSecretPassword123";

// Test 4: Weak random number
const token = Math.random();

// Test 5: Insecure HTTP
fetch("http://example.com/api");

// Test 6: Unsafe document.write
document.write(userInput);
`;

const severityColor = {
  CRITICAL: "#ff1744",
  HIGH: "#ff526e",
  MEDIUM: "#ffb020",
  LOW: "#42a5f5",
  INFO: "#9b9baf",
};

function formatDuration(ms) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function SeverityBadge({ severity }) {
  const color = severityColor[severity] || "#9b9baf";

  return (
    <span
      className="tt-severity"
      style={{
        color,
        borderColor: `${color}55`,
        background: `${color}12`,
      }}
    >
      <span
        className="tt-severity-dot"
        style={{ background: color }}
      />
      {severity || "UNKNOWN"}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      className="tt-stat-card"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4, borderColor: `${color}80` }}
    >
      <div
        className="tt-stat-icon"
        style={{ color, background: `${color}15` }}
      >
        <Icon size={19} />
      </div>

      <div className="tt-stat-info">
        <span>{label}</span>
        <strong>{value ?? 0}</strong>
      </div>
    </motion.div>
  );
}

function FindingCard({ finding, index }) {
  const [expanded, setExpanded] = useState(false);
  const color = severityColor[finding.severity] || "#9b9baf";

  return (
    <motion.article
      className="tt-finding-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(index * 0.035, 0.4),
      }}
      layout
    >
      <div className="tt-finding-main">
        <div
          className="tt-finding-icon"
          style={{
            color,
            background: `${color}12`,
            borderColor: `${color}30`,
          }}
        >
          <Bug size={18} />
        </div>

        <div className="tt-finding-content">
          <div className="tt-finding-title-row">
            <h3>{finding.title || "Security Finding"}</h3>
            <SeverityBadge severity={finding.severity} />
          </div>

          <div className="tt-finding-meta">
            <span>
              <FileCode2 size={13} />
              {finding.file || "Source code"}
            </span>

            <span>
              <Terminal size={13} />
              Line {finding.line || 1}
              {finding.column ? `:${finding.column}` : ""}
            </span>

            {finding.ruleId && (
              <span className="tt-rule-id">{finding.ruleId}</span>
            )}
          </div>

          <p className="tt-finding-description">
            {finding.description ||
              "Potential security issue detected."}
          </p>
        </div>

        <button
          className="tt-expand-btn"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Collapse finding" : "Expand finding"}
        >
          {expanded ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="tt-finding-details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="tt-detail-grid">
              <div>
                <span className="tt-detail-label">CWE</span>
                <p>{finding.cwe || "Not mapped"}</p>
              </div>

              <div>
                <span className="tt-detail-label">OWASP</span>
                <p>{finding.owasp || "Not mapped"}</p>
              </div>

              <div>
                <span className="tt-detail-label">Confidence</span>
                <p>{finding.confidence || "Not specified"}</p>
              </div>
            </div>

            {finding.evidence && (
              <div className="tt-detail-block">
                <span className="tt-detail-label">Evidence</span>
                <p>{finding.evidence}</p>
              </div>
            )}

            <div className="tt-recommendation">
              <div>
                <ShieldCheck size={17} />
                <strong>Remediation</strong>
              </div>

              <p>
                {finding.recommendation ||
                  "Review this code and apply secure coding practices."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function CodeScanner() {
  const [sourceCode, setSourceCode] = useState(DEMO_CODE);
  const [language, setLanguage] = useState("javascript");
  const [findings, setFindings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [scannedFiles, setScannedFiles] = useState([]);
  const [skippedFiles, setSkippedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [scanMode, setScanMode] = useState("code");
  const [scanDuration, setScanDuration] = useState(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const isBusy = loading || uploading;

  const resetResults = useCallback(() => {
    setFindings([]);
    setSummary(null);
    setScannedFiles([]);
    setSkippedFiles([]);
    setScanDuration(null);
    setProgress(0);
    setProgressLabel("");
    setError("");
  }, []);

  // Save completed scans to the signed-in user's activity history.
  const saveScanActivity = async ({
    title,
    description,
    status,
    metadata,
  }) => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) throw authError;
    if (!user) throw new Error("No authenticated user found.");

    const { error: insertError } = await supabase
      .from("user_activity")
      .insert({
        user_id: user.id,
        activity_type: "code_scan",
        title,
        description,
        status,
        metadata,
      });

    if (insertError) throw insertError;
  };

  const handleScan = async () => {
    if (!sourceCode.trim()) {
      setError("Enter source code before starting a scan.");
      return;
    }

    resetResults();
    setLoading(true);
    setScanMode("code");

    const startedAt = performance.now();

    try {
      setProgress(25);
      setProgressLabel("Preparing source code");

      const response = await fetch(`${API_BASE}/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: sourceCode,
          language,
        }),
      });

      setProgress(75);
      setProgressLabel("Analyzing security rules");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Code scan failed.");
      }

      const scanFindings = Array.isArray(data.findings)
        ? data.findings
        : [];

      setFindings(scanFindings);
      setSummary(data.summary || null);
      setScannedFiles(data.scannedFiles || []);
      setSkippedFiles(data.skippedFiles || []);

      try {
        await saveScanActivity({
          title: "Code Security Scan",
          description: `${scanFindings.length} potential finding(s) in ${language} source code`,
          status:
            scanFindings.length > 0
              ? "threat_detected"
              : "completed",
          metadata: {
            scan_mode: "code",
            language,
            total_findings: scanFindings.length,
            summary: data.summary || null,
            scanned_files: data.scannedFiles || [],
            skipped_files: data.skippedFiles || [],
          },
        });
      } catch (activityError) {
        console.error(
          "Could not save scan activity:",
          activityError
        );
      }

      setProgress(100);
      setProgressLabel("Scan completed");
      setScanDuration(performance.now() - startedAt);
    } catch (err) {
      console.error("Code scan error:", err);
      setError(
        err.message || "Unable to connect to scanner backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleZipUpload = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Please select a ZIP file.");
      return;
    }

    resetResults();
    setUploading(true);
    setScanMode("zip");

    const startedAt = performance.now();

    try {
      setProgress(10);
      setProgressLabel("Uploading ZIP archive");

      const formData = new FormData();
      formData.append("file", file);

      setProgress(35);
      setProgressLabel("Extracting source files");

      const response = await fetch(`${API_BASE}/scan-zip`, {
        method: "POST",
        body: formData,
      });

      setProgress(80);
      setProgressLabel("Analyzing project");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "ZIP scan failed.");
      }

      const scanFindings = Array.isArray(data.findings)
        ? data.findings
        : [];

      setFindings(scanFindings);
      setSummary(data.summary || null);
      setScannedFiles(data.scannedFiles || []);
      setSkippedFiles(data.skippedFiles || []);

      try {
        await saveScanActivity({
          title: "Project Code Scan",
          description: `${scanFindings.length} potential finding(s) in ${file.name}`,
          status:
            scanFindings.length > 0
              ? "threat_detected"
              : "completed",
          metadata: {
            scan_mode: "zip",
            archive_name: file.name,
            total_findings: scanFindings.length,
            summary: data.summary || null,
            scanned_files: data.scannedFiles || [],
            skipped_files: data.skippedFiles || [],
          },
        });
      } catch (activityError) {
        console.error(
          "Could not save scan activity:",
          activityError
        );
      }

      setProgress(100);
      setProgressLabel("Project scan completed");
      setScanDuration(performance.now() - startedAt);
    } catch (err) {
      console.error("ZIP scan error:", err);
      setError(err.message || "Unable to scan ZIP archive.");
    } finally {
      setUploading(false);
    }
  };

  const filteredFindings = useMemo(() => {
    return findings
      .filter((finding) => {
        const matchesSeverity =
          severityFilter === "ALL" ||
          finding.severity === severityFilter;

        const query = search.trim().toLowerCase();

        const matchesSearch =
          !query ||
          [
            finding.title,
            finding.description,
            finding.ruleId,
            finding.file,
            finding.cwe,
            finding.owasp,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(query)
            );

        return matchesSeverity && matchesSearch;
      })
      .sort((a, b) => {
        const severityA = SEVERITY_ORDER[a.severity] ?? 99;
        const severityB = SEVERITY_ORDER[b.severity] ?? 99;

        return (
          severityA - severityB ||
          (a.line || 0) - (b.line || 0)
        );
      });
  }, [findings, severityFilter, search]);

  const downloadReport = () => {
    const report = {
      product: "Test Trap",
      scanner: "Advanced SAST",
      generatedAt: new Date().toISOString(),
      summary,
      findings,
      scannedFiles,
      skippedFiles,
    };

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `test-trap-report-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearScan = () => {
    resetResults();
    setSearch("");
    setSeverityFilter("ALL");
  };

  return (
    <div className="tt-scanner-page">
      <div className="tt-scanner-bg-grid" />

      <div className="tt-scanner-container">
        {/* HEADER */}
        <motion.header
          className="tt-scanner-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="tt-header-left">
            <div className="tt-scanner-logo">
              <Shield size={25} />
            </div>

            <div>
              <div className="tt-eyebrow">
                TEST TRAP / SECURITY ANALYSIS
              </div>

              <h1>
                Code <span>Scanner</span>
              </h1>

              <p>
                Detect insecure patterns, exposed secrets, and potential
                vulnerabilities in your source code.
              </p>
            </div>
          </div>

          <div className="tt-engine-status">
            <span className="tt-status-dot" />
            ENGINE READY
          </div>
        </motion.header>

        {/* FEATURE STRIP */}
        <motion.div
          className="tt-scanner-feature-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span><Activity size={14} /> Static Analysis</span>
          <span><ShieldCheck size={14} /> Secret Detection</span>
          <span><Zap size={14} /> AST Analysis</span>
          <span><Terminal size={14} /> CWE Mapping</span>
        </motion.div>

        {/* EDITOR */}
        <motion.section
          className="tt-panel tt-editor-panel"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <div className="tt-panel-header">
            <div className="tt-panel-title">
              <FileCode2 size={17} />
              <span>Source Code</span>
              <span className="tt-panel-tag">EDITOR</span>
            </div>

            <div className="tt-editor-toolbar">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isBusy}
                className="tt-language-select"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
              </select>

              <button
                className="tt-icon-button"
                onClick={() => setSourceCode(DEMO_CODE)}
                title="Load sample"
                disabled={isBusy}
              >
                <RefreshCw size={15} />
              </button>

              <button
                className="tt-icon-button"
                onClick={() => setSourceCode("")}
                title="Clear editor"
                disabled={isBusy}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="tt-editor-wrapper">
            <Editor
              height="390px"
              language={language}
              theme="vs-dark"
              value={sourceCode}
              onChange={(value) => setSourceCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16 },
                wordWrap: "on",
                tabSize: 2,
                readOnly: isBusy,
              }}
            />
          </div>

          <div className="tt-editor-footer">
            <span>
              <span className="tt-live-dot" />
              {sourceCode.split("\n").length} lines
            </span>
            <span>{sourceCode.length} characters</span>
          </div>

          <div className="tt-scan-actions">
            <motion.button
              className="tt-primary-button"
              onClick={handleScan}
              disabled={isBusy}
              whileHover={!isBusy ? { scale: 1.015 } : {}}
              whileTap={!isBusy ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="tt-spin" />
                  Scanning Code...
                </>
              ) : (
                <>
                  <Scan size={17} />
                  Start Security Scan
                </>
              )}
            </motion.button>

            <label
              className={`tt-upload-button ${isBusy ? "disabled" : ""}`}
            >
              <Upload size={16} />
              Upload Project ZIP

              <input
                type="file"
                accept=".zip"
                disabled={isBusy}
                hidden
                onChange={(e) => {
                  handleZipUpload(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </motion.section>

        {/* PROGRESS */}
        <AnimatePresence>
          {isBusy && (
            <motion.section
              className="tt-progress-panel"
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
            >
              <div className="tt-progress-top">
                <div>
                  <RefreshCw size={16} className="tt-spin" />
                  <span>{progressLabel || "Analyzing..."}</span>
                </div>
                <strong>{progress}%</strong>
              </div>

              <div className="tt-progress-track">
                <motion.div
                  className="tt-progress-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <p>
                {scanMode === "zip"
                  ? "Analyzing uploaded project files..."
                  : "Inspecting source code for security patterns..."}
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ERROR */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="tt-error-box"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <AlertTriangle size={18} />
              <span>{error}</span>
              <button onClick={() => setError("")}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS */}
        <AnimatePresence>
          {summary && !isBusy && (
            <motion.section
              className="tt-results-section"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="tt-results-heading">
                <div>
                  <div className="tt-eyebrow">ANALYSIS COMPLETE</div>

                  <h2>
                    Scan <span>Results</span>
                  </h2>

                  <p>
                    Security analysis completed successfully.
                    {scanDuration !== null && (
                      <> Runtime: {formatDuration(scanDuration)}</>
                    )}
                  </p>
                </div>

                <div className="tt-results-actions">
                  <button
                    className="tt-secondary-button"
                    onClick={downloadReport}
                  >
                    <Download size={15} />
                    Export JSON
                  </button>

                  <button
                    className="tt-secondary-button"
                    onClick={clearScan}
                  >
                    <RefreshCw size={15} />
                    Reset
                  </button>
                </div>
              </div>

              {/* SUMMARY CARDS */}
              <div className="tt-stats-grid">
                <StatCard
                  label="Total Findings"
                  value={summary.total ?? findings.length}
                  icon={Bug}
                  color="#ff526e"
                  delay={0.05}
                />

                <StatCard
                  label="Critical"
                  value={summary.CRITICAL}
                  icon={ShieldAlert}
                  color="#ff1744"
                  delay={0.1}
                />

                <StatCard
                  label="High"
                  value={summary.HIGH}
                  icon={AlertTriangle}
                  color="#ff526e"
                  delay={0.15}
                />

                <StatCard
                  label="Medium"
                  value={summary.MEDIUM}
                  icon={Activity}
                  color="#ffb020"
                  delay={0.2}
                />
              </div>

              {/* FILE SUMMARY */}
              {scanMode === "zip" && (
                <div className="tt-file-summary">
                  <div>
                    <FolderArchive size={17} />
                    <span>Files scanned</span>
                    <strong>{scannedFiles.length}</strong>
                  </div>

                  <div>
                    <AlertTriangle size={17} />
                    <span>Files skipped</span>
                    <strong>{skippedFiles.length}</strong>
                  </div>
                </div>
              )}

              {/* FINDINGS */}
              <div className="tt-findings-panel">
                <div className="tt-findings-toolbar">
                  <div className="tt-findings-title">
                    <h3>Security Findings</h3>
                    <span>{filteredFindings.length} results</span>
                  </div>

                  <div className="tt-findings-filters">
                    <div className="tt-search-box">
                      <Search size={15} />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search findings..."
                      />
                    </div>

                    <select
                      value={severityFilter}
                      onChange={(e) =>
                        setSeverityFilter(e.target.value)
                      }
                      className="tt-filter-select"
                    >
                      <option value="ALL">All Severity</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                      <option value="INFO">Info</option>
                    </select>
                  </div>
                </div>

                {filteredFindings.length > 0 ? (
                  <div className="tt-findings-list">
                    {filteredFindings.map((finding, index) => (
                      <FindingCard
                        key={
                          finding.id ||
                          `${finding.ruleId}-${finding.line}-${index}`
                        }
                        finding={finding}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="tt-empty-findings"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ShieldCheck size={42} />

                    <h3>
                      {findings.length === 0
                        ? "No vulnerabilities detected"
                        : "No matching findings"}
                    </h3>

                    <p>
                      {findings.length === 0
                        ? "The scanner did not identify any issues using its current detection rules."
                        : "Try changing your search or severity filter."}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* SCANNED FILES */}
              {scanMode === "zip" && scannedFiles.length > 0 && (
                <details className="tt-files-details">
                  <summary>
                    <FileCode2 size={16} />
                    Scanned Files ({scannedFiles.length})
                  </summary>

                  <div className="tt-files-list">
                    {scannedFiles.map((file) => (
                      <span key={file}>{file}</span>
                    ))}
                  </div>
                </details>
              )}

              {scanMode === "zip" && skippedFiles.length > 0 && (
                <details className="tt-files-details">
                  <summary>
                    <AlertTriangle size={16} />
                    Skipped Files ({skippedFiles.length})
                  </summary>

                  <div className="tt-files-list">
                    {skippedFiles.map((file, index) => (
                      <span key={`${file.file}-${index}`}>
                        {file.file} — {file.reason}
                      </span>
                    ))}
                  </div>
                </details>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* INITIAL EMPTY STATE */}
        {!summary && !isBusy && !error && (
          <motion.div
            className="tt-scanner-empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="tt-empty-orbit">
              <div className="tt-empty-orbit-ring" />
              <div className="tt-empty-orbit-ring second" />

              <div className="tt-empty-shield">
                <Shield size={35} />
              </div>
            </div>

            <h2>
              Ready to <span>Analyze</span>
            </h2>

            <p>
              Paste source code or upload a project ZIP to begin
              security analysis.
            </p>

            <div className="tt-empty-hints">
              <span><CheckCircle2 size={14} /> Secret Detection</span>
              <span><CheckCircle2 size={14} /> Code Security Rules</span>
              <span><CheckCircle2 size={14} /> CWE Mapping</span>
            </div>
          </motion.div>
        )}

        <footer className="tt-scanner-footer">
          <span>
            <Shield size={13} /> TEST TRAP SECURITY ENGINE
          </span>
          <span>Advanced Code Analysis</span>
        </footer>
      </div>
    </div>
  );
}
