import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  hasNextPage: boolean;

  onPageChange: (
    page: number,
  ) => void;
}

export default function Pagination({
  page,
  hasNextPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-12 flex items-center justify-center gap-5">
      {/* Previous */}

      <button
        type="button"
        disabled={page <= 1}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="
          flex
          items-center
          gap-2
          text-xs
          font-medium
          uppercase
          tracking-[0.06em]
          transition
          hover:opacity-60
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
        />

        Previous
      </button>

      {/* Current page */}

      <span className="text-xs font-medium">
        Page {page}
      </span>

      {/* Next */}

      <button
        type="button"
        disabled={!hasNextPage}
        onClick={() =>
          onPageChange(page + 1)
        }
        className="
          flex
          items-center
          gap-2
          text-xs
          font-medium
          uppercase
          tracking-[0.06em]
          transition
          hover:opacity-60
          disabled:cursor-not-allowed
          disabled:opacity-30
        "
      >
        Next

        <ArrowRight
          size={14}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}