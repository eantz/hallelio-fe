import { format, parse } from "date-fns"
import { getEventOccurence } from "../../../fetcher"
import ScannerContainer from "./_scanner"

export default async function ScannerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const eventOccurenceId = (await params).id

  const eventOccurence = await getEventOccurence(eventOccurenceId)

  const startTime = parse(eventOccurence.data?.event.start_time, 'yyyy-MM-dd HH:mm:ss', new Date())
  const endTime = parse(eventOccurence.data?.event.end_time, 'yyyy-MM-dd HH:mm:ss', new Date())

  return (
    <div className="w-full">
      <h1>Attendance Scanner</h1>
      <div className="mt-4 flex flex-row w-full gap-4">
        <div className="w-1/5 flex flex-col gap-2">
          <div>
            <span className="text-gray-600 text-sm">Event</span>
            <h2 className="font-bold">{eventOccurence.data?.event.title}</h2>
          </div>
          
          <div>
            <span className="text-gray-600 text-sm">Date</span>
            <div>{format(startTime, 'yyyy-MM-dd')}</div>
          </div>
          
          <div>
            <span className="text-gray-600 text-sm">Time</span>
            <div>
              {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
            </div>
            
          </div>
          
        </div>
        <div className="w-4/5">
          <ScannerContainer
            eventOccurenceId={eventOccurence.data?.id}
          />
        </div>
      </div>
      
    </div>
  );
}