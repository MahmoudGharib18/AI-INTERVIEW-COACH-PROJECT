import { IUser, User } from '#/modules/user/user.model.js';
import { UpdateUserInput } from '#/modules/user/user.validation.js';
import { Types } from 'mongoose';


export const findUserById = async (userId: Types.ObjectId | string): Promise<IUser | null> => {
  return User.findById(userId);
};

export const updateUserProfile = async (
  userId: Types.ObjectId | string,
  updates: UpdateUserInput
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
};