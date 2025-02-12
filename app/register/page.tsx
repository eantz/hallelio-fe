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

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { register } from "./actions"
import { useState } from "react"
import { populateFormErrorResponse } from "@/lib/errors"
import { registerSchema } from "./schema"


export default function Register() {
	const [submitting, setSubmitting] = useState(false)

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			reTypePassword: ""
		}
	})

	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setSubmitting(true)
		console.log(values)

		const resp = await register(values)

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
							Register
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

						<Separator className="mt-4" />

						<Button asChild variant="link" className="mt-4 pl-0">
							<Link href="/">Login</Link>
						</Button>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
