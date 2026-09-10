import {api} from "./axios";

import type {
  OrdersResponse,
} from "../types/order";

export async function getOrders() {
  const response =
    await api.get<OrdersResponse>(
      "/orders",
    );

  return response.data;
}