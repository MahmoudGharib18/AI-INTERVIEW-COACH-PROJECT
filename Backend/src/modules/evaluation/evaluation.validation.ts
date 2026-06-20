import { z } from "zod";

export const dsaEvaluationSchema = z.object({
	correctness: z.boolean(),
	problemUnderstanding: z.number().min(0).max(10),
	codeQuality: z.number().min(0).max(10),
	readability: z.number().min(0).max(10),
	edgeCaseHandling: z.number().min(0).max(10),
	timeComplexity: z.string(),
	spaceComplexity: z.string(),
	score: z.number().min(0).max(100),
	strengths: z.array(z.string()),
	weaknesses: z.array(z.string()),
	feedback: z.string().min(10),
});

export type DsaEvaluationResult = z.infer<typeof dsaEvaluationSchema>;
