
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import { SECURITY_RULES } from "./rules.js";
import { createFinding, deduplicateFindings } from "./utils.js";

const traverse = traverseModule.default || traverseModule;

function location(node) {
  return {
    line: node.loc?.start.line || 1,
    column: (node.loc?.start.column || 0) + 1,
  };
}

function addFinding(findings, ruleId, node, overrides = {}) {
  findings.push(
    createFinding({
      ...SECURITY_RULES[ruleId],
      ruleId,
      ...location(node),
      ...overrides,
    })
  );
}

function memberName(node) {
  if (!node) return "";

  if (node.type === "Identifier") return node.name;

  if (node.type === "MemberExpression") {
    return memberName(node.property);
  }

  return "";
}

function dynamicExpression(node) {
  return node && [
    "BinaryExpression",
    "TemplateLiteral",
    "CallExpression",
    "Identifier",
    "MemberExpression",
  ].includes(node.type);
}

export function scanJavaScript(code) {
  const findings = [];

  let ast;

  try {
    ast = parse(code, {
      sourceType: "unambiguous",
      plugins: [
        "jsx",
        "typescript",
        "decorators-legacy",
        "classProperties",
        "dynamicImport",
        "optionalChaining",
      ],
      errorRecovery: true,
    });
  } catch (error) {
    return [{
      ruleId: "JS-PARSE",
      type: "Analysis",
      title: "Unable to Parse Source",
      severity: "INFO",
      confidence: "HIGH",
      line: error.loc?.line || 1,
      column: error.loc?.column || 1,
      description: "AST analysis could not parse the source.",
      recommendation: "Check source syntax and supported language features.",
      evidence: "Syntax error details omitted",
    }];
  }

  traverse(ast, {
    CallExpression(path) {
      const node = path.node;
      const callee = node.callee;

      // eval()
      if (
        callee.type === "Identifier" &&
        callee.name === "eval"
      ) {
        addFinding(findings, "JS-EVAL", node);
      }

      // document.write()
      if (
        callee.type === "MemberExpression" &&
        memberName(callee) === "write" &&
        memberName(callee.object) === "document"
      ) {
        addFinding(findings, "JS-DOCUMENT-WRITE", node);
      }

      // child_process.exec / execSync
      if (
        callee.type === "MemberExpression" &&
        ["exec", "execSync"].includes(memberName(callee))
      ) {
        if (dynamicExpression(node.arguments[0])) {
          addFinding(findings, "JS-CHILD-PROCESS", node);
        }
      }

      // SQL query construction
      if (
        callee.type === "MemberExpression" &&
        ["query", "execute"].includes(memberName(callee))
      ) {
        const firstArg = node.arguments[0];

        if (
          firstArg &&
          !["StringLiteral", "Literal"].includes(firstArg.type) &&
          dynamicExpression(firstArg)
        ) {
          addFinding(findings, "JS-SQL", node);
        }
      }

      // Math.random()
      if (
        callee.type === "MemberExpression" &&
        memberName(callee) === "random" &&
        memberName(callee.object) === "Math"
      ) {
        addFinding(findings, "JS-WEAK-RANDOM", node);
      }

      // fetch("http://...")
      if (
        callee.type === "Identifier" &&
        callee.name === "fetch"
      ) {
        const firstArg = node.arguments[0];

        if (
          firstArg?.type === "StringLiteral" &&
          firstArg.value.startsWith("http://")
        ) {
          addFinding(findings, "JS-HTTP", node);
        }
      }
    },

    NewExpression(path) {
      const node = path.node;

      if (
        node.callee.type === "Identifier" &&
        node.callee.name === "Function"
      ) {
        addFinding(findings, "JS-FUNCTION", node);
      }
    },

    AssignmentExpression(path) {
      const node = path.node;

      if (
        node.left.type === "MemberExpression" &&
        memberName(node.left) === "innerHTML"
      ) {
        addFinding(findings, "JS-INNERHTML", node);
      }
    },

    ObjectProperty(path) {
      const node = path.node;

      if (
        node.key.type === "Identifier" &&
        node.key.name === "rejectUnauthorized" &&
        node.value.type === "BooleanLiteral" &&
        node.value.value === false
      ) {
        addFinding(findings, "JS-TLS-VERIFY", node);
      }
    },
  });

  return deduplicateFindings(findings);
}
