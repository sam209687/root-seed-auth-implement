// src/components/CustomTable.tsx
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface CustomTableProps<T> {
  data: T[];
  columns: { key: keyof T | string; header: string; render?: (item: T) => React.ReactNode }[];
  caption?: string;
  className?: string;
}

export function CustomTable<T>({ data, columns, caption, className }: CustomTableProps<T>) {
  return (
    <Table className={className}>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((col, index) => (
            <TableHead key={index}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: T, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((col, colIndex) => (
              <TableCell key={`<span class="math-inline">\{rowIndex\}\-</span>{colIndex}`}>
                {col.render ? col.render(item) : (item as any)[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}