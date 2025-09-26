"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export type UserRole = "CUSTOMER" | "VENDOR" | "SHIPPING_PARTNER"

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
    const router = useRouter()

    // Role-based redirect
    const redirectToDashboard = (role: UserRole) => {
        switch (role) {
            case "CUSTOMER":
                router.push("/dashboard/customer")
                break
            case "VENDOR":
                router.push("/dashboard/vendor")
                break
            case "SHIPPING_PARTNER":
                router.push("/dashboard/shipping")
                break
        }
    }

    // Login
    const login = async (formData: { email: string; password: string }) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error("Invalid credentials")
            const data = await res.json()
            redirectToDashboard(data.user.role)
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
            const data = await res.json()
            redirectToDashboard(data.user.role)
            return true
        } catch (err: any) {
            setError(err.message || "Registration failed")
            return false
        }
    }

    return { login, register, error }
}
