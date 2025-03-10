'use client';

import { ChangeEvent, use, useState } from "react";
import { useForm } from "react-hook-form";
import { formInitialState, memberSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { populateFormErrorResponse } from "@/lib/errors";
import { redirect } from "next/navigation";
import { addMember } from "./add/actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, LoaderCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PhoneInput } from "@/components/ui/phone-input";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { editMember } from "./edit/[id]/actions";
import { ResponseObject } from "@/lib/http";

export function MemberForm({
  member
}: {
  member?: Promise<ResponseObject>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const memberData = member ? use(member) : null

  const action = memberData == null ? 'add' : 'edit'

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: action == 'add' ? formInitialState : {
      id: memberData?.data?.id ?? '',
      first_name: memberData?.data?.first_name ?? '',
      last_name: memberData?.data?.last_name ?? '',
      birth_place: memberData?.data?.birth_place ?? '',
      birth_date: memberData?.data?.birth_date !== null ? parse(memberData?.data?.birth_date || '1970-01-01', 'yyyy-MM-dd', new Date()) : null,
      phone_number: memberData?.data?.phone_number ?? '',
      address: memberData?.data?.address ?? '',
      personal_id_number: memberData?.data?.personal_id_number ?? '',
      picture: memberData?.data?.picture ?? ''
    }
  })

  async function submitHandler(values: z.infer<typeof memberSchema>) {
    setSubmitting(true)

    let resp;

    if (action == 'add') {
      resp = await addMember(values)
    } else {
      resp = await editMember(values)
    }
    

    if (resp.status == "error") {
      populateFormErrorResponse(form, resp.message?.errors)
      setSubmitting(false)
    } else {
      setIsSuccess(true)

      setTimeout(() => {
        redirect('/dashboard/member')
      }, 2000)
    }
 
  }

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files?.length == 0) {
      return
    }
    
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0])
      const resp = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      const body = await resp.json()

      form.setValue('picture', body.data.file_url)
    } catch(e: any) {
      console.log(e.message)
    }
    
  }

  const removeImage = () => {
    form.setValue('picture', '')

    const fileUploader = document.getElementById('file-uploader')
    fileUploader?.setAttribute('value', '')
  }

  return (
    <Form {...form}>     
      <form method="POST" onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-10">
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        
        {isSuccess ? (
          <Alert className="bg-green-300 border border-green-600 text-green-950">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            <AlertTitle className="font-bold">Success adding user!</AlertTitle>
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
          name="first_name"
          render={({field}) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Brian" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >

        </FormField>

        <FormField 
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="May" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="birth_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Place</FormLabel>
              <FormControl>
                <Input placeholder="Toronto" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="birth_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Birth Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={submitting}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
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
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput placeholder="Enter a phone number" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Street Ave." rows={5} {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="personal_id_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal ID Number</FormLabel>
              <FormControl>
                <Input placeholder="8317439473250" {...field} disabled={submitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Picture</FormLabel>
              <FormControl>
                <div>
                  <Input type="file" accept="image/*" onChange={uploadImage} id="file-uploader" disabled={submitting} />
                  <Input type="hidden" {...field} />
                  {field.value ? (
                    <div className="relative size-24 mt-2">
                      <Image src={field.value} alt="photo profile" className="size-24 rounded" fill />
                      <Button
                        type="button"
                        className="absolute top-1 rounded right-1 border p-1 h-6 hover:bg-slate-400"
                        onClick={removeImage}
                      >
                        <Trash2 className="w-4 h-4 hover:stroke-destructive duration-200 ease-in-out" />
                      </Button>
                    </div>
                  ) : ''}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <Button type="submit" className="mr-4" disabled={submitting}>Submit</Button>
          <Button type="reset" variant="secondary" disabled={submitting} onClick={() => form.reset()}>Reset</Button>
        </div>
      </form>
    </Form>
  )
  
}