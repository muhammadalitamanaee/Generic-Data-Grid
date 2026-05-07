"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { GridState } from "@/types/grid";

export function useGridState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * 1. Stabilize the current state object.
   * By using useMemo, the 'currentState' object reference only changes when
   * the actual URL search parameters change in the browser.
   */
  const currentState: GridState = useMemo(() => {
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const sortParam = searchParams.get("sort");
    const searchParam = searchParams.get("search");

    return {
      page,
      pageSize,
      sort: sortParam
        ? [
            {
              key: sortParam.split(":")[0],
              order: (sortParam.split(":")[1] as "asc" | "desc") || "asc",
            },
          ]
        : [],
      filters: searchParam ? [{ key: "name", value: searchParam }] : [],
    };
  }, [searchParams]);

  /**
   * 2. Stabilize the update function.
   * Wrapping this in useCallback prevents components like 'GridFilters'
   * from triggering their internal effects on every parent render.
   */
  const updateState = useCallback(
    (newState: Partial<GridState>) => {
      const params = new URLSearchParams(searchParams.toString());

      // Update Pagination
      if (newState.page !== undefined) {
        params.set("page", newState.page.toString());
      }

      // Update Sorting
      if (newState.sort !== undefined) {
        if (newState.sort.length > 0) {
          params.set(
            "sort",
            `${newState.sort[0].key}:${newState.sort[0].order}`,
          );
        } else {
          params.delete("sort");
        }
      }

      // Update Filtering (Mapping 'name' key to 'search' URL param)
      if (newState.filters !== undefined) {
        const nameFilter = newState.filters.find((f) => f.key === "name");
        if (nameFilter?.value) {
          params.set("search", String(nameFilter.value));
        } else {
          params.delete("search");
        }
      }

      const newQueryString = params.toString();
      const currentQueryString = searchParams.toString();

      /**
       * 3. THE CIRCUIT BREAKER:
       * We compare the generated string with the current one.
       * Only push to the router if the URL parameters have actually changed.
       * This prevents the infinite loop where searchParams trigger an effect
       * which triggers a push, which triggers searchParams...
       */
      if (newQueryString !== currentQueryString) {
        router.push(`${pathname}?${newQueryString}`, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  return { currentState, updateState };
}
