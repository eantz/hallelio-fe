import http, { ResponseObject } from "@/lib/http"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) : Promise<NextResponse<ResponseObject>> {
  const body = await request.json()

  const resp = await http().delete(`/api/event/${body.id}`, {
    selected_start_time: body.selected_start_time,
    selected_end_time: body.selected_end_time,
    mode: body.mode
  })

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