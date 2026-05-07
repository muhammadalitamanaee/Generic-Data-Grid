"use client";

import { ColumnConfig, GridState, PaginatedResponse } from "@/types/grid";
import { CellRenderer } from "./CellRenderer";
import { ChevronUp, ChevronDown, Loader2 } from "lucide-react";
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

  return (
    <div className="w-full space-y-4 border rounded-lg bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {columns
                .filter((c) => c.visible !== false)
                .map((col) => (
                  <th
                    key={col.key as string}
                    className={cn(
                      "px-4 py-3 font-semibold text-slate-700",
                      col.sortable &&
                        "cursor-pointer hover:bg-slate-100 transition-colors",
                    )}
                    onClick={() =>
                      col.sortable && handleSort(col.key as string)
                    }
                  >
                    <div className="flex items-center gap-2">
                      {col.title}
                      {col.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "w-3 h-3",
                              state.sort[0]?.key === col.key &&
                                state.sort[0]?.order === "asc"
                                ? "text-blue-600"
                                : "text-slate-300",
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 -mt-1",
                              state.sort[0]?.key === col.key &&
                                state.sort[0]?.order === "desc"
                                ? "text-blue-600"
                                : "text-slate-300",
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            )}

            {data.length > 0 ? (
              data.map((record, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {columns
                    .filter((c) => c.visible !== false)
                    .map((col) => (
                      <td key={col.key as string} className="px-4 py-3">
                        <CellRenderer column={col} record={record} />
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  داده‌ای برای نمایش وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component would go here */}
      <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
        <span className="text-xs text-slate-500">مجموع رکوردها: {total}</span>
        <div className="flex gap-2">
          <button
            disabled={state.page === 1}
            onClick={() => onStateChange({ page: state.page - 1 })}
            className="px-3 py-1 border rounded bg-white disabled:opacity-50"
          >
            قبلی
          </button>
          <span className="px-3 py-1">صفحه {state.page}</span>
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
