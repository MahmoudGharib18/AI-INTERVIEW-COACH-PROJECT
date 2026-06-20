import { getAIProvider } from '@/ai/ai.factory';
import { Evaluation, IEvaluation } from './evaluation.model';
import { dsaEvaluationSchema } from './evaluation.validation';
import {
  DSA_EVALUATOR_SYSTEM_PROMPT,
  buildEvaluationPrompt,
} from '@/ai/prompts/dsa-evaluator.prompt';
import { IProblem } from '@/modules/problem/problem.model';
import { Types } from 'mongoose';
import {
  TECHNICAL_EVALUATOR_SYSTEM_PROMPT,
  buildAnswerEvaluationPrompt,
} from '@/ai/prompts/technical-evaluator.prompt';
import { technicalAnswerEvaluationSchema } from './evaluation.validation';
import {
  TECHNICAL_FINAL_SUMMARY_SYSTEM_PROMPT,
  buildFinalSummaryPrompt,
} from '@/ai/prompts/technical-evaluator.prompt';
import { technicalFinalSummarySchema, TechnicalFinalSummaryResult } from './evaluation.validation';


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

export const evaluateTechnicalAnswer = async (
  question: string,
  answer: string
): Promise<IEvaluation> => {
  const provider = getAIProvider();

  const result = await provider.generateStructured({
    messages: [
      { role: 'system', content: TECHNICAL_EVALUATOR_SYSTEM_PROMPT },
      { role: 'user', content: buildAnswerEvaluationPrompt(question, answer) },
    ],
    schemaDescription:
      '{ score: number(0-100), strengths: string[], weaknesses: string[], feedback: string }',
    validate: (raw) => technicalAnswerEvaluationSchema.parse(raw),
  });

  const evaluation = await Evaluation.create({
    score: result.score,
    strengths: result.strengths,
    weaknesses: result.weaknesses,
    feedback: result.feedback,
  });

  return evaluation;
};

export const generateTechnicalFinalSummary = async (
  exchanges: { question: string; answer: string; score: number; feedback: string }[]
): Promise<TechnicalFinalSummaryResult> => {
  const provider = getAIProvider();

  return provider.generateStructured({
    messages: [
      { role: 'system', content: TECHNICAL_FINAL_SUMMARY_SYSTEM_PROMPT },
      { role: 'user', content: buildFinalSummaryPrompt(exchanges) },
    ],
    schemaDescription:
      '{ overallScore: number(0-100), strengths: string[], weaknesses: string[], areasForImprovement: string[], feedback: string }',
    validate: (raw) => technicalFinalSummarySchema.parse(raw),
  });
};