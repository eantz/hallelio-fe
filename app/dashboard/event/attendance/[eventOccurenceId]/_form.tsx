'use client';

import { useForm } from "react-hook-form";
import { Attendance, attendanceFormInitialState, attendanceSchema, attendanceType } from "../../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "date-fns";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { addAttendance } from "./add/actions";
import { populateFormErrorResponse } from "@/lib/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function AttendanceForm({
  eventOccurenceId,
  attendance
}: {
  eventOccurenceId: number,
  attendance?: Attendance
}) {
  const [submitting, setSubmitting] = useState(false)
  const [showGuestNameField, setShowGuestNameField] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)

  const [memberSelectLoading, setMemberSelectLoading] = useState(false)
  const [memberSelectOpen, setMemberSelectOpen] = useState(false)

  const [memberOptions, setMemberOptions] = useState([])
  const [selectedMember, setSelectedMember] = useState<any>({})
  const [inputSelectedMemberValue, setInputSelectedMemberValue] = useState('')

  const memberNameDebounced = useDebouncedCallback(
    useCallback(async function(value) {
      setMemberSelectLoading(true)

      const resp = await fetch(`/api/member/search?name=${value}`, {
        method: 'GET',
      })

      const body = await resp.json()

      if (resp.status === 500) {
        console.log(body.message)
      } else {
        setMemberOptions(() => {
          return body.data.data
        })
        setMemberSelectLoading(false)
        setMemberSelectOpen(true)
      }
    }, []),
    500,
    { maxWait: 5000}
  )

  const handleMemberOptionClick = (el: any) => {
    setSelectedMember(el)
    setInputSelectedMemberValue(el.first_name + ' ' + el.last_name)
    form.setValue("member_id", el.id)
  }

  const action = attendance == undefined ? 'add' : 'edit'

  const form = useForm<z.infer<typeof attendanceSchema>>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: action === 'add' ? attendanceFormInitialState : {
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
          redirect(`/dashboard/attendance/${eventOccurenceId}`)
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
                  <Input 
                    placeholder="Member Name" 
                    disabled={submitting} 
                    onChange={(e) => {
                      memberNameDebounced(e.target.value)
                    }}
                  />
                </FormControl>

                <Popover 
                  open={memberSelectOpen} 
                  onOpenChange={setMemberSelectOpen}
                >
                  <PopoverTrigger asChild>
                    <div></div>
                  </PopoverTrigger>
                  <PopoverContent 
                    onOpenAutoFocus={(e) => {
                      e.preventDefault()
                    }}
                    className="p-0"
                  >
                    {memberSelectLoading && 
                      <div className="w-full text-center">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      </div>
                    }
                    {!memberSelectLoading && memberOptions.map((el: any, idx: number) => {
                      return (
                        <div
                          key={idx}
                          className="w-full hover:bg-slate-400 p-2 flex flex-row"
                          onClick={() => handleMemberOptionClick(el)}
                        >
                          <span className="flex-grow text-sm">{el.first_name + ' ' + el.last_name}</span>
                          <span className="flex-none">
                            {selectedMember.id === el.id && 
                              <Check className="h-4 w-4 mt-1" />
                            }
                          </span>
                        </div>
                      )
                    })}
                  </PopoverContent>
                </Popover>

                <Input type="hidden" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        }

        <div className="mt-4">
          <Button type="submit" className="mr-4" disabled={submitting}>Submit</Button>
          <Button type="reset" variant="secondary" disabled={submitting} onClick={() => form.reset()}>Reset</Button>
        </div>
      </form>
    </Form>
  )
}