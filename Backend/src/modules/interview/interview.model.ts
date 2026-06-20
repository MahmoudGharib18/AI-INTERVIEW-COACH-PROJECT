import { Schema, model, Document, Types } from 'mongoose';
import { INTERVIEW_TYPES, InterviewType } from '@/config/constants';

interface IClarificationExchange {
  question: string;
  response: string;
  wasFlagged: boolean;
  usedFallback: boolean;
  askedAt: Date;
}

interface IQuestionAnswer {
  question: string;
  answer: string;
  evaluation?: Types.ObjectId;
  presentedAt: Date;
  clarifications: IClarificationExchange[];
}

export interface IInterview extends Document {
  session: Types.ObjectId;
  type: InterviewType;
  questions: IQuestionAnswer[];
  overallScore?: number;
  overallFeedback?: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const clarificationSchema = new Schema<IClarificationExchange>(
  {
    question: { type: String, required: true },
    response: { type: String, required: true },
    wasFlagged: { type: Boolean, default: false },
    usedFallback: { type: Boolean, default: false },
    askedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

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
          presentedAt: { type: Date, required: true, default: Date.now },
          clarifications: { type: [clarificationSchema], default: [] },
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