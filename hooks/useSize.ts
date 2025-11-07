"use client";

import { useCallback, useEffect, useState } from "react";

type Size = {
  width: number;
  height: number;
  ready: boolean;
};

export function useSize<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0, ready: false });

  const ref = useCallback((instance: T | null) => {
    setNode(instance);
  }, []);

  useEffect(() => {
    if (!node) return;

    const measure = (rect?: DOMRectReadOnly | DOMRect) => {
      const { width, height } = rect ?? node.getBoundingClientRect();
      setSize({ width, height, ready: width > 0 && height > 0 });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      const id = window.requestAnimationFrame(() => measure());
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      measure(entry?.contentRect);
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return { ref, ...size };
}
