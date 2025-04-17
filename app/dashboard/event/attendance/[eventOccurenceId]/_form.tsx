'use client';

import { useForm } from "react-hook-form";
import { Attendance, attendanceSchema, attendanceType } from "../../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { use, useState } from "react";
import { Button } from "@/components/ui/button";
import { addAttendance } from "./add/actions";
import { populateFormErrorResponse } from "@/lib/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Combobox, SearchValuesType } from "@/components/shared/dashboard/combobox";
import { TimePicker24 } from "@/components/ui/time-picker-24";
import { ResponseObject } from "@/lib/http";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export function AttendanceForm({
  eventOccurence,
  attendance,
}: {
  eventOccurence: Promise<ResponseObject>
  attendance?: Attendance
}) {
  const [submitting, setSubmitting] = useState(false)
  const [showGuestNameField, setShowGuestNameField] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  const eventOccurenceDetail = use(eventOccurence)

  const [attendanceTime, setAttendanceTime] = useState<Date>(parse(eventOccurenceDetail.data?.occurence_time, 'yyyy-MM-dd HH:mm:ss', new Date))

  const handleComboboxSearch = async (val: string): Promise<SearchValuesType[]> => {
    const resp = await fetch(`/api/member/search?name=${val}`, {
      method: 'GET',
    })

    const body = await resp.json()

    if (resp.status === 500) {
      return []
    }

    const respValue = body.data.data.map((el: any) => {
      return {
        key: el.id,
        value: el.first_name + ' ' + el.last_name
      }
    })
      
    return respValue
  }

  const queryClient = new QueryClient();

  const action = attendance == undefined ? 'add' : 'edit'

  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: action === 'add' ? {
      id: 0,
      event_occurence_id: eventOccurenceDetail.data?.id,
      attendance_type: attendanceType[1],
      member_id: "",
      guest_name: "",
      attendance_time: new Date(),
    } : {
      id: attendance?.id,
      event_occurence_id: attendance?.event_occurence_id,
      attendance_type: attendance?.attendance_type == 'member' ? attendanceType[0] : attendanceType[1],
      member_id: attendance?.member_id,
      guest_name: attendance?.guest_name,
      attendance_time: attendance ? parse(attendance?.attended_at, "yyyy-MM-dd HH:mm:ss", new Date) : new Date,
    }
  })

  async function submitHandler(values: z.infer<typeof attendanceSchema>) {
    setSubmitting(true)

    let resp;

    if (action == 'add') {
      resp = await addAttendance(values)
    } else {
      // resp = await editEvent(values, startTime, endTime)
    }
    

    if (resp?.status == "error") {
      populateFormErrorResponse(form, resp.message?.errors)
      setSubmitting(false)
    } else {
      setIsSuccess(true)

      setTimeout(() => {
        redirect(`/dashboard/event/attendance/${eventOccurenceDetail.data?.id}`)
      }, 2000)
    }
  
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
          name="event_occurence_id"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Input type="hidden" {...field} /> 
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attendance_type"
          render={({field}) => (
            <FormItem>
              <FormLabel>Attendance Type</FormLabel>
              <Select
                onValueChange={(val) => {
                  field.onChange(val)

                  setShowGuestNameField(val === 'guest')
                }}
                defaultValue={field.value}
                disabled={submitting || action === 'edit'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an attendance type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {attendanceType.map((el, idx) => (
                    <SelectItem key={idx} value={el}>{el}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input type="hidden" {...field} />

              <FormMessage />
            </FormItem>
          )}
        />

        {showGuestNameField && 
          <FormField 
            control={form.control}
            name="guest_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guest Name</FormLabel>
                <FormControl>
                  <Input placeholder="Guest Name" {...field} disabled={submitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        }

        {!showGuestNameField && 
          <FormField 
            control={form.control}
            name="member_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member Name</FormLabel>
                <FormControl>
                  <HydrationBoundary state={dehydrate(queryClient)}>
                    <Combobox 
                      onSearch={handleComboboxSearch} 
                      selectItemPlaceholder="Select a member"
                      searchItemsPlaceholder="Search members.."
                      noItemPlaceholder="No member found"
                      className="w-full"
                      onSelectedValueChanged={(val) => {
                        form.setValue('member_id', val.key)
                      }}
                      disabled={submitting}
                    />
                  </HydrationBoundary>
                  
                </FormControl>

                <Input type="hidden" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        }

        <FormItem>
          <FormLabel>Attendance Time</FormLabel>
          <FormControl>
            <TimePicker24 
              date={attendanceTime} 
              setDate={(d) => {
                console.log(d)
                if (d !== undefined) {
                  setAttendanceTime(d)
                  form.setValue('attendance_time', d)
                }
              }} 
              showIcon={false}
              showSecond={false}
            />
          </FormControl>
          
          <FormMessage />
        </FormItem>
        
        <div className="mt-4">
          <Button type="submit" className="mr-4" disabled={submitting}>Submit</Button>
          <Button type="reset" variant="secondary" disabled={submitting} onClick={() => form.reset()}>Reset</Button>
        </div>
      </form>
    </Form>
  )
}