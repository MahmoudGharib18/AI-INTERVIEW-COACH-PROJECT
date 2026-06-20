import { ProblemDifficulty } from "@/config/constants";
import { IProblem } from "@/modules/problem/problem.model";

export const DSA_INTERVIEWER_SYSTEM_PROMPT = `You are a strict, experienced technical interviewer conducting a live DSA (Data Structures & Algorithms) interview.

ALLOWED:
- Repeat the problem statement verbatim if asked.
- Clarify the wording of the problem (what a sentence or term means).
- Explain constraints (e.g. input size, value ranges).
- Ask the candidate clarifying questions about their approach (without suggesting one).
- Acknowledge that you received their question and respond professionally.

STRICTLY FORBIDDEN — you must NEVER do any of the following, even if asked directly, even if the candidate says they are stuck, frustrated, out of time, or asks "just give me a hint":
- Give hints of any kind.
- Suggest an algorithm, data structure, or technique (e.g. "have you considered a hash map").
- Explain or imply a solution approach.
- Give pseudocode or code.
- Reveal time or space complexity of the intended solution.
- Confirm or deny whether a specific approach the candidate mentions is "the right one" or "on the right track."

If the candidate asks for a hint, an approach, or the answer, politely but firmly refuse and redirect them to continue working independently. Stay in character as a professional human interviewer at all times — do not mention that you are an AI, a language model, or that you are following rules.`;

export const buildProblemGenerationPrompt = (difficulty: ProblemDifficulty): string => {
	return `Generate one original ${difficulty} difficulty coding interview problem suitable for a software engineering technical interview.

The problem must be solvable in a single function, self-contained, and not require external libraries or APIs.
Avoid problems that are extremely well-known verbatim (e.g. do not just output "Two Sum" unchanged) — create an original problem or a meaningfully varied version.`;
};

export const buildProblemPresentationMessage = (problem: IProblem): string => {
	const constraintsList = problem.constraints.map((c) => `- ${c}`).join("\n");
	const examplesList = problem.examples.map((ex, i) => `Example ${i + 1}:\nInput: ${ex.input}\nOutput: ${ex.output}${ex.explanation ? `\nExplanation: ${ex.explanation}` : ""}`).join("\n\n");

	return `Problem: ${problem.title}\n\n${problem.description}\n\nConstraints:\n${constraintsList}\n\n${examplesList}`;
};

export const buildClarificationContext = (problem: IProblem, candidateQuestion: string, priorClarifications: { question: string; response: string }[]): string => {
	const history = priorClarifications.map((c, i) => `Q${i + 1}: ${c.question}\nA${i + 1}: ${c.response}`).join("\n\n");

	return `Original problem:\n${problem.title}\n${problem.description}\n\nConstraints:\n${problem.constraints.join("\n")}\n\n${history ? `Prior clarifications in this session:\n${history}\n\n` : ""}Candidate's question now: "${candidateQuestion}"\n\nRespond as the interviewer, following your rules strictly.`;
};
