import { Router } from 'express';
import { protect } from '@/middlewares/auth.middleware';
import {
  startDsa,
  submitDsa,
  completeDsa,
  askClarification,
} from './dsa-interview.controller';

const router = Router();

router.use(protect);

router.post('/start', startDsa);
router.post('/:interviewId/submit', submitDsa);
router.post('/:interviewId/complete', completeDsa);
router.post('/:interviewId/clarify', askClarification);

export default router;