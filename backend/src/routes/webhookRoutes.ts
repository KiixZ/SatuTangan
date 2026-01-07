import { Router } from "express";
import webhookController from "../controllers/webhookController";

const router = Router();

// Midtrans webhook endpoint (no auth required - verified by signature)
router.post("/midtrans", (req, res) =>
  webhookController.handleMidtransNotification(req, res),
);

// Midtrans redirect endpoints (called when user finishes payment)
router.get("/midtrans/finish", (req, res) =>
  webhookController.handleFinishRedirect(req, res),
);
router.get("/midtrans/unfinish", (req, res) =>
  webhookController.handleUnfinishRedirect(req, res),
);
router.get("/midtrans/error", (req, res) =>
  webhookController.handleErrorRedirect(req, res),
);

export default router;
