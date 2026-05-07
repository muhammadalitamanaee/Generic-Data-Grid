"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { GridFilter, GridState } from "@/types/grid";

// Each filter is stored in the URL as:  filter_<key>=<value>&filterop_<key>=<operator>
// e.g. filter_name=Ali&filterop_name=contains
//      filter_age=25&filterop_age=equals
//      filter_isActive=true&filterop_isActive=equals

export function useGridState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentState: GridState = useMemo(() => {
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const sortParam = searchParams.get("sort");

    // Reconstruct filters array from all filter_* params
    const filters: GridFilter[] = [];
    searchParams.forEach((value, paramKey) => {
      if (paramKey.startsWith("filter_")) {
        const key = paramKey.replace("filter_", "");
        const operator =
          (searchParams.get(`filterop_${key}`) as GridFilter["operator"]) ||
          "contains";

        // Coerce value to the right type
        let coerced: string | number | boolean = value;
        if (value === "true") coerced = true;
        else if (value === "false") coerced = false;
        else if (!isNaN(Number(value)) && value !== "") coerced = Number(value);

        filters.push({ key, value: coerced, operator });
      }
    });

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
      filters,
    };
  }, [searchParams]);

  const updateState = useCallback(
    (newState: Partial<GridState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newState.page !== undefined) {
        params.set("page", newState.page.toString());
      }

      if (newState.pageSize !== undefined) {
        params.set("pageSize", newState.pageSize.toString());
      }

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

      if (newState.filters !== undefined) {
        // Clear all existing filter_* and filterop_* params first
        const keysToDelete: string[] = [];
        params.forEach((_, k) => {
          if (k.startsWith("filter_") || k.startsWith("filterop_")) {
            keysToDelete.push(k);
          }
        });
        keysToDelete.forEach((k) => params.delete(k));

        // Write new filters
        newState.filters.forEach((f) => {
          params.set(`filter_${f.key}`, String(f.value));
          if (f.operator) {
            params.set(`filterop_${f.key}`, f.operator);
          }
        });

        // Any filter change should reset to page 1
        params.set("page", "1");
      }

      const newQueryString = params.toString();
      if (newQueryString !== searchParams.toString()) {
        router.push(`${pathname}?${newQueryString}`, { scroll: false });
      }
    },
    [pathname, router, searchParams],
  );

  return { currentState, updateState };
}
