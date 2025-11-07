"use client";

import { useEffect } from "react";

export function DevConsoleSilencer() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const originalError = console.error;

    console.error = (...args: Parameters<typeof console.error>) => {
      const [message] = args;
      if (typeof message === "string" && message.includes("width(-1) and height(-1)")) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
