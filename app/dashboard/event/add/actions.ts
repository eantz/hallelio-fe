'use server'

import { eventSchema } from "../schema";
import http, { ResponseObject } from "@/lib/http";
import { format } from "date-fns";
import { z } from "zod";

export async function addEvent(data: z.infer<typeof eventSchema>) : Promise<ResponseObject> {

  const params : Record<string, any> = {
    event_type: data.event_type,
    title: data.title,
    description: data.description,
    location: data.location,
    start_time: data.start_time != null ? format(data.start_time, 'yyyy-MM-dd HH:mm:ss') : null,
    end_time: data.end_time != null ? format(data.end_time, 'yyyy-MM-dd HH:mm:ss') : null,
    is_recurring: data.is_recurring
  }

  if (data.recurrence) {
    params.recurrence = {
      recurrence_type: data.recurrence.recurrence_type,
      start_date: data.recurrence.start_date != null ? format(data.recurrence.start_date, 'yyyy-MM-dd') : null,
      end_date: data.recurrence.end_date != null ? format(data.recurrence.end_date, 'yyyy-MM-dd') : null,
      interval: data.recurrence.interval,
    }
  }

  console.log(params)

  const resp = await http().post('/api/event', params);

  console.log(resp.data)

  if (resp.status !== 201) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  return {
    status: "success",
    // data: resp.data
  }
}