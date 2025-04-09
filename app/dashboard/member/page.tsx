import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MemberTable } from "./_table";
import { PaginationState } from "@tanstack/react-table";
import { getMembers } from "./fetcher";

export default async function Member(props: {
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

  const members = getMembers(currentPage)

  return (
    <div className="w-full">
      <h1>Member Management</h1>

      <div className="flex items-end flex-col pt-4">
        <div>
          <Button asChild>
            <Link href="/dashboard/member/add">Add Member</Link>
          </Button>
          
        </div>
        
      </div>
      <div className="container mx-auto py-4">
        <MemberTable members={members} pagination={pagination} />
      </div>
    </div>
  ) 
}