'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema } from "./schema";
import { use, useState } from "react";
import { editUser } from "./action";
import { populateFormErrorResponse } from "@/lib/errors";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX, Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { ResponseObject } from "@/lib/http";
import { Separator } from "@/components/ui/separator";

export function UserForm({
  user
}: {
  user: Promise<ResponseObject>
}) {
  const [submitting, setSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const userData = use(user)

  const formInitialState = {
    id: userData.data?.id ?? 0,
    name: userData.data?.name ?? "",
    email: userData.data?.email ?? "",
    password: "",
    reTypePassword: ""
  }

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: formInitialState 
  })

  async function submitHandler(values: z.infer<typeof userSchema>) {
    setSubmitting(true)

    const resp = await editUser(values)

    if (resp.status == "error") {
      populateFormErrorResponse(form, resp.message?.errors)
      setSubmitting(false)
    } else {
      setIsSuccess(true)

      setTimeout(() => {
        redirect('/dashboard/user')
      }, 2000)
    }

    
  }

  return (
    <>
      {userData.status == "success" ? (
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-10">
            <FormMessage>{form.formState.errors.root?.message}</FormMessage>
    
            {isSuccess ? (
              <Alert className="bg-green-300 border border-green-600 text-green-950">
                <Loader className="h-4 w-4" />
                <AlertTitle className="font-bold">Success editing user!</AlertTitle>
                <AlertDescription>
                  You will soon be redirected
                </AlertDescription>
              </Alert>
            ) : "" }

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
    
            <FormField
              control={form.control}
              name="name"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Brian May" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            >
    
            </FormField>
    
            <FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    
            <Separator className="mt-6" />

            <FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*******" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    
            <FormField 
              control={form.control}
              name="reTypePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Re-type Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="*******" {...field} />
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
      ) : (
        <Alert variant="destructive">
          <CircleX className="h-4 w-4" />
          <AlertTitle className="font-bold">Error getting user</AlertTitle>
          <AlertDescription>
            Please try again
          </AlertDescription>
        </Alert>
      )}
    </>
    
  )
  
}