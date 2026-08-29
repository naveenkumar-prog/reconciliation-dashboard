import { Request, Response } from "express";

import {
  reconcileUserData
} from "../services/reconciliation.service";

export const runReconciliation =
  async (
    req: any,
    res: Response
  ) => {

    await reconcileUserData(
      req.userId
    );

    res.json({
      message:
        "Reconciliation completed"
    });
  };

  console.log("runReconciliation", runReconciliation);