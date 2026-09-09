import { ChevronDown, ChevronRight } from "lucide-react";
import { useState, type PropsWithChildren } from "react";

interface FilterSectionProps extends PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}

export default function FilterSection({
  title,
  defaultOpen = false,
  children,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-black/10 py-4">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-sm font-semibold tracking-[0.04em]">
          {title}
        </span>

        {isOpen ? (
          <ChevronDown size={16} strokeWidth={1.5} />
        ) : (
          <ChevronRight size={16} strokeWidth={1.5} />
        )}
      </button>

      {isOpen && (
        <div className="pt-4">
          {children}
        </div>
      )}
    </div>
  );
}