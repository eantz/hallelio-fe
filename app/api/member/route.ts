import http, { ResponseObject } from "@/lib/http"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) : Promise<NextResponse<ResponseObject>> {
  const body = await request.json()
  console.log(body)

  const resp = await http().delete(`/api/member/${body.id}`, {})

  if (resp.status !== 200) {
    return NextResponse.json({
      status: "error",
      message: resp.data
    }, {status: 500})
  }

  return NextResponse.json({
    status: "success",
    data: resp.data
  })
}