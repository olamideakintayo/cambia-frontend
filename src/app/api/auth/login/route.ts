import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
    const body = await req.json()
    const { email, password } = body

    // 🔹 Replace this with your real auth service
    if (email === "test@email.com" && password === "password123") {
        const token = "fake-jwt-token"

        // ✅ Set HttpOnly cookie
        cookies().set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        })

        return NextResponse.json({ user: { email }, token })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
