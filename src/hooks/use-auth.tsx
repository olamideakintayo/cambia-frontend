// hooks/use-auth.ts
"use client"

import { useState, useEffect } from "react"

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

export type User = {
    email: string
    firstName: string
    lastName: string
    walletAddress: string
    phone?: string
    address?: string
    role: UserRole
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("user")
        if (stored) setUser(JSON.parse(stored))
    }, [])

    const login = async (formData: { email: string; password: string; remember: boolean }) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error("Invalid credentials")
            const data = await res.json()
            setUser(data.user)
            localStorage.setItem("user", JSON.stringify(data.user))
            return data.user
        } catch (err: any) {
            setError(err.message || "Login failed")
            return null
        }
    }

    const register = async (formData: RegisterRequest) => {
        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error("Registration failed")
            const data = await res.json()
            setUser(data.user)
            localStorage.setItem("user", JSON.stringify(data.user))
            return data.user
        } catch (err: any) {
            setError(err.message || "Registration failed")
            return null
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("user")
    }

    return { user, login, register, logout, error }
}
