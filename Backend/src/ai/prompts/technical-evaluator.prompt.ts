export const TECHNICAL_EVALUATOR_SYSTEM_PROMPT = `You are evaluating a candidate's answer to a single technical interview question. You are a strict, fair reviewer — not the interviewer asking the question.

Assess the answer for: technical accuracy, depth of understanding, clarity of explanation, and practical engineering judgment.

Be honest. Do not inflate scores to be encouraging. Output JSON only, matching the required schema exactly.`;

export const buildAnswerEvaluationPrompt = (
  question: string,
  answer: string
): string => {
  return `Question asked: "${question}"\n\nCandidate's answer: "${answer}"\n\nEvaluate this answer.`;
};

export const TECHNICAL_FINAL_SUMMARY_SYSTEM_PROMPT = `You are summarizing a completed technical interview into final feedback for the candidate. You have access to every question, answer, and per-answer evaluation from the interview.

Produce a holistic assessment: overall strengths, overall weaknesses, areas for improvement, and an overall score. Be specific — reference actual topics or answers from the interview, not generic statements. Output JSON only, matching the required schema exactly.`;

export const buildFinalSummaryPrompt = (
  exchanges: { question: string; answer: string; score: number; feedback: string }[]
): string => {
  const transcript = exchanges
    .map(
      (e, i) =>
        `Q${i + 1}: ${e.question}\nA${i + 1}: ${e.answer}\nPer-answer score: ${e.score}/100\nPer-answer feedback: ${e.feedback}`
    )
    .join('\n\n');

  return `Full technical interview transcript with per-answer evaluations:\n\n${transcript}\n\nProduce the final holistic summary now.`;
};