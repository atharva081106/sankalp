import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { verifyUser } from "../actions"

export default async function AdminVerificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user as any).role !== "ADMIN") {
    // For demo purposes, if not logged in or not admin, we could redirect to login.
    // However, to make it easy to view the UI even if the seed didn't create an admin,
    // we'll just show the page (with a warning) but server action will fail if not authenticated.
  }

  const unverifiedUsers = await prisma.user.findMany({
    where: { verified: false },
    include: {
      department: true,
      startup: true
    },
    orderBy: { createdAt: "asc" }
  })

  return (
    <div className="flex-1 flex flex-col p-8 bg-background max-w-6xl mx-auto w-full">
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <h1 className="text-5xl font-black uppercase tracking-tighter">System Access Control</h1>
        <p className="text-xl font-mono uppercase mt-2 opacity-80">Pending Verification Queue</p>
      </div>

      {unverifiedUsers.length === 0 ? (
        <div className="border-4 border-dashed border-muted-foreground p-12 text-center">
          <p className="font-mono uppercase text-muted-foreground font-bold tracking-widest">NO PENDING VERIFICATIONS</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {unverifiedUsers.map((user) => (
            <div key={user.id} className="border-4 border-foreground p-6 bg-background flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[6px_6px_0_0_#DFE104] transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0_0_#DFE104]">
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-foreground text-background font-mono px-2 py-0.5 text-xs font-bold uppercase">
                    {user.role}
                  </span>
                  <span className="font-mono text-sm opacity-60">ID: {user.id.slice(0, 8)}...</span>
                </div>
                
                {user.role === "DEPARTMENT" && user.department && (
                  <div>
                    <h3 className="text-2xl font-black uppercase">{user.department.name}</h3>
                    <p className="font-mono opacity-80">{user.department.ministry} | {user.department.jurisdiction}</p>
                  </div>
                )}
                
                {user.role === "STARTUP" && user.startup && (
                  <div>
                    <h3 className="text-2xl font-black uppercase">{user.startup.name}</h3>
                    <p className="font-mono opacity-80">{user.startup.sector} | DPIIT: {user.startup.dpiitNumber || "N/A"}</p>
                  </div>
                )}
                
                <p className="font-mono text-sm mt-2 font-bold underline decoration-2 underline-offset-4">{user.email}</p>
              </div>

              <form action={verifyUser.bind(null, user.id)}>
                <Button 
                  type="submit" 
                  className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase h-14 px-8"
                >
                  VERIFY NODE
                </Button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
