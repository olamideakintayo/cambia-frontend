import { LoginForm } from "@/components/login-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Join DiasporaFood</h1>
          <p className="text-muted-foreground mt-2">Create your account to start ordering authentic Nigerian food</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
