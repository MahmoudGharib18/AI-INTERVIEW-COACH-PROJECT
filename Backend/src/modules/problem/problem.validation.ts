import { z } from 'zod';
import { PROBLEM_DIFFICULTY } from '@/config/constants';

export const generatedProblemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  difficulty: z.enum([
    PROBLEM_DIFFICULTY.EASY,
    PROBLEM_DIFFICULTY.MEDIUM,
    PROBLEM_DIFFICULTY.HARD,
  ]),
  constraints: z.array(z.string()).min(1),
  examples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional(),
      })
    )
    .min(1),
  tags: z.array(z.string()).default([]),
});

export type GeneratedProblem = z.infer<typeof generatedProblemSchema>;