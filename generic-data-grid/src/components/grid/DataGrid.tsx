"use client";

import { ColumnConfig, GridState } from "@/types/grid";
import { CellRenderer } from "./CellRenderer";
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataGridProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  total: number;
  loading?: boolean;
  state: GridState;
  onStateChange: (newState: Partial<GridState>) => void;
}

export function DataGrid<T>({
  columns,
  data,
  total,
  loading,
  state,
  onStateChange,
}: DataGridProps<T>) {
  const handleSort = (key: string) => {
    const currentSort = state.sort.find((s) => s.key === key);
    let newOrder: "asc" | "desc" | null = "asc";

    if (currentSort?.order === "asc") newOrder = "desc";
    else if (currentSort?.order === "desc") newOrder = null;

    onStateChange({ sort: newOrder ? [{ key, order: newOrder }] : [] });
  };

  const getSortIcon = (key: string) => {
    const sort = state.sort.find((s) => s.key === key);
    if (!sort) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />;
    if (sort.order === "asc")
      return <ChevronUp className="w-3.5 h-3.5 text-blue-600" />;
    return <ChevronDown className="w-3.5 h-3.5 text-blue-600" />;
  };

  const visibleColumns = columns.filter((c) => c.visible !== false);

  return (
    <div className="w-full space-y-4 border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="relative overflow-x-auto">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key as string}
                  className={cn(
                    "px-4 py-3 font-semibold text-slate-700 select-none",
                    col.sortable && "cursor-pointer hover:bg-slate-100",
                  )}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.title}
                    {col.sortable && getSortIcon(col.key as string)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((record, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  {visibleColumns.map((col) => (
                    <td key={col.key as string} className="px-4 py-3">
                      <CellRenderer column={col} record={record} />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  داده‌ای برای نمایش وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t bg-slate-50 flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>نمایش</span>
          <select
            value={state.pageSize}
            onChange={(e) =>
              onStateChange({ pageSize: Number(e.target.value), page: 1 })
            }
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>رکورد از {total}</span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={state.page === 1}
            onClick={() => onStateChange({ page: state.page - 1 })}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-3 py-1 text-sm">
            صفحه {state.page} از {Math.ceil(total / state.pageSize)}
          </span>
          <button
            disabled={state.page * state.pageSize >= total}
            onClick={() => onStateChange({ page: state.page + 1 })}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}
