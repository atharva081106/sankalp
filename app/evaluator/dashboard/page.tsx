import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProposalCard } from "./proposal-card"

export default async function EvaluatorDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "EVALUATOR") {
    redirect("/login")
  }

  // Fetch all proposals in SUBMITTED state to be evaluated
  const proposals = await prisma.proposal.findMany({
    where: { status: "SUBMITTED" },
    include: {
      startup: true,
      requirement: {
        include: { department: true }
      }
    },
    orderBy: { opportunityScore: "desc" }
  })

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 bg-background max-w-7xl mx-auto w-full">
      <div className="mb-8 border-b-4 border-foreground pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Evaluator Node</h1>
          <p className="text-xl font-mono uppercase mt-2 opacity-80">Pending Technical Evaluations</p>
        </div>
        <div className="text-right font-mono">
          <p className="text-sm uppercase font-bold text-accent">QUEUE_SIZE: {proposals.length}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {proposals.length === 0 ? (
          <div className="border-4 border-dashed border-muted-foreground p-12 text-center">
            <p className="font-mono uppercase text-muted-foreground font-bold tracking-widest">NO PROPOSALS PENDING EVALUATION</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        )}
      </div>
    </div>
  )
}
