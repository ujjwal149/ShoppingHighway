import FilterSection from "./FilterSection";

import type { Category } from "../../types/category";

export interface ProductFiltersProps {
  categories: Category[];

  selectedCategoryId?: number;
  selectedPrice?: string;
  selectedRating?: number;

  onCategoryChange: (
    categoryId?: number,
  ) => void;

  onPriceChange: (
    value?: string,
  ) => void;

  onRatingChange: (
    rating?: number,
  ) => void;

  onClear: () => void;

  onClose?: () => void;
}

const priceRanges = [
  {
    label: "Under ₹1,500",
    value: "under-1500",
  },
  {
    label: "₹1,500 - ₹3,000",
    value: "1500-3000",
  },
  {
    label: "₹3,000 - ₹5,000",
    value: "3000-5000",
  },
  {
    label: "Above ₹5,000",
    value: "above-5000",
  },
];

const ratings = [
  {
    label: "4.5 & above",
    value: 4.5,
  },
  {
    label: "4.0 & above",
    value: 4,
  },
  {
    label: "3.5 & above",
    value: 3.5,
  },
];

export default function ProductFilters({
  categories,
  selectedCategoryId,
  selectedPrice,
  selectedRating,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClear,
  onClose,
}: ProductFiltersProps) {
  return (
    <aside className="w-full">
      <div className="flex items-center justify-between border-b border-black/10 pb-4">
        <h2 className="text-lg font-semibold tracking-[0.04em]">
          Filters
        </h2>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.08em] text-neutral-500 transition hover:text-black"
          >
            Close
          </button>
        )}
      </div>

      {/* Category */}
      <FilterSection
        title="Category"
        defaultOpen
      >
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={
                  selectedCategoryId ===
                  category.id
                }
                onChange={() =>
                  onCategoryChange(
                    category.id,
                  )
                }
                className="size-4 accent-black"
              />

              <span>
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="price"
                value={range.value}
                checked={
                  selectedPrice ===
                  range.value
                }
                onChange={() =>
                  onPriceChange(
                    range.value,
                  )
                }
                className="size-4 accent-black"
              />

              <span>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Ratings">
        <div className="space-y-3">
          {ratings.map((rating) => (
            <label
              key={rating.value}
              className="flex cursor-pointer items-center gap-3 text-sm"
            >
              <input
                type="radio"
                name="rating"
                value={rating.value}
                checked={
                  selectedRating ===
                  rating.value
                }
                onChange={() =>
                  onRatingChange(
                    rating.value,
                  )
                }
                className="size-4 accent-black"
              />

              <span className="flex items-center gap-2">
                <span>★</span>

                {rating.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <button
        type="button"
        onClick={onClear}
        className="
          mt-6
          w-full
          border
          border-black
          px-4
          py-3
          text-xs
          font-medium
          uppercase
          tracking-[0.08em]
          transition
          hover:bg-black
          hover:text-white
        "
      >
        Clear Filters
      </button>
    </aside>
  );
}