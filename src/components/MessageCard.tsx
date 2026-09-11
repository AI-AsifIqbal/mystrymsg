'use client'
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "./ui/toast"
import dayjs from 'dayjs';

type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const handleDeleteConfirm = async () => {
        try {
            const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast.add({
                type: 'success',
                title: res.data.message
            })
            onMessageDelete(String(message._id))
        } catch (error) {
            console.error("Error in deleting message", error);
            const axiosError = error as AxiosError<ApiResponse>

            toast.add({
                type: "error",
                description: axiosError.response?.data.message ?? "Failed to delete message",
                priority: "high"
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {message.content}
                </CardTitle>
                <CardDescription>
                    {dayjs(message.createdAt).format('D MMM YYYY, h:mm A')}
                </CardDescription>
                <CardAction>
                    <AlertDialog>
                        <AlertDialogTrigger render={
                            <Button variant="destructive">
                                <X className="w-5 h-5" />
                            </Button>
                        } />

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardAction>
            </CardHeader>
        </Card>
    )
}

export default MessageCard