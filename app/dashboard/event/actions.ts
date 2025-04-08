'use server';

import { z } from "zod";
import { eventOccurenceSchema } from "./schema";
import http, { ResponseObject } from "@/lib/http";
import { format } from "date-fns";

export async function registerOccurence(data: z.infer<typeof eventOccurenceSchema>): Promise<ResponseObject> {
  const params: Record<string, any> = {
    event_id: data.event_id,
    occurence_time: format(data.occurence_time, 'yyyy-MM-dd HH:mm:ss'),
  }

  const resp = await http().post(`/api/event/occurence/register`, params);

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