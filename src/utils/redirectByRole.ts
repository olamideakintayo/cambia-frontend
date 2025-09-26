// utils/redirectByRole.ts
import { useRouter } from "next/navigation"
import type { UserRole } from "@/hooks/use-auth"

export const redirectByRole = (role: UserRole, router: ReturnType<typeof useRouter>) => {
    switch (role) {
        case "SENDER":
            router.push("/dashboard/sender")
            break
        case "VENDOR":
            router.push("/dashboard/vendor")
            break
        case "SHIPPING_PARTNER":
            router.push("/dashboard/shipping")
            break
        default:
            router.push("/dashboard")
    }
}
