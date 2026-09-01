"use client"

import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitProposal } from "../actions"
import { Send, Loader2 } from "lucide-react"

function ProposalForm() {
  const searchParams = useSearchParams()
  const requirementId = searchParams.get("requirementId")
  const [loading, setLoading] = useState(false)

  if (!requirementId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-8">
        <div className="border-4 border-dashed border-foreground p-12 text-center max-w-xl">
          <p className="font-mono uppercase font-bold tracking-widest text-destructive">INVALID STATE: MISSING TARGET REQUIREMENT</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    // Form submission handles action naturally via onSubmit or we can just manage loading state
    setLoading(true)
  }

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-4xl mx-auto w-full">
      
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
            TARGET: {requirementId.slice(0,8)}
          </span>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">
          Submit <span className="text-accent">Proposal</span>
        </h1>
        <p className="text-xl font-mono uppercase mt-2 opacity-80">
          The AI Copilot will evaluate your pitch against the department's requirements.
        </p>
      </div>

      <form action={submitProposal} onSubmit={handleSubmit} className="space-y-8">
        <input type="hidden" name="requirementId" value={requirementId} />
        
        <div>
          <Label className="text-2xl font-black uppercase mb-4 block border-l-4 border-foreground pl-4">Your Solution Pitch</Label>
          <p className="font-mono opacity-80 mb-6">
            Describe your capability. Focus on how it directly solves the raw problem and meets the required scale and constraints.
          </p>
          <Textarea 
            name="pitch"
            required
            placeholder="Our Edge Compute platform solves this by..."
            className="min-h-[300px] rounded-none border-4 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2 shadow-[8px_8px_0_0_#DFE104]"
          />
        </div>

        <Button 
          type="submit"
          disabled={loading}
          className="w-full rounded-none border-4 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase py-8 text-xl flex gap-3 items-center shadow-[6px_6px_0_0_#DFE104] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-8"
        >
          {loading ? (
            <><Loader2 className="w-6 h-6 animate-spin" /> ANALYZING FIT...</>
          ) : (
            <><Send className="w-6 h-6" /> SUBMIT FOR EVALUATION</>
          )}
        </Button>
      </form>
    </div>
  )
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="p-8 font-mono uppercase">Loading form...</div>}>
      <ProposalForm />
    </Suspense>
  )
}
