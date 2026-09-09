import {
  Router,
} from "express";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../controllers/address.controller";

import {
  requireAuth,
} from "../middleware/auth.middleware";

const router =
  Router();

router.use(
  requireAuth,
);

router.get(
  "/",
  getAddresses,
);

router.post(
  "/",
  createAddress,
);

router.patch(
  "/:addressId",
  updateAddress,
);

router.delete(
  "/:addressId",
  deleteAddress,
);

export default router;