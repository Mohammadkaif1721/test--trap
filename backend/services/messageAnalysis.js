
const scamPatterns = [
  {
    pattern: /account.{0,30}(block|suspend|disable| बंद)/i,
    score: 25,
    reason: "Account blocking or suspension threat",
  },
  {
    pattern: /(urgent|immediately|तुरंत|जल्दी|abhi|turant)/i,
    score: 15,
    reason: "Urgency or immediate action requested",
  },
  {
    pattern: /(won|winner|lottery|prize|reward|इनाम|लॉटरी|जीत)/i,
    score: 25,
    reason: "Unexpected prize or reward claim",
  },
  {
    pattern: /(otp|password|pin|cvv|पासवर्ड|ओटीपी)/i,
    score: 30,
    reason: "Sensitive credential or OTP mentioned",
  },
  {
    pattern: /(verify|update).{0,30}(kyc|account|bank|verify)/i,
    score: 25,
    reason: "Account verification request",
  },
  {
    pattern: /(click|tap|open).{0,30}(link|here|below|लिंक)/i,
    score: 15,
    reason: "Message encourages clicking a link",
  },
  {
    pattern: /(claim|activate|unlock).{0,30}(reward|offer|account)/i,
    score: 20,
    reason: "Reward or account activation bait",
  },
  {
    pattern: /(free money|easy income|guaranteed profit|double your money)/i,
    score: 30,
    reason: "Unrealistic financial promise",
  },
];

const urlRegex = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;

export function analyzeMessage(message) {
  const findings = [];
  let score = 0;

  // Detect message patterns
  for (const rule of scamPatterns) {
    if (rule.pattern.test(message)) {
      score += rule.score;
      findings.push(rule.reason);
    }
  }

  // Extract URLs
  const urls = message.match(urlRegex) || [];

  if (urls.length > 0) {
    findings.push(`${urls.length} URL(s) detected in message`);
  }

  // Suspicious message formatting
  if (/[A-Z]{8,}/.test(message)) {
    score += 10;
    findings.push("Excessive uppercase text");
  }

  if (/!{3,}/.test(message)) {
    score += 5;
    findings.push("Excessive exclamation marks");
  }

  score = Math.min(score, 100);

  let verdict;

  if (score >= 60) {
    verdict = "LIKELY_FRAUD";
  } else if (score >= 25) {
    verdict = "SUSPICIOUS";
  } else {
    verdict = "LIKELY_GENUINE";
  }

  return {
    score,
    verdict,
    findings,
    urls,
  };
}
