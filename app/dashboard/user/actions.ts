import http, { ResponseObject } from "@/lib/http";

export async function getUsers(pageNum: number): Promise<ResponseObject> {

  const resp = await http().get('/api/user/list', {'page': pageNum})

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