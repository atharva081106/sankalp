import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RequirementDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const req = await prisma.requirement.findUnique({
    where: { id: params.id },
    include: {
      department: true,
      _count: { select: { proposals: true } }
    }
  })

  if (!req) {
    notFound()
  }

  let structuredData: any = {}
  try {
    structuredData = JSON.parse(req.structured)
  } catch (e) {
    // pass
  }

  let eligibilityData: any = {}
  try {
    eligibilityData = JSON.parse(req.eligibility)
  } catch (e) {
    // pass
  }

  let evaluationData: Record<string, string> = {}
  try {
    evaluationData = JSON.parse(req.evaluationCriteria)
  } catch (e) {
    // pass
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header Banner */}
      <div className="bg-foreground text-background py-16 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
              {req.status}
            </span>
            <span className="font-mono text-sm opacity-60">ID: {req.id}</span>
            <span className="font-mono text-sm opacity-60">|</span>
            <span className="font-mono text-sm opacity-60">POSTED: {req.createdAt.toLocaleDateString()}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">
            {structuredData?.domain || "General"} <span className="text-accent">Requirement</span>
          </h1>

          <div className="flex flex-wrap gap-8 font-mono text-sm uppercase">
            <div>
              <p className="opacity-60 mb-1">Department</p>
              <p className="font-bold text-xl tracking-tight">{req.department.name}</p>
            </div>
            <div>
              <p className="opacity-60 mb-1">Location</p>
              <p className="font-bold text-xl tracking-tight">{req.location}</p>
            </div>
            <div>
              <p className="opacity-60 mb-1">Budget Band</p>
              <p className="font-bold text-xl tracking-tight text-accent">{req.budgetBand}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-8 grid md:grid-cols-3 gap-12 mt-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-12">
          
          {/* Problem Statement */}
          <section>
            <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Problem Specification</h2>
            <div className="font-mono text-base md:text-lg leading-relaxed bg-muted/30 p-6 md:p-8 border-l-4 border-foreground whitespace-pre-wrap shadow-[4px_4px_0_0_#000]">
              {req.rawProblem}
            </div>
          </section>

          {/* Structured Intelligence */}
          <section>
            <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 mb-6 flex items-center justify-between">
              Extracted Parameters
              <span className="text-xs font-mono bg-accent text-foreground px-2 py-1">SYS.AI_EXTRACT</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border-2 border-foreground p-4">
                <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2">Required Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {structuredData?.capabilities?.map((cap: string) => (
                    <span key={cap} className="bg-foreground text-background font-mono text-xs px-2 py-1 uppercase">{cap}</span>
                  )) || "N/A"}
                </div>
              </div>
              
              <div className="border-2 border-foreground p-4">
                <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2">Scale</h3>
                <p className="font-bold text-lg">{structuredData?.scale || "N/A"}</p>
              </div>

              <div className="border-2 border-foreground p-4">
                <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2">Deployment Preference</h3>
                <p className="font-bold text-lg">{structuredData?.deployment || "N/A"}</p>
              </div>

              <div className="border-2 border-foreground p-4">
                <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2">Hard Constraints</h3>
                <p className="font-bold text-lg text-destructive">{structuredData?.constraints || "None specified"}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          <div className="border-4 border-foreground p-6 bg-background shadow-[8px_8px_0_0_#DFE104]">
            <h2 className="text-xl font-black uppercase border-b-2 border-foreground pb-2 mb-4">Application Status</h2>
            
            <div className="flex justify-between items-center mb-6 font-mono border-b border-foreground/20 pb-4">
              <span className="uppercase text-sm font-bold opacity-80">Proposals Received</span>
              <span className="text-2xl font-black">{req._count.proposals}</span>
            </div>

            <Button 
              render={<Link href={`/startup/proposals/new?requirementId=${req.id}`} />} 
              className="w-full rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase py-6 text-lg transition-colors"
            >
              Draft Proposal
            </Button>
          </div>

          <div className="border-2 border-foreground p-6">
            <h2 className="text-xl font-black uppercase border-b-2 border-foreground pb-2 mb-4">Eligibility</h2>
            <ul className="space-y-4 font-mono text-sm">
              <li className="flex justify-between border-b border-dashed border-foreground/30 pb-2">
                <span className="opacity-80">Min TRL</span>
                <span className="font-bold">{eligibilityData?.minTRL || "N/A"}</span>
              </li>
              <li className="flex justify-between border-b border-dashed border-foreground/30 pb-2">
                <span className="opacity-80">Made in India</span>
                <span className="font-bold">{eligibilityData?.madeInIndia ? "YES" : "NO"}</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-foreground p-6">
            <h2 className="text-xl font-black uppercase border-b-2 border-foreground pb-2 mb-4">Evaluation Weights</h2>
            <div className="space-y-4">
              {Object.entries(evaluationData).map(([key, value], i) => (
                <div key={i} className="border-b border-dashed border-foreground/30 pb-2 mb-2">
                  <div className="flex justify-between font-mono text-sm uppercase mb-1">
                    <span className="font-bold opacity-80">{key}</span>
                    <span className="font-black text-accent">{value}</span>
                  </div>
                </div>
              ))}
              {Object.keys(evaluationData).length === 0 && <p className="font-mono text-sm opacity-60">Not specified</p>}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
