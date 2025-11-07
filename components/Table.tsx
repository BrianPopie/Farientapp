"use client";

import * as React from "react";
import { Table as UITable, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import type { TableColumn } from "@/lib/types";

type GenericTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  density?: "compact" | "cozy";
};

export function DataTable<T extends Record<string, unknown>>({ columns, data, density = "cozy" }: GenericTableProps<T>) {
  const padding = density === "compact" ? "py-2" : "py-3";

  const resolveValue = (row: T, key: TableColumn<T>["key"]) => {
    const typedKey = key as keyof T;
    return row[typedKey];
  };

  return (
    <UITable>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className={
                column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
              }
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={`${idx}-${String(columns[0]?.key ?? idx)}`}>
            {columns.map((column) => {
              const content = column.render ? column.render(row) : resolveValue(row, column.key);
              return (
                <TableCell
                  key={`${String(column.key)}-${idx}`}
                  className={`${padding} ${
                    column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {content as React.ReactNode}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  );
}
