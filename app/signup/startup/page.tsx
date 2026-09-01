"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { registerStartup } from "../actions"
import { Textarea } from "@/components/ui/textarea"

export default function StartupSignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    try {
      const res = await registerStartup(formData)
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
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-4 py-4 min-h-[90vh]">
      <div className="w-full max-w-xl border-4 border-foreground p-5 md:p-6 bg-background relative shadow-[6px_6px_0_0_#DFE104]">
        
        <div className="absolute top-0 right-0 bg-accent text-background px-3 py-1 font-mono text-sm border-l-4 border-b-4 border-foreground uppercase font-bold flex gap-2 items-center">
          SYS.REG // TECH
          <button 
            type="button" 
            onClick={() => {
              (document.getElementById('email') as HTMLInputElement).value = 'founder@demo.com';
              (document.getElementById('password') as HTMLInputElement).value = 'password';
              (document.getElementById('name') as HTMLInputElement).value = 'Demo Technologies';
              (document.getElementById('sector') as HTMLInputElement).value = 'AI / Smart Cities';
              (document.getElementById('foundedYear') as HTMLInputElement).value = '2023';
              (document.getElementById('dpiitNumber') as HTMLInputElement).value = 'DPIIT999999';
              (document.getElementById('pricingModel') as HTMLInputElement).value = 'B2B SaaS';
              (document.getElementById('description') as HTMLTextAreaElement).value = 'We build next-generation smart city infrastructure using edge AI.';
            }}
            className="text-[10px] bg-background text-foreground px-2 py-0.5 hover:bg-foreground hover:text-background transition-colors border border-foreground ml-2"
          >
            PRE-FILL DEMO
          </button>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black uppercase mb-1 tracking-tight">Tech Node Init</h1>
        <p className="text-muted-foreground uppercase text-[10px] md:text-xs mb-4 font-mono">Establish startup credentials</p>

        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <p className="text-destructive font-mono text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="uppercase font-bold tracking-wider text-[10px]">Founder Email</Label>
              <Input id="email" name="email" type="email" required placeholder="founder@startup.com" className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="uppercase font-bold tracking-wider text-[10px]">Passcode</Label>
              <Input id="password" name="password" type="password" required className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="name" className="uppercase font-bold tracking-wider text-[10px]">Startup Name</Label>
            <Input id="name" name="name" type="text" required placeholder="Acme Technologies" className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="sector" className="uppercase font-bold tracking-wider text-[10px]">Sector</Label>
              <Input id="sector" name="sector" type="text" required placeholder="E.g., Smart City" className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="foundedYear" className="uppercase font-bold tracking-wider text-[10px]">Founded Year</Label>
              <Input id="foundedYear" name="foundedYear" type="number" required placeholder="2022" min="1900" max="2099" className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="dpiitNumber" className="uppercase font-bold tracking-wider text-[10px]">DPIIT Number (Optional)</Label>
              <Input id="dpiitNumber" name="dpiitNumber" type="text" placeholder="DPIIT12345" className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="pricingModel" className="uppercase font-bold tracking-wider text-[10px]">Pricing Model</Label>
              <Input id="pricingModel" name="pricingModel" type="text" required placeholder="SaaS / Per-node / One-time" className="rounded-none border-2 border-foreground bg-background p-2.5 h-auto font-mono text-sm md:text-base focus-visible:ring-accent focus-visible:ring-offset-2" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="uppercase font-bold tracking-wider text-[10px]">Short Description</Label>
            <Textarea id="description" name="description" required placeholder="What problem do you solve?" className="rounded-none border-2 border-foreground bg-background p-2.5 font-mono text-sm focus-visible:ring-accent focus-visible:ring-offset-2 min-h-[50px] md:min-h-[60px]" />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground text-sm md:text-base py-3 h-auto uppercase font-bold tracking-widest transition-colors shadow-[4px_4px_0_0_#DFE104] active:translate-x-1 active:translate-y-1 active:shadow-none mt-1"
          >
            {loading ? "INITIALIZING..." : "SUBMIT REGISTRATION"}
          </Button>
        </form>
      </div>
    </div>
  )
}
