"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { Search } from "lucide-react";

interface GridFiltersProps {
  onSearch: (value: string) => void;
}

export function GridFilters({ onSearch }: GridFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="flex items-center gap-4 p-4 bg-white border rounded-t-lg border-b-0">
      <div className="relative w-full max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="جستجو در نام..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10" // Padding for the icon on the right (RTL)
        />
      </div>
      {/* You can add a 'Type' dropdown or 'Status' filter here later */}
    </div>
  );
}
