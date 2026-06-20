import { z } from 'zod';

export const submitGithubSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, 'sessionId is required'),
    repositoryUrl: z.string().url('Must be a valid URL'),
    commitUrl: z.string().url('Must be a valid URL').optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export type SubmitGithubInput = z.infer<typeof submitGithubSchema>['body'];