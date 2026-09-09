import { Router } from "express";

import {
  addCartItem,
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart.controller";

import {
  requireAuth,
} from "../middleware/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  getCart,
);

router.post(
  "/items",
  addCartItem,
);

router.patch(
  "/items/:cartItemId",
  updateCartItem,
);

router.delete(
  "/items/:cartItemId",
  deleteCartItem,
);

export default router;