// src/components/grid/GridFilters.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "../ui/Input";

export function GridFilters({ onSearch }: { onSearch: (val: string) => void }) {
  const searchParams = useSearchParams();
  const currentSearchInUrl = searchParams.get("search") || "";

  // Initialize state from URL so it doesn't "reset" the world on mount
  const [searchTerm, setSearchTerm] = useState(currentSearchInUrl);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Only trigger onSearch if the debounced value is DIFFERENT from the URL
    if (debouncedSearch !== currentSearchInUrl) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, currentSearchInUrl, onSearch]);

  return (
    <div className="p-4 bg-white border-x">
      <Input
        placeholder="جستجو بر اساس نام..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
