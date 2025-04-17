import { EventForm } from "../../_form";
import { getEvent } from "../../fetcher";

export default async function EditEvent({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{
    'start_time': string,
    'end_time': string
  }>
}) {

  const eventId = (await params).id
  const qs = await searchParams

  const event = getEvent(eventId, qs.start_time, qs.end_time)

  return (
    <div className="w-1/2">
      <h1>Edit Event</h1>
      
      <EventForm 
        event={event} 
        startTime={qs.start_time}
        endTime={qs.end_time}
      />
    </div>
  );
}
