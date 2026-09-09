import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  useState,
  type FormEvent,
} from "react";

type StripePaymentFormProps = {
  orderId: number;
  amount: number;

  onPaymentSuccess: (
    orderId: number,
  ) => void;
};

export default function StripePaymentForm({
  orderId,
  amount,
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [
    isPaying,
    setIsPaying,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !stripe ||
      !elements
    ) {
      return;
    }

    try {
      setIsPaying(true);
      setErrorMessage(null);

      const result =
        await stripe.confirmPayment({
          elements,

          confirmParams: {
            return_url:
              `${window.location.origin}/checkout`,
          },

          redirect:
            "if_required",
        });

      if (result.error) {
        setErrorMessage(
          result.error.message ??
            "Payment failed.",
        );

        return;
      }

      if (
        result.paymentIntent
          ?.status ===
        "succeeded"
      ) {
        /*
         * Stripe confirmed the payment.
         *
         * Backend webhook remains the
         * authoritative source for
         * marking the order PAID.
         */
        onPaymentSuccess(
          orderId,
        );
      }
    } catch (error) {
      console.error(
        "Payment confirmation failed:",
        error,
      );

      setErrorMessage(
        "Unable to complete payment.",
      );
    } finally {
      setIsPaying(false);
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Payment
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Amount:{" "}
          {new Intl.NumberFormat(
            "en-IN",
            {
              style:
                "currency",
              currency:
                "INR",
            },
          ).format(
            amount / 100,
          )}
        </p>
      </div>

      <PaymentElement />

      {errorMessage && (
        <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={
          !stripe ||
          isPaying
        }
        className="min-h-12 w-full bg-black px-5 text-xs font-medium uppercase text-white disabled:opacity-50"
      >
        {isPaying
          ? "Processing Payment..."
          : `Pay ${new Intl.NumberFormat(
              "en-IN",
              {
                style:
                  "currency",
                currency:
                  "INR",
              },
            ).format(
              amount / 100,
            )}`}
      </button>
    </form>
  );
}