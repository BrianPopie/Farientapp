"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/20 text-primary-foreground/80",
        outline: "border-border text-muted-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-200",
        warning: "border-transparent bg-amber-500/15 text-amber-200",
        destructive: "border-transparent bg-rose-500/15 text-rose-200",
        neutral: "border-transparent bg-muted/50 text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
