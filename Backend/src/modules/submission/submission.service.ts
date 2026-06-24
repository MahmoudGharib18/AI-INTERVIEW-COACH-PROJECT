import { Types } from "mongoose";
import { Submission, ISubmission } from "./submission.model";
import { SubmissionSource } from "@/config/constants";

export const createSubmission = async (userId: Types.ObjectId, problemId: Types.ObjectId | string | null, code: string, language: string, source: SubmissionSource, problemSnapshot?: string): Promise<ISubmission> => {
	const isRealProblemId = problemId && typeof problemId !== "string" ? true : isValidObjectIdString(problemId);

	return Submission.create({
		user: userId,
		problem: isRealProblemId ? problemId : undefined,
		problemSnapshot: isRealProblemId ? undefined : problemSnapshot,
		code,
		language,
		source,
	});
};

function isValidObjectIdString(value: unknown): boolean {
	return typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);
}
