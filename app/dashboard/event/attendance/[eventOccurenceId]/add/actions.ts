'use server'

import http, { ResponseObject } from "@/lib/http";
import { format } from "date-fns";
import { z } from "zod";
import { attendanceSchema } from "../../schema";

export async function addAttendance(data: z.infer<typeof attendanceSchema>) : Promise<ResponseObject> {

  const params : Record<string, any> = {
    event_occurence_id: data.event_occurence_id,
    attendance_type: data.attendance_type,
    guest_name: data.attendance_type == 'guest' ? data.guest_name : '',
    member_id: data.attendance_type == 'member' ? data.member_id : '',
    attended_at: format(data.attendance_time, 'yyyy-MM-dd HH:mm:ss'),
  }

  console.log(params)

  const resp = await http().post('/api/attendance/register', params);

  console.log(resp.data)

  if (!(resp.status === 201 || resp.status === 200)) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  return {
    status: "success"
  }
}