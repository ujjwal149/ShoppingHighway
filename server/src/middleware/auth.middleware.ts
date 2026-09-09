import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  verifyAuthToken,
} from "../utils/auth-token";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies[
        "shoppinghighway_auth"
      ];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    const payload =
      verifyAuthToken(token);

    req.user = {
      customerId:
        payload.customerId,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired session",
    });
  }
};