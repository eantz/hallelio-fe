import http, { ResponseObject } from "@/lib/http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) : Promise<NextResponse<ResponseObject>> {
  const body = await request.formData()
  const f = body.get('file') as File
  

  const params = new FormData()
  params.append('file', f)
  
  const resp = await http().post('/api/upload', params, {
    headers: {
      'Content-type': 'multipart/form-data'
    }
  });

  console.log(resp)

  if (resp.status !== 200) {
    return NextResponse.json({
      status: "error",
      message: resp.data,
    }, {status: 500})
  }

  return NextResponse.json({
    status: "success",
    data: resp.data
  })
}