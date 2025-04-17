import { getEventAttendance, getEventOccurence } from "@/app/dashboard/event/fetcher";
import { AttendanceForm } from "../../_form";

export default async function EditAttendance({
  params
}: {
  params: Promise<{ eventOccurenceId: string, id: string }>
}) {

  const eventOccurenceId = (await params).eventOccurenceId
  const id = (await params).id
  

  const eventOccurence = getEventOccurence(eventOccurenceId)
  const attendance = getEventAttendance(eventOccurenceId, id)

  return (
    <div className="w-1/4">
      <h1>Edit Attendace</h1>
      
      <AttendanceForm 
        eventOccurence={eventOccurence}
        attendance={attendance}
      />
    </div>
  );
}
