import { getAIProvider } from '@/ai/ai.factory';
import { Evaluation, IEvaluation } from './evaluation.model';
import { dsaEvaluationSchema } from './evaluation.validation';
import {
  DSA_EVALUATOR_SYSTEM_PROMPT,
  buildEvaluationPrompt,
} from '@/ai/prompts/dsa-evaluator.prompt';
import { IProblem } from '@/modules/problem/problem.model';
import { Types } from 'mongoose';

export const evaluateDsaSubmission = async (
  submissionId: Types.ObjectId,
  problem: IProblem,
  code: string,
  language: string
): Promise<IEvaluation> => {
  const provider = getAIProvider();

  const result = await provider.generateStructured({
    messages: [
      { role: 'system', content: DSA_EVALUATOR_SYSTEM_PROMPT },
      { role: 'user', content: buildEvaluationPrompt(problem, code, language) },
    ],
    schemaDescription:
      '{ correctness: boolean, problemUnderstanding: number(0-10), codeQuality: number(0-10), readability: number(0-10), edgeCaseHandling: number(0-10), timeComplexity: string, spaceComplexity: string, score: number(0-100), strengths: string[], weaknesses: string[], feedback: string }',
    validate: (raw) => dsaEvaluationSchema.parse(raw),
  });

  const evaluation = await Evaluation.create({
    submission: submissionId,
    ...result,
  });

  return evaluation;
};