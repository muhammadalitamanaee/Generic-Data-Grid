import { ReactNode } from "react";

export type ColumnType = "text" | "number" | "date" | "boolean" | "custom";

export interface ColumnConfig<T> {
  key: keyof T | string;
  title: string;
  type: ColumnType;
  sortable?: boolean; //
  filterable?: boolean; //
  render?: (value: unknown, record: T) => ReactNode; // Custom renderer
  visible?: boolean; // Bonus: Column Visibility Toggle[cite: 1]
}

export type SortOrder = "asc" | "desc" | null;

export interface GridSort {
  key: string;
  order: SortOrder;
}

export interface GridFilter {
  key: string;
  value: string | number | boolean;
  operator?: "contains" | "equals" | "gt" | "lt" | "between";
}

export interface GridState {
  page: number;
  pageSize: number;
  sort: GridSort[];
  filters: GridFilter[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number; // For server-side pagination[cite: 1]
}
