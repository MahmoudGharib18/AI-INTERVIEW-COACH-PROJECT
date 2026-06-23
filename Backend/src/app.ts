import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

// route imports
import authRoutes from './modules/auth/auth.routes.js';
import sessionRoutes from './modules/session/session.routes.js';
import dailySessionRoutes from './modules/session/daily-session.routes.js';
import dsaInterviewRoutes from './modules/interview/dsa-interview.routes.js';
import technicalInterviewRoutes from './modules/interview/technical-interview.routes.js';
import progressRoutes from './modules/progress/progress.routes.js';
import githubRoutes from './modules/github/github.routes.js';
import linkedinRoutes from './modules/linkedin/linkedin.routes.js';
import userRoutes from './modules/user/user.routes.js';


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
app.use('/api/user', userRoutes);

// --- 404 + error handling (must be last, in this order) ---
app.use(notFoundHandler);
app.use(errorHandler);