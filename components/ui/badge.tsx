"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[0.8rem] font-medium tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-accent/15 text-accent",
        outline: "border-border text-text-muted",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/20 text-warning",
        destructive: "border-transparent bg-danger/18 text-danger",
        neutral: "border-transparent bg-muted/60 text-text"
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
