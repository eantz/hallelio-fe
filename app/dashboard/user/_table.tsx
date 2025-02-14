'use client';

import { DataTable } from "@/components/shared/dashboard/datatable";
import { columns } from "./_columns"
import { ResponseObject } from "@/lib/http";
import { use } from "react";
import AlertDelete from "@/components/shared/dashboard/alert-delete";

export function UserTable({
  users,
  pagination
}: {
  users: Promise<ResponseObject>,
  pagination: any
}) {
  const usersData = use(users)

  return (
    <>
      <DataTable 
        columns={columns} 
        data={usersData.data?.data} 
        pagination={pagination}
      />

      <AlertDelete />
    </>
  )
  
}