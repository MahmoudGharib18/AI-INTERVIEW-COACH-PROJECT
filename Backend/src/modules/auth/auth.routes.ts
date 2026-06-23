import { protect } from '#/middlewares/auth.middleware.js';
import { validate } from '#/middlewares/validate.middleware.js';
import { getMe, login, logout, register } from '#/modules/auth/auth.controller.js';
import { loginSchema, registerSchema } from '#/modules/auth/auth.validation.js';
import { Router } from 'express';


const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;