import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  formatCurrency,
} from "../../utils/formatCurrency";

interface CartSummaryProps {
  subtotal: number;
  shipping?: number;
}

export default function CartSummary({
  subtotal,
  shipping = 0,
}: CartSummaryProps) {
  const navigate = useNavigate();

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

  const total =
    subtotal + shipping;

  return (
    <aside
      className="
        border
        border-black/10
        p-5
        sm:p-6
        lg:sticky
        lg:top-28
      "
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider">
        Order Summary
      </h2>

      <div className="mt-7 space-y-3 border-b border-black/10 pb-6 text-sm">
        <div className="flex justify-between gap-4">
          <span>Subtotal</span>

          <span>
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span>Shipping</span>

          <span>
            {shipping === 0
              ? "Calculated at checkout"
              : formatCurrency(shipping)}
          </span>
        </div>
      </div>

      <div className="flex justify-between gap-4 py-6">
        <div>
          <p className="text-sm font-medium uppercase">
            Total
          </p>

          <p className="mt-1 text-[10px] uppercase text-neutral-500">
            Tax incl.
          </p>
        </div>

        <p className="text-lg font-semibold">
          {formatCurrency(total)}
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-xs text-neutral-600">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) =>
            setAcceptedTerms(
              event.target.checked,
            )
          }
          className="mt-0.5 size-4 accent-black"
        />

        <span>
          I agree to the Terms and
          Conditions
        </span>
      </label>

      <button
        type="button"
        disabled={!acceptedTerms}
        onClick={() =>
          navigate("/checkout")
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
          transition
          hover:opacity-80
          disabled:cursor-not-allowed
          disabled:bg-neutral-300
          disabled:text-neutral-500
        "
      >
        Continue
      </button>
    </aside>
  );
}