import { create } from "zustand";

import {
  persist,
} from "zustand/middleware";

import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from "../api/cart.api";

import type {
  AddCartItemInput,
  CartItem,
} from "../types/cart";

import type {
  ProductDetail,
  ProductVariant,
} from "../types/product";

interface CartStore {
  /*
   * Authenticated customer's
   * database cart.
   */
  items: CartItem[];

  /*
   * Guest cart.
   * This is persisted in localStorage.
   */
  guestItems: CartItem[];

  isLoading: boolean;
  error: string | null;

  // Authenticated cart actions
  loadCart: () => Promise<void>;

  addItem: (
    input: AddCartItemInput,
  ) => Promise<void>;

  mergeGuestCartToAuthenticatedCart:
    () => Promise<void>;

  updateItemQuantity: (
    cartItemId: number,
    quantity: number,
  ) => Promise<void>;

  removeItem: (
    cartItemId: number,
  ) => Promise<void>;

  clearAuthenticatedCart: () => void;

  // Guest cart actions
  addGuestItem: (
    product: ProductDetail,
    variant: ProductVariant,
    quantity: number,
  ) => void;

  updateGuestItemQuantity: (
    variantId: number,
    quantity: number,
  ) => void;

  removeGuestItem: (
    variantId: number,
  ) => void;

  clearGuestCart: () => void;

 
}

export const useCartStore =
  create<CartStore>()(
    persist(
      (set, get) => ({
        items: [],

        guestItems: [],

        isLoading: false,

        error: null,

        /*
         * -------------------------
         * AUTHENTICATED CART
         * -------------------------
         */

        loadCart: async () => {
          try {
            set({
              isLoading: true,
              error: null,
            });

            const response =
              await getCart();

            set({
              items:
                response.data.items,
            });
          } catch (error) {
            console.error(
              "Failed to load cart:",
              error,
            );

            set({
              items: [],
              error:
                "Unable to load cart.",
            });
          } finally {
            set({
              isLoading: false,
            });
          }
        },

        addItem: async (
          input,
        ) => {
          await addCartItem(
            input,
          );

          /*
           * Reload full cart because
           * POST response does not contain
           * nested variant/product data.
           */
          await get().loadCart();
        },

        updateItemQuantity:
          async (
            cartItemId,
            quantity,
          ) => {
            await updateCartItem(
              cartItemId,
              {
                quantity,
              },
            );

            set((state) => ({
              items:
                state.items.map(
                  (item) =>
                    item.id ===
                    cartItemId
                      ? {
                          ...item,
                          quantity,
                        }
                      : item,
                ),
            }));
          },

        removeItem: async (
          cartItemId,
        ) => {
          await removeCartItem(
            cartItemId,
          );

          set((state) => ({
            items:
              state.items.filter(
                (item) =>
                  item.id !==
                  cartItemId,
              ),
          }));
        },

        mergeGuestCartToAuthenticatedCart:
            async () => {
              const guestItems =
                get().guestItems;
            
              /*
               * Nothing from guest cart to merge.
               * Just load the existing DB cart.
               */
              if (guestItems.length === 0) {
                await get().loadCart();
                return;
              }
            
              try {
                /*
                 * Send every guest cart item
                 * to the authenticated backend cart.
                 *
                 * The backend already handles:
                 *
                 * existing variant
                 * → increase quantity
                 *
                 * new variant
                 * → create CartItem
                 */
                for (const item of guestItems) {
                  await addCartItem({
                    variantId:
                      item.variantId,
                  
                    quantity:
                      item.quantity,
                  });
                }
              
                /*
                 * All guest items successfully
                 * reached the database.
                 *
                 * Now it is safe to remove
                 * local guest cart.
                 */
                set({
                  guestItems: [],
                });
              
                /*
                 * Fetch complete DB cart with
                 * nested product/variant details.
                 */
                await get().loadCart();
              } catch (error) {
                console.error(
                  "Failed to merge guest cart:",
                  error,
                );
              
                /*
                 * Important:
                 * don't clear guestItems when
                 * merge fails.
                 */
                throw error;
              }
            },
          
          clearAuthenticatedCart:
            () => {
            set({
              items: [],
              error: null,
              isLoading: false,
            });
          },

        /*
         * -------------------------
         * GUEST CART
         * -------------------------
         */

        addGuestItem: (
          product,
          variant,
          quantity,
        ) => {
          const existingItem =
            get().guestItems.find(
              (item) =>
                item.variantId ===
                variant.id,
            );

          const availableStock =
            variant.inventory
              ?.quantity ?? 0;

          /*
           * Same variant already
           * exists in guest cart.
           */
          if (existingItem) {
            const finalQuantity =
              existingItem.quantity +
              quantity;

            if (
              finalQuantity >
              availableStock
            ) {
              throw new Error(
                "INSUFFICIENT_STOCK",
              );
            }

            set((state) => ({
              guestItems:
                state.guestItems.map(
                  (item) =>
                    item.variantId ===
                    variant.id
                      ? {
                          ...item,
                          quantity:
                            finalQuantity,
                        }
                      : item,
                ),
            }));

            return;
          }

          /*
           * New guest CartItem.
           *
           * cartId = 0 because this cart
           * does not exist in PostgreSQL.
           *
           * id uses the variant ID because
           * variant IDs are unique.
           */
          const guestItem: CartItem = {
            id: variant.id,
            cartId: 0,

            variantId:
              variant.id,

            quantity,

            variant: {
              id: variant.id,
              sku: variant.sku,
              size: variant.size,

              productId:
                variant.productId,

              product,

              inventory:
                variant.inventory
                  ? {
                      id:
                        variant.inventory
                          .id,

                      quantity:
                        variant.inventory
                          .quantity,

                      variantId:
                        variant.inventory
                          .variantId,
                    }
                  : null,
            },
          };

          set((state) => ({
            guestItems: [
              ...state.guestItems,
              guestItem,
            ],
          }));
        },

        updateGuestItemQuantity: (
          variantId,
          quantity,
        ) => {
          const item =
            get().guestItems.find(
              (item) =>
                item.variantId ===
                variantId,
            );

          if (!item) {
            return;
          }

          const availableStock =
            item.variant.inventory
              ?.quantity ?? 0;

          if (
            quantity >
            availableStock
          ) {
            throw new Error(
              "INSUFFICIENT_STOCK",
            );
          }

          set((state) => ({
            guestItems:
              state.guestItems.map(
                (item) =>
                  item.variantId ===
                  variantId
                    ? {
                        ...item,
                        quantity,
                      }
                    : item,
              ),
          }));
        },

        removeGuestItem: (
          variantId,
        ) => {
          set((state) => ({
            guestItems:
              state.guestItems.filter(
                (item) =>
                  item.variantId !==
                  variantId,
              ),
          }));
        },

        clearGuestCart: () => {
          set({
            guestItems: [],
          });
        },
      }),

      {
        /*
         * localStorage key
         */
        name:
          "shoppinghighway-guest-cart",

        /*
         * CRITICAL:
         *
         * Persist ONLY guestItems.
         *
         * Authenticated database cart
         * must never be stored here.
         */
        partialize: (state) => ({
          guestItems:
            state.guestItems,
        }),
      },
    ),
  );