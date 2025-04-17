'use client';

import { DataTableDeleteAction } from '@/components/shared/dashboard/datatable-delete-action';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { format, parse } from 'date-fns';
import { Attendance } from '../schema';

export const columns: ColumnDef<Attendance>[] = [
  {
    accessorFn: row => `${row.member !== null ? row.member.first_name + ' ' + row.member.last_name : row.guest_name} `,
    header: 'Name'
  },
  {
    accessorFn: row => `${format(parse(row.attended_at, 'yyyy-MM-dd HH:mm:ss', new Date()), 'HH:mm')}`,
    header: 'Attended At'
  },
  {
    accessorKey: 'attendance_type',
    header: 'Membership Status'
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const attendance = row.original

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
            {
              attendance.attendance_type == 'guest' && 
                <DropdownMenuItem>
                  <Link href={`/dashboard/event/attendance/${attendance.event_occurence_id}/edit/${attendance.id}`} className="w-full">Edit</Link>
                </DropdownMenuItem>
            }
              
            <DataTableDeleteAction 
              deleteEndpoint={`/api/attendance`}
              deleteParams={{
                id: attendance.id,
              }}
              label="Delete"
            />

          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]