import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@/modules/user/user.model';
import { AppError } from '@/shared/errors/AppError';
import { catchAsync } from '@/shared/utils/catchAsync';
import { env } from '@/config/env';

interface JwtPayload {
  userId: string;
}

export const protect = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      throw new AppError('Not authenticated. Please log in.', 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw new AppError('Invalid or expired token. Please log in again.', 401);
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('User no longer exists.', 401);
    }

    req.user = user;
    next();
  }
);