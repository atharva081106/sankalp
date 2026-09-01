"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { registerDepartment } from "../actions"

export default function DepartmentSignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    try {
      const res = await registerDepartment(formData)
      if (res.error) {
        setError(res.error)
      } else {
        router.push("/login?registered=true")
      }
    } catch (err) {
      setError("SYSTEM ERROR")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-xl border-4 border-foreground p-8 bg-background relative shadow-[8px_8px_0_0_#DFE104]">
        
        <div className="absolute top-0 right-0 bg-accent text-background px-3 py-1 font-mono text-sm border-l-4 border-b-4 border-foreground uppercase font-bold flex gap-2 items-center">
          SYS.REG // GOV
          <button 
            type="button" 
            onClick={() => {
              (document.getElementById('email') as HTMLInputElement).value = 'admin@demo.gov.in';
              (document.getElementById('password') as HTMLInputElement).value = 'password';
              (document.getElementById('name') as HTMLInputElement).value = 'Department of Innovation';
              (document.getElementById('ministry') as HTMLInputElement).value = 'Ministry of Technology';
              (document.getElementById('jurisdiction') as HTMLInputElement).value = 'National';
            }}
            className="text-[10px] bg-background text-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors border border-foreground ml-2"
          >
            PRE-FILL DEMO
          </button>
        </div>
        
        <h1 className="text-4xl font-black uppercase mb-2 tracking-tight">Gov Node Init</h1>
        <p className="text-muted-foreground uppercase text-sm mb-8 font-mono">Establish department credentials</p>

        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-destructive font-mono text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="uppercase font-bold tracking-wider">Official Email</Label>
              <Input id="email" name="email" type="email" required placeholder="user@gov.in" className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="uppercase font-bold tracking-wider">Passcode</Label>
              <Input id="password" name="password" type="password" required className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="uppercase font-bold tracking-wider">Department Name</Label>
            <Input id="name" name="name" type="text" required placeholder="E.g., Traffic Police" className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ministry" className="uppercase font-bold tracking-wider">Parent Ministry</Label>
            <Input id="ministry" name="ministry" type="text" required placeholder="E.g., Ministry of Transport" className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jurisdiction" className="uppercase font-bold tracking-wider">Jurisdiction</Label>
            <Input id="jurisdiction" name="jurisdiction" type="text" required placeholder="E.g., New Delhi" className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground text-lg py-6 uppercase font-bold tracking-widest transition-colors shadow-[4px_4px_0_0_#DFE104] active:translate-x-1 active:translate-y-1 active:shadow-none mt-4"
          >
            {loading ? "INITIALIZING..." : "SUBMIT REGISTRATION"}
          </Button>
        </form>
      </div>
    </div>
  )
}
