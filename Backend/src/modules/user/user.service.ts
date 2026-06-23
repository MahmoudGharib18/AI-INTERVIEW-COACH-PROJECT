import { IUser } from '#/modules/user/user.model.js';
import { findUserById, updateUserProfile } from '#/modules/user/user.repository.js';
import { UpdateUserInput } from '#/modules/user/user.validation.js';
import { AppError } from '#/shared/errors/AppError.js';
import { Types } from 'mongoose';


export const getUserProfile = async (userId: Types.ObjectId | string): Promise<IUser> => {
  const user = await findUserById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

export const updateProfile = async (
  userId: Types.ObjectId | string,
  updates: UpdateUserInput
): Promise<IUser> => {
  const updatedUser = await updateUserProfile(userId, updates);
  if (!updatedUser) throw new AppError('User not found', 404);
  return updatedUser;
};