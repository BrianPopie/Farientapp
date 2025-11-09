"use client";

import { useEffect, useMemo, useRef } from "react";
import { Copy, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUI";

export function CitationDrawer() {
  const { citationDrawer, closeDrawer, handleDrawerVisibility } = useUIStore((state) => ({
    citationDrawer: state.citationDrawer,
    closeDrawer: state.closeDrawer,
    handleDrawerVisibility: state.handleDrawerVisibility
  }));

  if (process.env.NODE_ENV !== "production") {
    console.count("CitationDrawer render");
  }

  const renderGuardRef = useRef(0);
  useEffect(() => {
    renderGuardRef.current += 1;
    if (process.env.NODE_ENV !== "production" && renderGuardRef.current > 20) {
      console.warn("Potential render loop detected in <CitationDrawer>");
    }
  });

  const { payload } = citationDrawer;
  const isOpen = Boolean(payload);
  const title = payload?.type === "policy" ? `${payload.data.firm} · ${payload.data.section}` : payload?.data.companyName ?? "Citation";
  const description =
    payload?.type === "policy"
      ? `${payload.data.yearFrom}→${payload.data.yearTo}`
      : `${payload?.data.filing} p.${payload?.data.page}`;

  const copyReference = () => {
    if (!payload) return;
    const text =
      payload.type === "policy"
        ? `${payload.data.firm} ${payload.data.section} ${payload.data.yearFrom}→${payload.data.yearTo}: ${payload.data.changeSummary}`
        : `${payload.data.filing} ${payload.data.year}: p.${payload.data.page} lines ${payload.data.lineStart}-${payload.data.lineEnd}`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const renderBody = useMemo(() => {
    if (!payload) return null;
    if (payload.type === "policy") {
      return (
        <div className="space-y-4 p-6">
          <p className="text-sm text-muted-foreground">{payload.data.changeSummary}</p>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
            Versioned rule pack placeholder - plug ISS / Glass Lewis API here.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 p-6">
        <p className="rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed">{payload.data.text}</p>
        <dl className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <dt className="uppercase">Filing</dt>
            <dd>{payload.data.filing}</dd>
          </div>
          <div>
            <dt className="uppercase">Page · Lines</dt>
            <dd>
              {payload.data.page} · {payload.data.lineStart}-{payload.data.lineEnd}
            </dd>
          </div>
          <div>
            <dt className="uppercase">Company</dt>
            <dd>{payload.data.companyName}</dd>
          </div>
          <div>
            <dt className="uppercase">Year</dt>
            <dd>{payload.data.year}</dd>
          </div>
        </dl>
      </div>
    );
  }, [payload]);

  return (
    <Drawer open={isOpen} onOpenChange={handleDrawerVisibility}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <div>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={closeDrawer}>
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        {renderBody}
        <DrawerFooter className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={copyReference} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy reference
          </Button>
          <Button variant="ghost" onClick={closeDrawer}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
