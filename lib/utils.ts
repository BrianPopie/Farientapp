import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatUSD = (value: number, options: { maximumFractionDigits?: number } = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: options.maximumFractionDigits ?? 0
  }).format(value);

export const formatPct = (value: number, options: { maximumFractionDigits?: number } = {}) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: options.maximumFractionDigits ?? 1
  }).format(value);

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
