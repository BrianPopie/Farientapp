"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn("inline-flex h-12 items-center justify-center rounded-2xl bg-muted/30 p-1 text-text-muted", className)}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex min-w-[120px] items-center justify-center whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-surface data-[state=active]:text-text",
      className
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content className={cn("mt-4 focus-visible:outline-none", className)} {...props} />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
