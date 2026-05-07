"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { DataGrid } from "./DataGrid";
import { useGridState } from "@/hooks/useGridState";
import { fetchGridData } from "@/lib/mockApi";
import { GridFilters } from "./GridFilters";

export default function ClientGridWrapper({
  initialData,
}: {
  initialData: any;
}) {
  const { currentState, updateState } = useGridState();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData.data);
  const [total, setTotal] = useState(initialData.total);

  const columns = [
    { key: "id", title: "شناسه", type: "number", sortable: true },
    { key: "name", title: "نام کاربر", type: "text", sortable: true },
    { key: "age", title: "سن", type: "number", sortable: true },
    { key: "createdAt", title: "تاریخ ایجاد", type: "date", sortable: true },
    { key: "isActive", title: "وضعیت", type: "boolean" },
  ];

  useEffect(() => {
    // When currentState (URL) changes, fetch new data inside the transition
    startTransition(async () => {
      try {
        const result = await fetchGridData(currentState);
        setData(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error("Failed to fetch grid data:", error);
      }
    });
  }, [JSON.stringify(currentState)]); // Using stringify to track deep changes in sort/filters arrays

  const handleSearch = useCallback(
    (value: string) => {
      updateState({
        page: 1, // Reset to page 1 on new search
        filters: value ? [{ key: "name", value }] : [],
      });
    },
    [updateState],
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        {/* Optional: Add an Export button here to meet requirement 4. bonus */}
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
