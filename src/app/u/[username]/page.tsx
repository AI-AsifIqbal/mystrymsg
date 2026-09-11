'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCompletion } from '@ai-sdk/react';
import * as z from "zod";

const specialChar = '||';
const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
};
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const MessagePage = () => {
    const params = useParams<{ username: string }>()
    const username = params.username;

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    })
    const messageContent = form.watch('content');

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true)
        try {
            const res = await axios.post(`/api/send-message`, {
                username: username,
                content: data.content
            })

            toast.add({
                type: 'success',
                description: res.data.message
            })

            form.reset({ ...form.getValues(), content: '' })

        } catch (error) {
            console.error("Error in sending message", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast.add({
                type: "error",
                title: "Message sending error",
                description: axiosError.response?.data.message ?? "Something went wrong",
                priority: "high"
            })
        } finally {
            setIsLoading(false)
        }
    }

    // const [generateMessages, setGenerateMessages] = useState(initialMessageString)
    // const [isGeneratingMessages, setIsGeneratingMessages] = useState(false)

    // const fetchSuggestMessages = async () => {
    //     setIsGeneratingMessages(true)
    //     try {
    //         const res = await axios.post(`/api/suggest-messages`)
    //         const aiMessages = res.data.message
    //         setGenerateMessages(aiMessages)

    //         toast.add({
    //             type: "success",
    //             title: "Message suggested successfully"
    //         })

    //     } catch (error) {
    //         console.error("Error in generating message", error);
    //         const axiosError = error as AxiosError<ApiResponse>

    //         toast.add({
    //             type: "error",
    //             title: "Message generation error",
    //             description: axiosError.response?.data.message ?? "Something went wrong",
    //             priority: "high"
    //         })
    //     } finally {
    //         setIsGeneratingMessages(false)
    //     }
    // }

    const { complete, completion, isLoading: isSuggestLoading, error } = useCompletion({
        api: '/api/suggest-messages',
        initialCompletion: initialMessageString
    })

    const fetchSuggestMessages = async () => {
        try {
            complete('')
        } catch (error) {
            console.error("Error generating messages:", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast.add({
                type: "error",
                title: "Message generation error",
                description: axiosError.response?.data.message ?? "Something went wrong",
                priority: "high"
            })
        }
    }

    const handleMesageClick = (message: string) => {
        form.setValue("content", message)
    }

    return (
        <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
            <h1 className='text-4xl font-bold mb-6 text-center'>
                Public Profile Link
            </h1>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FieldGroup>
                    <Controller
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <Field>
                                <FieldLabel>
                                    Send anonymous message to @{username}
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="content"
                                    placeholder="Write your anonymous message here"
                                    autoComplete="off"
                                />
                            </Field>
                        )}
                    />

                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </FieldGroup>
            </form>

            <div className="space-y-4 my-8">
                <div className="space-y-2">
                    <Button
                        className="my-4"
                        onClick={fetchSuggestMessages}
                        disabled={isSuggestLoading}
                    >
                        Suggest Messages
                    </Button>

                    <p>Click on any message to select it.</p>
                </div>

                <Card>
                    <CardHeader className="text-xl font-semibold">
                        Messages
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        {isSuggestLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p className="text-center">Please Wait</p>
                            </>
                        ) : error ? (
                            <p className="text-red-500">
                                {error.message}
                            </p>
                        ) : (
                            parseStringMessages(completion).map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className='border-0 mb-2'
                                    onClick={() => handleMesageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            <Separator className="my-6" />

            <div className="text-center">
                <h1 className="mb-4">
                    Get Your Message Board
                </h1>
                <Link href={'/sign-up'}>
                    <Button>Create your account</Button>
                </Link>
            </div>
        </div>
    )
}

export default MessagePage