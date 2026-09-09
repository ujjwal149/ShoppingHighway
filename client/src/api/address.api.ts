import {
  api,
} from "./axios";

import type {
  AddressResponse,
  AddressesResponse,
  CreateAddressInput,
  UpdateAddressInput,
} from "../types/address";

export const getAddresses =
  async (): Promise<AddressesResponse> => {
    const response =
      await api.get(
        "/addresses",
      );

    return response.data;
  };

export const createAddress = async (
  input: CreateAddressInput,
): Promise<AddressResponse> => {
  const response =
    await api.post(
      "/addresses",
      input,
    );

  return response.data;
};

export const updateAddress = async (
  addressId: number,
  input: UpdateAddressInput,
): Promise<AddressResponse> => {
  const response =
    await api.patch(
      `/addresses/${addressId}`,
      input,
    );

  return response.data;
};

export const deleteAddress = async (
  addressId: number,
): Promise<AddressResponse> => {
  const response =
    await api.delete(
      `/addresses/${addressId}`,
    );

  return response.data;
};