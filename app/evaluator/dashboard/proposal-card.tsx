"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react"

export function ProposalCard({ proposal }: { proposal: any }) {
  const [evalData, setEvalData] = useState<any>(proposal.aiEvaluation ? JSON.parse(proposal.aiEvaluation) : null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleScore = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/evaluator/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: proposal.id })
      })
      if (!res.ok) throw new Error("Failed to score")
      const data = await res.json()
      setEvalData(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  let readinessScore: any = proposal.readinessScore
  try { readinessScore = JSON.parse(proposal.readinessScore) } catch (e) {}

  return (
    <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#DFE104]">
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="border-foreground bg-accent text-foreground font-mono font-bold rounded-none uppercase">
              {proposal.requirement.department.name}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black uppercase">{proposal.startup.name}</h3>
            {proposal.startup.makeInIndia && (
              <Badge className="bg-green-600 text-white font-mono font-bold rounded-none uppercase text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1" /> Make in India
              </Badge>
            )}
          </div>
          <p className="font-mono text-sm opacity-80 mt-1 max-w-2xl line-clamp-2">
            {proposal.pitch}
          </p>
        </div>
        
        <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto">
          {!evalData ? (
            <Button 
              onClick={handleScore} 
              disabled={loading}
              className="w-full md:w-auto border-2 border-foreground bg-background text-foreground hover:bg-accent px-6 py-6 font-bold uppercase tracking-widest transition-colors shadow-[2px_2px_0_0_#000] rounded-none flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4 text-accent mix-blend-difference" />}
              {loading ? "Analyzing..." : "Auto-Evaluate"}
            </Button>
          ) : (
            <div className="bg-foreground text-background font-mono px-4 py-2 font-bold text-lg flex items-center gap-3">
              AI SCORE: {evalData.feasibilityScore}/10
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 border-2 border-destructive bg-destructive/10 text-destructive font-mono text-sm font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {evalData && (
        <div className="mt-6 border-t-4 border-foreground pt-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black uppercase text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> AI Evaluation Report
            </h4>
            <Badge variant="outline" className={`rounded-none border-2 border-foreground font-mono font-bold px-3 py-1 ${evalData.riskLevel === 'HIGH' ? 'bg-destructive text-destructive-foreground' : evalData.riskLevel === 'MEDIUM' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
              RISK: {evalData.riskLevel}
            </Badge>
          </div>
          
          <p className="font-mono text-base border-l-4 border-accent pl-4 mb-6 leading-relaxed bg-accent/10 p-4">
            {evalData.recommendation}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-foreground p-4 bg-muted/20">
              <h5 className="font-bold uppercase mb-2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Strengths
              </h5>
              <ul className="list-disc pl-5 font-mono text-sm space-y-1 opacity-90">
                {evalData.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="border-2 border-foreground p-4 bg-muted/20">
              <h5 className="font-bold uppercase mb-2 flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" /> Weaknesses
              </h5>
              <ul className="list-disc pl-5 font-mono text-sm space-y-1 opacity-90">
                {evalData.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {!evalData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t-2 border-dashed border-foreground/30">
          <div>
            <h4 className="font-mono text-xs font-bold uppercase opacity-60 mb-1">Target Requirement</h4>
            <p className="font-mono text-sm line-clamp-2">{proposal.requirement.rawProblem}</p>
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase opacity-60 mb-1">Self-Reported Readiness</h4>
            <p className="font-mono text-sm">
              TRL: {readinessScore?.trl || "--"} - {readinessScore?.reasoning || "--"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
