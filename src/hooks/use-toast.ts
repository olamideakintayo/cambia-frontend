
import { useCallback } from "react"

type ToastOptions = {
    title: string
    description?: string
    variant?: "success" | "error" | "info" | "destructive"
}

export function useToast() {
    const toast = useCallback(({ title, description, variant }: ToastOptions) => {

        alert(`[${variant || "info"}] ${title}\n${description || ""}`)
    }, [])

    return { toast }
}
