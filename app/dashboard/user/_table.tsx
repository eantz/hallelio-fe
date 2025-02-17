'use client';

import { DataTable } from "@/components/shared/dashboard/datatable";
import { columns } from "./_columns"
import { ResponseObject } from "@/lib/http";
import { use } from "react";
import AlertDelete from "@/components/shared/dashboard/alert-delete";
import { useRouter } from "next/navigation";

export function UserTable({
  users,
  pagination
}: {
  users: Promise<ResponseObject>,
  pagination: any
}) {
  const usersData = use(users)
  const router = useRouter()

  return (
    <>
      <DataTable 
        columns={columns} 
        data={usersData.data?.data} 
        pagination={pagination}
        rowCount={usersData.data?.total}
        router={router}
      />

      <AlertDelete />
    </>
  )
  
}