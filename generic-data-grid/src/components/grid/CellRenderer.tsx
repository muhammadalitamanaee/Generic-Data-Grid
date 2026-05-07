"use client";

import { ColumnConfig } from "@/types/grid";
import { cn, formatJalali } from "@/lib/utils";

interface Props<T> {
  column: ColumnConfig<T>;
  record: T;
}

export function CellRenderer<T>({ column, record }: Props<T>) {
  const value = record[column.key as keyof T];

  // 1. Custom Renderer Support
  if (column.render) return column.render(value, record);

  // 2. Type-based Rendering
  switch (column.type) {
    case "date":
      return <span>{value ? formatJalali(value as string) : "-"}</span>;
    case "boolean":
      return (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs",
            value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700",
          )}
        >
          {value ? "فعال" : "غیرفعال"}
        </span>
      );
    case "number":
      return (
        <span className="font-mono">
          {new Intl.NumberFormat("fa-IR").format(value as number)}
        </span>
      );
    default:
      return <span>{String(value ?? "-")}</span>;
  }
}
