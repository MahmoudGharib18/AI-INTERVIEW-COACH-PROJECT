// keyword/pattern signals that an AI response may have leaked a hint or solution.
// Intentionally broad and over-sensitive — false positives are cheap (just re-prompt
// the model to try again), false negatives (an actual leak reaching the user) are not.
const LEAK_PATTERNS: RegExp[] = [
  /\b(you (could|should|can) (try|use)|consider using)\b/i,
  /\b(the (approach|algorithm|technique) (is|would be|you('| a)?ll? want))\b/i,
  /\b(use (a |an )?(hash ?map|two[- ]pointer|sliding window|binary search|dynamic programming|dfs|bfs|recursion|stack|queue|heap|greedy))\b/i,
  /\b(time complexity (would be|is) O\()/i,
  /```[\s\S]*```/, // any fenced code block in interviewer dialogue is suspicious
  /\b(here'?s (the|a|how) (solution|code|answer))\b/i,
];

export interface LeakCheckResult {
  flagged: boolean;
  matchedPatterns: string[];
}

export const checkForLeak = (aiResponse: string): LeakCheckResult => {
  const matched: string[] = [];

  for (const pattern of LEAK_PATTERNS) {
    if (pattern.test(aiResponse)) {
      matched.push(pattern.source);
    }
  }

  return {
    flagged: matched.length > 0,
    matchedPatterns: matched,
  };
};