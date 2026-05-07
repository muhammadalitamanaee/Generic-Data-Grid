import { ReactNode } from "react";

export type ColumnType = "text" | "number" | "date" | "boolean" | "custom";

// describes what kind of filter UI to render for this column
export type FilterType = "text" | "number" | "date" | "select" | "boolean";

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface ColumnConfig<T> {
  key: keyof T | string;
  title: string;
  type: ColumnType;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: FilterType; //  which filter UI to show
  filterOptions?: SelectOption[]; //  used when filterType === "select"
  render?: (value: unknown, record: T) => ReactNode;
  visible?: boolean;
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
  total: number;
}
