'use client'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { signInSchema } from '@/schemas/signInSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

const SignInPage = () => {
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const res = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (res?.error) {
            toast.add({
                type: "error",
                title: "Login failed",
                description: "Incorrect credentials",
                priority: "high"
            })
            return
        }

        if (res?.url) {
            router.replace('/dashboard')
        }

        toast.add({
            type: 'success',
            description: "Logged in successfully"
        })
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back
                    </h1>
                    <p className="mb-4">
                        Sign in to continue your anonymous adventure
                    </p>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Username or Email</FieldLabel>
                                    <Input
                                        {...field}
                                        id="identifier"
                                        placeholder="username or email"
                                        autoComplete="off"
                                    />
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
                                </Field>
                            )}
                        />

                        <Button type="submit">
                            Signin
                        </Button>
                    </FieldGroup>
                </form>

                <div className="text-center mt-4">
                    <p>
                        New to Mystry Message?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}

export default SignInPage