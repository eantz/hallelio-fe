'use server'

import { memberSchema } from "./schema";
import http, { ResponseObject } from "@/lib/http";
import { z } from "zod";

export async function addMember(data: z.infer<typeof memberSchema>) : Promise<ResponseObject> {

  const params : Record<string, any> = {
    'first_name': data.firstName,
    'last_name': data.lastName,
    'birth_place': data.birthPlace,
    'birth_date': data.birthDate,
    'phone_number': data.phoneNumber,
    'personal_id_number': data.personalIDNumber,
    'picture': data.picture
  }

  const resp = await http().post('/api/member', params);

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