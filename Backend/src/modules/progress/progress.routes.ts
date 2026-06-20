import { Router } from 'express';
import { protect } from '@/middlewares/auth.middleware';
import { getOverview, getTrend } from './progress.controller';

const router = Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/trend', getTrend);
router.get('/weaknesses', getWeaknesses);
export default router;