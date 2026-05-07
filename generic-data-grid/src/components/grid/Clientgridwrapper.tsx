"use client";

import { useState, useEffect, useTransition } from "react";
import { DataGrid } from "./DataGrid";
import { GridState, PaginatedResponse } from "@/types/grid";
import { useGridState } from "@/hooks/useGridState";
import { fetchGridData } from "@/lib/mockApi";
import { GridFilters } from "./GridFilters";

interface Props {
  initialData: PaginatedResponse<unknown>;
}

export default function ClientGridWrapper({ initialData }: Props) {
  const { currentState, updateState } = useGridState();
  const [isPending, startTransition] = useTransition(); // For smooth UI updates
  const [data, setData] = useState(initialData.data);
  const [total, setTotal] = useState(initialData.total);

  // Define columns here so they are accessible to the client
  const columns = [
    { key: "id", title: "شناسه", type: "number", sortable: true },
    {
      key: "name",
      title: "نام کاربر",
      type: "text",
      sortable: true,
      filterable: true,
    },
    { key: "age", title: "سن", type: "number", sortable: true },
    { key: "createdAt", title: "تاریخ ایجاد", type: "date", sortable: true },
    { key: "isActive", title: "وضعیت", type: "boolean" },
  ];

  // This Effect only runs when the URL (currentState) changes
  useEffect(() => {
    // Skip the very first render since we have initialData from the server
    if (currentState.page === 1 && currentState.sort.length === 0) return;

    startTransition(async () => {
      const result = await fetchGridData(currentState);
      setData(result.data);
      setTotal(result.total);
    });
  }, [currentState]);

  const handleSearch = (value: string) => {
    updateState({
      page: 1, // Reset to page 1 on new search
      filters: value ? [{ key: "name", value }] : [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">مدیریت کاربران</h1>
        {isPending && (
          <span className="text-sm text-blue-500 animate-pulse">
            در حال بروزرسانی...
          </span>
        )}
      </div>

      <GridFilters onSearch={handleSearch} />

      <DataGrid
        columns={columns}
        data={data}
        total={total}
        loading={isPending}
        state={currentState}
        onStateChange={updateState}
      />
    </div>
  );
}
