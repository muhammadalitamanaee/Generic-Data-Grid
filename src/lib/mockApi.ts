import { GridState, PaginatedResponse } from "@/types/grid";

type MockRecord = {
  id: number;
  name: string;
  age: number;
  createdAt: string;
  isActive: boolean;
  role: string;
};

const ROLES = ["admin", "user", "manager"];

const MOCK_DATA: MockRecord[] = Array.from({ length: 120 }, (_, i) => ({
  id: i + 1,
  name: `کاربر ${i + 1}`,
  age: Math.floor(Math.random() * 50) + 20,
  createdAt: new Date(2024, 0, i + 1).toISOString().split("T")[0], // "YYYY-MM-DD"
  isActive: i % 3 === 0,
  role: ROLES[i % 3],
}));

export async function fetchGridData(
  state: GridState,
): Promise<PaginatedResponse<MockRecord>> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 500));

  let filteredData = [...MOCK_DATA];

  // ── Server-side Filtering ────────────────────────────────────────────────
  state.filters.forEach((f) => {
    // Skip empty values (but allow boolean false and number 0)
    if (f.value === "" || f.value === undefined || f.value === null) return;

    filteredData = filteredData.filter((item) => {
      const itemValue = item[f.key as keyof MockRecord];

      switch (f.operator) {
        case "contains":
          // Text search — case insensitive
          return String(itemValue)
            .toLowerCase()
            .includes(String(f.value).toLowerCase());

        case "equals":
          // Handles boolean, number, select, date equality
          if (typeof f.value === "boolean") {
            return itemValue === f.value;
          }
          if (typeof f.value === "number") {
            return Number(itemValue) === f.value;
          }
          // Date: compare "YYYY-MM-DD" prefix
          if (
            typeof itemValue === "string" &&
            String(f.value).match(/^\d{4}-\d{2}-\d{2}$/)
          ) {
            return itemValue.startsWith(String(f.value));
          }
          // Select / string equality
          return (
            String(itemValue).toLowerCase() === String(f.value).toLowerCase()
          );

        case "gt":
          return Number(itemValue) > Number(f.value);

        case "lt":
          return Number(itemValue) < Number(f.value);

        default:
          // Fallback to contains for text
          return String(itemValue)
            .toLowerCase()
            .includes(String(f.value).toLowerCase());
      }
    });
  });

  // ── Server-side Sorting ──────────────────────────────────────────────────
  if (state.sort.length > 0) {
    const { key, order } = state.sort[0];
    filteredData.sort((a, b) => {
      const valA = a[key as keyof MockRecord];
      const valB = b[key as keyof MockRecord];

      // Numbers: compare as numbers
      if (typeof valA === "number" && typeof valB === "number") {
        return order === "asc" ? valA - valB : valB - valA;
      }

      // Booleans: true > false
      if (typeof valA === "boolean" && typeof valB === "boolean") {
        const cmp = valA === valB ? 0 : valA ? 1 : -1;
        return order === "asc" ? cmp : -cmp;
      }

      // Dates: parse and compare as timestamps
      if (
        typeof valA === "string" &&
        typeof valB === "string" &&
        !isNaN(Date.parse(valA)) &&
        !isNaN(Date.parse(valB))
      ) {
        const cmp = Date.parse(valA) - Date.parse(valB);
        return order === "asc" ? cmp : -cmp;
      }

      // Strings: locale-aware comparison (handles Persian/Arabic too)
      if (typeof valA === "string" && typeof valB === "string") {
        const cmp = valA.localeCompare(valB, "fa");
        return order === "asc" ? cmp : -cmp;
      }

      return 0;
    });
  }

  // ── Server-side Pagination ───────────────────────────────────────────────
  const start = (state.page - 1) * state.pageSize;
  const paginatedData = filteredData.slice(start, start + state.pageSize);

  return {
    data: paginatedData,
    total: filteredData.length,
  };
}
