import { getUserProfile, updateProfile } from '#/modules/user/user.service.js';
import { catchAsync } from '#/shared/utils/catchAsync.js';
import { Request, Response } from 'express';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const user = await getUserProfile(userId);

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

export const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!._id;

  const user = await updateProfile(userId, req.body);

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