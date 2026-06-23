import { protect } from "#/middlewares/auth.middleware.js";
import { advanceToTechnical, begin, finish } from "#/modules/session/daily-session.controller.js";
import { Router } from "express";


const router = Router();

router.use(protect);

router.post("/:sessionId/begin", begin);
router.post("/:sessionId/advance-to-technical", advanceToTechnical);
router.post("/:sessionId/finish", finish);

export default router;
