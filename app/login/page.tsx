"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (res?.error) {
        setError("INVALID CREDENTIALS")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("SYSTEM ERROR")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md border-4 border-foreground p-8 bg-background relative shadow-[8px_8px_0_0_#DFE104]">
        
        <div className="absolute top-0 right-0 bg-accent text-background px-3 py-1 font-mono text-sm border-l-4 border-b-4 border-foreground uppercase font-bold">
          SYS.AUTH
        </div>
        
        <h1 className="text-4xl font-black uppercase mb-2 tracking-tight">Access Node</h1>
        <p className="text-muted-foreground uppercase text-sm mb-8 font-mono">Authenticate to proceed</p>

        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-destructive font-mono text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="uppercase font-bold tracking-wider">Email Address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="operator@gov.in"
              className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="uppercase font-bold tracking-wider">Passcode</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground text-lg py-6 uppercase font-bold tracking-widest transition-colors shadow-[4px_4px_0_0_#DFE104] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {loading ? "AUTHENTICATING..." : "INITIALIZE LOGIN"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-foreground text-center">
          <p className="text-muted-foreground font-mono text-xs uppercase">
            No active session? <a href="/signup" className="text-foreground hover:bg-accent hover:text-background px-1 transition-colors underline underline-offset-4 font-bold">Request Access</a>
          </p>
        </div>
      </div>
      
      {/* Demo helper */}
      <div className="mt-8 p-4 border-2 border-dashed border-muted-foreground max-w-md w-full">
        <p className="font-mono text-sm font-bold mb-4 uppercase text-center text-muted-foreground">Demo Accounts</p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              try {
                const res = await signIn("credentials", { email: "head@ministryofurbandev.gov.in", password: "password123", redirect: false })
                if (res?.error) setError("INVALID CREDENTIALS")
                else { router.push("/dashboard"); router.refresh() }
              } finally { setLoading(false) }
            }}
            className="w-full rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors py-3 px-4 text-left disabled:opacity-50"
          >
            <span className="block font-mono font-black text-xs uppercase tracking-widest">🏛️ Government Dept</span>
            <span className="block font-mono text-[10px] opacity-60 mt-0.5">head@ministryofurbandev.gov.in</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              try {
                const res = await signIn("credentials", { email: "deepinder@zomato.com", password: "password123", redirect: false })
                if (res?.error) setError("INVALID CREDENTIALS")
                else { router.push("/dashboard"); router.refresh() }
              } finally { setLoading(false) }
            }}
            className="w-full rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors py-3 px-4 text-left disabled:opacity-50"
          >
            <span className="block font-mono font-black text-xs uppercase tracking-widest">🚀 Startup Founder</span>
            <span className="block font-mono text-[10px] opacity-60 mt-0.5">deepinder@zomato.com</span>
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              setLoading(true)
              try {
                const res = await signIn("credentials", { email: "evaluator@gov.in", password: "password123", redirect: false })
                if (res?.error) setError("INVALID CREDENTIALS")
                else { router.push("/dashboard"); router.refresh() }
              } finally { setLoading(false) }
            }}
            className="w-full rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background transition-colors py-3 px-4 text-left disabled:opacity-50"
          >
            <span className="block font-mono font-black text-xs uppercase tracking-widest">👨‍⚖️ Evaluator</span>
            <span className="block font-mono text-[10px] opacity-60 mt-0.5">evaluator@gov.in</span>
          </button>
        </div>
      </div>
    </div>
  )
}
