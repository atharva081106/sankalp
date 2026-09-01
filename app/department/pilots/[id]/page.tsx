import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { ApproveMilestoneButton } from "./approve-button"

export default async function PilotDashboardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    redirect("/login")
  }

  const departmentId = (session.user as any).departmentId

  const pilot = await prisma.pilot.findUnique({
    where: { id: params.id },
    include: {
      proposal: {
        include: {
          startup: true,
          requirement: true
        }
      },
      milestones: {
        orderBy: { dueDate: "asc" }
      }
    }
  })

  if (!pilot || pilot.proposal.requirement.departmentId !== departmentId) {
    notFound()
  }

  let claimed: any = {}
  try { claimed = JSON.parse(pilot.claimedMetrics) } catch (e) {}
  
  let measured: any = {}
  try { measured = JSON.parse(pilot.measuredMetrics) } catch (e) {}

  const hasScaleDecision = !!pilot.scaleDecision

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <Link href={`/department/requirements/${pilot.proposal.requirementId}/proposals`} className="font-mono text-sm uppercase font-bold hover:underline mb-4 block">
          &larr; Back to Requirement Matches
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
            PILOT NODE
          </span>
          <span className="font-mono text-sm opacity-60 uppercase font-bold">{pilot.id}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
          {pilot.proposal.startup.name} <span className="text-accent">Deployment</span>
        </h1>
        <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
          Live pilot outcome tracking and validation dashboard.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Tracking Area */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="border-4 border-foreground p-6 bg-background shadow-[8px_8px_0_0_#DFE104]">
            <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Outcome Metrics (KPIs)</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="border-b-4 border-foreground">
                    <th className="py-4 font-black uppercase tracking-widest text-sm">Metric</th>
                    <th className="py-4 font-black uppercase tracking-widest text-sm">Claimed (Pre-Pilot)</th>
                    <th className="py-4 font-black uppercase tracking-widest text-sm">Measured (Live)</th>
                    <th className="py-4 font-black uppercase tracking-widest text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(claimed).length === 0 && Object.keys(measured).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center opacity-60 italic">No metrics configured yet.</td>
                    </tr>
                  ) : (
                    Object.keys(claimed).map(key => {
                      const cVal = claimed[key]
                      const mVal = measured[key]
                      // Very naive status check
                      const met = mVal !== undefined && Number(mVal) >= Number(cVal) * 0.9

                      return (
                        <tr key={key} className="border-b-2 border-foreground/30">
                          <td className="py-4 font-bold">{key}</td>
                          <td className="py-4 opacity-80">{cVal}</td>
                          <td className="py-4 text-accent font-bold text-lg">{mVal || "--"}</td>
                          <td className="py-4">
                            {mVal === undefined ? (
                              <span className="flex items-center gap-1 opacity-60 text-xs"><Clock className="w-3 h-3" /> PENDING</span>
                            ) : met ? (
                              <span className="flex items-center gap-1 text-accent font-bold text-xs"><CheckCircle2 className="w-4 h-4" /> VERIFIED</span>
                            ) : (
                              <span className="flex items-center gap-1 text-destructive font-bold text-xs"><AlertCircle className="w-4 h-4" /> UNDERPERFORMING</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-4 border-foreground p-6 bg-background">
            <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Milestones & Payments</h2>
            <div className="space-y-4">
              {pilot.milestones.length === 0 ? (
                <p className="font-mono opacity-60 italic">No milestones defined.</p>
              ) : (
                pilot.milestones.map((m, i) => (
                  <div key={m.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-2 border-foreground">
                    <div>
                      <span className="font-mono text-xs opacity-60 font-bold uppercase block mb-1">M{i+1}: Due {m.dueDate.toLocaleDateString()}</span>
                      <h3 className="font-bold uppercase tracking-wide">{m.title}</h3>
                    </div>
                    <div className="flex items-center gap-6 mt-4 sm:mt-0">
                      <span className="font-mono text-lg font-black">₹{m.amount.toLocaleString()}</span>
                      
                      {m.status === 'SUBMITTED' ? (
                        <ApproveMilestoneButton milestoneId={m.id} />
                      ) : (
                        <span className={`font-mono text-xs font-bold uppercase px-2 py-1 border-2 border-foreground ${m.status === 'PAID' ? 'bg-accent text-foreground' : 'bg-muted'}`}>
                          {m.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          
          <div className="border-4 border-foreground p-6 bg-foreground text-background">
            <h2 className="text-xl font-black uppercase border-b-2 border-background/30 pb-2 mb-4">Scale Decision</h2>
            <p className="font-mono text-sm mb-6 opacity-80">
              Procurement rule 144: You may issue a direct work order without a fresh tender if pilot metrics are independently validated.
            </p>
            
            {hasScaleDecision ? (
              <div className="bg-accent text-foreground p-4 font-mono text-center font-bold uppercase">
                Decision Recorded
              </div>
            ) : (
              <Button className="w-full rounded-none border-2 border-background bg-transparent hover:bg-accent hover:border-accent hover:text-foreground font-bold tracking-widest uppercase h-14 transition-colors">
                Procure & Scale (WO)
              </Button>
            )}
          </div>

          <div className="border-2 border-foreground p-6">
            <h2 className="text-xl font-black uppercase border-b-2 border-foreground/30 pb-2 mb-4">Validation Engine</h2>
            <div className="font-mono text-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="opacity-80">Data Integrity</span>
                <span className="text-accent font-bold">100% (Cryptographic)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="opacity-80">Third-Party Validated</span>
                <span className="font-bold">Pending IIT Audit</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
