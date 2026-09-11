import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Elements,
} from "@stripe/react-stripe-js";

import {
  loadStripe,
} from "@stripe/stripe-js";

import PageContainer from "../components/layout/PageContainer";

import StripePaymentForm from "../components/checkout/StripePaymentForm";

import {
  createAddress,
  getAddresses,
} from "../api/address.api";

import {
  prepareCheckout,
} from "../api/checkout.api";

import {
  startPayment,
} from "../api/payment.api";

import {
  useCartStore,
} from "../stores/cart.store";

import {
  formatCurrency,
} from "../utils/formatCurrency";

import type {
  AddressLabel,
  CreateAddressInput,
  CustomerAddress,
} from "../types/address";

import type {
  StartPaymentData,
} from "../types/payment";

const stripePublishableKey =
  import.meta.env
    .VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error(
    "VITE_STRIPE_PUBLISHABLE_KEY is not configured",
  );
}

const stripePromise = loadStripe(
  stripePublishableKey,
);

const initialAddress: CreateAddressInput = {
  label: "HOME",

  customLabel: null,

  fullName: "",
  phone: "",

  addressLine1: "",
  addressLine2: "",

  city: "",
  state: "",
  postalCode: "",
  country: "India",

  isDefault: false,
};

export default function CheckoutPage() {
  const items =
    useCartStore(
      (state) =>
        state.items,
    );

  const loadCart =
    useCartStore(
      (state) =>
        state.loadCart,
    );

  const [
    addresses,
    setAddresses,
  ] = useState<
    CustomerAddress[]
  >([]);

  const [
    selectedAddressId,
    setSelectedAddressId,
  ] = useState<
    number | null
  >(null);

  const clearAuthenticatedCart =
  useCartStore(
    (state) =>
      state.clearAuthenticatedCart,
  );

  const [
    showAddressForm,
    setShowAddressForm,
  ] = useState(false);

  const [
    addressForm,
    setAddressForm,
  ] =
    useState<CreateAddressInput>(
      initialAddress,
    );

  const [
    isLoadingAddresses,
    setIsLoadingAddresses,
  ] = useState(true);

  const [
    isSavingAddress,
    setIsSavingAddress,
  ] = useState(false);

  const [
    isPreparingCheckout,
    setIsPreparingCheckout,
  ] = useState(false);

  const [
    paymentData,
    setPaymentData,
  ] = useState<
    StartPaymentData | null
  >(null);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    checkoutMessage,
    setCheckoutMessage,
  ] = useState<
    string | null
  >(null);

  const [
    successfulOrderId,
    setSuccessfulOrderId,
  ] = useState<
    number | null
  >(null);



  useEffect(() => {
    const loadAddresses =
      async () => {
        try {
          setIsLoadingAddresses(
            true,
          );

          setError(
            null,
          );

          const response =
            await getAddresses();

          setAddresses(
            response.data,
          );

          const defaultAddress =
            response.data.find(
              (
                address: CustomerAddress,
              ) =>
                address.isDefault,
            ) ??
            response.data[0];

          if (
            defaultAddress
          ) {
            setSelectedAddressId(
              defaultAddress.id,
            );
          }
        } catch (error) {
          console.error(
            "Failed to load addresses:",
            error,
          );

          setError(
            "Unable to load your saved addresses.",
          );
        } finally {
          setIsLoadingAddresses(
            false,
          );
        }
      };

    loadAddresses();
  }, []);

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        item.variant.product
          .price *
          item.quantity,
      0,
    );

  const updateAddressField =
    (
      field:
        keyof CreateAddressInput,
      value:
        string |
        boolean |
        null,
    ) => {
      setAddressForm(
        (current) => ({
          ...current,
          [field]:
            value,
        }),
      );
    };

  const handleCreateAddress =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      try {
        setIsSavingAddress(
          true,
        );

        setError(
          null,
        );

        const response =
          await createAddress(
            addressForm,
          );

        setAddresses(
          (current) => [
            ...current.map(
              (address) => ({
                ...address,

                isDefault:
                  response.data
                    .isDefault
                    ? false
                    : address
                        .isDefault,
              }),
            ),

            response.data,
          ],
        );

        setSelectedAddressId(
          response.data.id,
        );

        setAddressForm(
          initialAddress,
        );

        setShowAddressForm(
          false,
        );
      } catch (error) {
        console.error(
          "Failed to save address:",
          error,
        );

        setError(
          "Unable to save address. Please check the information and try again.",
        );
      } finally {
        setIsSavingAddress(
          false,
        );
      }
    };

  const handleCheckout =
    async () => {
      if (
        !selectedAddressId
      ) {
        setError(
          "Please select a delivery address.",
        );

        return;
      }

      try {
        setIsPreparingCheckout(
          true,
        );

        setError(
          null,
        );

        setCheckoutMessage(
          null,
        );

        /*
         * Step 1:
         * Ask the backend to verify the
         * cart, address, stock, and total.
         *
         * This does NOT create the order
         * or reserve inventory.
         */
        const checkoutResponse =
          await prepareCheckout({
            addressId:
              selectedAddressId,
          });

       
        const payment =
          await startPayment(
            selectedAddressId,
          );

        setPaymentData(
          payment,
        );

        setCheckoutMessage(
          `Checkout verified. Total: ${formatCurrency(
            checkoutResponse.data
              .totalAmount,
          )}. Complete your payment below.`,
        );
      } catch (error) {
        console.error(
          "Unable to start payment:",
          error,
        );

        setPaymentData(
          null,
        );

        setError(
          "Unable to continue to payment. Your cart, address, or stock may have changed.",
        );
      } finally {
        setIsPreparingCheckout(
          false,
        );
      }
    };

  const handlePaymentSuccess =
  async (
    orderId: number,
  ) => {
    setSuccessfulOrderId(
      orderId,
    );

    setCheckoutMessage(
      null,
    );

    /*
     * Immediately clear the UI.
     *
     * Stripe has confirmed the payment,
     * but the webhook may still be
     * updating PostgreSQL.
     */
    clearAuthenticatedCart();

    /*
     * Wait for the webhook to finish,
     * then retry the server cart.
     */
    for (
      let attempt = 0;
      attempt < 6;
      attempt++
    ) {
      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            1000,
          ),
      );

      try {
        await loadCart();

        const items =
          useCartStore
            .getState()
            .items;

        /*
         * Webhook has finished.
         */
        if (
          items.length === 0
        ) {
          console.log(
            "Cart synchronized after payment.",
          );

          break;
        }

        /*
         * Server still returned the
         * old cart because webhook
         * is processing.
         *
         * Keep UI empty while waiting.
         */
        clearAuthenticatedCart();
      } catch (error) {
        console.error(
          "Cart sync attempt failed:",
          error,
        );
      }
    }
  };

  if (
    isLoadingAddresses
  ) {
    return (
      <main className="py-12">
        <PageContainer>
          <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
            Loading checkout...
          </p>
        </PageContainer>
      </main>
    );
  }



  return (
    <main className="py-8 lg:py-14">
      <PageContainer>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            <h1 className="text-2xl font-semibold uppercase">
              Checkout
            </h1>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase">
                  Delivery Address
                </h2>

                <button
                  type="button"
                  disabled={
                    paymentData !== null
                  }
                  onClick={() =>
                    setShowAddressForm(
                      (current) =>
                        !current,
                    )
                  }
                  className="text-xs underline"
                >
                  {showAddressForm
                    ? "Cancel"
                    : "Add Address"}
                </button>
              </div>

              {addresses.length >
                0 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {addresses.map(
                    (address) => {
                      const label =
                        address.label ===
                          "OTHER"
                          ? address
                              .customLabel ??
                            "Other"
                          : address.label;

                      return (
                        <label
                          key={
                            address.id
                          }
                          className={`
                            cursor-pointer
                            border
                            p-4
                            ${
                              selectedAddressId ===
                              address.id
                                ? "border-black"
                                : "border-black/15"
                            }
                          `}
                        >
                          <div className="flex gap-3">
                            <input
                              type="radio"
                              name="shippingAddress"
                              checked={
                                selectedAddressId ===
                                address.id
                              }
                              disabled={
                                paymentData !==
                                null
                              }
                              onChange={() =>
                                setSelectedAddressId(
                                  address.id,
                                )
                              }
                            />

                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold uppercase">
                                  {
                                    label
                                  }
                                </p>

                                {address.isDefault && (
                                  <span className="text-[10px] uppercase text-neutral-500">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-3 text-sm font-medium">
                                {
                                  address.fullName
                                }
                              </p>

                              <p className="mt-1 text-xs leading-5 text-neutral-600">
                                {
                                  address.addressLine1
                                }

                                {address.addressLine2 &&
                                  `, ${address.addressLine2}`}

                                <br />

                                {
                                  address.city
                                }
                                ,{" "}
                                {
                                  address.state
                                }{" "}
                                {
                                  address.postalCode
                                }

                                <br />

                                {
                                  address.country
                                }

                                <br />

                                {
                                  address.phone
                                }
                              </p>
                            </div>
                          </div>
                        </label>
                      );
                    },
                  )}
                </div>
              )}

              {addresses.length ===
                0 &&
                !showAddressForm && (
                  <div className="mt-5 border border-black/10 p-6 text-sm text-neutral-500">
                    You don't have a
                    saved address yet.
                    Add one to continue.
                  </div>
                )}

              {showAddressForm && (
                <form
                  onSubmit={
                    handleCreateAddress
                  }
                  className="mt-6 space-y-4 border border-black/10 p-5"
                >
                  <div>
                    <label className="text-xs uppercase">
                      Label
                    </label>

                    <select
                      value={
                        addressForm.label
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "label",
                          event
                            .target
                            .value as AddressLabel,
                        )
                      }
                      className="mt-2 w-full border border-black/20 bg-transparent p-3 text-sm"
                    >
                      <option value="HOME">
                        Home
                      </option>

                      <option value="OFFICE">
                        Office
                      </option>

                      <option value="OTHER">
                        Other
                      </option>
                    </select>
                  </div>

                  {addressForm.label ===
                    "OTHER" && (
                    <input
                      required
                      placeholder="Custom label"
                      value={
                        addressForm.customLabel ??
                        ""
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "customLabel",
                          event
                            .target
                            .value,
                        )
                      }
                      className="w-full border border-black/20 bg-transparent p-3 text-sm"
                    />
                  )}

                  <input
                    required
                    placeholder="Full name"
                    value={
                      addressForm.fullName
                    }
                    onChange={(
                      event,
                    ) =>
                      updateAddressField(
                        "fullName",
                        event
                          .target
                          .value,
                      )
                    }
                    className="w-full border border-black/20 bg-transparent p-3 text-sm"
                  />

                  <input
                    required
                    placeholder="Phone"
                    value={
                      addressForm.phone
                    }
                    onChange={(
                      event,
                    ) =>
                      updateAddressField(
                        "phone",
                        event
                          .target
                          .value,
                      )
                    }
                    className="w-full border border-black/20 bg-transparent p-3 text-sm"
                  />

                  <input
                    required
                    placeholder="Address line 1"
                    value={
                      addressForm.addressLine1
                    }
                    onChange={(
                      event,
                    ) =>
                      updateAddressField(
                        "addressLine1",
                        event
                          .target
                          .value,
                      )
                    }
                    className="w-full border border-black/20 bg-transparent p-3 text-sm"
                  />

                  <input
                    placeholder="Address line 2"
                    value={
                      addressForm.addressLine2 ??
                      ""
                    }
                    onChange={(
                      event,
                    ) =>
                      updateAddressField(
                        "addressLine2",
                        event
                          .target
                          .value,
                      )
                    }
                    className="w-full border border-black/20 bg-transparent p-3 text-sm"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      placeholder="City"
                      value={
                        addressForm.city
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "city",
                          event
                            .target
                            .value,
                        )
                      }
                      className="border border-black/20 bg-transparent p-3 text-sm"
                    />

                    <input
                      required
                      placeholder="State"
                      value={
                        addressForm.state
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "state",
                          event
                            .target
                            .value,
                        )
                      }
                      className="border border-black/20 bg-transparent p-3 text-sm"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Postal code"
                      value={
                        addressForm.postalCode
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "postalCode",
                          event
                            .target
                            .value,
                        )
                      }
                      className="border border-black/20 bg-transparent p-3 text-sm"
                    />

                    <input
                      required
                      placeholder="Country"
                      value={
                        addressForm.country
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "country",
                          event
                            .target
                            .value,
                        )
                      }
                      className="border border-black/20 bg-transparent p-3 text-sm"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={
                        addressForm.isDefault ??
                        false
                      }
                      onChange={(
                        event,
                      ) =>
                        updateAddressField(
                          "isDefault",
                          event
                            .target
                            .checked,
                        )
                      }
                    />

                    Make this my
                    default address
                  </label>

                  <button
                    type="submit"
                    disabled={
                      isSavingAddress
                    }
                    className="min-h-12 w-full bg-black px-5 text-xs font-medium uppercase text-white disabled:opacity-50"
                  >
                    {isSavingAddress
                      ? "Saving..."
                      : "Save Address"}
                  </button>
                </form>
              )}
            </div>

            {error && (
              <p className="mt-5 text-sm text-red-600">
                {error}
              </p>
            )}

            {checkoutMessage && (
              <p className="mt-5 text-sm text-green-700">
                {
                  checkoutMessage
                }
              </p>
            )}

            {/* Payment success notification */}
            {successfulOrderId && (
              <div className="mt-8 border border-green-300 bg-green-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                    ✓
                  </div>
            
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-green-900">
                      Payment Successful
                    </h2>
            
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      Your payment was completed
                      successfully. Your order has
                      been placed.
                    </p>
            
                    <p className="mt-2 text-xs text-green-700">
                      Order #{successfulOrderId}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Stripe payment form */}
          {paymentData &&
            !successfulOrderId && (
              <div className="mt-8 border border-black/10 p-5 sm:p-6">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret:
                      paymentData.clientSecret,
                  }}
                >
                  <StripePaymentForm
                    orderId={
                      paymentData.orderId
                    }
                    amount={
                      paymentData.amount
                    }
                    onPaymentSuccess={
                      handlePaymentSuccess
                    }
                  />
                </Elements>
              </div>
            )}

                    

          </section>

          <aside className="border border-black/10 p-6">
            <h2 className="text-sm font-medium uppercase">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3">
              {items.map(
                (item) => (
                  <div
                    key={
                      item.id
                    }
                    className="flex justify-between gap-4 text-sm"
                  >
                    <span>
                      {
                        item.variant
                          .product
                          .name
                      }

                      {" / "}

                      {
                        item.variant
                          .size
                      }

                      {" × "}

                      {
                        item.quantity
                      }
                    </span>

                    <span>
                      {formatCurrency(
                        item.variant
                          .product
                          .price *
                          item.quantity,
                      )}
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-6 flex justify-between border-t border-black/10 pt-4 font-medium">
              <span>
                Total
              </span>

              <span>
                {formatCurrency(
                  subtotal,
                )}
              </span>
            </div>

            {!paymentData && (
              <button
                type="button"
                disabled={
                  !selectedAddressId ||
                  items.length === 0 ||
                  isPreparingCheckout
                }
                onClick={
                  handleCheckout
                }
                className="
                  mt-6
                  min-h-12
                  w-full
                  bg-black
                  px-5
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {isPreparingCheckout
                  ? "Preparing Payment..."
                  : "Continue to Payment"}
              </button>
            )}
          </aside>
        </div>
      </PageContainer>
    </main>
  );
}