import { X } from "lucide-react";

import QuantityControl from "./QuantityControl";

import {
  formatCurrency,
} from "../../utils/formatCurrency";

import type {
  CartItem,
} from "../../types/cart";

interface CartItemCardProps {
  item: CartItem;

  onQuantityChange?: (
    quantity: number,
  ) => void;

  onRemove?: () => void;
}

export default function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const {
    quantity,
    variant,
  } = item;

  const product =
    variant.product;

  return (
    <article
      className="
        grid
        gap-4
        border-b
        border-black/10
        pb-6
        sm:grid-cols-[180px_minmax(0,1fr)]
        lg:grid-cols-[220px_minmax(0,1fr)]
      "
    >
      <div className="overflow-hidden bg-neutral-200">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="
            aspect-4/5
            h-full
            w-full
            object-cover
          "
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.08em] text-neutral-500">
                {variant.sku}
              </p>

              <h2 className="mt-1 text-sm font-medium uppercase">
                {product.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${product.name}`}
              className="text-neutral-500 transition hover:text-black"
            >
              <X
                size={17}
                strokeWidth={1.4}
              />
            </button>
          </div>

          <p className="mt-5 text-xs">
            Size{" "}
            <span className="ml-2 font-medium">
              {variant.size}
            </span>
          </p>

          
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <QuantityControl
            quantity={quantity}
            onChange={
              onQuantityChange ??
              (() => {})
            }
          />

          <p className="text-sm font-medium">
            {formatCurrency(
              product.price *
                quantity,
            )}
          </p>
        </div>
      </div>
    </article>
  );
}