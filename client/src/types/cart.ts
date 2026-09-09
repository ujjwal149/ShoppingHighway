import type {
  Product,
} from "./product";

import type {
  ApiResponse,
  ApiMessageResponse,
} from "./api";

export interface CartInventory {
  id: number;
  quantity: number;
  variantId: number;
}

export interface CartVariant {
  id: number;
  sku: string;
  size: string;
  productId: number;

  product: Product;

  inventory:
    CartInventory | null;
}

export interface CartItem {
  id: number;
  cartId: number;
  variantId: number;
  quantity: number;

  variant: CartVariant;
}

export interface Cart {
  id: number | null;
  customerId: number;
  items: CartItem[];
}

export interface AddCartItemInput {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export type CartResponse =
  ApiResponse<Cart>;

export type CartItemResponse =
  ApiMessageResponse<CartItem>;