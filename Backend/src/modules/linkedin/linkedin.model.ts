import { Schema, model, Document, Types } from 'mongoose';

export interface ILinkedInDraft extends Document {
  user: Types.ObjectId;
  session: Types.ObjectId;
  postText: string;
  angle: string;
  createdAt: Date;
  updatedAt: Date;
}

const linkedInDraftSchema = new Schema<ILinkedInDraft>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    postText: {
      type: String,
      required: true,
    },
    angle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const LinkedInDraft = model<ILinkedInDraft>('LinkedInDraft', linkedInDraftSchema);