import http, { ResponseObject } from "@/lib/http"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) : Promise<NextResponse<ResponseObject>> {
  const searchParams = request.nextUrl.searchParams
  const name = searchParams.get('name')

  const resp = await http().get('/api/member/list', {'name': name})

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