import ProductFilters from "./ProductFilters";

import type {
  ProductFiltersProps,
} from "./ProductFilters";

type MobileFilterDrawerProps =
  Omit<ProductFiltersProps, "onClose"> & {
    isOpen: boolean;
    onClose: () => void;
  };

export default function MobileFilterDrawer({
  isOpen,
  onClose,

  categories,
  selectedCategoryId,
  selectedPrice,
  selectedRating,

  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onClear,
}: MobileFilterDrawerProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 lg:hidden">
      {/* Dark background overlay */}
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />

      {/* Drawer */}
      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[86%]
          max-w-sm
          overflow-y-auto
          bg-[#f4f4f1]
          px-5
          py-5
          shadow-xl
        "
      >
        <ProductFilters
          categories={categories}
          selectedCategoryId={
            selectedCategoryId
          }
          selectedPrice={
            selectedPrice
          }
          selectedRating={
            selectedRating
          }
          onCategoryChange={
            onCategoryChange
          }
          onPriceChange={
            onPriceChange
          }
          onRatingChange={
            onRatingChange
          }
          onClear={onClear}
          onClose={onClose}
        />
      </div>
    </div>
  );
}