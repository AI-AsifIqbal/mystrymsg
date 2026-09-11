'use client'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()

    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code
            })

            toast.add({
                type: 'success',
                description: res.data.message
            })

            router.replace('/sign-in')

        } catch (error) {
            console.error("Error in verifying user", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast.add({
                type: "error",
                title: "Verification falied",
                description: axiosError.response?.data.message ?? "Something went wrong",
                priority: "high"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">
                        Enter the verification code sent to your email
                    </p>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FieldGroup>
                        <Controller
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>Verification Code</FieldLabel>
                                    <Input
                                        {...field}
                                        id="code"
                                        placeholder="code"
                                        autoComplete="off"
                                    />
                                </Field>
                            )}
                        />

                        <Button type="submit">
                            Submit
                        </Button>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default VerifyAccount