"use client"

import { useState } from "react"

export type UserRole = "SENDER" | "VENDOR" | "SHIPPING_PARTNER"

export type RegisterRequest = {
    email: string
    firstName: string
    lastName: string
    password: string
    walletAddress: string
    phone?: string
    address?: string
    role: UserRole
}

export function useAuth() {
    const [error, setError] = useState<string | null>(null)

    // Login
    const login = async (formData: { email: string; password: string; remember: boolean }) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Invalid credentials")
            await res.json()
            return true
        } catch (err: any) {
            setError(err.message || "Login failed")
            return false
        }
    }

    // Register
    const register = async (formData: RegisterRequest) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Registration failed")
            await res.json()
            return true
        } catch (err: any) {
            setError(err.message || "Registration failed")
            return false
        }
    }

    return { login, register, error }
}
