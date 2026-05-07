import { GridState, PaginatedResponse } from "@/types/grid";

// Generating 100 sample records[cite: 1]
const MOCK_DATA = Array.from({ length: 120 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  age: Math.floor(Math.random() * 50) + 20,
  createdAt: new Date(2024, 0, i + 1).toISOString(),
  isActive: i % 3 === 0,
}));

export async function fetchGridData(
  state: GridState,
): Promise<PaginatedResponse<unknown>> {
  // 1. Simulate Latency
  await new Promise((res) => setTimeout(res, 800));

  let filteredData = [...MOCK_DATA];

  // 2. Server-side Filtering[cite: 1]
  state.filters.forEach((f) => {
    if (f.value) {
      filteredData = filteredData.filter((item) => {
        const itemValue = String(
          item[f.key as keyof typeof item],
        ).toLowerCase();
        const filterValue = String(f.value).toLowerCase();
        return itemValue.includes(filterValue);
      });
    }
  });

  // 3. Server-side Sorting[cite: 1]
  if (state.sort.length > 0) {
    const { key, order } = state.sort[0];
    filteredData.sort((a, b) => {
      const valA = a[key as keyof typeof a];
      const valB = b[key as keyof typeof b];
      if (order === "asc") return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }

  // 4. Server-side Pagination[cite: 1]
  const start = (state.page - 1) * state.pageSize;
  const paginatedData = filteredData.slice(start, start + state.pageSize);

  return {
    data: paginatedData,
    total: filteredData.length,
  };
}
