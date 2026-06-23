import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { getGithubHistory, submitGithub } from '#/modules/github/github.controller.js';
import { submitGithubSchema } from '#/modules/github/github.validation.js';
import { Router } from 'express';


const router = Router();

router.use(protect);

router.post('/', validate(submitGithubSchema), submitGithub);
router.get('/', getGithubHistory);

export default router;