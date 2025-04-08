
export default async function ScannerPage({
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

  return (
    <div className="w-1/2">
      <h1>Scanner</h1>
      <p>Event ID: {eventId}</p>
      <p>Start Time: {qs.start_time}</p>
      <p>End Time: {qs.end_time}</p>
    </div>
  );
}