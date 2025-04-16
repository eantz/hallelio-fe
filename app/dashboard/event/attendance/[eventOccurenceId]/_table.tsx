'use client';

import { DataTable } from "@/components/shared/dashboard/datatable";
import AlertDelete from "@/components/shared/dashboard/alert-delete";
import { useRouter } from "next/navigation";
import { Attendance } from "../../schema";
import { columns } from "./_columns";

export function AttendanceTable({
  attendances,
  pagination,
  totalRow
}: {
  attendances: Attendance[],
  pagination: any,
  totalRow: number
}) {

  const router = useRouter()

  return (
    <>
      <DataTable 
        columns={columns} 
        data={attendances} 
        pagination={pagination}
        rowCount={totalRow}
        router={router}
      />

      <AlertDelete />
    </>
  )
  
}