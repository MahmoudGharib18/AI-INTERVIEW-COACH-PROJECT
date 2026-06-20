import { Router } from 'express';
import { protect } from '@/middlewares/auth.middleware';
import {
  openSession,
  getSession,
  getActiveSession,
  getHistory,
} from './session.controller';

const router = Router();

router.use(protect); // every session route requires auth

router.get('/active', getActiveSession);
router.get('/history', getHistory);
router.get('/:sessionId', getSession);
router.post('/:sessionId/start', openSession);

export default router;