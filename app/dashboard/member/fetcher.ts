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

export async function getMember(id: string): Promise<ResponseObject> {
  const resp = await http().get(`/api/member/${id}`, null)

  if (resp.status !== 200) {
    return {
      status: "error",
      message: resp.data,
    }
  }

  return {
    status: "success",
    data: resp.data,
  }
}