import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const existingUserByEmail = await UserModel.findOne({ email })

        const hashedPassword = await bcrypt.hash(password, 10)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is already exists"
                }, { status: 400 })
            } else {
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = expiryDate
                await existingUserByEmail.save()
            }
        } else {
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 400 })
        }

        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.error("Error signup user", error);
        return Response.json({
            success: false,
            message: "Error signup user"
        }, { status: 500 })
    }
}
