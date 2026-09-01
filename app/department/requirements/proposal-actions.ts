"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function advanceToPilot(proposalId: string, requirementId: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    throw new Error("UNAUTHORIZED")
  }

  const departmentId = (session.user as any).departmentId

  // Verify ownership
  const req = await prisma.requirement.findUnique({
    where: { id: requirementId }
  })
  if (req?.departmentId !== departmentId) {
    throw new Error("UNAUTHORIZED")
  }

  // Update proposal status
  await prisma.proposal.update({
    where: { id: proposalId },
    data: { status: "PILOTING" }
  })

  // Update requirement status
  await prisma.requirement.update({
    where: { id: requirementId },
    data: { status: "PILOTING" }
  })

  // Create pilot record
  const pilot = await prisma.pilot.create({
    data: {
      proposalId,
      scope: "Standard 3-month outcome-based pilot",
      claimedMetrics: JSON.stringify({}),
      measuredMetrics: JSON.stringify({})
    }
  })

  redirect(`/department/pilots/${pilot.id}`)
}
