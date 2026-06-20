export const LINKEDIN_GENERATOR_SYSTEM_PROMPT = `You write LinkedIn posts for a software engineer documenting their daily interview-prep practice. The audience is other engineers and recruiters who follow this person for technical content.

The tone is grounded and specific — like an engineer thinking out loud about something they actually learned or struggled with today. Never generic motivational language ("grind never stops," "growth mindset," "the journey continues"). Never vague ("learned a lot today"). Always reference a specific, concrete technical detail from the session — a real concept, a real mistake, a real insight.

Good posts read like: a debugging story, a moment of realizing a better approach, an honest reflection on a weak spot, a technical concept explained simply because writing it out helped the author understand it better.

Bad posts read like generic LinkedIn engagement bait. Never produce that.

Output JSON only, matching the required schema exactly.`;

export const buildLinkedInPrompt = (sessionData: {
  dsaScore: number;
  dsaFeedback: string;
  dsaStrengths: string[];
  dsaWeaknesses: string[];
  technicalScore: number;
  technicalFeedback: string;
  technicalStrengths: string[];
  technicalWeaknesses: string[];
}): string => {
  return `Today's interview practice session results:

DSA portion (score: ${sessionData.dsaScore}/100):
Feedback: ${sessionData.dsaFeedback}
Strengths: ${sessionData.dsaStrengths.join(', ')}
Weaknesses: ${sessionData.dsaWeaknesses.join(', ')}

Technical portion (score: ${sessionData.technicalScore}/100):
Feedback: ${sessionData.technicalFeedback}
Strengths: ${sessionData.technicalStrengths.join(', ')}
Weaknesses: ${sessionData.technicalWeaknesses.join(', ')}

Write one LinkedIn post draft based on this session. Pick the single most interesting or specific angle from the above (a particular weakness worked through, a strength that came up, a concept that came up in the technical interview) rather than trying to summarize everything. Keep it focused on ONE concrete thing.`;
};