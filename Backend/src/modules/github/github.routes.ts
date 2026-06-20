import { Router } from 'express';
import { protect } from '@/middlewares/auth.middleware';
import { validate } from '@/middlewares/validate.middleware';
import { submitGithubSchema } from './github.validation';
import { submitGithub, getGithubHistory } from './github.controller';

const router = Router();

router.use(protect);

router.post('/', validate(submitGithubSchema), submitGithub);
router.get('/', getGithubHistory);

export default router;