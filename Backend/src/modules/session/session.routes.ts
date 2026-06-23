import { protect } from '#/middlewares/auth.middleware.js';
import { getActiveSession, getHistory, getSession, openSession } from '#/modules/session/session.controller.js';
import { Router } from 'express';


const router = Router();

router.use(protect); // every session route requires auth

router.get('/active', getActiveSession);
router.get('/history', getHistory);
router.get('/:sessionId', getSession);
router.post('/:sessionId/start', openSession);

export default router;