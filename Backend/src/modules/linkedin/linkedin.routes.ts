import { protect } from '#/middlewares/auth.middleware.js';
import { createDraft, getDrafts } from '#/modules/linkedin/linkedin.controller.js';
import { Router } from 'express';


const router = Router();

router.use(protect);

router.post('/generate', createDraft);
router.get('/', getDrafts);

export default router;