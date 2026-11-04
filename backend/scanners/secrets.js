
import { SECURITY_RULES } from "./rules.js";
import {
  createFinding,
  getLineNumber,
  deduplicateFindings,
} from "./utils.js";

const SECRET_PATTERNS = [
  {
    ruleId: "SECRET-AWS",
    regex: /\bAKIA[0-9A-Z]{16}\b/g,
  },
  {
    ruleId: "SECRET-GITHUB",
    regex: /\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g,
  },
  {
    ruleId: "SECRET-GITLAB",
    regex: /\bglpat-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    ruleId: "SECRET-SLACK",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g,
  },
  {
    ruleId: "SECRET-GOOGLE",
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    ruleId: "SECRET-STRIPE",
    regex: /\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b/g,
  },
  {
    ruleId: "SECRET-PRIVATE-KEY",
    regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    ruleId: "SECRET-JWT",
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
];

const GENERIC_CREDENTIAL_REGEX =
  /\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)\s*[:=]\s*(['"`])([^'"`\r\n]{6,})\1/gi;

export function scanSecrets(code) {
  const findings = [];

  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;

    let match;

    while ((match = pattern.regex.exec(code)) !== null) {
      const rule = SECURITY_RULES[pattern.ruleId];

      findings.push(
        createFinding({
          ...rule,
          ruleId: pattern.ruleId,
          line: getLineNumber(code, match.index),
          column:
            match.index -
            code.lastIndexOf("\n", match.index - 1),
          evidence: "Sensitive value redacted",
        })
      );
    }
  }

  let genericMatch;

  GENERIC_CREDENTIAL_REGEX.lastIndex = 0;

  while (
    (genericMatch = GENERIC_CREDENTIAL_REGEX.exec(code)) !== null
  ) {
    const key = genericMatch[0]
      .split(/[:=]/)[0]
      .trim()
      .toLowerCase();

    const value = genericMatch[2].trim();

    // Avoid obvious placeholders.
    if (
      /^(?:your_|example|placeholder|changeme|dummy|test|none|null|undefined|password123)$/i.test(
        value
      )
    ) {
      continue;
    }

    const rule = SECURITY_RULES["SECRET-GENERIC"];

    findings.push(
      createFinding({
        ...rule,
        ruleId: "SECRET-GENERIC",
        title: `Possible Hardcoded ${key.replace(/[_-]/g, " ")}`,
        line: getLineNumber(code, genericMatch.index),
        column:
          genericMatch.index -
          code.lastIndexOf("\n", genericMatch.index - 1),
        evidence: "Sensitive value redacted",
      })
    );
  }

  return deduplicateFindings(findings);
}
