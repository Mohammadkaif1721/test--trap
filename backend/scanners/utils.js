
export function getLineNumber(source, index) {
  let line = 1;

  for (let i = 0; i < index; i++) {
    if (source.charCodeAt(i) === 10) line++;
  }

  return line;
}

export function createFinding({
  ruleId,
  title,
  severity = "MEDIUM",
  confidence = "MEDIUM",
  line = 1,
  column = 1,
  description,
  recommendation,
  cwe,
  owasp,
  evidence,
  file,
}) {
  return {
    id: `${ruleId}-${line}-${column}`,
    ruleId,
    type: "Static Analysis",
    title,
    severity,
    confidence,
    line,
    column,
    description,
    recommendation,
    cwe,
    owasp,
    evidence: evidence || "Potentially unsafe code detected",
    ...(file ? { file } : {}),
  };
}

export function deduplicateFindings(findings) {
  const seen = new Set();

  return findings.filter((finding) => {
    const key = `${finding.ruleId}:${finding.line}:${finding.column}`;

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

export function getSeverityCounts(findings) {
  return {
    CRITICAL: findings.filter((f) => f.severity === "CRITICAL").length,
    HIGH: findings.filter((f) => f.severity === "HIGH").length,
    MEDIUM: findings.filter((f) => f.severity === "MEDIUM").length,
    LOW: findings.filter((f) => f.severity === "LOW").length,
    INFO: findings.filter((f) => f.severity === "INFO").length,
  };
}
