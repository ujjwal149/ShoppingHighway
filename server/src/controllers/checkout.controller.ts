import type {
  Request,
  Response,
} from "express";

import {
  prepareCheckoutSchema,
} from "../validation/checkout.schema";

import {
  prepareCheckout as prepareCheckoutService,
} from "../services/checkout.service";

export const prepareCheckout =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!
          .customerId;

      const parsedBody =
        prepareCheckoutSchema.safeParse(
          req.body,
        );

      if (
        !parsedBody.success
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid checkout data",
            errors:
              parsedBody.error.flatten(),
          });
      }

      const checkout =
        await prepareCheckoutService(
          customerId,
          parsedBody.data
            .addressId,
        );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Checkout verified",
          data: checkout,
        });
    } catch (error) {
      if (
        error instanceof
          Error &&
        error.message ===
          "ADDRESS_NOT_FOUND"
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              "Shipping address not found",
          });
      }

      if (
        error instanceof
          Error &&
        error.message ===
          "CART_EMPTY"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Your cart is empty",
          });
      }

      if (
        error instanceof
          Error &&
        error.message ===
          "INVENTORY_NOT_FOUND"
      ) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "Inventory is unavailable for one or more products",
          });
      }

      if (
        error instanceof
          Error &&
        error.message ===
          "INSUFFICIENT_STOCK"
      ) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "One or more cart items no longer have enough stock",
          });
      }

      console.error(
        "Failed to prepare checkout:",
        error,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to prepare checkout",
        });
    }
  };