'use server'

import http, { ResponseObject } from "@/lib/http"

export async function getActiveUser() : Promise<ResponseObject> {
  const resp = await http().get('/api/user/active-user', null)

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