import { Schema, model, Document, Types } from "mongoose";
import { SESSION_STATES, SessionState } from "@/config/constants";

interface IInterviewSummary {
	score: number;
	feedback: string;
	strengths: string[];
	weaknesses: string[];
}

export interface ISession extends Document {
	user: Types.ObjectId;
	scheduledTime: Date;
	startedTime?: Date;
	completedTime?: Date;
	status: SessionState;
	dsaInterview?: Types.ObjectId;
	technicalInterview?: Types.ObjectId;
	dsaSummary?: IInterviewSummary;
	technicalSummary?: IInterviewSummary;
	overallScore?: number;
	summary?: string;
	improvementSuggestions: string[];
	isLate: boolean;
	isMissed: boolean;
	createdAt: Date;
	updatedAt: Date;
    emailFailed: boolean;
}

const interviewSummarySchema = new Schema<IInterviewSummary>(
	{
		score: { type: Number, required: true, min: 0, max: 100 },
		feedback: { type: String, required: true },
		strengths: { type: [String], default: [] },
		weaknesses: { type: [String], default: [] },
	},
	{ _id: false },
);

const sessionSchema = new Schema<ISession>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		scheduledTime: {
			type: Date,
			required: true,
		},
		startedTime: {
			type: Date,
		},
		completedTime: {
			type: Date,
		},
		status: {
			type: String,
			enum: Object.values(SESSION_STATES),
			default: SESSION_STATES.PENDING,
		},
		dsaInterview: {
			type: Schema.Types.ObjectId,
			ref: "Interview",
		},
		technicalInterview: {
			type: Schema.Types.ObjectId,
			ref: "Interview",
		},
		dsaSummary: {
			type: interviewSummarySchema,
		},
		technicalSummary: {
			type: interviewSummarySchema,
		},
		overallScore: {
			type: Number,
			min: 0,
			max: 100,
		},
		summary: {
			type: String,
		},
		improvementSuggestions: {
			type: [String],
			default: [],
		},
		isLate: {
			type: Boolean,
			default: false,
		},
		isMissed: {
			type: Boolean,
			default: false,
		},
		emailFailed: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

export const Session = model<ISession>("Session", sessionSchema);
