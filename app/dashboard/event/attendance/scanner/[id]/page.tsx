import { getEventOccurence } from "../../../fetcher"
import ScannerContainer from "./_scanner"

export default async function ScannerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const eventId = (await params).id

  const event = getEventOccurence(eventId)

  return (
    <div className="w-full">
      <h1>Attendance Scanner</h1>
      <ScannerContainer
        event={event}
      />
    </div>
  );
}