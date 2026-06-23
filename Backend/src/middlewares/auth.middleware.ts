import { env } from '#/config/env.js';
import { User } from '#/modules/user/user.model.js';
import { AppError } from '#/shared/errors/AppError.js';
import { catchAsync } from '#/shared/utils/catchAsync.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


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