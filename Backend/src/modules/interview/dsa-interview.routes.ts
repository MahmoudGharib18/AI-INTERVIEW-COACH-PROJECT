import { protect } from "#/middlewares/auth.middleware.js";
import { askClarification, completeDsa, getDsa, startDsa, submitDsa } from "#/modules/interview/dsa-interview.controller.js";
import { Router } from "express";


const router = Router();

router.use(protect);

router.post("/start", startDsa);
router.post("/:interviewId/submit", submitDsa);
router.post("/:interviewId/complete", completeDsa);
router.post("/:interviewId/clarify", askClarification);
router.get("/:interviewId", getDsa);

export default router;
