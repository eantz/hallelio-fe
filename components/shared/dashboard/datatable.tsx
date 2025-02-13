'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, PaginationState, useReactTable } from "@tanstack/react-table";
import Paginator from "./datatable-paginator";
import { useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  pagination: PaginationState
}

export function DataTable<TData, TValue> ({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>)  {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    state: {
      pagination
    }
  })

  const searchParams = useSearchParams()

  const handlePageChange = (pageNum: number) => {

    const params = new URLSearchParams(searchParams);
    params.set('page', pageNum.toString())
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null 
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                        }
                      </TableHead>
                    )
                  })}
                </TableRow>
              )
            }
          )}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {
            table.getFilteredSelectedRowModel().rows.length ? (
              `${table.getFilteredSelectedRowModel().rows.length} of{" "}`
            ) : null
          }
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className="flex justify-end">
          <Paginator
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(pageNumber) => handlePageChange(pageNumber)}
            showPreviousNext
          />
        </div>
      </div>
    </div>
    
  )
}