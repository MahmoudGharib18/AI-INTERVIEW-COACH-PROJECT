import { PROBLEM_DIFFICULTY, ProblemDifficulty } from '#/config/constants.js';
import { Schema, model, Document } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const problemSchema = new Schema<IProblem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(PROBLEM_DIFFICULTY),
      required: true,
    },
    constraints: {
      type: [String],
      default: [],
    },
    examples: {
      type: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true },
          explanation: { type: String },
        },
      ],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

export const Problem = model<IProblem>('Problem', problemSchema);