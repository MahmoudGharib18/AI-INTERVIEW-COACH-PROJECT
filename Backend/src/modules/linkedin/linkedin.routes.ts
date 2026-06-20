import { Router } from 'express';
import { protect } from '@/middlewares/auth.middleware';
import { createDraft, getDrafts } from './linkedin.controller';

const router = Router();

router.use(protect);

router.post('/generate', createDraft);
router.get('/', getDrafts);

export default router;