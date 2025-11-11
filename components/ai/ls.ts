"use client";

export const LS_KEY = "farient_ai_inputs_v1";
export const LS_OUT = "farient_ai_output_v1";

export function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify(value);
    window.localStorage.setItem(key, payload);
    window.dispatchEvent(
      new StorageEvent("storage", { key, newValue: payload, storageArea: window.localStorage })
    );
  } catch {
    // ignore write errors (storage disabled, quota, etc.)
  }
}

export function removeKey(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(
      new StorageEvent("storage", { key, newValue: null, storageArea: window.localStorage })
    );
  } catch {
    // ignore
  }
}

export function readJSON<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
}
