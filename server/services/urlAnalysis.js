
import { parse } from "tldts";
import similarity from "string-similarity";
import { verifiedBrands } from "../data/verifiedBrands.js";

const suspiciousWords = [
  "login",
  "signin",
  "verify",
  "verification",
  "secure",
  "account",
  "update",
  "password",
  "wallet",
  "banking",
  "confirm",
  "support",
];

function normalizeDomain(domain) {
  return domain.toLowerCase().replace(/^www\./, "");
}

function getBrandDomainMatch(domain) {
  for (const brand of verifiedBrands) {
    for (const officialDomain of brand.domains) {
      const normalizedOfficial = normalizeDomain(officialDomain);

      if (domain === normalizedOfficial) {
        return {
          brand: brand.name,
          officialDomain: normalizedOfficial,
        };
      }
    }
  }

  return null;
}

function getBrandLookalike(domain) {
  const parsed = parse(domain);
  const registrableDomain = parsed.domain;

  if (!registrableDomain) return null;

  const domainName = registrableDomain.split(".")[0];

  let bestMatch = null;

  for (const brand of verifiedBrands) {
    for (const officialDomain of brand.domains) {
      const officialName = officialDomain.split(".")[0];

      const score = similarity.compareTwoStrings(
        domainName,
        officialName
      );

      const hasBrandName = domainName.includes(officialName);
      const isLookalike =
        score >= 0.65 &&
        domainName !== officialName;

      if (hasBrandName || isLookalike) {
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = {
            brand: brand.name,
            officialDomain,
            score,
          };
        }
      }
    }
  }

  return bestMatch;
}

export function analyzeUrl(input) {
  let url;

  try {
    url = new URL(input);
  } catch {
    throw new Error("Please enter a valid URL.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  if (url.username || url.password) {
    throw new Error("URLs containing embedded credentials are not accepted.");
  }

  const hostname = normalizeDomain(url.hostname);
  const parsed = parse(hostname);

  if (!parsed.domain) {
    throw new Error("Could not identify the registered domain.");
  }

  const registeredDomain = parsed.domain;
  const exactMatch = getBrandDomainMatch(registeredDomain);

  const flags = [];

  const hasIpAddress = /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);

  if (hasIpAddress) {
    flags.push("Website uses an IP address instead of a domain.");
  }

  if (url.protocol !== "https:") {
    flags.push("Website does not use HTTPS.");
  }

  if (url.hostname.length > 70) {
    flags.push("Unusually long hostname.");
  }

  if (hostname.includes("xn--")) {
    flags.push("Internationalized domain / punycode detected.");
  }

  const domainName = registeredDomain.split(".")[0];

  const suspiciousMatches = suspiciousWords.filter((word =>
    domainName.includes(word)
  ));

  if (suspiciousMatches.length > 0) {
    flags.push(
      `Suspicious domain keywords: ${suspiciousMatches.join(", ")}`
    );
  }

  // Exact official registered domain
  if (exactMatch) {
    return {
      input,
      hostname,
      registeredDomain,
      verdict: "VERIFIED_OFFICIAL",
      risk: "LOW",
      brand: exactMatch.brand,
      message: `Domain matches the configured official domain for ${exactMatch.brand}.`,
      flags,
      checkedAt: new Date().toISOString(),
    };
  }

  // Brand impersonation / lookalike
  const lookalike = getBrandLookalike(registeredDomain);

  if (lookalike) {
    flags.push(
      `Domain resembles ${lookalike.brand} (${lookalike.officialDomain}).`
    );

    return {
      input,
      hostname,
      registeredDomain,
      verdict: "LIKELY_PHISHING",
      risk: "HIGH",
      brand: lookalike.brand,
      message: `This domain resembles ${lookalike.brand} but is not in the verified official domain list.`,
      flags,
      checkedAt: new Date().toISOString(),
    };
  }

  // Unknown domains are not automatically phishing
  return {
    input,
    hostname,
    registeredDomain,
    verdict: flags.length ? "SUSPICIOUS" : "UNVERIFIED",
    risk: flags.length ? "MEDIUM" : "UNKNOWN",
    brand: null,
    message: flags.length
      ? "Suspicious indicators detected. Verify before sharing sensitive information."
      : "This domain is not in the configured verified brand database.",
    flags,
    checkedAt: new Date().toISOString(),
  };
}
