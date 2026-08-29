import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  getSummary,
  getDiscrepancies,
  getResults
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/summary", protect, getSummary);
router.get("/discrepancies", protect, getDiscrepancies);
router.get("/results", protect, getResults);

export default router;