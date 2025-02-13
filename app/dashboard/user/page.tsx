import { DataTable } from "@/components/shared/dashboard/datatable"
import { getUsers } from "./actions"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import { PaginationState } from "@tanstack/react-table"
import Link from "next/link"

export default async function User(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string
  }>
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page || 1)

  const pagination: PaginationState = {
    pageSize: 10,
    pageIndex: currentPage
  }

  const users = await getUsers(1)

  return (
    <div className="w-full">
      <h1>User Management</h1>

      <div className="flex items-end flex-col pt-4">
        <div>
          <Button asChild>
            <Link href="/dashboard/user/add">Add User</Link>
          </Button>
          
        </div>
        
      </div>
      <div className="container mx-auto py-4">
        <DataTable 
          columns={columns} 
          data={users.data?.data} 
          pagination={pagination}
        />
      </div>

    </div>
  ) 
}