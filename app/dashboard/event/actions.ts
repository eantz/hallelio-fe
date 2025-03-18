import http, { ResponseObject } from "@/lib/http";

export async function getEvents(startDate: string, endDate: string): Promise<ResponseObject> {

  const resp = await http().get('/api/event/list', {'start_date': startDate, 'end_date': endDate})

  if (resp.status !== 200) {
    return {
      status: 'error',
      message: resp.data
    }
  }

  return {
    status: 'success',
    data: resp.data
  }

}