import { Types } from 'mongoose';
import { Submission, ISubmission } from './submission.model';
import { SubmissionSource } from '@/config/constants';

export const createSubmission = async (
  userId: Types.ObjectId,
  problemId: Types.ObjectId,
  code: string,
  language: string,
  source: SubmissionSource
): Promise<ISubmission> => {
  return Submission.create({
    user: userId,
    problem: problemId,
    code,
    language,
    source,
  });
};