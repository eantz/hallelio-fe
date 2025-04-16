import http, { ResponseObject } from "@/lib/http";

export async function getEvents(startDate: string, endDate: string): Promise<ResponseObject> {

  if (!endDate) {
    endDate = startDate
  }

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

export async function getEvent(id: string, start_time: string, end_time: string): Promise<ResponseObject> {
  const resp = await http().get(`/api/event/${id}`, {
    'start_time': start_time,
    'end_time': end_time,
    'include_recurrence_info': 1
  })

  if (resp.status !== 200) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  return {
    status: "success",
    data: resp.data,
  }
}

export async function getEventOccurence(id: string): Promise<ResponseObject> {
  const resp = await http().get(`/api/event/occurence/${id}`, {})

  if (resp.status !== 200) {
    return {
      status: "error",
      message: resp.data,
    }
  }
  
  return {
    status: "success",
    data: resp.data,
  }
}

export async function getEventAttendances(eventOccurenceId: string, page: number): Promise<ResponseObject> {
  const resp = await http().get(`/api/attendance/list?event_occurence_id=${eventOccurenceId}&page=${page}`, null)

  if (resp.status !== 200) {
    return {
      status: "error",
      message: resp.data,
    }
  }
  
  return {
    status: "success",
    data: resp.data,
  }
}

export async function searchMembers(name: string): Promise<ResponseObject> {
  const resp = await http().get('/api/member/list', {'name': name})

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