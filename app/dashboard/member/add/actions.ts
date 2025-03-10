'use server'

import { memberSchema } from "./schema";
import http, { ResponseObject } from "@/lib/http";
import { format } from "date-fns";
import { z } from "zod";

export async function addMember(data: z.infer<typeof memberSchema>) : Promise<ResponseObject> {

  const params : Record<string, any> = {
    'first_name': data.first_name,
    'last_name': data.last_name,
    'birth_place': data.birth_place,
    'birth_date': data.birth_date != null ? format(data.birth_date, 'yyyy-MM-dd') : null,
    'phone_number': data.phone_number,
    'address': data.address,
    'personal_id_number': data.personal_id_number,
    'picture': data.picture
  }

  console.log(params)

  const resp = await http().post('/api/member', params);

  console.log(resp.data)

  if (resp.status !== 201) {
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