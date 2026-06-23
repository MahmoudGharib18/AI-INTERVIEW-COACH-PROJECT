import { SUBMISSION_SOURCES, SubmissionSource } from '#/config/constants.js';
import { Schema, model, Document, Types } from 'mongoose';

export interface ISubmission extends Document {
  user: Types.ObjectId;
  problem: Types.ObjectId;
  code: string;
  language: string;
  source: SubmissionSource;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      enum: Object.values(SUBMISSION_SOURCES),
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Submission = model<ISubmission>('Submission', submissionSchema);