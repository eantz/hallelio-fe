'use client';

import { DataTable } from "@/components/shared/dashboard/datatable";
import { ResponseObject } from "@/lib/http";
import { use } from "react";
import AlertDelete from "@/components/shared/dashboard/alert-delete";
import { useRouter } from "next/navigation";
import { columns } from "./_columns";

export function MemberTable({
  members,
  pagination
}: {
  members: Promise<ResponseObject>,
  pagination: any
}) {
  const membersData = use(members)
  const router = useRouter()

  return (
    <>
      <DataTable 
        columns={columns} 
        data={membersData.data?.data} 
        pagination={pagination}
        rowCount={membersData.data?.total}
        router={router}
      />

      <AlertDelete />
    </>
  )
  
}