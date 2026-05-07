"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { GridState } from "@/types/grid";

export function useGridState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentState: GridState = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    sort: searchParams.get("sort")
      ? [
          {
            key: searchParams.get("sort")?.split(":")[0] || "",
            order: (searchParams.get("sort")?.split(":")[1] as any) || "asc",
          },
        ]
      : [],
    // Parsing filters from URL so they persist on refresh
    filters: searchParams.get("search")
      ? [{ key: "name", value: searchParams.get("search")! }]
      : [],
  };

  const updateState = (newState: Partial<GridState>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newState.page !== undefined)
      params.set("page", newState.page.toString());
    if (newState.pageSize !== undefined)
      params.set("pageSize", newState.pageSize.toString());

    if (newState.sort !== undefined) {
      if (newState.sort.length > 0) {
        params.set("sort", `${newState.sort[0].key}:${newState.sort[0].order}`);
      } else {
        params.delete("sort");
      }
    }

    if (newState.filters !== undefined) {
      const nameFilter = newState.filters.find((f) => f.key === "name");
      if (nameFilter?.value) {
        params.set("search", String(nameFilter.value));
      } else {
        params.delete("search");
      }
    }

    // This triggers the transition in the wrapper
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { currentState, updateState };
}
