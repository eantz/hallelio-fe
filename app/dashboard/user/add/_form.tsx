'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { formInitialState, userSchema } from "./schema";
import { useState } from "react";
import { addUser } from "./action";
import { populateFormErrorResponse } from "@/lib/errors";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserForm() {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: formInitialState
  })

  // const [formState, formAction, isPending] = useActionState(addUser, {})
  
  // if (formState.status === "error") {
  //   populateFormErrorResponse(form, formState.message?.errors, formState?.formErrors)
  // }

  async function submitHandler(values: z.infer<typeof userSchema>) {
    setSubmitting(true)
    console.log(values)

    const resp = await addUser(values)

    if (resp.status == "error") {
      populateFormErrorResponse(form, resp.message?.errors)
    }
  }

  return (
    <Form {...form}>
      
      <form method="POST" onSubmit={form.handleSubmit(submitHandler)} className="space-y-4 mt-20">
        <FormMessage>{form.formState.errors.root?.message}</FormMessage>

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
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="reset" variant="secondary" disabled={submitting}>Reset</Button>
        </div>
      </form>
    </Form>
  )
  
}