import {
  useEffect,
  useState,
} from "react";

import {
  Package,
} from "lucide-react";

import PageContainer from "../components/layout/PageContainer";

import {
  getOrders,
} from "../api/order.api";

import {
  formatCurrency,
} from "../utils/formatCurrency";

import type {
  CustomerOrder,
} from "../types/order";

export default function OrdersPage() {
  const [
    orders,
    setOrders,
  ] = useState<
    CustomerOrder[]
  >([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          setIsLoading(
            true,
          );

          setError(
            null,
          );

          const response =
            await getOrders();

          setOrders(
            response.data,
          );
        } catch (error) {
          console.error(
            "Failed to load orders:",
            error,
          );

          setError(
            "Unable to load your order history.",
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      };

    loadOrders();
  }, []);

  if (isLoading) {
    return (
      <main className="py-12">
        <PageContainer>
          <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading orders...
          </p>
        </PageContainer>
      </main>
    );
  }

  return (
    <main className="py-8 lg:py-14">
      <PageContainer>
        <div className="mx-auto max-w-4xl">
          <div>
            <h1 className="text-2xl font-semibold uppercase">
              My Orders
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              View your previous
              ShoppingHighway orders.
            </p>
          </div>

          {error && (
            <p className="mt-8 text-sm text-red-600">
              {error}
            </p>
          )}

          {!error &&
            orders.length === 0 && (
              <div className="mt-10 border border-black/10 p-10 text-center">
                <Package
                  size={28}
                  strokeWidth={1.3}
                  className="mx-auto"
                />

                <p className="mt-4 text-sm font-medium uppercase">
                  No orders yet
                </p>

                <p className="mt-2 text-xs text-neutral-500">
                  Your completed
                  orders will appear
                  here.
                </p>
              </div>
            )}

          <div className="mt-8 space-y-6">
            {orders.map(
              (order) => (
                <article
                  key={
                    order.id
                  }
                  className="border border-black/10"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 p-5">
                    <div>
                      <p className="text-xs font-semibold uppercase">
                        Order #
                        {
                          order.id
                        }
                      </p>

                      <p className="mt-1 text-[11px] text-neutral-500">
                        {new Date(
                          order.createdAt,
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day:
                              "2-digit",

                            month:
                              "short",

                            year:
                              "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium uppercase">
                        {
                          order.status
                        }
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {formatCurrency(
                          order.totalAmount,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y divide-black/10">
                    {order.items.map(
                      (
                        item,
                      ) => (
                        <div
                          key={
                            item.id
                          }
                          className="flex gap-4 p-5"
                        >
                          <img
                            src={
                              item
                                .variant
                                .product
                                .imageUrl
                            }
                            alt={
                              item
                                .variant
                                .product
                                .name
                            }
                            loading="lazy"
                            className="size-20 object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium uppercase">
                              {
                                item
                                  .variant
                                  .product
                                  .name
                              }
                            </p>

                            <p className="mt-2 text-xs text-neutral-500">
                              Size:{" "}
                              {
                                item
                                  .variant
                                  .size
                              }
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              Quantity:{" "}
                              {
                                item.quantity
                              }
                            </p>
                          </div>

                          <p className="text-sm">
                            {formatCurrency(
                              item.unitPrice *
                                item.quantity,
                            )}
                          </p>
                        </div>
                      ),
                    )}
                  </div>

                  {order.shippingAddress && (
                    <div className="border-t border-black/10 p-5">
                      <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-500">
                        Delivered To
                      </p>

                      <p className="mt-2 text-sm">
                        {
                          order
                            .shippingAddress
                            .fullName
                        }
                      </p>

                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        {
                          order
                            .shippingAddress
                            .addressLine1
                        }

                        {order
                          .shippingAddress
                          .addressLine2 &&
                          `, ${order.shippingAddress.addressLine2}`}

                        <br />

                        {
                          order
                            .shippingAddress
                            .city
                        }
                        ,{" "}
                        {
                          order
                            .shippingAddress
                            .state
                        }{" "}
                        {
                          order
                            .shippingAddress
                            .postalCode
                        }
                      </p>
                    </div>
                  )}
                </article>
              ),
            )}
          </div>
        </div>
      </PageContainer>
    </main>
  );
}