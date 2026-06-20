import { Schema, model, Document, Types } from 'mongoose';
import { INTERVIEW_TYPES, InterviewType } from '@/config/constants';

interface IQuestionAnswer {
  question: string;
  answer: string;
  evaluation?: Types.ObjectId; // ref to Evaluation, set after AI evaluates
}

export interface IInterview extends Document {
  session: Types.ObjectId;
  type: InterviewType;
  questions: IQuestionAnswer[];
  overallScore?: number; // 0-100, set when interview part completes
  overallFeedback?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(INTERVIEW_TYPES),
      required: true,
    },
    questions: {
      type: [
        {
          question: { type: String, required: true },
          answer: { type: String, default: '' },
          evaluation: { type: Schema.Types.ObjectId, ref: 'Evaluation' },
        },
      ],
      default: [],
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    overallFeedback: {
      type: String,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Interview = model<IInterview>('Interview', interviewSchema);