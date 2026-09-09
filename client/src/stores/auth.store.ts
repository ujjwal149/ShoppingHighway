import { create } from "zustand";

import {
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
  signupCustomer,
} from "../api/auth.api";

import {
  useCartStore,
} from "./cart.store";

import type {
  AuthCustomer,
  LoginInput,
  SignupInput,
} from "../types/auth";

type AuthMode =
  | "login"
  | "signup";

interface AuthStore {
  customer:
    AuthCustomer | null;

  isLoading: boolean;

  isInitialized: boolean;

  error:
    string | null;

  isAuthModalOpen: boolean;

  authMode:
    AuthMode;

  initializeAuth:
    () => Promise<void>;

  login:
    (
      input: LoginInput,
    ) => Promise<void>;

  signup:
    (
      input: SignupInput,
    ) => Promise<void>;

  logout:
    () => Promise<void>;

  openAuthModal:
    (
      mode?: AuthMode,
    ) => void;

  closeAuthModal:
    () => void;

  setAuthMode:
    (
      mode: AuthMode,
    ) => void;

  clearError:
    () => void;
}

export const useAuthStore =
  create<AuthStore>((set) => ({
    customer: null,

    isLoading: false,

    isInitialized: false,

    error: null,

    isAuthModalOpen: false,

    authMode: "login",

    initializeAuth:
      async () => {
        try {
          set({
            isLoading: true,
          });

          const response =
            await getCurrentCustomer();

          set({
            customer:
              response.data,
          });

          await useCartStore
            .getState()
            .loadCart();
        } catch {
          set({
            customer: null,
          });
        } finally {
          set({
            isLoading: false,
            isInitialized: true,
          });
        }
      },

    login: async (
      input,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await loginCustomer(
            input,
          );
        
        await useCartStore
          .getState()
          .mergeGuestCartToAuthenticatedCart();
        
        set({
          customer:
            response.data,
        
          isAuthModalOpen:
            false,
        });
      } catch (error) {
        console.error(
          "Login failed:",
          error,
        );

        set({
          error:
            "Invalid email or password.",
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    signup: async (
      input,
    ) => {
      try {
        set({
          isLoading: true,
          error: null,
        });

        const response =
          await signupCustomer(
            input,
          );

        await useCartStore
          .getState()
          .mergeGuestCartToAuthenticatedCart();

        set({
          customer:
            response.data,

          isAuthModalOpen:
            false,
        });

        await useCartStore
          .getState()
          .loadCart();
      } catch (error) {
        console.error(
          "Signup failed:",
          error,
        );

        set({
          error:
            "Unable to create account.",
        });

        throw error;
      } finally {
        set({
          isLoading: false,
        });
      }
    },

    logout: async () => {
      try {
        await logoutCustomer();
      } finally {
        set({
          customer: null,
          error: null,
        });

        useCartStore
          .getState()
          .clearAuthenticatedCart();
      }
    },

    openAuthModal: (
      mode = "login",
    ) => {
      set({
        isAuthModalOpen: true,
        authMode: mode,
        error: null,
      });
    },

    closeAuthModal: () => {
      set({
        isAuthModalOpen: false,
        error: null,
      });
    },

    setAuthMode: (
      mode,
    ) => {
      set({
        authMode: mode,
        error: null,
      });
    },

    clearError: () => {
      set({
        error: null,
      });
    },
  }));