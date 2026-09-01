import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RequirementsBrowsePage() {
  const requirements = await prisma.requirement.findMany({
    include: {
      department: true,
      _count: { select: { proposals: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="flex-1 flex flex-col p-8 bg-background max-w-6xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b-4 border-foreground pb-6 gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">
            Open <span className="text-accent">Requirements</span>
          </h1>
          <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
            Live procurement challenges from verified government departments.
          </p>
        </div>
        <Button 
          render={<Link href="/signup/startup" />} 
          className="rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase py-6 px-8 text-lg"
        >
          Submit Proposal &rarr;
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requirements.map((req) => {
          let structuredData = null
          try {
            structuredData = JSON.parse(req.structured)
          } catch (e) {
            // handle parse error silently
          }

          return (
            <Link key={req.id} href={`/requirements/${req.id}`} className="group border-4 border-foreground p-6 bg-background shadow-[6px_6px_0_0_#DFE104] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#DFE104] flex flex-col md:flex-row justify-between gap-6 items-start">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`font-mono px-3 py-1 text-xs font-bold uppercase border-2 border-foreground ${req.status === 'OPEN' ? 'bg-accent text-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {req.status}
                  </span>
                  <span className="font-mono text-sm font-bold bg-foreground text-background px-2 py-1">{req.department.name}</span>
                </div>
                
                <h2 className="text-3xl font-black uppercase mb-2 line-clamp-3 leading-tight">
                  {req.rawProblem}
                </h2>
                <p className="font-mono text-sm opacity-60 mb-4 line-clamp-1">
                  DOMAIN: {structuredData?.domain || "General"} | JURISDICTION: {req.department.jurisdiction}
                </p>

                <div className="flex flex-wrap gap-4 text-sm font-mono opacity-80 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold border-b-2 border-foreground pb-0.5">DEPT:</span>
                    {req.department.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold border-b-2 border-foreground pb-0.5">BUDGET:</span>
                    {req.budgetBand}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold border-b-2 border-foreground pb-0.5">LOCATION:</span>
                    {req.location}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between self-stretch border-l-0 md:border-l-4 border-foreground pl-0 md:pl-6 pt-4 md:pt-0 w-full md:w-auto">
                <div className="text-right mb-6 w-full md:w-auto flex justify-between md:flex-col items-center md:items-end">
                  <span className="font-mono uppercase text-xs font-bold mb-1 opacity-60">Proposals</span>
                  <span className="text-4xl font-black">{req._count.proposals}</span>
                </div>
                
                <span className="font-bold uppercase tracking-widest text-sm border-b-2 border-transparent group-hover:border-accent group-hover:text-accent pb-1 transition-all inline-flex items-center gap-2">
                  View Details &rarr;
                </span>
              </div>
            </Link>
          )
        })}

        {requirements.length === 0 && (
          <div className="border-4 border-dashed border-muted-foreground p-12 text-center">
            <p className="font-mono uppercase text-muted-foreground font-bold tracking-widest">NO REQUIREMENTS POSTED</p>
          </div>
        )}
      </div>
    </div>
  )
}
