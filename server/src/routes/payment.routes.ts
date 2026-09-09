import {
  Router,
} from "express";

import {
  startPayment,
} from "../controllers/payment.controller";

import {
  requireAuth,
} from "../middleware/auth.middleware";

const router =
  Router();

router.use(
  requireAuth,
);

router.post(
  "/create-intent",
  startPayment,
);

export default router;