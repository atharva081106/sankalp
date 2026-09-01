"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateStructuredRequirement, publishRequirement } from "../actions"
import { Loader2, BrainCircuit } from "lucide-react"

export default function NewRequirementWizard() {
  const [step, setStep] = useState(1)
  const [rawProblem, setRawProblem] = useState("")
  const [loading, setLoading] = useState(false)
  const [structuredData, setStructuredData] = useState<any>(null)
  
  const handleGenerate = async () => {
    if (!rawProblem.trim()) return
    setLoading(true)
    try {
      const data = await generateStructuredRequirement(rawProblem)
      setStructuredData(data)
      setStep(2)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-4xl mx-auto w-full">
      
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
            SYS.AI_WIZARD
          </span>
          <span className="font-mono text-sm opacity-60">STEP 0{step}/02</span>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">
          Requirement <span className="text-accent">Generator</span>
        </h1>
      </div>

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <Label className="text-2xl font-black uppercase mb-4 block">1. Define the Problem</Label>
            <p className="font-mono opacity-80 mb-6">
              Write the problem in plain English. Do not write a tender document. The Copilot will structure it.
            </p>
            <Textarea 
              value={rawProblem}
              onChange={(e) => setRawProblem(e.target.value)}
              placeholder="E.g., We need a way to monitor traffic violations at junctions without laying physical cables under the road."
              className="min-h-[200px] rounded-none border-4 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2"
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={loading || !rawProblem.trim()}
            className="w-full rounded-none border-4 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase py-8 text-xl flex gap-3 items-center shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
          >
            {loading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> ANALYZING...</>
            ) : (
              <><BrainCircuit className="w-6 h-6" /> GENERATE STRUCTURE</>
            )}
          </Button>
        </div>
      )}

      {step === 2 && structuredData && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="border-4 border-foreground p-6 bg-muted/20">
            <h2 className="text-xl font-black uppercase border-b-2 border-foreground pb-2 mb-6 flex items-center justify-between">
              Extracted Parameters
              <span className="text-xs font-mono bg-accent text-foreground px-2 py-1">SYS.AI_EXTRACT</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono">
              <div>
                <p className="opacity-60 text-xs font-bold uppercase mb-1">Domain</p>
                <p className="font-bold text-lg">{structuredData.domain}</p>
              </div>
              <div>
                <p className="opacity-60 text-xs font-bold uppercase mb-1">Capabilities</p>
                <p className="font-bold">{structuredData.capabilities.join(", ")}</p>
              </div>
              <div>
                <p className="opacity-60 text-xs font-bold uppercase mb-1">Scale</p>
                <p className="font-bold">{structuredData.scale}</p>
              </div>
              <div>
                <p className="opacity-60 text-xs font-bold uppercase mb-1">Constraints</p>
                <p className="font-bold text-destructive">{structuredData.constraints}</p>
              </div>
            </div>
          </div>

          <form action={publishRequirement} className="space-y-8 border-t-4 border-foreground pt-8">
            <input type="hidden" name="rawProblem" value={rawProblem} />
            <input type="hidden" name="structured" value={JSON.stringify(structuredData)} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="uppercase font-bold tracking-wider">Deployment Location</Label>
                <Input id="location" name="location" type="text" required placeholder="E.g., Mumbai, MH" className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetBand" className="uppercase font-bold tracking-wider">Budget Band</Label>
                <Input id="budgetBand" name="budgetBand" type="text" required placeholder="E.g., ₹10L - ₹50L" className="rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2" />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 rounded-none border-4 border-foreground bg-background text-foreground hover:bg-muted font-bold tracking-widest uppercase py-8 text-lg"
              >
                &larr; EDIT
              </Button>
              <Button 
                type="submit"
                className="w-2/3 rounded-none border-4 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase py-8 text-xl shadow-[6px_6px_0_0_#DFE104] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
              >
                PUBLISH REQUIREMENT
              </Button>
            </div>
          </form>

        </div>
      )}

    </div>
  )
}
