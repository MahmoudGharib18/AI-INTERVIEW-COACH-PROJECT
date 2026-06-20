import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '@/config/env';
import { errorHandler, notFoundHandler } from '@/middlewares/error.middleware';

// route imports
import authRoutes from '@/modules/auth/auth.routes';
import sessionRoutes from '@/modules/session/session.routes';
import dailySessionRoutes from '@/modules/session/daily-session.routes';
import dsaInterviewRoutes from '@/modules/interview/dsa-interview.routes';
import technicalInterviewRoutes from '@/modules/interview/technical-interview.routes';
import progressRoutes from '@/modules/progress/progress.routes';
import githubRoutes from '@/modules/github/github.routes';
import linkedinRoutes from '@/modules/linkedin/linkedin.routes';

export const app: Application = express();

// --- core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // required for the httpOnly cookie to be sent cross-origin
  })
);
app.use(express.json());
app.use(cookieParser());

// --- health check ---
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'OK' });
});

// --- routes ---
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/daily-session', dailySessionRoutes);
app.use('/api/dsa-interview', dsaInterviewRoutes);
app.use('/api/technical-interview', technicalInterviewRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/linkedin', linkedinRoutes);

// --- 404 + error handling (must be last, in this order) ---
app.use(notFoundHandler);
app.use(errorHandler);