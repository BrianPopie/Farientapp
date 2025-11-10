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
      className={cn("text-[2rem] md:text-[2.4rem] font-semibold leading-[1.1] text-text tracking-tight", className)}
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
      className={cn("text-[1.45rem] font-semibold leading-tight text-text tracking-tight", className)}
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
        "text-[0.95rem] leading-6 text-text",
        muted && "text-text-muted",
        "tracking-[0.01em]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}
