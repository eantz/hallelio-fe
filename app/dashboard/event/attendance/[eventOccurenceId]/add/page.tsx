import { AttendanceForm } from "../_form";

export default async function AddAttendance({
  params
}: {
  params: Promise<{ eventOccurenceId: string }>
}) {

  const eventOccurenceId = (await params).eventOccurenceId

  return (
    <div className="w-1/4">
      <h1>Add Event</h1>
      
      <AttendanceForm 
        eventOccurenceId={Number(eventOccurenceId)}
      />
    </div>
  );
}
