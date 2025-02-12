'use server'

import http, { ResponseObject } from "@/lib/http"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "./schema";

export async function login(data: z.infer<typeof loginSchema>): Promise<ResponseObject> | never {
  const params : Record<string, any> = {
    'email': data.email,
    'password': data.password,
    'device_name': data.email
  }

  const resp = await http().post('/api/auth/login', params);

  if (resp.status !== 200) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  const cookieStore = await cookies()
  cookieStore.set('token', resp.data.token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  redirect('/dashboard')
}