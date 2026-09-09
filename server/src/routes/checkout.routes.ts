import {
  Router,
} from "express";

import {
  prepareCheckout,
} from "../controllers/checkout.controller";

import {
  requireAuth,
} from "../middleware/auth.middleware";

const router =
  Router();

router.use(
  requireAuth,
);

router.post(
  "/",
  prepareCheckout,
);

export default router;