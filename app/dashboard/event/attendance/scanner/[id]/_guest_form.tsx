'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { attendanceListType, attendanceSchema, guestFormSchema } from "../../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormItem, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { registerAttendance } from "./actions";
import { parse } from "date-fns";

export default function GuestForm({
  eventOccurenceId,
  onSuccessAddAttendance
}: {
  eventOccurenceId: number,
  onSuccessAddAttendance: (newAttendance: attendanceListType) => void
}) {

  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof guestFormSchema>>({
    resolver: zodResolver(guestFormSchema),
    defaultValues: {
      guest_name: "Guest",
    }
  })

  const submitHandler = async(data: z.infer<typeof guestFormSchema>) => {
    setSubmitting(true);

    console.log(data)

    const params = attendanceSchema.safeParse({
      event_occurence_id: eventOccurenceId,
      attendance_type: "guest",
      attendance_time: new Date(),
      member_id: null,
      guest_name: data.guest_name,
    })

    if (!params.success) {
      let errors = ''
      params.error.issues.map((issue) => {
        errors += issue.message
      })
      form.setError('root', {message: errors})
      return;
    }

    const resp = await registerAttendance(params.data)
    if (resp.status !== "success") {
      form.setError('root', {message: resp.message?.error})
      return;
    }

    const newAttendanceList = {
      memberId: "",
      memberName: resp.data?.guest_name,
      attendanceTime: parse(resp.data?.attended_at, 'yyyy-MM-dd HH:mm:ss', new Date()),
      attendanceType: resp.data?.attendance_type,
      guestName: resp.data?.guest_name,
    }
    
    onSuccessAddAttendance(newAttendanceList)

    form.reset();

    setSubmitting(false);
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form method="POST" onSubmit={form.handleSubmit(submitHandler)}>
          <div className="flex flex-col md:flex-row">
            <FormField 
              control={form.control}
              name="guest_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Guest Name" 
                      {...field} 
                      disabled={submitting} 
                      className="rounded-t-none rounded-r-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="flex-grow rounded-t-none rounded-l-none" disabled={submitting}>Submit</Button>
          </div>

          <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        </form>
      </Form>
    </div>
  )
}