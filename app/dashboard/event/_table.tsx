'use client';

import { DataTable } from "@/components/shared/dashboard/datatable";
import { ResponseObject } from "@/lib/http";
import { use } from "react";
import AlertDelete from "@/components/shared/dashboard/alert-delete";
import { useRouter } from "next/navigation";
import { columns } from "./_columns";
import { PaginationState } from "@tanstack/react-table";
import AlertLoading from "@/components/shared/dashboard/alert-loading";

export function EventTable({
  events
}: {
  events: Promise<ResponseObject>
}) {
  const eventsData = use(events)
  const router = useRouter()

  const pagination: PaginationState = {
    pageSize: eventsData.data?.data.length,
    pageIndex: 1 // always set to 1, because there is no dynamic pagination for event schedules
  }

  return (
    <>
      <DataTable 
        columns={columns} 
        data={eventsData.data?.data} 
        pagination={pagination}
        rowCount={eventsData.data?.data.length}
        router={router}
      />

      <AlertDelete />
      
      <AlertLoading 
        title="Launching attendance scanner..." 
      />
    </>
  )
  
}