"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GridState } from "@/types/grid";

export function useGridState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentState: GridState = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    sort: searchParams.get("sort")
      ? [
          {
            key: searchParams.get("sort")?.split(":")[0] || "",
            order: (searchParams.get("sort")?.split(":")[1] as unknown) || "asc",
          },
        ]
      : [],
    filters: [], // Logic to parse filters from URL can be added here
  };

  const updateState = (newState: Partial<GridState>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newState.page) params.set("page", newState.page.toString());
    if (newState.pageSize) params.set("pageSize", newState.pageSize.toString());
    if (newState.sort)
      params.set("sort", `${newState.sort[0].key}:${newState.sort[0].order}`);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  return { currentState, updateState };
}
