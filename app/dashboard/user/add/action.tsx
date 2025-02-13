'use server'

import { userSchema } from "./schema";
import http, { ResponseObject } from "@/lib/http";
import { z } from "zod";

export async function addUser(data: z.infer<typeof userSchema>) : Promise<ResponseObject> {

  const params : Record<string, any> = {
    'name': data.name,
    'email': data.email,
    'password': data.password
  }

  const resp = await http().post('/api/user', params);

  if (resp.status !== 200) {
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

// export async function addUser(data: z.infer<typeof userSchema>): Promise<ResponseObject> | never {
//   const params : Record<string, any> = {
//     'name': data.name,
//     'email': data.email,
//     'password': data.password
//   }

//   const resp = await http().post('/api/user', params);

//   if (resp.status !== 200) {
//     return {
//       status: "error",
//       message: resp.data,
//     }
//   }

//   return {
//     status: "success",
//     data: resp.data
//   }
// }