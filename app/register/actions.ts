'use server'

import http, { ResponseObject } from "@/lib/http"
import { redirect } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "./schema";

export async function register(data: z.infer<typeof registerSchema>): Promise<ResponseObject> | never {
  const params : Record<string, any> = {
    'name': data.name,
    'email': data.email,
    'password': data.password,
    'device_name': data.email
  }

  const resp = await http().post('/api/auth/register', params);

  if (resp.status !== 200) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  redirect('/')
}