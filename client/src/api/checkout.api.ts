import {
  api,
} from "./axios";

import type {
  CheckoutPreviewResponse,
  PrepareCheckoutInput,
} from "../types/checkout";

export const prepareCheckout =
  async (
    input: PrepareCheckoutInput,
  ): Promise<CheckoutPreviewResponse> => {
    const response =
      await api.post(
        "/checkout",
        input,
      );

    return response.data;
  };