'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { login } from "./actions"
import { useState } from "react"
import { populateFormErrorResponse } from "@/lib/errors"
import { loginSchema } from "./schema"


export default function Home() {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "", 
      password: "",
      rememberMe: false
    }
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setSubmitting(true)
    console.log(values)

    const resp = await login(values)

    if (resp.status == "error") {
      populateFormErrorResponse(form, resp.message?.errors)
    }

    setSubmitting(false)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Card>
          <CardHeader>
            <CardTitle>
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormMessage>{form.formState.errors.root?.message}</FormMessage>
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
                    <FormItem className="mt-4">
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
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
                          <label 
                            htmlFor="rememberMe"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Remember Me
                          </label>
                        </div>
                        
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="mt-4">
                  <Button type="submit" className="mr-4" disabled={submitting}>Submit</Button>
                  <Button type="reset" variant="secondary" disabled={submitting}>Reset</Button>
                </div>
              </form>
            </Form>

            <Separator className="mt-4" />

            <Button asChild variant="link" className="mt-4 pl-0">
              <Link href="/register">Register</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
