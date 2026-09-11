import type {
  Request,
  Response,
} from "express";

import {
  createAuthToken,
} from "../utils/auth-token";

import {
  signupSchema,
  loginSchema,
} from "../validation/auth.schema";

import {
  signupCustomer,
  loginCustomer,
  getCustomerById,
} from "../services/auth.service";

export const signup = async (
  req: Request,
  res: Response,
) => {
  try {
    
    const parsedBody =
      signupSchema.safeParse(
        req.body,
      );

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid signup data",
        errors:
          parsedBody.error.flatten(),
      });
    }

    
    const customer =
      await signupCustomer(
        parsedBody.data,
      );

    const token =
      createAuthToken(
        customer.id,
      );
    
    res.cookie(
      "shoppinghighway_auth",
      token,
      {
        httpOnly: true,
      
        secure:
          process.env.NODE_ENV ===
          "production",
      
        sameSite: "lax",
      
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      },
    );

    
    return res.status(201).json({
      success: true,
      message:
        "Account created successfully",
      data: customer,
    });
  } catch (error) {
    
    if (
      error instanceof Error &&
      error.message ===
        "EMAIL_ALREADY_EXISTS"
    ) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists",
      });
    }

    console.error(
      "Failed to create account:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create account",
    });
  }
};

//Login controller
export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const parsedBody =
      loginSchema.safeParse(
        req.body,
      );
      
    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid login data",
        errors:
          parsedBody.error.flatten(),
      });
    }

    const customer =
      await loginCustomer(
        parsedBody.data,
      );

    const token =
      createAuthToken(
        customer.id,
    );

    res.cookie(
      "shoppinghighway_auth",
      token,
      {
        httpOnly: true,
      
        secure:
          process.env.NODE_ENV ===
          "production",
      
        sameSite: "lax",
      
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      },
    );

    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      data: customer,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVALID_CREDENTIALS"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    console.error(
      "Failed to login:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to login",
    });
  }
};

//Me controller
export const getCurrentCustomer =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const customerId =
        req.user!.customerId;

      const customer =
        await getCustomerById(
          customerId,
        );

      return res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message ===
          "CUSTOMER_NOT_FOUND"
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Customer not found",
        });
      }

      console.error(
        "Failed to fetch current customer:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch current customer",
      });
    }
  };

//Logout
export const logout = (
  _req: Request,
  res: Response,
) => {
  res.clearCookie(
    "shoppinghighway_auth",
    {
      httpOnly: true,
      sameSite: "lax",

      secure:
        process.env.NODE_ENV ===
        "production",
    },
  );

  return res.status(200).json({
    success: true,
    message:
      "Logged out successfully",
  });
};