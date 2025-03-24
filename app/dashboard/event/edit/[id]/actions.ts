'use server'

import { eventSchema } from "../../schema";
import http, { ResponseObject } from "@/lib/http";
import { format } from "date-fns";
import { z } from "zod";

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

export async function editEvent(data: z.infer<typeof eventSchema>, startTime: string, endTime: string) : Promise<ResponseObject> {

  const params : Record<string, any> = {
    event_type: data.event_type,
    title: data.title,
    description: data.description,
    location: data.location,
    start_time: data.start_time != null ? format(data.start_time, 'yyyy-MM-dd HH:mm:ss') : null,
    end_time: data.end_time != null ? format(data.end_time, 'yyyy-MM-dd HH:mm:ss') : null,
    is_recurring: data.is_recurring,
    mode: data.mode
  }

  if (data.is_recurring && data.recurrence) {
    params.recurrence = {
      recurrence_type: data.recurrence.recurrence_type,
      start_date: data.recurrence.start_date != null ? format(data.recurrence.start_date, 'yyyy-MM-dd') : null,
      end_date: data.recurrence.end_date != null ? format(data.recurrence.end_date, 'yyyy-MM-dd') : null,
      interval: data.recurrence.interval,
    }
  }

  console.log(params)

  let base_url = `/api/event/${data.id}`
  if (data.mode !== null) {
    base_url += `?selected_start_time=${startTime}&selected_end_time=${endTime}`
  }

  const resp = await http().put(base_url, params);

  console.log(resp.data)

  if (resp.status > 400) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  return {
    status: "success",
    data: resp.data
  }
}