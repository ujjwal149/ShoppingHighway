import {
  Router,
} from "express";

import {
  signup,
  login,
  logout,
  getCurrentCustomer,
} from "../controllers/auth.controller";

import {
  requireAuth,
} from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/signup",
  signup,
);

router.post(
  "/login",
  login,
);

router.post(
  "/logout",
  logout,
);

router.get(
  "/me",
  requireAuth,
  getCurrentCustomer,
);

export default router;