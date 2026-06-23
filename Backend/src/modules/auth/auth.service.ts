import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '#/config/env.js';
import { LoginInput, RegisterInput } from '#/modules/auth/auth.validation.js';
import { IUser, User } from '#/modules/user/user.model.js';
import { AppError } from '#/shared/errors/AppError.js';


const SALT_ROUNDS = 10;

const signToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

export const registerUser = async (
  input: RegisterInput
): Promise<{ user: IUser; token: string }> => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    preferredInterviewTime: input.preferredInterviewTime,
  });

  const token = signToken(user._id.toString());

  return { user, token };
};

export const loginUser = async (
  input: LoginInput
): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user._id.toString());

  return { user, token };
};