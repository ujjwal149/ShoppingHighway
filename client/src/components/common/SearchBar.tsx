import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  defaultValue = "",
  onSearch,
  placeholder = "Search",
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const searchValue = value.trim();

    if (!searchValue) {
      return;
    }

    onSearch?.(searchValue);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex
        h-11
        w-full
        items-center
        border
        border-black/10
        bg-black/4
        ${className}
      `}
    >
      <Search
        size={17}
        strokeWidth={1.5}
        className="ml-4 shrink-0 text-neutral-700"
      />

      <input
        type="search"
        value={value}
        onChange={(event) =>
          setValue(event.target.value)
        }
        placeholder={placeholder}
        className="
          h-full
          min-w-0
          flex-1
          border-0
          bg-transparent
          px-3
          text-xs
          outline-none
          placeholder:text-neutral-500
          focus:ring-0
        "
      />

      <button
        type="submit"
        className="
          h-full
          shrink-0
          px-4
          text-[10px]
          uppercase
          tracking-widest
          text-neutral-500
          transition
          hover:text-black
          sm:px-6
        "
      >
        Search
      </button>
    </form>
  );
}