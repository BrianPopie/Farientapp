"use client";

import { useEffect } from "react";

export default function ClientRuntimeListener() {
  useEffect(() => {
    const handler = (ev: ErrorEvent) => {
      const msg = `[client-error] ${ev.message} @ ${ev.filename}:${ev.lineno}`;
      console.error(msg, ev.error);
      const el = document.createElement("div");
      el.style.cssText =
        "position:fixed;left:12px;bottom:12px;z-index:99999;padding:8px 10px;background:#111827;color:#fca5a5;border:1px solid #f87171;border-radius:8px;font:12px/1.4 ui-sans-serif,system-ui";
      el.textContent = msg;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);
  return null;
}
