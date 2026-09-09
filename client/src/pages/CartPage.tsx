import PageContainer from "../components/layout/PageContainer";
import CartItemCard from "../components/cart/CartItemCard";
import CartSummary from "../components/cart/CartSummary";

import {
  useAuthStore,
} from "../stores/auth.store";

import {
  useCartStore,
} from "../stores/cart.store";

import type {
  CartItem,
} from "../types/cart";

export default function CartPage() {
  const customer =
    useAuthStore(
      (state) =>
        state.customer,
    );

  const authenticatedItems =
    useCartStore(
      (state) =>
        state.items,
    );

  const guestItems =
    useCartStore(
      (state) =>
        state.guestItems,
    );

  const isLoading =
    useCartStore(
      (state) =>
        state.isLoading,
    );

  const error =
    useCartStore(
      (state) =>
        state.error,
    );

  const updateItemQuantity =
    useCartStore(
      (state) =>
        state.updateItemQuantity,
    );

  const removeItem =
    useCartStore(
      (state) =>
        state.removeItem,
    );

  const updateGuestItemQuantity =
    useCartStore(
      (state) =>
        state
          .updateGuestItemQuantity,
    );

  const removeGuestItem =
    useCartStore(
      (state) =>
        state.removeGuestItem,
    );

  /*
   * Logged in customer:
   * use PostgreSQL cart.
   *
   * Guest:
   * use localStorage cart.
   */
  const items =
    customer
      ? authenticatedItems
      : guestItems;

  const handleQuantityChange =
    async (
      item: CartItem,
      quantity: number,
    ) => {
      try {
        if (customer) {
          await updateItemQuantity(
            item.id,
            quantity,
          );
        } else {
          updateGuestItemQuantity(
            item.variantId,
            quantity,
          );
        }
      } catch (error) {
        console.error(
          "Failed to update quantity:",
          error,
        );
      }
    };

  const handleRemoveItem =
    async (
      item: CartItem,
    ) => {
      try {
        if (customer) {
          await removeItem(
            item.id,
          );
        } else {
          removeGuestItem(
            item.variantId,
          );
        }
      } catch (error) {
        console.error(
          "Failed to remove cart item:",
          error,
        );
      }
    };

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.variant.product
          .price *
          item.quantity,
      0,
    );

  /*
   * Loading/error belongs to
   * authenticated API cart only.
   *
   * Guest cart is localStorage,
   * so it doesn't need API loading.
   */
  if (
    customer &&
    isLoading
  ) {
    return (
      <main className="py-8 lg:py-14">
        <PageContainer>
          <div className="py-24 text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading your bag...
          </div>
        </PageContainer>
      </main>
    );
  }

  if (
    customer &&
    error
  ) {
    return (
      <main className="py-8 lg:py-14">
        <PageContainer>
          <div className="py-24 text-center">
            <p className="text-sm">
              {error}
            </p>
          </div>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="py-8 lg:py-14">
      <PageContainer>
        <div className="mb-8 border-b border-black/10 pb-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="border-b border-black pb-3 text-xs font-medium uppercase"
            >
              Shopping Bag
            </button>

            <button
              type="button"
              className="pb-3 text-xs uppercase text-neutral-400"
            >
              Favourites
            </button>
          </div>
        </div>

        <div
          className="
            grid
            items-start
            gap-10
            lg:grid-cols-[minmax(0,1fr)_340px]
            xl:grid-cols-[minmax(0,1fr)_380px]
          "
        >
          <section>
            {items.length ===
            0 ? (
              <div className="py-24 text-center">
                <h1 className="text-2xl font-semibold uppercase">
                  Your bag is
                  empty
                </h1>

                <p className="mt-3 text-sm text-neutral-500">
                  Add something
                  from the
                  collection to
                  continue.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map(
                  (item) => (
                    <CartItemCard
                      key={
                        item.variantId
                      }
                      item={
                        item
                      }
                      onQuantityChange={(
                        quantity,
                      ) =>
                        handleQuantityChange(
                          item,
                          quantity,
                        )
                      }
                      onRemove={() =>
                        handleRemoveItem(
                          item,
                        )
                      }
                    />
                  ),
                )}
              </div>
            )}
          </section>

          {items.length > 0 && (
            <CartSummary
              subtotal={
                subtotal
              }
            />
          )}
        </div>
      </PageContainer>
    </main>
  );
}