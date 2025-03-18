'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function TableFilter({
  dateRange
}: {
  dateRange: DateRange
}) {

  const [dateSelected, setDateSelected] = useState<DateRange | undefined>(dateRange);

  return (
    <>
      <form method="GET" className="flex gap-2">
        <input type="hidden" name="start_date" value={dateSelected?.from ? format(dateSelected.from, 'yyyy-MM-dd') : ''} />
        <input type="hidden" name="end_date" value={dateSelected?.to ? format(dateSelected.to, 'yyyy-MM-dd') : ''} />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal"
              )}
            >
              {dateSelected?.from ? (
                dateSelected.to ? (
                  <>
                    {format(dateSelected.from, "yyyy-MM-dd")} -{" "}
                    {format(dateSelected.to, "yyyy-MM-dd")}
                  </>
                ) : (
                  format(dateSelected.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateSelected ?? undefined}
              onSelect={setDateSelected}
              numberOfMonths={2}
              max={31}
            />
          </PopoverContent>
        </Popover>

        <Button type="submit">Filter</Button>
      </form>
      
    </>
  )
}