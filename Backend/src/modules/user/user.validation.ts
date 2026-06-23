import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    preferredInterviewTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format')
      .optional(),
  }).refine(
    (data) => data.name !== undefined || data.preferredInterviewTime !== undefined,
    { message: 'At least one field (name or preferredInterviewTime) must be provided' }
  ),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];