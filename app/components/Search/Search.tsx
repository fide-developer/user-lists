"use client";

import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import useDebounce from "@/app/hooks/useDebounce";

type SearchProps = {
  onSearch: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
};

export default function Search({
  onSearch,
  defaultValue = "",
  placeholder = "Search...",
  debounceMs = 300,
  className = "",
}: SearchProps) {
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebounce(value, debounceMs);

  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    onSearchRef.current(debounced);
  }, [debounced]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearchRef.current(value);
      }}
      className={`relative w-full max-w-sm ${className}`.trim()}
    >
      <button
        type="submit"
        aria-label="Search"
        className="absolute left-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1.5 text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
      >
        <FiSearch aria-hidden />
      </button>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-black/15 bg-transparent py-2 pl-10 pr-3 text-sm placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 dark:border-white/20 dark:placeholder:text-white/40 dark:focus:ring-white/20"
      />
    </form>
  );
}
