import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export async function DELETE(
    request: Request,
    {params}: {params: Promise<{messageid: string}>}
) {
    await dbConnect()

    try {
        const {messageid: messageId} = await params;

        const session = await getServerSession(authOptions)
        const user: User = session?.user as User

        if (!session || !user?._id) {
            return Response.json({
                success: false,
                message: "User not authenticated"
            }, { status: 401 })
        }

        const updatedMessages = await UserModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull: {
                    messages: {
                        _id: messageId
                    }
                }
            }
        )

        if (updatedMessages.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            message: "Message deleted"
        }, { status: 200 })

    } catch (error) {
        console.error("Error deleting messages:", error);
        return Response.json({
            success: false,
            message: "Error deleting messages"
        }, { status: 500 })
    }
}