import { getEventOccurence } from "../../../fetcher";
import { AttendanceForm } from "../_form";

export default async function AddAttendance({
  params
}: {
  params: Promise<{ eventOccurenceId: string }>
}) {

  const eventOccurenceId = (await params).eventOccurenceId
  const eventOccurence = getEventOccurence(eventOccurenceId)

  return (
    <div className="w-1/4">
      <h1>Add Attendance</h1>
      
      <AttendanceForm 
        eventOccurence={eventOccurence}
      />
    </div>
  );
}
