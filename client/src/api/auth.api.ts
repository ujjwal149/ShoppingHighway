import { api } from "./axios";

import type {
  AuthResponse,
  CurrentCustomerResponse,
  LoginInput,
  LogoutResponse,
  SignupInput,
} from "../types/auth";

export const loginCustomer = async (
  input: LoginInput,
): Promise<AuthResponse> => {
  const response =
    await api.post(
      "/auth/login",
      input,
    );

  return response.data;
};

export const signupCustomer = async (
  input: SignupInput,
): Promise<AuthResponse> => {
  const response =
    await api.post(
      "/auth/signup",
      input,
    );

  return response.data;
};

export const getCurrentCustomer =
  async (): Promise<CurrentCustomerResponse> => {
    const response =
      await api.get(
        "/auth/me",
      );

    return response.data;
  };

export const logoutCustomer =
  async (): Promise<LogoutResponse> => {
    const response =
      await api.post(
        "/auth/logout",
      );

    return response.data;
  };