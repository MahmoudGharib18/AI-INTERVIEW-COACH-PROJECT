import { protect } from '#/middlewares/auth.middleware.js';
import { getOverview, getTrend, getWeaknesses } from '#/modules/progress/progress.controller.js';
import { Router } from 'express';


const router = Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/trend', getTrend);
router.get('/weaknesses', getWeaknesses);
export default router;