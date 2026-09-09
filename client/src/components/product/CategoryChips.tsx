import type {
  Category,
} from "../../types/category";

interface CategoryChipsProps {
  categories: Category[];
  selectedCategoryId?: number;

  onCategoryChange: (
    categoryId?: number,
  ) => void;
}

export default function CategoryChips({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: CategoryChipsProps) {
  return (
    <div
      className="
        flex
        gap-2
        overflow-x-auto
        pb-2
        scrollbar-none
        [&::-webkit-scrollbar]:hidden
      "
    >
      {/* All products */}

      <button
        type="button"
        onClick={() =>
          onCategoryChange(undefined)
        }
        className={`
          shrink-0
          border
          px-4
          py-2
          text-[10px]
          font-medium
          uppercase
          tracking-[0.08em]
          transition
          ${
            selectedCategoryId ===
            undefined
              ? "border-black bg-black text-white"
              : "border-black/20 hover:border-black"
          }
        `}
      >
        All
      </button>

      {/* Categories */}

      {categories.map(
        (category) => {
          const isSelected =
            selectedCategoryId ===
            category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                onCategoryChange(
                  category.id,
                )
              }
              className={`
                shrink-0
                border
                px-4
                py-2
                text-[10px]
                font-medium
                uppercase
                tracking-[0.08em]
                transition
                ${
                  isSelected
                    ? "border-black bg-black text-white"
                    : "border-black/20 hover:border-black"
                }
              `}
            >
              {category.name}
            </button>
          );
        },
      )}
    </div>
  );
}