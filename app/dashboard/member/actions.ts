import http, { ResponseObject } from "@/lib/http";

export async function getMembers(pageNum: number): Promise<ResponseObject> {

  const resp = await http().get('/api/member/list', {'page': pageNum})

  if (resp.status !== 200) {
    return {
      status: 'error',
      message: resp.data
    }
  }

  return {
    status: 'success',
    data: resp.data
  }

}