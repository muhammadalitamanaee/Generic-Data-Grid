import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes and handles conditional logic efficiently.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
