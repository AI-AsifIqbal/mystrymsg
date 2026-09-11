'use client'
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { signUpSchema } from "@/schemas/signUpSchema"
import * as z from "zod"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "@/components/ui/toast"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const SignUpPage = () => {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300)
    
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const res = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(res.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUniqueUsername()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const res = await axios.post(`/api/sign-up`, data)

            toast.add({
                type: 'success',
                description: res.data.message
            })

            router.replace(`/verify/${data.username}`)
            
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast.add({
                type: "error",
                title: "Signup failed",
                description: axiosError.response?.data.message ?? "Something went wrong",
                priority: "high"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Mystery Message
                    </h1>
                    <p className="mb-4">
                        Sign up to start your anonymous adventure
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(
                    onSubmit,
                    (errors) => {
                        console.log("FORM VALIDATION ERRORS:", errors)
                    }
                )} className="space-y-6">
                    <FieldGroup>
                        <Controller
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Username</FieldLabel>
                                    <Input
                                        {...field}
                                        id="username"
                                        placeholder="username"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            field.onChange(e)
                                            debounced(e.target.value)
                                        }}
                                    />
                                    {form.formState.errors.username && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {form.formState.errors.username.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />
                        {isCheckingUsername && <Loader2 className="animate-spin" />}
                        {usernameMessage && (
                            <p
                                className={`text-sm ${usernameMessage === "Username is unique"
                                    ? "text-green-500"
                                    : "text-red-500"
                                    }`}
                            >
                                {usernameMessage}
                            </p>
                        )}

                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id="email"
                                        placeholder="email"
                                        autoComplete="off"
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input
                                        {...field}
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        autoComplete="off"
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </Field>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please Wait
                                    </>
                                ) : ('Signup')
                            }
                        </Button>
                    </FieldGroup>
                </form>

                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    )
}

export default SignUpPage