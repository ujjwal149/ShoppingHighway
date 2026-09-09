import type {
  ProductVariant,
} from "../../types/product";

interface SizeSelectorProps {
  variants: ProductVariant[];

  selectedVariantId:
    number | null;

  onSelect:
    (variantId: number) => void;
}

export default function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div>
      <p className="text-xs text-neutral-500">
        Size
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected =
            selectedVariantId ===
            variant.id;

          const isOutOfStock =
            !variant.inventory ||
            variant.inventory.quantity <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() =>
                onSelect(variant.id)
              }
              className={`
                flex
                h-9
                min-w-10
                items-center
                justify-center
                border
                px-3
                text-[10px]
                font-medium
                uppercase
                transition

                ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-black/20 hover:border-black"
                }

                ${
                  isOutOfStock
                    ? "cursor-not-allowed opacity-30 line-through"
                    : ""
                }
              `}
            >
              {variant.size}
            </button>
          );
        })}
      </div>
    </div>
  );
}