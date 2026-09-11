import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import UserModel from "@/model/User"
import mongoose from "mongoose"

export async function GET(request: Request) {
    await dbConnect()

    try {
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User
    
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 })
        }

        const users = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(user._id)
                }
            },
            {
                $unwind: {
                    path: '$messages',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
                    }
                }
            }
        ])

        if (!users || users.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        const rawMessages = users[0]?.messages || []
        const messages = rawMessages.filter((m: any) => m && m._id && m.content)

        return Response.json({
            success: true,
            messages
        }, { status: 200 })

    } catch (error) {
        console.error("Error getting messages:", error);
        return Response.json({
            success: false,
            message: "Error getting messages"
        }, { status: 500 })
    }
}