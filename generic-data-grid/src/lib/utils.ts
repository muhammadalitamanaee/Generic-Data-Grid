import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes and handles conditional logic efficiently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into the Jalali calendar format (Persian calendar).
 */
export const formatJalali = (date: Date | string) => {
  return new Intl.DateTimeFormat("fa-IR").format(new Date(date));
};
