import { Router } from 'express';
import { protect } from '@/middlewares/auth.middleware';
import {
  startTechnical,
  submitTechnical,
  getNextQuestion,
  completeTechnical,
} from './technical-interview.controller';

const router = Router();

router.use(protect);

router.post('/start', startTechnical);
router.post('/:interviewId/submit', submitTechnical);
router.post('/:interviewId/next', getNextQuestion);
router.post('/:interviewId/complete', completeTechnical);

export default router;