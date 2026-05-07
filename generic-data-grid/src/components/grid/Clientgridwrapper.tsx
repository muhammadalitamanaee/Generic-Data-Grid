"use client";

import { useState, useEffect, useTransition } from "react";
import { DataGrid } from "./DataGrid";
import { useGridState } from "@/hooks/useGridState";
import { fetchGridData } from "@/lib/mockApi";
import { GridFilters } from "./GridFilters";
import { ColumnConfig, GridFilter } from "@/types/grid";

// Define columns OUTSIDE the component so they're stable references
const columns: ColumnConfig<Record<string, unknown>>[] = [
  {
    key: "id",
    title: "شناسه",
    type: "number",
    sortable: true,
    // No filter on ID — usually not useful
  },
  {
    key: "name",
    title: "نام کاربر",
    type: "text",
    sortable: false,
    filterable: true,
    filterType: "text",
  },
  {
    key: "age",
    title: "سن",
    type: "number",
    sortable: true,
    filterable: true,
    filterType: "number",
  },
  {
    key: "createdAt",
    title: "تاریخ ایجاد",
    type: "date",
    sortable: true,
    filterable: true,
    filterType: "date",
  },
  {
    key: "isActive",
    title: "وضعیت",
    type: "boolean",
    filterable: true,
    filterType: "boolean",
  },
  {
    key: "role",
    title: "نقش",
    type: "text",
    sortable: false,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { label: "ادمین", value: "admin" },
      { label: "کاربر", value: "user" },
      { label: "مدیر", value: "manager" },
    ],
  },
];

export default function ClientGridWrapper({
  initialData,
}: {
  initialData: { data: unknown[]; total: number };
}) {
  const { currentState, updateState } = useGridState();
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState(initialData.data);
  const [total, setTotal] = useState(initialData.total);

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await fetchGridData(currentState);
        setData(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error("Failed to fetch grid data:", error);
      }
    });
  }, [JSON.stringify(currentState)]);

  const handleFiltersChange = (filters: GridFilter[]) => {
    updateState({ filters });
  };

  return (
    <div className="space-y-4">
      <GridFilters
        columns={columns}
        currentFilters={currentState.filters}
        onFiltersChange={handleFiltersChange}
      />
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
