import { PaginationState } from "@tanstack/react-table";
import { getEventAttendances } from "../../fetcher"
import { AttendanceTable } from "./_table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AttendancesPage({
  params,
  searchParams
}: {
  params: Promise<{ eventOccurenceId: string }>,
  searchParams?: Promise<{
    query?: string;
    page?: string
  }>
}) {
  const eventOccurenceId = (await params).eventOccurenceId
  const qs = await searchParams;
  const currentPage = Number(qs?.page || 1)

  const attendances = await getEventAttendances(eventOccurenceId, currentPage)

  const pagination: PaginationState = {
    pageSize: 10,
    pageIndex: currentPage
  }

  return (
    <div className="w-full">
      <h1>Attendances</h1>

      {attendances.data?.event.title}

      <div className="grid grid-cols-6 pt-4">
        <div className="col-start-6 flex items-end flex-col">
          <Button asChild>
            <Link href={`/dashboard/event/attendance/${eventOccurenceId}/add`}>Add Attendance</Link>
          </Button>
        </div>
        
      </div>
      <div className="container mx-auto py-4">
        <AttendanceTable
          attendances={attendances.data?.attendances.data}
          pagination={pagination}
          totalRow={attendances.data?.attendances.total}
        />
      </div>
    </div>
  )
}

