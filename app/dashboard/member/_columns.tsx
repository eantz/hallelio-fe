'use client';

import { DataTableDeleteAction } from '@/components/shared/dashboard/datatable-delete-action';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Member } from './schema';

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorFn: row => `${row.first_name} ${row.last_name}`,
    header: 'Name'
  },
  {
    accessorFn: row => `${row.birth_place ? row.birth_place + ', ' : ''}${row.birth_date ?? ''}`,
    header: 'Birthday'
  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number'
  },
  {
    accessorKey: 'address',
    header: 'Address'
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const member = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/dashboard/member/edit/${member.id}`} className="w-full">Edit</Link>
            </DropdownMenuItem>
            
            <DataTableDeleteAction 
              deleteEndpoint="/api/member"
              deleteParams={{
                id: member.id
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]