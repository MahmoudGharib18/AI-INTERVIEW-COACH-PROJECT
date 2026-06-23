import { SubmissionSource } from "#/config/constants.js";
import { ISubmission, Submission } from "#/modules/submission/submission.model.js";
import { Types } from "mongoose";


export const createSubmission = async (userId: Types.ObjectId, problemId: Types.ObjectId, code: string, language: string, source: SubmissionSource): Promise<ISubmission> => {
	return Submission.create({
		user: userId,
		problem: problemId,
		code,
		language,
		source,
	});
};
