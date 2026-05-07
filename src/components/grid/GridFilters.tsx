"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { ColumnConfig, GridFilter, SelectOption } from "@/types/grid";
import { Input } from "../ui/Input";

interface GridFiltersProps<T> {
  columns: ColumnConfig<T>[];
  currentFilters: GridFilter[];
  onFiltersChange: (filters: GridFilter[]) => void;
}

export function GridFilters<T>({
  columns,
  currentFilters,
  onFiltersChange,
}: GridFiltersProps<T>) {
  const filterableColumns = columns.filter((c) => c.filterable);

  // Local state: one raw string value per column key (for controlled inputs)
  const [localValues, setLocalValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    filterableColumns.forEach((col) => {
      const key = col.key as string;
      const existing = currentFilters.find((f) => f.key === key);
      initial[key] = existing !== undefined ? String(existing.value) : "";
    });
    return initial;
  });

  // Debounce only the text & number inputs (300ms feels snappy)
  const debouncedValues = useDebounce(localValues, 300);

  // Whenever debounced values change, rebuild the filters array and notify parent
  useEffect(() => {
    const newFilters: GridFilter[] = [];

    filterableColumns.forEach((col) => {
      const key = col.key as string;
      const raw = debouncedValues[key];

      if (raw === "" || raw === undefined) return;

      switch (col.filterType) {
        case "text":
          newFilters.push({ key, value: raw, operator: "contains" });
          break;
        case "number":
          if (!isNaN(Number(raw))) {
            newFilters.push({ key, value: Number(raw), operator: "equals" });
          }
          break;
        case "date":
          newFilters.push({ key, value: raw, operator: "equals" });
          break;
        case "select":
          newFilters.push({ key, value: raw, operator: "equals" });
          break;
        case "boolean":
          // raw is "true", "false", or "" (all)
          if (raw === "true" || raw === "false") {
            newFilters.push({ key, value: raw === "true", operator: "equals" });
          }
          break;
      }
    });

    // Only call parent if filters actually changed (avoid unnecessary re-fetches)
    const newStr = JSON.stringify(newFilters);
    const currentStr = JSON.stringify(currentFilters);
    if (newStr !== currentStr) {
      onFiltersChange(newFilters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues]);

  const handleChange = useCallback((key: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = () => {
    const cleared: Record<string, string> = {};
    filterableColumns.forEach((col) => {
      cleared[col.key as string] = "";
    });
    setLocalValues(cleared);
  };

  const hasActiveFilters = Object.values(localValues).some((v) => v !== "");

  if (filterableColumns.length === 0) return null;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">فیلترها</span>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            پاک کردن همه فیلترها
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filterableColumns.map((col) => {
          const key = col.key as string;
          const value = localValues[key] ?? "";

          return (
            <div key={key} className="flex flex-col gap-1">
              <label className="text-xs text-slate-500">{col.title}</label>
              <FilterInput
                filterType={col.filterType ?? "text"}
                value={value}
                options={col.filterOptions}
                onChange={(v) => handleChange(key, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


interface FilterInputProps {
  filterType: "text" | "number" | "date" | "select" | "boolean";
  value: string;
  options?: SelectOption[];
  onChange: (value: string) => void;
}


// renders the right input per filterType 

function FilterInput({
  filterType,
  value,
  options,
  onChange,
}: FilterInputProps) {
  const baseSelect =
    "flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950";

  switch (filterType) {
    case "text":
      return (
        <Input
          type="text"
          value={value}
          placeholder="جستجو..."
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "number":
      return (
        <Input
          type="number"
          value={value}
          placeholder="عدد..."
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "date":
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseSelect}
        >
          <option value="">همه</option>
          {options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      );

    case "boolean":
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseSelect}
        >
          <option value="">همه</option>
          <option value="true">فعال</option>
          <option value="false">غیرفعال</option>
        </select>
      );

    default:
      return null;
  }
}
