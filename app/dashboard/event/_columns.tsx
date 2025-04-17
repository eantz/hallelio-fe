'use client';

import { DataTableDeleteAction } from '@/components/shared/dashboard/datatable-delete-action';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Event, EventTypeString } from './schema';
import { differenceInMinutes, format, parse } from 'date-fns';
import { LaunchAttendanceScanner } from './_launch_attendance_scanner';

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

      const currentTime = new Date();
      const startTime = parse(event.start_time, 'yyyy-MM-dd HH:mm:ss', new Date());
      const endTime = parse(event.end_time, 'yyyy-MM-dd HH:mm:ss', new Date());

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
              <Link href={`/dashboard/event/edit/${event.exception_event_id ?? event.id}?start_time=${event.start_time}&end_time=${event.end_time}`} className="w-full">Edit</Link>
            </DropdownMenuItem>

            {event.event_occurence_id && 
              <DropdownMenuItem>
                <Link href={`/dashboard/event/attendance/${event.event_occurence_id}`} className="w-full">Attendances</Link>
              </DropdownMenuItem>
            }

            {(differenceInMinutes(startTime, currentTime) < 15 && differenceInMinutes(endTime, currentTime) > -60) && 
              <LaunchAttendanceScanner 
                actionData={{
                  event_id: event.exception_event_id ?? event.id,
                  start_time: event.start_time,
                  end_time: event.end_time
                }}
              />
            }
              
            <DataTableDeleteAction 
              deleteEndpoint={`/api/event`}
              deleteParams={{
                id: event.id,
                selected_start_time: event.start_time,
                selected_end_time: event.end_time,
                mode: 'this'
              }}
              label={(event.is_recurring) ? 'Delete this event only' : 'Delete'}
            />
            
            
            {Boolean(event.is_recurring) &&
              <DataTableDeleteAction 
                deleteEndpoint={`/api/event`}
                deleteParams={{
                  id: event.id,
                  selected_start_time: event.start_time,
                  selected_end_time: event.end_time,
                  mode: 'this_and_following'
                }}
                label='Delete this and following'
              />
            }

          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]