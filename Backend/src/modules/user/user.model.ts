import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  preferredInterviewTime: string; // "HH:mm" 24hr format, e.g. "09:00"
  streakCount: number;
  lateCount: number;
  missedCount: number;
  totalSessions: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never returned by default in queries
    },
    preferredInterviewTime: {
      type: String,
      required: true,
      default: '09:00',
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    lateCount: {
      type: Number,
      default: 0,
    },
    missedCount: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);