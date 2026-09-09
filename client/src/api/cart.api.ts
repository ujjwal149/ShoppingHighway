import { api } from "./axios";

import type {
  AddCartItemInput,
  UpdateCartItemInput,
  CartResponse,
  CartItemResponse,
} from "../types/cart";

export const getCart =
  async (): Promise<CartResponse> => {
    const response =
      await api.get(
        "/cart",
      );

    return response.data;
  };

export const addCartItem = async (
  input: AddCartItemInput,
): Promise<CartItemResponse> => {
  const response =
    await api.post(
      "/cart/items",
      input,
    );

  return response.data;
};

export const updateCartItem = async (
  cartItemId: number,
  input: UpdateCartItemInput,
): Promise<CartItemResponse> => {
  const response =
    await api.patch(
      `/cart/items/${cartItemId}`,
      input,
    );

  return response.data;
};

export const removeCartItem = async (
  cartItemId: number,
): Promise<CartItemResponse> => {
  const response =
    await api.delete(
      `/cart/items/${cartItemId}`,
    );

  return response.data;
};