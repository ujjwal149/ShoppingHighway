import type {
  Request,
  Response,
} from "express";

import {
  getCustomerOrders,
} from "../services/order.service";

export const getOrders =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!.customerId;

      const orders =
        await getCustomerOrders(
          customerId,
        );

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error(
        "Failed to get orders:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load orders.",
      });
    }
  };