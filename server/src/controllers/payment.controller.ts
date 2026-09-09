import type {
  Request,
  Response,
} from "express";

import {
  prepareCheckoutSchema,
} from "../validation/checkout.schema";

import {
  createPendingOrder,
  releasePendingOrderReservation,
} from "../services/checkout.service";

import {
  createPaymentIntent,
} from "../services/payment.service";


export const startPayment =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!.customerId;

      const parsedBody =
        prepareCheckoutSchema.safeParse(
          req.body,
        );

      if (!parsedBody.success) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid payment data",
            errors:
              parsedBody.error.flatten(),
          });
      }

      /*
       * STEP 1
       *
       * Reserve inventory and create:
       * - Order PENDING
       * - OrderItems
       * - Shipping snapshot
       * - Payment PENDING
       */
      const pendingOrder =
        await createPendingOrder(
          customerId,
          parsedBody.data.addressId,
        );

      /*
       * STEP 2
       *
       * Database transaction has now
       * committed.
       *
       * Stripe is external, so if Stripe
       * fails we must compensate manually.
       */
      try {
        const stripePayment =
          await createPaymentIntent(
            customerId,
            pendingOrder.orderId,
            pendingOrder.paymentId,
          );

        return res
          .status(201)
          .json({
            success: true,
            message:
              "Payment initialized",
            data:
              stripePayment,
          });
      } catch (stripeError) {
        /*
         * Stripe failed AFTER stock
         * was reserved.
         *
         * Restore inventory and mark:
         *
         * Order   → PAYMENT_FAILED
         * Payment → FAILED
         */
        try {
          await releasePendingOrderReservation(
            customerId,
            pendingOrder.orderId,
            pendingOrder.paymentId,
          );
        } catch (
          compensationError
        ) {
          console.error(
            "CRITICAL: Failed to restore inventory after Stripe failure:",
            compensationError,
          );
        }

        /*
         * Send the original Stripe error
         * to the outer catch block.
         */
        throw stripeError;
      }
    } catch (error) {
      if (
        error instanceof Error &&
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
        error instanceof Error &&
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
        error instanceof Error &&
        error.message ===
          "INVALID_CART_QUANTITY"
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid quantity found in cart",
          });
      }

      if (
        error instanceof Error &&
        error.message ===
          "INVENTORY_NOT_FOUND"
      ) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "Inventory is unavailable for one or more items",
          });
      }

      if (
        error instanceof Error &&
        error.message ===
          "INSUFFICIENT_STOCK"
      ) {
        return res
          .status(409)
          .json({
            success: false,
            message:
              "One or more items are no longer available in the requested quantity",
          });
      }

      console.error(
        "Failed to initialize payment:",
        error,
      );

      return res
        .status(500)
        .json({
          success: false,
          message:
            "Failed to initialize payment",
        });
    }
  };