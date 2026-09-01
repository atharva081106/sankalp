import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Activity, UploadCloud } from "lucide-react"
import { SubmitMilestoneButton } from "./submit-button"

export default async function StartupPilotDashboardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "STARTUP") {
    redirect("/login")
  }

  const startupId = (session.user as any).startupId

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

  if (!pilot || pilot.proposal.startupId !== startupId) {
    notFound()
  }

  let claimed: any = {}
  try { claimed = JSON.parse(pilot.claimedMetrics) } catch (e) {}
  
  let measured: any = {}
  try { measured = JSON.parse(pilot.measuredMetrics) } catch (e) {}

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <Link href="/startup/dashboard" className="font-mono text-sm uppercase font-bold hover:underline mb-4 block">
          &larr; Back to Dashboard
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
            LIVE PILOT
          </span>
          <span className="font-mono text-sm opacity-60 uppercase font-bold">{pilot.id}</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
          Deployment <span className="text-accent">Telemetry</span>
        </h1>
        <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
          Report metrics and request milestone validations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Tracking Area */}
        <div className="md:col-span-2 space-y-8">
          
          <div className="border-4 border-foreground p-6 bg-background shadow-[8px_8px_0_0_#DFE104]">
            <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 mb-6 flex items-center justify-between">
              Update Metrics
              <Activity className="w-6 h-6" />
            </h2>
            
            <form className="space-y-6 font-mono">
              <p className="opacity-80 text-sm mb-4">Input current measured values for your claimed metrics to update the department's dashboard.</p>
              
              {Object.keys(claimed).length === 0 ? (
                 <div className="border-2 border-dashed border-foreground/30 p-8 text-center opacity-60">
                   No baseline metrics defined yet. Contact the department.
                 </div>
              ) : (
                Object.keys(claimed).map(key => (
                  <div key={key} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="flex-1">
                      <span className="font-bold block uppercase">{key}</span>
                      <span className="text-xs opacity-60 uppercase">Target: {claimed[key]}</span>
                    </div>
                    <div className="flex-1 w-full sm:w-auto">
                      <input 
                        type="text" 
                        defaultValue={measured[key] || ""} 
                        placeholder="Current value..." 
                        className="w-full border-2 border-foreground bg-background p-3 focus:outline-none focus:ring-2 focus:ring-accent" 
                      />
                    </div>
                  </div>
                ))
              )}
              
              {Object.keys(claimed).length > 0 && (
                <div className="pt-4 border-t-2 border-foreground/30">
                  <Button className="w-full rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase h-12">
                    Transmit Telemetry
                  </Button>
                </div>
              )}
            </form>
          </div>

          <div className="border-4 border-foreground p-6 bg-background">
            <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Milestones</h2>
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
                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                      <span className={`font-mono text-xs font-bold uppercase px-2 py-1 border-2 border-foreground ${m.status === 'PENDING' ? 'bg-background' : 'bg-muted'}`}>
                        {m.status}
                      </span>
                      {m.status === "PENDING" && (
                        <SubmitMilestoneButton milestoneId={m.id} />
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
          
          <div className="border-4 border-foreground p-6 bg-accent text-foreground">
            <h2 className="text-xl font-black uppercase border-b-2 border-foreground/30 pb-2 mb-4">Evidence Upload</h2>
            <p className="font-mono text-sm mb-6 opacity-80">
              Upload cryptographically signed logs or independent audit reports to back up your metric claims.
            </p>
            
            <Button variant="outline" className="w-full rounded-none border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase h-14 flex items-center justify-center gap-2">
              <UploadCloud className="w-5 h-5" />
              Upload Hash
            </Button>
          </div>

        </div>

      </div>
    </div>
  )
}
