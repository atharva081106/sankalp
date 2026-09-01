import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, Send, CheckCircle2, FileText } from "lucide-react"

export default async function StartupDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "STARTUP") {
    redirect("/login")
  }

  const startupId = (session.user as any).startupId
  if (!startupId) {
    return <div>INVALID NODE STATE</div>
  }

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: {
      proposals: {
        include: {
          requirement: {
            include: { department: true }
          },
          pilot: true
        },
        orderBy: { requirement: { createdAt: "desc" } }
      }
    }
  })

  if (!startup) {
    return <div>STARTUP NOT FOUND</div>
  }

  const activeProposals = startup.proposals.filter(p => p.status !== "REJECTED" && p.status !== "PILOTING" && p.status !== "SCALED").length
  const activePilots = startup.proposals.filter(p => p.status === "PILOTING").length
  const scaledSolutions = startup.proposals.filter(p => p.status === "SCALED").length

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-foreground pb-6 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
              NODE: TECH
            </span>
            <span className="font-mono text-sm opacity-60">AUTH: VERIFIED</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            {startup.name}
          </h1>
          <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
            {startup.sector} | DPIIT: {startup.dpiitNumber || "N/A"}
          </p>
        </div>
        <Button 
          render={<Link href="/requirements" />} 
          className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase py-6 px-8 text-lg flex gap-2 items-center shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <Rocket className="w-5 h-5" />
          Find Opportunities
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <Send className="w-4 h-4" /> Active Proposals
          </h3>
          <p className="text-6xl font-black">{activeProposals}</p>
        </div>
        <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-80 mb-2 flex gap-2 items-center">
            <Rocket className="w-4 h-4" /> Live Pilots
          </h3>
          <p className="text-6xl font-black">{activePilots}</p>
        </div>
        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <CheckCircle2 className="w-4 h-4" /> Scaled Procurements
          </h3>
          <p className="text-6xl font-black text-accent">{scaledSolutions}</p>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-12 border-4 border-foreground p-6 bg-accent/20 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[6px_6px_0_0_#DFE104]">
        <div>
          <h3 className="text-2xl font-black uppercase mb-1">Standard Templates</h3>
          <p className="font-mono text-sm opacity-80">Download the official Sankalp format for structuring startup pitches and readiness scores.</p>
        </div>
        <a 
          href="/templates/proposal_template.md" 
          download
          className="rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase py-4 px-6 text-sm flex gap-2 items-center shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <FileText className="w-4 h-4" /> Download Proposal Template (MD)
        </a>
      </div>

      {/* Pipeline List */}
      <div>
        <h2 className="text-3xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Operations Log</h2>
        
        {startup.proposals.length === 0 ? (
          <div className="border-4 border-dashed border-muted-foreground p-12 text-center">
            <p className="font-mono uppercase text-muted-foreground font-bold tracking-widest">NO ACTIVE PROPOSALS OR PILOTS</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {startup.proposals.map(proposal => {
              let domain = "General"
              try {
                domain = JSON.parse(proposal.requirement.structured)?.domain || domain
              } catch (e) {}

              let readinessScore: any = {}
              try { readinessScore = JSON.parse(proposal.readinessScore) } catch (e) {}

              return (
                <div key={proposal.id} className="border-4 border-foreground p-6 bg-background flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[4px_4px_0_0_#000] hover:bg-muted/10 transition-colors">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-mono px-2 py-0.5 text-xs font-bold uppercase border-2 border-foreground ${proposal.status === 'PILOTING' ? 'bg-accent text-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {proposal.status}
                      </span>
                      <span className="font-mono text-sm opacity-60">REQ: {proposal.requirementId.slice(0, 8)}...</span>
                    </div>
                    
                    <h3 className="text-2xl font-black uppercase mb-2 line-clamp-1">{domain} Requirement</h3>
                    <p className="font-mono text-sm opacity-80 line-clamp-1 max-w-2xl">{proposal.requirement.department.name} | {proposal.requirement.department.jurisdiction}</p>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="text-right border-r-2 border-foreground pr-4">
                      <p className="font-mono text-xs uppercase opacity-60 font-bold">Fit Score</p>
                      <p className="text-2xl font-black">{readinessScore.overall || "--"}</p>
                    </div>
                    
                    {proposal.status === "PILOTING" ? (
                      <Button 
                        render={<Link href={`/startup/pilots/${proposal.pilot?.id}`} />}
                        className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase"
                      >
                        Manage Pilot
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase"
                      >
                        View Status
                      </Button>
                    )}
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
