"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Scale, FileText } from "lucide-react"

export function RTIPortal() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError("")
    setResponse("")

    try {
      const res = await fetch("/api/transparency/rti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })

      if (!res.ok) throw new Error("Failed to submit RTI query")
      
      const data = await res.json()
      setResponse(data.response)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-16 border-4 border-foreground p-6 md:p-10 bg-muted/20 shadow-[8px_8px_0_0_#000]">
      <div className="flex items-center gap-3 mb-4">
        <Scale className="w-8 h-8" />
        <h2 className="text-3xl font-black uppercase">Right to Information (RTI) Portal</h2>
      </div>
      <p className="font-mono text-sm opacity-80 mb-8 max-w-3xl">
        As mandated by the RTI Act, 2005, citizens can query the Central Public Information Officer (CPIO) regarding any active pilot, deployment, or government-startup procurement contract on the Sankalp platform.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="E.g., Why was Ola selected for the EV Grid project and what is their MII status?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[120px] border-2 border-foreground bg-background rounded-none font-mono text-base focus-visible:ring-accent focus-visible:ring-2"
        />
        <Button 
          type="submit" 
          disabled={loading || !query.trim()}
          className="w-full md:w-auto rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-black tracking-widest uppercase h-12 px-8"
        >
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileText className="w-5 h-5 mr-2" />}
          {loading ? "Processing RTI Request..." : "File RTI Request"}
        </Button>
      </form>

      {error && (
        <div className="mt-6 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm font-bold p-4">
          ERROR: {error}
        </div>
      )}

      {response && (
        <div className="mt-8 border-t-4 border-foreground pt-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="border-l-4 border-accent pl-6 py-2">
            <h3 className="font-black uppercase text-xl mb-4 text-accent">Official CPIO Response</h3>
            <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
