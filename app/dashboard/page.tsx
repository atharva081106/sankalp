import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const role = (session.user as any).role

  if (role === "DEPARTMENT") {
    redirect("/department/dashboard")
  } else if (role === "STARTUP") {
    redirect("/startup/dashboard")
  } else if (role === "EVALUATOR") {
    redirect("/evaluator/dashboard")
  } else if (role === "ADMIN") {
    redirect("/admin/dashboard")
  } else {
    // Fallback
    redirect("/")
  }
}
