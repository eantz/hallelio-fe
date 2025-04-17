'use server';

import { z } from "zod";
import { attendanceSchema } from "../../schema";
import http, { ResponseObject } from "@/lib/http";
import { format } from "date-fns";

export async function registerAttendance(data: z.infer<typeof attendanceSchema>): Promise<ResponseObject> {
  const params: Record<string, any> = {
    event_occurence_id: data.event_occurence_id,
    attendance_type: data.attendance_type,
    attended_at: format(data.attendance_time, 'yyyy-MM-dd HH:mm:ss'),
    member_id: data.member_id && data.member_id !== null ? data.member_id : '',
    guest_name: data.guest_name && data.guest_name !== null ? data.guest_name : '',
  }

  const resp = await http().post(`/api/attendance/register`, params);

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