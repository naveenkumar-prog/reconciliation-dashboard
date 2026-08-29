import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { explainDiscrepancy } from "../controllers/llm.controller";

const router = Router();

router.post(
  "/explain/:id",
  protect,
  explainDiscrepancy
);

export default router;