import {
  Minus,
  Plus,
} from "lucide-react";

interface QuantityControlProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

export default function QuantityControl({
  quantity,
  onChange,
}: QuantityControlProps) {
  return (
    <div>
      <p className="text-xs text-neutral-500">
        Quantity
      </p>

      <div className="mt-2 inline-flex h-10 items-center border border-black/20">
        <button
          type="button"
          onClick={() =>
            onChange(Math.max(1, quantity - 1))
          }
          className="flex size-10 items-center justify-center transition hover:bg-black hover:text-white"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>

        <span className="flex h-full min-w-10 items-center justify-center border-x border-black/20 text-xs">
          {quantity}
        </span>

        <button
          type="button"
          onClick={() =>
            onChange(quantity + 1)
          }
          className="flex size-10 items-center justify-center transition hover:bg-black hover:text-white"
          aria-label="Increase quantity"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}