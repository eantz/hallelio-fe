'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { formInitialState, memberSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { populateFormErrorResponse } from "@/lib/errors";
import { redirect } from "next/navigation";
import { addMember } from "./actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, Loader, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { PhoneInput } from "@/components/ui/phone-input";
import { DropzoneOptions } from "react-dropzone";
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

export function MemberForm() {
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: formInitialState
  })

  async function submitHandler(values: z.infer<typeof memberSchema>) {
    setSubmitting(true)

    const resp = await addMember(values)

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
  const dropzone = {
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    noDrag: true
  } satisfies DropzoneOptions;

  const uploadImage = async (files: File[] | null) => {
    files?.map(async (file : File) => {
      const formData = new FormData();
      formData.append('file', file)
      const resp = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      })

      console.log(resp)
    })
  }

  return (
    <Form {...form}>
      
      <form method="POST" onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-10">
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>
        
        {isSuccess ? (
          <Alert className="bg-green-300 border border-green-600 text-green-950">
            <Loader className="h-4 w-4" />
            <AlertTitle className="font-bold">Success adding user!</AlertTitle>
            <AlertDescription>
              You will soon be redirected
            </AlertDescription>
          </Alert>
        ) : "" }

        <FormField
          control={form.control}
          name="firstName"
          render={({field}) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Brian" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        >

        </FormField>

        <FormField 
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="May" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="birthPlace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Place</FormLabel>
              <FormControl>
                <Input placeholder="Toronto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="birthDate"
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
                    selected={field.value}
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput placeholder="Enter a phone number" {...field} />
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
                <Textarea placeholder="Street Ave." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField 
          control={form.control}
          name="personalIDNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Personal ID Number</FormLabel>
              <FormControl>
                <Input placeholder="8317439473250" {...field} />
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
                <FileUploader
                  value={field.value}
                  onValueChange={(files) => {
                    uploadImage(files)
                    field.onChange(files)
                  }}
                  dropzoneOptions={dropzone}
                  reSelect={true}
                  className="w-24"
                >
                  <FileInput
                    className={cn(
                      "bg-gray-400 size-24 grid grid-cols-3 content-center gap-3",
                    )}
                  >
                    <Upload className="size-6 col-start-2" />
                    
                  </FileInput>
                  {field.value && field.value.length > 0 && (
                    <FileUploaderContent className="absolute bottom-20 size-24 -ml-1 rounded-b-none rounded-t-md flex-row ">
                      {field.value.map((file, i) => (
                        <FileUploaderItem
                          key={i}
                          index={i}
                          aria-roledescription={`file ${i + 1} containing ${
                            file.name
                          }`}
                          className="p-0 size-24 mt-1"
                        >
                          <div className="size-full">
                            <AspectRatio className="size-full">
                              <Image
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="object-cover rounded-md"
                                fill
                              />
                            </AspectRatio>
                          </div>
                          
                        </FileUploaderItem>
                      ))}
                    </FileUploaderContent>
                  )}
                </FileUploader>
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