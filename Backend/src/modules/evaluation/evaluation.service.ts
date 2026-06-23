import { getAIProvider } from "#/ai/ai.factory.js";
import { DSA_EVALUATOR_SYSTEM_PROMPT, buildEvaluationPrompt } from "#/ai/prompts/dsa-evaluator.prompt.js";
import { TECHNICAL_EVALUATOR_SYSTEM_PROMPT, TECHNICAL_FINAL_SUMMARY_SYSTEM_PROMPT, buildAnswerEvaluationPrompt, buildFinalSummaryPrompt } from "#/ai/prompts/technical-evaluator.prompt.js";
import { Evaluation, IEvaluation } from "#/modules/evaluation/evaluation.model.js";
import { TechnicalFinalSummaryResult, dsaEvaluationSchema, technicalAnswerEvaluationSchema, technicalFinalSummarySchema } from "#/modules/evaluation/evaluation.validation.js";
import { IProblem } from "#/modules/problem/problem.model.js";
import { Types } from "mongoose";


export const evaluateDsaSubmission = async (submissionId: Types.ObjectId, problem: IProblem, code: string, language: string): Promise<IEvaluation> => {
	const provider = getAIProvider();

	const result = await provider.generateStructured({
		messages: [
			{ role: "system", content: DSA_EVALUATOR_SYSTEM_PROMPT },
			{ role: "user", content: buildEvaluationPrompt(problem, code, language) },
		],
		schemaDescription: "{ correctness: boolean, problemUnderstanding: number(0-10), codeQuality: number(0-10), readability: number(0-10), edgeCaseHandling: number(0-10), timeComplexity: string, spaceComplexity: string, score: number(0-100), strengths: string[], weaknesses: string[], feedback: string }",
		validate: (raw) => dsaEvaluationSchema.parse(raw),
	});

	const evaluation = await Evaluation.create({
		submission: submissionId,
		...result,
	});

	return evaluation;
};

export const evaluateTechnicalAnswer = async (question: string, answer: string): Promise<IEvaluation> => {
	const provider = getAIProvider();

	const result = await provider.generateStructured({
		messages: [
			{ role: "system", content: TECHNICAL_EVALUATOR_SYSTEM_PROMPT },
			{ role: "user", content: buildAnswerEvaluationPrompt(question, answer) },
		],
		schemaDescription: "{ score: number(0-100), strengths: string[], weaknesses: string[], feedback: string }",
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

export const generateTechnicalFinalSummary = async (exchanges: { question: string; answer: string; score: number; feedback: string }[]): Promise<TechnicalFinalSummaryResult> => {
	const provider = getAIProvider();

	return provider.generateStructured({
		messages: [
			{ role: "system", content: TECHNICAL_FINAL_SUMMARY_SYSTEM_PROMPT },
			{ role: "user", content: buildFinalSummaryPrompt(exchanges) },
		],
		schemaDescription: "{ overallScore: number(0-100), strengths: string[], weaknesses: string[], areasForImprovement: string[], feedback: string }",
		validate: (raw) => technicalFinalSummarySchema.parse(raw),
	});
};
