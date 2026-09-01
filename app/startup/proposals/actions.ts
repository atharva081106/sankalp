"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { calculateReadinessScore, generateMatchExplanation } from "@/lib/ai/service"
import { redirect } from "next/navigation"

export async function submitProposal(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "STARTUP") {
    throw new Error("UNAUTHORIZED")
  }

  const startupId = (session.user as any).startupId
  const requirementId = formData.get("requirementId") as string
  const pitch = formData.get("pitch") as string

  if (!requirementId || !pitch) {
    throw new Error("MISSING_DATA")
  }

  const req = await prisma.requirement.findUnique({
    where: { id: requirementId }
  })
  if (!req) throw new Error("REQUIREMENT_NOT_FOUND")

  // Generate scores via AI service stubs
  const score = await calculateReadinessScore(pitch, req.structured)
  const explanation = await generateMatchExplanation(pitch, req.structured)

  const proposal = await prisma.proposal.create({
    data: {
      requirementId,
      startupId,
      pitch,
      readinessScore: JSON.stringify(score),
      matchExplanation: JSON.stringify(explanation),
      opportunityScore: score.overall,
      status: "SUBMITTED"
    }
  })

  redirect("/startup/dashboard")
}
