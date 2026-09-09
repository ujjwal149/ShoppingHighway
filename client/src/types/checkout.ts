import type {
  ApiResponse,
} from "./api";

import type {
  CustomerAddress,
} from "./address";

export interface CheckoutItem {
  cartItemId: number;

  variantId: number;
  sku: string;
  size: string;

  productId: number;
  productName: string;
  imageUrl: string;

  quantity: number;
  availableStock: number;

  unitPrice: number;
  lineTotal: number;
}

export interface CheckoutPreview {
  address:
    Omit<
      CustomerAddress,
      | "customerId"
      | "isDefault"
      | "createdAt"
      | "updatedAt"
    >;

  items: CheckoutItem[];

  totalAmount: number;
}

export interface PrepareCheckoutInput {
  addressId: number;
}

export type CheckoutPreviewResponse =
  ApiResponse<CheckoutPreview>;