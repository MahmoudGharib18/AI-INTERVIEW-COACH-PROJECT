import { getAIProvider } from "#/ai/ai.factory.js";
import { buildProblemGenerationPrompt } from "#/ai/prompts/dsa-interviewer.prompt.js";
import { ProblemDifficulty } from "#/config/constants.js";
import { IProblem, Problem } from "#/modules/problem/problem.model.js";
import { generatedProblemSchema } from "#/modules/problem/problem.validation.js";


export const generateProblem = async (
  difficulty: ProblemDifficulty
): Promise<IProblem> => {
  const provider = getAIProvider();

  const generated = await provider.generateStructured({
    messages: [
      {
        role: 'system',
        content:
          'You are a problem-setter generating original technical interview coding problems. Output JSON only.',
      },
      { role: 'user', content: buildProblemGenerationPrompt(difficulty) },
    ],
    schemaDescription:
      '{ title: string, description: string, difficulty: "EASY"|"MEDIUM"|"HARD", constraints: string[], examples: [{input: string, output: string, explanation?: string}], tags: string[] }',
    validate: (raw) => generatedProblemSchema.parse(raw),
  });

  const problem = await Problem.create(generated);
  return problem;
};

export const generateDailyProblemSet = async (): Promise<{
  easy: IProblem;
  medium: IProblem;
  hard: IProblem;
}> => {
  const [easy, medium, hard] = await Promise.all([
    generateProblem('EASY'),
    generateProblem('MEDIUM'),
    generateProblem('HARD'),
  ]);

  return { easy, medium, hard };
};