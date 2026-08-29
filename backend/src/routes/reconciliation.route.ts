import { Router } from "express";

import { protect } from "../middleware/auth.middleware";

import {
  runReconciliation
} from "../controllers/reconciliation.controller";

const router = Router();

router.post(
  "/run",
  protect,
  runReconciliation
);

export default router;