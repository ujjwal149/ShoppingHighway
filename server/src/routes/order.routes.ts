import {
  Router,
} from "express";

import {
  getOrders,
} from "../controllers/order.controller";

import {
  requireAuth,
} from "../middleware/auth.middleware";

const router = Router();

router.use(
  requireAuth,
);

router.get(
  "/",
  getOrders,
);

export default router;