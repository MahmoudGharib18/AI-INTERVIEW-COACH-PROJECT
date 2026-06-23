import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { getProfile, updateMyProfile } from '#/modules/user/user.controller.js';
import { updateUserSchema } from '#/modules/user/user.validation.js';
import { Router } from 'express';

const router = Router();

router.use(protect);

router.get('/me', getProfile);
router.patch('/me', validate(updateUserSchema), updateMyProfile);

export default router;