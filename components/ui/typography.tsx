"use client";

import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType, HTMLAttributes, ReactNode } from "react";

type HeadingProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function PageHeading<T extends ElementType = "h1">({
  as,
  children,
  className,
  ...props
}: HeadingProps<T>) {
  const Component = (as ?? "h1") as ElementType;
  return (
    <Component
      className={cn("text-3xl md:text-[2.75rem] font-semibold leading-tight tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export function SectionHeading<T extends ElementType = "h2">({
  as,
  children,
  className,
  ...props
}: HeadingProps<T>) {
  const Component = (as ?? "h2") as ElementType;
  return (
    <Component
      className={cn("text-xl md:text-2xl font-semibold leading-tight tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

type BodyTextProps = HTMLAttributes<HTMLParagraphElement> & {
  muted?: boolean;
};

export function BodyText({ children, className, muted = false, ...props }: BodyTextProps) {
  return (
    <p
      className={cn(
        "text-base leading-7 text-foreground tracking-[0.01em]",
        muted && "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function Kicker({ children, className }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}
