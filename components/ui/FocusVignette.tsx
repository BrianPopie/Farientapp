"use client";

import { useEffect, useState } from "react";

export function FocusVignette() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduceMotion(media.matches);
    handler();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 opacity-0 dark:opacity-30 sm:dark:opacity-100"
      style={{
        mixBlendMode: "normal",
        opacity: reduceMotion ? 0 : undefined,
        background: "radial-gradient(600px 400px at 50% 30%, rgba(255,255,255,0.08), rgba(0,0,0,0) 60%)"
      }}
    />
  );
}
