"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-auto rounded-2xl border border-white/5">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("sticky top-0 bg-muted/40 backdrop-blur", className)} {...props} />
);

const TableBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableFooter = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot className={cn("bg-muted/50 font-semibold text-foreground", className)} {...props} />
);

const TableRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("border-b border-white/5 transition-colors hover:bg-muted/30", className)} {...props} />
);

const TableHead = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
      className
    )}
    {...props}
  />
);

const TableCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3 align-middle text-sm text-foreground/90", className)} {...props} />
);

const TableCaption = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
);

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
