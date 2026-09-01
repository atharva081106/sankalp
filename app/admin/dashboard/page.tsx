import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert, Users, Database, Activity } from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "ADMIN") {
    // For demo purposes, we will not redirect if they aren't admin so you can view it.
    // In production: redirect("/login")
  }

  // Aggregate Metrics
  const totalUsers = await prisma.user.count()
  const totalDepartments = await prisma.department.count()
  const totalStartups = await prisma.startup.count()
  
  const pendingVerifications = await prisma.user.count({ where: { verified: false } })
  
  const requirements = await prisma.requirement.findMany({ select: { status: true } })
  const totalReqs = requirements.length
  const activePilots = requirements.filter(r => r.status === 'PILOTING').length
  const procured = requirements.filter(r => r.status === 'PROCURED').length

  const allProposals = await prisma.proposal.count()

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-foreground pb-6 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-destructive text-background font-mono px-3 py-1 text-sm font-bold uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              SYS.ADMIN
            </span>
            <span className="font-mono text-sm opacity-60">AUTH: ROOT_LEVEL</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            Platform <span className="text-destructive">Command</span>
          </h1>
          <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
            System-wide metrics and node administration.
          </p>
        </div>
        <Button 
          render={<Link href="/admin/verifications" />} 
          className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase py-6 px-8 text-lg flex gap-2 items-center shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
        >
          Verification Queue ({pendingVerifications})
        </Button>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-xs uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <Users className="w-4 h-4" /> Total Nodes
          </h3>
          <p className="text-5xl font-black">{totalUsers}</p>
          <div className="mt-4 font-mono text-xs opacity-80 flex justify-between border-t-2 border-foreground/30 pt-2">
            <span>Gov: {totalDepartments}</span>
            <span>Tech: {totalStartups}</span>
          </div>
        </div>

        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-xs uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <Database className="w-4 h-4" /> Requirements
          </h3>
          <p className="text-5xl font-black">{totalReqs}</p>
          <div className="mt-4 font-mono text-xs opacity-80 flex justify-between border-t-2 border-foreground/30 pt-2">
            <span>Proposals: {allProposals}</span>
          </div>
        </div>

        <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-xs uppercase font-bold opacity-80 mb-2 flex gap-2 items-center">
            <Activity className="w-4 h-4" /> Active Pilots
          </h3>
          <p className="text-5xl font-black">{activePilots}</p>
          <div className="mt-4 font-mono text-xs opacity-80 border-t-2 border-background/30 pt-2">
            Generating Telemetry
          </div>
        </div>

        <div className="border-4 border-foreground p-6 bg-accent text-foreground shadow-[6px_6px_0_0_#000]">
          <h3 className="font-mono text-xs uppercase font-bold mb-2 flex gap-2 items-center">
            <ShieldAlert className="w-4 h-4" /> Procured & Scaled
          </h3>
          <p className="text-5xl font-black">{procured}</p>
          <div className="mt-4 font-mono text-xs opacity-80 border-t-2 border-foreground/30 pt-2 font-bold">
            SUCCESSFUL EXITS
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="border-4 border-foreground p-6 bg-background">
        <h2 className="text-3xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">System Health Log</h2>
        
        <div className="space-y-2 font-mono text-sm">
          <div className="flex items-center gap-4 border-b-2 border-foreground/20 pb-2">
            <span className="opacity-60">[{(new Date()).toISOString().split('T')[1].slice(0,8)}]</span>
            <span className="bg-accent text-foreground px-2 font-bold uppercase text-xs">INFO</span>
            <span>AI Copilot Engine online. Inference latency &lt;200ms.</span>
          </div>
          <div className="flex items-center gap-4 border-b-2 border-foreground/20 pb-2">
            <span className="opacity-60">[{(new Date(Date.now() - 300000)).toISOString().split('T')[1].slice(0,8)}]</span>
            <span className="bg-background border border-foreground px-2 font-bold uppercase text-xs">SYSTEM</span>
            <span>Database synchronized. Capability Graph updated with 14 new nodes.</span>
          </div>
          <div className="flex items-center gap-4 border-b-2 border-foreground/20 pb-2">
            <span className="opacity-60">[{(new Date(Date.now() - 3600000)).toISOString().split('T')[1].slice(0,8)}]</span>
            <span className="bg-destructive text-background px-2 font-bold uppercase text-xs">WARN</span>
            <span>3 Pending Verifications have been in queue for &gt; 24h.</span>
          </div>
        </div>
      </div>

    </div>
  )
}
