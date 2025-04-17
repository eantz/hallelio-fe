import { PaginationState } from "@tanstack/react-table";
import { getEventAttendances } from "../../fetcher"
import { AttendanceTable } from "./_table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format, parse } from "date-fns";

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

  const startTime = parse(attendances.data?.event.start_time, 'yyyy-MM-dd HH:mm:ss', new Date())
  const endTime = parse(attendances.data?.event.end_time, 'yyyy-MM-dd HH:mm:ss', new Date())

  return (
    <div className="w-full">
      <h1>Attendances</h1>

      <div className="mt-8 flex flex-col gap-2">
        <div>
          <span className="text-gray-600 text-sm">Event</span>
          <h2 className="font-bold">{attendances.data?.event.title}</h2>
        </div>
        
        <div>
          <span className="text-gray-600 text-sm">Date Time</span>
          <div>{format(startTime, 'yyyy-MM-dd')} {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}</div>
        </div>
        
      </div>
      

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

