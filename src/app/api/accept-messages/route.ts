import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 })
    }

    const userId = user._id
    const { acceptMessage } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found while updating status to accept messages"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Accept messages status updated successfully",
            updatedUser
        }, { status: 200 })

    } catch (error) {
        console.error("Error updating status to accept messages", error);
        return Response.json({
            success: false,
            message: "Error updating status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "User not authenticated"
        }, { status: 401 })
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, { status: 200 })

    } catch (error) {
        console.error("Error getting status to accept messages", error);
        return Response.json({
            success: false,
            message: "Error getting status to accept messages"
        }, { status: 500 })
    }
}