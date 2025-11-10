"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUI";

export function CitationDrawer() {
  const { citationDrawer, closeDrawer, handleDrawerVisibility } = useUIStore((state) => ({
    citationDrawer: state.citationDrawer,
    closeDrawer: state.closeDrawer,
    handleDrawerVisibility: state.handleDrawerVisibility
  }));

  const [mounted, setMounted] = useState(false);

  if (process.env.NODE_ENV !== "production") {
    console.count("CitationDrawer render");
  }

  const renderGuardRef = useRef(0);
  useEffect(() => {
    renderGuardRef.current += 1;
    if (process.env.NODE_ENV !== "production" && renderGuardRef.current > 20) {
      console.warn("Potential render loop detected in <CitationDrawer>");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const { payload } = citationDrawer;
  const isOpen = Boolean(payload);
  const title =
    payload?.type === "policy" ? `${payload.data.firm} / ${payload.data.section}` : payload?.data.companyName ?? "Citation";
  const description =
    payload?.type === "policy" ? `${payload.data.yearFrom}-${payload.data.yearTo}` : `${payload?.data.filing} p.${payload?.data.page}`;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleDrawerVisibility(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleDrawerVisibility, isOpen]);

  const copyReference = () => {
    if (!payload) return;
    const text =
      payload.type === "policy"
        ? `${payload.data.firm} ${payload.data.section} ${payload.data.yearFrom}-${payload.data.yearTo}: ${payload.data.changeSummary}`
        : `${payload.data.filing} ${payload.data.year}: p.${payload.data.page} lines ${payload.data.lineStart}-${payload.data.lineEnd}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const renderBody = useMemo(() => {
    if (!payload) return null;
    if (payload.type === "policy") {
      return (
        <div className="space-y-4 p-6">
          <p className="text-sm text-text-muted">{payload.data.changeSummary}</p>
          <div className="rounded-2xl border border-border bg-surface p-4 text-xs text-text-muted">
            Versioned rule pack placeholder - plug ISS / Glass Lewis API here.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-6">
        <p className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed text-text">{payload.data.text}</p>
        <dl className="grid grid-cols-2 gap-4 text-xs text-text-muted">
          <div>
            <dt className="uppercase tracking-wide">Filing</dt>
            <dd>{payload.data.filing}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Page & Lines</dt>
            <dd>
              {payload.data.page} / {payload.data.lineStart}-{payload.data.lineEnd}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Company</dt>
            <dd>{payload.data.companyName}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wide">Year</dt>
            <dd>{payload.data.year}</dd>
          </div>
        </dl>
      </div>
    );
  }, [payload]);

  if (!mounted || !isOpen || !payload) {
    return null;
  }

  const drawer = (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => handleDrawerVisibility(false)} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Citation drawer"
        className="relative h-full w-full max-w-xl border-l border-border bg-surface/95 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <p className="text-lg font-semibold">{title}</p>
            <p className="text-sm text-text-muted">{description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={closeDrawer}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {renderBody}
        <div className="mt-auto border-t border-border p-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={copyReference} className="gap-2">
              <Copy className="h-4 w-4" />
              Copy reference
            </Button>
            <Button variant="ghost" onClick={closeDrawer}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
