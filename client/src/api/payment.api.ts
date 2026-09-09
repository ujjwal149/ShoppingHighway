import { api } from "./axios";

import type {
  StartPaymentResponse,
} from "../types/payment";

export async function startPayment(
  addressId: number,
) {
  const response =
    await api.post<StartPaymentResponse>(
      "/payments/create-intent",
      {
        addressId,
      },
    );

  return response.data.data;
}