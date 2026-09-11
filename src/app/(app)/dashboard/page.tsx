'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const DashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [profileUrl, setProfileUrl] = useState('')

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => String(message._id) !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            acceptMessage: true
        }
    })

    const { register, watch, setValue } = form
    const acceptMessage = watch('acceptMessage')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const res = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessage', res.data.isAcceptingMessage ?? false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                type: "error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                priority: "high"
            })
        } finally {
            setIsSwitchLoading(false)
        }
    }, [])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true)

        try {
            const res = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(res.data.messages || [])
            if (refresh) {
                toast.add({
                    type: 'success',
                    title: "Refreshed messages",
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                type: "error",
                description: axiosError.response?.data.message || "Failed to fetch messages",
                priority: "high"
            })
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    useEffect(() => {
        if (typeof window !== 'undefined' && session?.user) {
            const baseUrl = `${window.location.protocol}//${window.location.host}`
            const username = (session.user as User).username
            setProfileUrl(`${baseUrl}/u/${username}`)
        }
    }, [session])

    const handleSwitchChange = async () => {
        try {
            const res = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessage: !acceptMessage })
            setValue('acceptMessage', !acceptMessage)
            toast.add({
                type: 'success',
                title: res.data.message
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.add({
                type: "error",
                description: axiosError.response?.data.message || "Failed to fetch message settings",
                priority: "high"
            })
        }
    }

    if (!session || !session.user) {
        return <div>Please Login</div>
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.add({
            type: 'success',
            title: 'URL copied',
            description: 'Profile URL has been copied to clipboard'
        })
    }

    return (
        <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
            <h1 className='text-4xl font-bold mb-4'>
                User Dashboard
            </h1>

            <div className='mb-4'>
                <h2 className='text-lg font-semibold mb-2'>
                    Copy Your Unique Link
                </h2>{' '}
                <div className='flex items-center'>
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className='input input-bordered w-full p-2 mr-2'
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className='mb-4'>
                <Switch
                    {...register('acceptMessage')}
                    checked={acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className='ml-2'>
                    Accept Messages: {acceptMessage ? 'On' : 'Off'}
                </span>
            </div>

            <Separator />

            <Button
                className='mt-4'
                variant='outline'
                onClick={(e) => {
                    e.preventDefault()
                    fetchMessages(true)
                }}
            >
                {isLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                    <RefreshCcw className='h-4 w-4' />
                )}
            </Button>

            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={String(message._id)}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

export default DashboardPage