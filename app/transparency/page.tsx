import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ShieldCheck, TrendingUp, IndianRupee } from "lucide-react"
import { RTIPortal } from "./rti-portal"

export default async function TransparencyPage() {
  // Aggregate data
  const startups = await prisma.startup.findMany({
    include: {
      proposals: {
        include: {
          pilot: {
            include: { milestones: true }
          }
        }
      }
    }
  })

  // Calculate metrics
  let totalDisbursed = 0
  let activePilots = 0
  
  const leaderboard = startups.map(startup => {
    let startupDisbursed = 0
    let startupPilots = 0
    
    startup.proposals.forEach(p => {
      if (p.pilot) {
        startupPilots++
        activePilots++
        p.pilot.milestones.forEach(m => {
          if (m.status === "PAID") {
            startupDisbursed += m.amount
            totalDisbursed += m.amount
          }
        })
      }
    })

    return {
      name: startup.name,
      sector: startup.sector,
      pilots: startupPilots,
      disbursed: startupDisbursed
    }
  }).filter(s => s.pilots > 0).sort((a, b) => b.disbursed - a.disbursed)

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 border-b-4 border-foreground pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Link href="/" className="font-mono text-sm uppercase font-bold hover:underline mb-4 block">
            &larr; Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase">
              LIVE DATA
            </span>
            <span className="font-mono text-sm opacity-60 uppercase font-bold">PUBLIC LEDGER</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
            Transparency <span className="text-accent">Portal</span>
          </h1>
          <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
            Real-time tracking of public funds disbursed to verified startups.
          </p>
        </div>
        <div className="text-right border-4 border-foreground p-6 bg-accent/10 shadow-[6px_6px_0_0_#000]">
          <p className="font-mono text-sm font-bold uppercase opacity-80 mb-2 flex items-center justify-end gap-2">
            Total Capital Deployed <IndianRupee className="w-4 h-4" />
          </p>
          <p className="text-5xl font-black text-accent tracking-tighter">
            ₹{(totalDisbursed / 10000000).toFixed(2)} Cr
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-60 mb-2 flex gap-2 items-center">
            <TrendingUp className="w-4 h-4" /> Active Deployments (Pilots)
          </h3>
          <p className="text-6xl font-black">{activePilots}</p>
        </div>
        <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-[6px_6px_0_0_#DFE104]">
          <h3 className="font-mono text-sm uppercase font-bold opacity-80 mb-2 flex gap-2 items-center">
            <ShieldCheck className="w-4 h-4" /> Startups Verified & Funded
          </h3>
          <p className="text-6xl font-black text-accent">{leaderboard.length}</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div>
        <h2 className="text-3xl font-black uppercase border-b-4 border-foreground pb-2 mb-6">Top Performers</h2>
        
        <div className="overflow-x-auto border-4 border-foreground shadow-[8px_8px_0_0_#000] bg-background">
          <table className="w-full text-left font-mono">
            <thead className="bg-muted">
              <tr className="border-b-4 border-foreground">
                <th className="p-4 font-black uppercase tracking-widest text-sm">Rank</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm">Startup Name</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm">Sector</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm text-right">Active Pilots</th>
                <th className="p-4 font-black uppercase tracking-widest text-sm text-right">Funds Secured (₹)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center opacity-60 italic uppercase font-bold">No data available on the ledger.</td>
                </tr>
              ) : (
                leaderboard.map((startup, idx) => (
                  <tr key={idx} className="border-b-2 border-foreground/20 hover:bg-accent/10 transition-colors">
                    <td className="p-4 font-black text-xl">#{idx + 1}</td>
                    <td className="p-4 font-bold uppercase text-lg">{startup.name}</td>
                    <td className="p-4 opacity-80 text-sm">{startup.sector}</td>
                    <td className="p-4 text-right font-bold">{startup.pilots}</td>
                    <td className="p-4 text-right text-accent font-black text-xl">₹{startup.disbursed.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RTIPortal />

    </div>
  )
}
