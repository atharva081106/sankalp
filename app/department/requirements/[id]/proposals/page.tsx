import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { advanceToPilot } from "../../proposal-actions"

export default async function ProposalsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    redirect("/login")
  }

  const departmentId = (session.user as any).departmentId

  const requirement = await prisma.requirement.findUnique({
    where: { id: params.id },
    include: {
      proposals: {
        include: {
          startup: true,
          pilot: true
        },
        orderBy: { opportunityScore: "desc" }
      }
    }
  })

  if (!requirement || requirement.departmentId !== departmentId) {
    notFound()
  }

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <Link href="/department/dashboard" className="font-mono text-sm uppercase font-bold hover:underline mb-4 block">
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
            REQ: {requirement.id.slice(0, 8)}
          </span>
          <span className="font-mono text-sm opacity-60 uppercase font-bold text-accent">{requirement.status}</span>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">
          Proposal <span className="text-accent">Matches</span>
        </h1>
        <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
          AI-scored submissions ranked by readiness and capability fit.
        </p>
      </div>

      <div className="grid gap-8">
        {requirement.proposals.length === 0 ? (
          <div className="border-4 border-dashed border-muted-foreground p-12 text-center">
            <p className="font-mono uppercase text-muted-foreground font-bold tracking-widest">NO PROPOSALS RECEIVED YET</p>
          </div>
        ) : (
          requirement.proposals.map(proposal => {
            let score: any = {}
            try { score = JSON.parse(proposal.readinessScore) } catch (e) {}

            let match: any = { met: [], gaps: [] }
            try { match = JSON.parse(proposal.matchExplanation) } catch (e) {}

            return (
              <div key={proposal.id} className="border-4 border-foreground p-6 bg-background flex flex-col md:flex-row gap-8 shadow-[6px_6px_0_0_#DFE104] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#DFE104]">
                
                {/* Score Column */}
                <div className="flex flex-col items-center justify-center border-b-4 md:border-b-0 md:border-r-4 border-foreground pb-6 md:pb-0 md:pr-8 md:w-48 shrink-0">
                  <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="none" className="opacity-20" />
                      <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="377" strokeDashoffset={377 - (377 * (score.overall || 0)) / 100} className="text-accent" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-black">{score.overall || "--"}</span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold uppercase text-center opacity-80">Overall Fit</span>
                </div>

                {/* Details Column */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-foreground text-background font-mono px-2 py-0.5 text-xs font-bold uppercase">
                      {proposal.status}
                    </span>
                    <span className="font-mono text-sm font-bold uppercase">
                      DPIIT: {proposal.startup.dpiitNumber || "N/A"}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-black uppercase mb-1">{proposal.startup.name}</h2>
                  <p className="font-mono text-sm opacity-80 mb-6">{proposal.startup.sector} | Founded {proposal.startup.foundedYear}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 border-b-2 border-foreground/30 pb-1">AI Match Confidence</h3>
                      <ul className="space-y-2 font-mono text-sm">
                        {match.met?.map((m: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-accent font-bold">+</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 border-b-2 border-foreground/30 pb-1">Identified Gaps</h3>
                      <ul className="space-y-2 font-mono text-sm">
                        {match.gaps?.map((g: string, i: number) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-destructive font-bold">-</span>
                            <span className="opacity-80">{g}</span>
                          </li>
                        ))}
                        {(!match.gaps || match.gaps.length === 0) && (
                          <li className="opacity-50">No significant gaps identified.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Column */}
                <div className="flex flex-col justify-end gap-4 border-t-4 md:border-t-0 md:border-l-4 border-foreground pt-6 md:pt-0 md:pl-8 shrink-0">
                  <Button 
                    variant="outline"
                    className="w-full rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-muted font-bold tracking-widest uppercase h-12"
                  >
                    View Pitch
                  </Button>
                  {proposal.status === "SUBMITTED" && (
                    <form action={advanceToPilot.bind(null, proposal.id, requirement.id)}>
                      <Button 
                        type="submit"
                        className="w-full rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase h-14"
                      >
                        Initiate Pilot
                      </Button>
                    </form>
                  )}
                  {proposal.status === "PILOTING" && (
                    <Button 
                      render={<Link href={`/department/pilots/${proposal.pilot?.id || ""}`} />}
                      className="w-full rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase h-14"
                    >
                      View Pilot
                    </Button>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
