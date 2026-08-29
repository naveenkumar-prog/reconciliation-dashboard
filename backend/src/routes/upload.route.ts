import { Router } from "express";

import { upload } from "../config/multer";
import { protect } from "../middleware/auth.middleware";

import {
  uploadOrders,
  uploadPayments
} from "../controllers/upload.controller";

const router = Router();

router.post(
  "/orders",
  protect,
  upload.single("file"),
  uploadOrders
);

router.post(
  "/payments",
  protect,
  upload.single("file"),
  uploadPayments
);

export default router;