import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    const body = await req.json()
    const { firstName, lastName, email, password } = body

    // 🔹 Replace with DB call
    const token = "new-user-fake-jwt"

    cookies().set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
    })

    return NextResponse.json({ user: { firstName, lastName, email }, token })
}
