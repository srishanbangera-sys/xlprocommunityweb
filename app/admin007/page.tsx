"use client"

import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { loginAdmin } from "./actions"
import { SiteHeader } from "@/components/site-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  )
}

export default function AdminLoginPage() {
  const { toast } = useToast()
  const [state, formAction] = useActionState(loginAdmin, null)

  useEffect(() => {
    if (state && (state as any).error) {
      toast({ title: "Access denied", description: "Invalid credentials", variant: "destructive" })
    }
  }, [state, toast])

  const hasError = Boolean(state && (state as any).error)

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto grid max-w-md px-4 py-16">
        <div
          className={cn(
            "rounded-xl border border-border/60 bg-secondary/20 p-6 backdrop-blur transition",
            hasError && "animate-shake",
          )}
        >
          <h1 className="text-xl font-semibold">Admin Access</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter the secret credentials.</p>
          <form action={formAction} className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="admin" autoComplete="username" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>
            <SubmitButton />
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Protected route: /admin007. Credentials are validated on the server.
          </p>
        </div>
      </section>
    </main>
  )
}
