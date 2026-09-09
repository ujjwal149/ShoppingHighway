import type {
  Request,
  Response,
} from "express";

import {
  addCartItemSchema,
  cartItemParamsSchema,
  updateCartItemSchema,
} from "../validation/cart.schema";

import {
  addItemToCart,
  getCartByCustomerId,
  updateCartItemQuantity,
  removeCartItem,
} from "../services/cart.service";


// Add Item To Cart
export const addCartItem = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId =
      req.user!.customerId;

    const parsedBody =
      addCartItemSchema.safeParse(
        req.body,
      );

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart data",
        errors:
          parsedBody.error.flatten(),
      });
    }

    const cartItem =
      await addItemToCart(
        customerId,
        parsedBody.data,
      );

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cartItem,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "CUSTOMER_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "VARIANT_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Product variant not found",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "INVENTORY_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory not found",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "INSUFFICIENT_STOCK"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Requested quantity exceeds available stock",
      });
    }

    console.error(
      "Failed to add item to cart:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to add item to cart",
    });
  }
};


// Get Logged-In Customer's Cart
export const getCart = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId =
      req.user!.customerId;

    const cart =
      await getCartByCustomerId(
        customerId,
      );

    return res.status(200).json({
      success: true,
      data: cart,
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
      "Failed to fetch cart:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch cart",
    });
  }
};


// Update Cart Item Quantity
export const updateCartItem = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId =
      req.user!.customerId;

    const parsedParams =
      cartItemParamsSchema.safeParse(
        req.params,
      );

    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid cart item ID",
        errors:
          parsedParams.error.flatten(),
      });
    }

    const parsedBody =
      updateCartItemSchema.safeParse(
        req.body,
      );

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid quantity",
        errors:
          parsedBody.error.flatten(),
      });
    }

    const { cartItemId } =
      parsedParams.data;

    const updatedCartItem =
      await updateCartItemQuantity(
        customerId,
        cartItemId,
        parsedBody.data,
      );

    return res.status(200).json({
      success: true,
      message:
        "Cart quantity updated",
      data: updatedCartItem,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "CART_ITEM_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "INVENTORY_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Inventory not found",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "INSUFFICIENT_STOCK"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Requested quantity exceeds available stock",
      });
    }

    console.error(
      "Failed to update cart quantity:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update cart quantity",
    });
  }
};


// Delete Cart Item
export const deleteCartItem = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId =
      req.user!.customerId;

    const parsedParams =
      cartItemParamsSchema.safeParse(
        req.params,
      );

    if (!parsedParams.success) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid cart item ID",
        errors:
          parsedParams.error.flatten(),
      });
    }

    const { cartItemId } =
      parsedParams.data;

    const deletedCartItem =
      await removeCartItem(
        customerId,
        cartItemId,
      );

    return res.status(200).json({
      success: true,
      message:
        "Item removed from cart",
      data: deletedCartItem,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "CART_ITEM_NOT_FOUND"
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found",
      });
    }

    console.error(
      "Failed to remove cart item:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to remove item from cart",
    });
  }
};