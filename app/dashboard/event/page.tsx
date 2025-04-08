import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEvents } from "./fetcher";
import { addDays, format, parse } from "date-fns";
import { EventTable } from "./_table";
import TableFilter from "./_table_filter";

export default async function Member(props: {
  searchParams?: Promise<{
    start_date?: string,
    end_date?: string
  }>
}) {
  const searchParams = await props.searchParams;
  const startDate = searchParams?.start_date || format(new Date(), 'yyyy-MM-dd')
  const endDate = searchParams?.end_date || format(addDays(new Date(), 6), 'yyyy-MM-dd')

  const events = getEvents(startDate, endDate)

  return (
    <div className="w-full">
      <h1>Event Schedules</h1>

      <div className="grid grid-cols-6 pt-4">
        <div className="col-start-1">
          <TableFilter dateRange={{
            from: parse(startDate, 'yyyy-MM-dd', new Date()),
            to: parse(endDate, 'yyyy-MM-dd', new Date())
          }} />
        </div>
        <div className="col-start-6 flex items-end flex-col">
          <Button asChild>
            <Link href="/dashboard/event/add">Add Event</Link>
          </Button>
        </div>
        
      </div>
      <div className="container mx-auto py-4">
        <EventTable events={events} />
      </div>
    </div>
  ) 
}