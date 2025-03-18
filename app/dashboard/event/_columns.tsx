'use client';

import { DataTableDeleteAction } from '@/components/shared/dashboard/datatable-delete-action';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Event, EventTypeString } from './schema';
import { format, parse } from 'date-fns';

export const columns: ColumnDef<Event>[] = [
  {
    accessorFn: row => format(parse(row.start_time, 'yyyy-MM-dd HH:mm:ss', new Date()), 'yyyy-MM-dd'),
    header: 'Date'
  },
  {
    accessorFn: row => `${format(parse(row.start_time, 'yyyy-MM-dd HH:mm:ss', new Date()), 'HH:mm')} - `
      + `${format(parse(row.end_time, 'yyyy-MM-dd HH:mm:ss', new Date()), 'HH:mm')}`,
    header: 'Time'
  },
  {
    accessorFn: row => {
      return EventTypeString[row.event_type]
    },
    header: 'Event Type'
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    accessorKey: 'description',
    header: 'Description'
  },
  {
    accessorKey: 'location',
    header: 'Location'
  },
  {
    id: 'actions',
    cell: ({row}) => {
      const event = row.original

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
              <Link href={`/dashboard/event/edit/${event.id}`} className="w-full">Edit</Link>
            </DropdownMenuItem>
            
            <DataTableDeleteAction 
              deleteEndpoint="/api/event"
              deleteParams={{
                id: event.id
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]