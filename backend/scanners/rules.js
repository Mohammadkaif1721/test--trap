
export const SECURITY_RULES = {
  "SECRET-AWS": {
    title: "AWS Access Key",
    severity: "CRITICAL",
    confidence: "HIGH",
    cwe: "CWE-798",
    owasp: "A07:2021 - Identification and Authentication Failures",
    description: "An AWS access key identifier was detected.",
    recommendation:
      "Revoke exposed credentials immediately and use IAM roles or secure secret storage.",
  },

  "SECRET-GITHUB": {
    title: "GitHub Token",
    severity: "CRITICAL",
    confidence: "HIGH",
    cwe: "CWE-798",
    owasp: "A07:2021 - Identification and Authentication Failures",
    description: "A possible GitHub access token was detected.",
    recommendation:
      "Revoke the token and use environment variables or a secret manager.",
  },

  "SECRET-GENERIC": {
    title: "Hardcoded Credential",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-798",
    owasp: "A07:2021 - Identification and Authentication Failures",
    description: "A credential-like value appears hardcoded.",
    recommendation:
      "Move credentials into secure environment variables or a secret manager.",
  },

  "JS-EVAL": {
    title: "Unsafe eval() Usage",
    severity: "HIGH",
    confidence: "HIGH",
    cwe: "CWE-95",
    owasp: "A03:2021 - Injection",
    description:
      "eval() dynamically executes JavaScript and may allow code injection.",
    recommendation:
      "Avoid eval(). Use safe parsing or explicit function logic.",
  },

  "JS-FUNCTION": {
    title: "Dynamic Function Constructor",
    severity: "HIGH",
    confidence: "HIGH",
    cwe: "CWE-95",
    owasp: "A03:2021 - Injection",
    description:
      "The Function constructor dynamically creates executable JavaScript.",
    recommendation:
      "Avoid dynamically generating executable code.",
  },

  "JS-INNERHTML": {
    title: "Potential DOM XSS",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-79",
    owasp: "A03:2021 - Injection",
    description:
      "HTML is assigned to innerHTML. If the value is attacker-controlled, DOM XSS may occur.",
    recommendation:
      "Prefer textContent or sanitize HTML using a trusted sanitizer.",
  },

  "JS-DOCUMENT-WRITE": {
    title: "Unsafe document.write()",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-79",
    owasp: "A03:2021 - Injection",
    description:
      "document.write() can introduce unsafe HTML into a document.",
    recommendation:
      "Avoid document.write() and use safe DOM APIs.",
  },

  "JS-CHILD-PROCESS": {
    title: "Potential Command Injection",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-78",
    owasp: "A03:2021 - Injection",
    description:
      "A command execution API was detected. Unsafe user-controlled input may lead to command injection.",
    recommendation:
      "Avoid shell execution where possible. Use fixed commands and validated arguments.",
  },

  "JS-SQL": {
    title: "Potential SQL Injection",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-89",
    owasp: "A03:2021 - Injection",
    description:
      "A dynamically constructed SQL query may be vulnerable to injection.",
    recommendation:
      "Use parameterized queries or prepared statements.",
  },

  "JS-HTTP": {
    title: "Insecure HTTP Connection",
    severity: "MEDIUM",
    confidence: "HIGH",
    cwe: "CWE-319",
    owasp: "A02:2021 - Cryptographic Failures",
    description:
      "A hardcoded HTTP URL may transmit data without transport encryption.",
    recommendation:
      "Use HTTPS when communicating sensitive information.",
  },

  "JS-WEAK-RANDOM": {
    title: "Weak Randomness",
    severity: "MEDIUM",
    confidence: "HIGH",
    cwe: "CWE-338",
    owasp: "A02:2021 - Cryptographic Failures",
    description:
      "Math.random() is not suitable for security-sensitive random values.",
    recommendation:
      "Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive randomness.",
  },

  "JS-TLS-VERIFY": {
    title: "TLS Certificate Verification Disabled",
    severity: "HIGH",
    confidence: "HIGH",
    cwe: "CWE-295",
    owasp: "A02:2021 - Cryptographic Failures",
    description:
      "TLS certificate verification appears to be disabled.",
    recommendation:
      "Enable certificate verification and validate server certificates.",
  },

  "PY-EVAL": {
    title: "Unsafe eval() Usage",
    severity: "HIGH",
    confidence: "HIGH",
    cwe: "CWE-95",
    owasp: "A03:2021 - Injection",
    description:
      "eval() executes dynamically generated Python code.",
    recommendation:
      "Avoid eval() and use safe parsing alternatives.",
  },

  "PY-EXEC": {
    title: "Dynamic Code Execution",
    severity: "HIGH",
    confidence: "HIGH",
    cwe: "CWE-95",
    owasp: "A03:2021 - Injection",
    description:
      "exec() dynamically executes Python code.",
    recommendation:
      "Avoid exec() on untrusted or dynamically constructed input.",
  },

  "PY-SQL": {
    title: "Potential SQL Injection",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-89",
    owasp: "A03:2021 - Injection",
    description:
      "A SQL query may be constructed using unsafe string formatting.",
    recommendation:
      "Use parameterized queries and database driver placeholders.",
  },

  "PY-SHELL": {
    title: "Potential Command Injection",
    severity: "HIGH",
    confidence: "MEDIUM",
    cwe: "CWE-78",
    owasp: "A03:2021 - Injection",
    description:
      "A shell execution API was detected.",
    recommendation:
      "Avoid shell=True and pass arguments as a list with validated input.",
  },
};
