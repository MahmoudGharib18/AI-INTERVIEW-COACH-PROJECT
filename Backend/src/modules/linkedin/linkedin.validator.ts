import { z } from 'zod';

export const linkedInDraftSchema = z.object({
  postText: z.string().min(50),
  angle: z.string().min(5), // short label of what angle was chosen, e.g. "DSA weakness: recursion"
});

export type LinkedInDraftResult = z.infer<typeof linkedInDraftSchema>;