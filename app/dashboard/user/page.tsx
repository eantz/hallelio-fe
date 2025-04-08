import { getUsers } from "./fetcher"
import { Button } from "@/components/ui/button"
import { PaginationState } from "@tanstack/react-table"
import Link from "next/link"
import { UserTable } from "./_table"

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

  const users = getUsers(currentPage)

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
        <UserTable users={users} pagination={pagination} />
      </div>
    </div>
  ) 
}