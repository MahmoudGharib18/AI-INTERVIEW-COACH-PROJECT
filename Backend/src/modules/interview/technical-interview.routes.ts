import { protect } from "#/middlewares/auth.middleware.js";
import { completeTechnical, getNextQuestion, getTechnical, startTechnical, submitTechnical } from "#/modules/interview/technical-interview.controller.js";
import { Router } from "express";


const router = Router();

router.use(protect);

router.post("/start", startTechnical);
router.post("/:interviewId/submit", submitTechnical);
router.post("/:interviewId/next", getNextQuestion);
router.post("/:interviewId/complete", completeTechnical);
router.get("/:interviewId", getTechnical);

export default router;
