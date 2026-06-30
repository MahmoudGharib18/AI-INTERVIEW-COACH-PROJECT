import { env } from "#/config/env.js";
import { loginUser, registerUser } from "#/modules/auth/auth.service.js";
import { catchAsync } from "#/shared/utils/catchAsync.js";
import { Request, Response } from "express";


// const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const COOKIE_OPTIONS = {
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
	maxAge: 24 * 60 * 60 * 1000, // keep in sync with JWT_EXPIRES_IN
};

export const register = catchAsync(async (req: Request, res: Response) => {
	const { user, token } = await registerUser(req.body);

	res.cookie("token", token, COOKIE_OPTIONS);

	res.status(201).json({
		success: true,
		data: {
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				preferredInterviewTime: user.preferredInterviewTime,
			},
		},
	});
});

export const login = catchAsync(async (req: Request, res: Response) => {
	const { user, token } = await loginUser(req.body);

	res.cookie("token", token, COOKIE_OPTIONS);

	res.status(200).json({
		success: true,
		data: {
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				preferredInterviewTime: user.preferredInterviewTime,
			},
		},
	});
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
	res.clearCookie("token", COOKIE_OPTIONS);
	res.status(200).json({ success: true, message: "Logged out" });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user!; // protect middleware guarantees this exists

	res.status(200).json({
		success: true,
		data: {
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				preferredInterviewTime: user.preferredInterviewTime,
			},
		},
	});
});
