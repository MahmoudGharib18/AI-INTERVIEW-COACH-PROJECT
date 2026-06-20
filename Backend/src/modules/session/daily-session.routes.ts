import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import { begin, advanceToTechnical, finish } from "./daily-session.controller";

const router = Router();

router.use(protect);

router.post("/:sessionId/begin", begin);
router.post("/:sessionId/advance-to-technical", advanceToTechnical);
router.post("/:sessionId/finish", finish);

export default router;
