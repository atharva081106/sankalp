import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilePlus, FileText, CheckCircle2 } from "lucide-react"

export default async function DepartmentDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    redirect("/login")
  }

  const departmentId = (session.user as any).departmentId
  if (!departmentId) {
    return <div>INVALID NODE STATE</div>
  }

  const department = await prisma.department.findUnique({
    where: { id: departmentId },
    include: {
      requirements: {
        include: {
          _count: { select: { proposals: true } }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  if (!department) {
    return <div>DEPARTMENT NOT FOUND</div>
  }

  // Calculate aggregates
  const activeReqs = department.requirements.filter(r => r.status !== 'CLOSED').length
  const totalProposals = department.requirements.reduce((acc, r) => acc + r._count.proposals, 0)
  const activePilots = department.requirements.filter(r => r.status === 'PILOTING').length

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-foreground pb-6 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
              NODE: GOV
            </span>
            <span className="font-mono text-sm opacity-60">AUTH: VERIFIED</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            {department.name}
          </h1>
          <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
            {department.ministry} | {department.jurisdiction}
          </p>
        </div>
        <Button 
          render={<Link href="/department/requirements/new" />} 
          className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase py-6 px-8 text-lg flex gap-2 items-center shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <FilePlus className="w-5 h-5" />
          Initialize Requirement
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <FileText className="w-4 h-4" /> Active Requirements
          </h3>
          <p className="text-6xl font-black">{activeReqs}</p>
        </div>
        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <FileText className="w-4 h-4" /> Proposals Received
          </h3>
          <p className="text-6xl font-black">{totalProposals}</p>
        </div>
        <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-80 mb-2 flex gap-2 items-center">
            <CheckCircle2 className="w-4 h-4" /> Ongoing Pilots
          </h3>
          <p className="text-6xl font-black">{activePilots}</p>
        </div>
      </div>

      {/* Resources */}
      <div className="mb-12 border-4 border-foreground p-6 bg-accent/20 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[6px_6px_0_0_#DFE104]">
        <div>
          <h3 className="text-2xl font-black uppercase mb-1">Standard Templates</h3>
          <p className="font-mono text-sm opacity-80">Download the official Sankalp format for structuring problem statements and challenges.</p>
        </div>
        <a 
          href="/templates/challenge_template.csv" 
          download
          className="rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase py-4 px-6 text-sm flex gap-2 items-center shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          <FileText className="w-4 h-4" /> Download Challenge Template (CSV)
        </a>
      </div>

      {/* Requirements List */}
      <div>
        <h2 className="text-3xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Operations Log</h2>
        
        {department.requirements.length === 0 ? (
          <div className="border-4 border-dashed border-muted-foreground p-12 text-center">
            <p className="font-mono uppercase text-muted-foreground font-bold tracking-widest">NO ACTIVE OPERATIONS</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {department.requirements.map(req => {
              let domain = "General"
              try {
                domain = JSON.parse(req.structured)?.domain || domain
              } catch (e) {}

              return (
                <div key={req.id} className="border-4 border-foreground p-6 bg-background flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[4px_4px_0_0_#000] hover:bg-muted/10 transition-colors">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`font-mono px-2 py-0.5 text-xs font-bold uppercase border-2 border-foreground ${req.status === 'OPEN' ? 'bg-accent text-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {req.status}
                      </span>
                      <span className="font-mono text-sm opacity-60">ID: {req.id.slice(0, 8)}...</span>
                    </div>
                    
                    <h3 className="text-2xl font-black uppercase mb-2 line-clamp-1">{domain} Requirement</h3>
                    <p className="font-mono text-sm opacity-80 line-clamp-1 max-w-2xl">{req.rawProblem}</p>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="text-right border-r-2 border-foreground pr-4">
                      <p className="font-mono text-xs uppercase opacity-60 font-bold">Proposals</p>
                      <p className="text-2xl font-black">{req._count.proposals}</p>
                    </div>
                    
                    <Button 
                      render={<Link href={`/department/requirements/${req.id}/proposals`} />}
                      className="rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase"
                    >
                      View Details
                    </Button>
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
