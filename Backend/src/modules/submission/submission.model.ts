import { SUBMISSION_SOURCES, SubmissionSource } from "#/config/constants.js";
import { Schema, model, Document, Types } from "mongoose";

export interface ISubmission extends Document {
	user: Types.ObjectId;
	problem: Types.ObjectId;
	code: string;
	language: string;
	source: SubmissionSource;
  problemSnapshot: string;
	createdAt: Date;
	updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		problem: {
			type: Schema.Types.ObjectId,
			ref: "Problem",
			required: false,
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
		problemSnapshot: {
			type: String, // for resumed submissions with no real Problem doc: stores a label like "Problem 1 (EASY)"
			required: false,
		},
	},
	{ timestamps: true },
);

export const Submission = model<ISubmission>("Submission", submissionSchema);
