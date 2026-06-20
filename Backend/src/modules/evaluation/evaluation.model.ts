import { Schema, model, Document, Types } from 'mongoose';

export interface IEvaluation extends Document {
  submission: Types.ObjectId;
  feedback: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  score: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  correctness: boolean;
  problemUnderstanding: number; // 0-10 sub-score
  codeQuality: number;
  readability: number;
  edgeCaseHandling: number;
  createdAt: Date;
  updatedAt: Date;
}

const evaluationSchema = new Schema<IEvaluation>(
  {
    submission: {
      type: Schema.Types.ObjectId,
      ref: 'Submission',
      required: false,
      index: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    timeComplexity: {
      type: String,
    },
    spaceComplexity: {
      type: String,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    correctness: {
      type: Boolean,
      required: false,
    },
    problemUnderstanding: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    codeQuality: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    readability: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    edgeCaseHandling: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Evaluation = model<IEvaluation>('Evaluation', evaluationSchema);