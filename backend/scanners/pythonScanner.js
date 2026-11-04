
import { SECURITY_RULES } from "./rules.js";
import {
  createFinding,
  getLineNumber,
  deduplicateFindings,
} from "./utils.js";

const PYTHON_RULES = [
  {
    ruleId: "PY-EVAL",
    regex: /\beval\s*\(/g,
  },
  {
    ruleId: "PY-EXEC",
    regex: /\bexec\s*\(/g,
  },
  {
    ruleId: "PY-SHELL",
    regex: /\bsubprocess\.(?:run|Popen|call|check_call|check_output)\s*\(/g,
  },
  {
    ruleId: "PY-SQL",
    regex: /\b(?:execute|executemany)\s*\(\s*(?:f["']|["'][^"']*%s|["'][^"']*\+|["'][^"']*\{)/g,
  },
];

export function scanPython(code) {
  const findings = [];

  for (const rule of PYTHON_RULES) {
    rule.regex.lastIndex = 0;

    let match;

    while ((match = rule.regex.exec(code)) !== null) {
      const metadata = SECURITY_RULES[rule.ruleId];

      // subprocess usage alone is not always unsafe.
      const evidence =
        rule.ruleId === "PY-SHELL"
          ? "Subprocess execution API detected; inspect shell usage and input validation."
          : "Potentially unsafe code pattern detected.";

      findings.push(
        createFinding({
          ...metadata,
          ruleId: rule.ruleId,
          line: getLineNumber(code, match.index),
          column:
            match.index -
            code.lastIndexOf("\n", match.index - 1),
          evidence,
        })
      );
    }
  }

  // Detect shell=True separately.
  const shellRegex = /\bshell\s*=\s*True\b/g;
  let shellMatch;

  while ((shellMatch = shellRegex.exec(code)) !== null) {
    findings.push(
      createFinding({
        ruleId: "PY-SHELL-TRUE",
        title: "Shell Execution Enabled",
        severity: "HIGH",
        confidence: "HIGH",
        cwe: "CWE-78",
        owasp: "A03:2021 - Injection",
        description:
          "subprocess shell execution is enabled. Untrusted input may lead to command injection.",
        recommendation:
          "Prefer shell=False and pass commands as argument arrays.",
        line: getLineNumber(code, shellMatch.index),
        column:
          shellMatch.index -
          code.lastIndexOf("\n", shellMatch.index - 1),
        evidence: "shell=True detected",
      })
    );
  }

  return deduplicateFindings(findings);
}
