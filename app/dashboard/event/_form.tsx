'use client';

import { use, useState } from "react";
import { useForm } from "react-hook-form";
import { eventSchema, EventTypes, EventTypeString, formInitialState, RecurrenceTypes } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { populateFormErrorResponse } from "@/lib/errors";
import { redirect } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { ResponseObject } from "@/lib/http";
import { addEvent } from "./add/actions";
import { editEvent } from "./edit/[id]/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TimePicker24 } from "@/components/ui/time-picker-24";

export function EventForm({
  event
}: {
  event?: Promise<ResponseObject>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [recurringEndDateOpen, setRecurringEndDateOpen] = useState(false)

  const eventData = event ? use(event) : null
  
  const [startDateSelected, setStartDateSelected] = useState<Date | undefined>(eventData?.data?.start_time !== undefined ? parse(eventData?.data?.start_time, 'yyyy-MM-dd HH:mm:ss', new Date()) : new Date())
  const [endDateSelected, setEndDateSelected] = useState<Date | undefined>(eventData?.data?.end_time !== undefined ? parse(eventData?.data?.end_time, 'yyyy-MM-dd HH:mm:ss', new Date()) : new Date())

  const action = eventData == null ? 'add' : 'edit'

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: action == 'add' ? formInitialState : {
      id: eventData?.data?.id ?? '',
      event_type: eventData?.data?.event_type ?? EventTypes[0],
      title: eventData?.data?.title ?? '',
      description: eventData?.data?.description ?? '',
      location: eventData?.data?.location ?? '',
      start_time: startDateSelected,
      end_time: endDateSelected,
      is_recurring: eventData?.data?.is_recurring,
      recurrence: {
        recurrence_type: eventData?.data?.recurrence.recurrence_type ?? RecurrenceTypes[0],
        start_date: eventData?.data?.recurrence?.start_date !== undefined ? parse(eventData?.data?.recurrence?.start_date , 'yyyy-MM-dd HH:mm:ss', new Date()) : new Date(),
        end_date: eventData?.data?.recurrence?.end_date !== undefined ? parse(eventData?.data?.recurrence?.end_date, 'yyyy-MM-dd HH:mm:ss', new Date()) : new Date(),
        interval: eventData?.data?.recurrence.interval ?? 1,
      }
    }
  })

  async function submitHandler(values: z.infer<typeof eventSchema>) {
    setSubmitting(true)

    let resp;

    if (action == 'add') {
      resp = await addEvent(values)
    } else {
      resp = await editEvent(values)
    }
    

    if (resp.status == "error") {
      populateFormErrorResponse(form, resp.message?.errors)
      setSubmitting(false)
    } else {
      setIsSuccess(true)

      setTimeout(() => {
        redirect('/dashboard/event')
      }, 2000)
    }
 
  }

  const replaceDate = (originalDateTime: Date | undefined, newDateTime: Date): Date => {
    if (originalDateTime == undefined) {
      return newDateTime
    }
    const originalTime = format(originalDateTime, 'HH:mm:ss')
    const newTime = format(newDateTime, 'HH:mm:ss')

    console.log('original time: ' + originalTime)
    console.log('new time: ' + newTime)

    if (originalTime == newTime) {
      return newDateTime
    }

    return parse(format(newDateTime, 'yyyy-MM-dd') + ' ' + originalTime, 'yyyy-MM-dd HH:mm:ss', new Date())
  }

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-10">
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        
        {isSuccess ? (
          <Alert className="bg-green-300 border border-green-600 text-green-950">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <AlertTitle className="font-bold">Success {action == 'add' ? 'adding' : 'updating'} event!</AlertTitle>
            <AlertDescription>
              You will soon be redirected
            </AlertDescription>
          </Alert>
        ) : "" }

        {action == 'edit' ? (
          <FormField 
            control={form.control} 
            name="id"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} /> 
                </FormControl>
              </FormItem>
            )}
          />
        ) : ''}

        <FormField
          control={form.control}
          name="event_type"
          render={({field}) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={submitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EventTypes.map((el, idx) => (
                    <SelectItem key={idx} value={el}>{EventTypeString[el]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField 
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Sunday Service" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Weekly events" rows={5} {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Church" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex flex-col">
          <FormLabel>Date</FormLabel>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal"
                  )}
                  disabled={submitting}
                >
                  {startDateSelected ? (
                    format(startDateSelected, "yyyy-MM-dd")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDateSelected ?? undefined}
                disabled={{ before: new Date() }}
                onSelect={(d) => {
                  const newStartDate = replaceDate(form.getValues('start_time'), d)
                  
                  setStartDateSelected(newStartDate)
                  form.setValue('start_time', newStartDate)
                  form.setValue('recurrence.start_date', newStartDate)

                  const newEndDate = replaceDate(form.getValues('end_time'), d)
                  form.setValue('end_time', newEndDate)
                  setEndDateSelected(newEndDate)

                  setDateOpen(false)
                }}
                required={true}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>

        <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-1 ">
          <FormItem className="col-span-2">
            <FormLabel>Start Time</FormLabel>
            <FormControl>
              <TimePicker24 
                date={startDateSelected} 
                setDate={(d) => {
                  setStartDateSelected(d)

                  if (d !== undefined) {
                    form.setValue('start_time', d)
                  }
                  
                }} 
                showIcon={false}
                showSecond={false}
              />
            </FormControl>
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel>End Time</FormLabel>
            <FormControl>
              <TimePicker24 
                date={endDateSelected} 
                setDate={(d) => {
                  setEndDateSelected(d)

                  if (d !== undefined) {
                    form.setValue('end_time', d)
                  }
                  
                }} 
                showIcon={false}
                showSecond={false}
              />
            </FormControl>
          </FormItem>
        </div>
        

        <FormField 
          control={form.control}
          name="is_recurring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recurring Event?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="ml-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.getValues('is_recurring') &&
          <>
            <FormField
              control={form.control}
              name="recurrence.recurrence_type"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Recurrence Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={submitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose recurrence type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RecurrenceTypes.map((el, idx) => (
                        <SelectItem key={idx} value={el}>{el}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="recurrence.interval"
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormLabel>Interval</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} disabled={submitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="recurrence.end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Repeat Until</FormLabel>
                  <Popover open={recurringEndDateOpen} onOpenChange={setRecurringEndDateOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal"
                          )}
                          disabled={submitting}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        disabled={{ before: startDateSelected || new Date() }}
                        onSelect={(d) => {
                          field.onChange(d)

                          setRecurringEndDateOpen(false)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            
          </>
        }

        <div className="mt-4">
          <Button type="submit" className="mr-4" disabled={submitting}>Submit</Button>
          <Button type="reset" variant="secondary" disabled={submitting} onClick={() => form.reset()}>Reset</Button>
        </div>
      </form>
    </Form>
  )
  
}