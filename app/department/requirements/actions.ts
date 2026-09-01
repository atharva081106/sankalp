"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { extractStructuredRequirement } from "@/lib/ai/service"
import { redirect } from "next/navigation"

export async function generateStructuredRequirement(rawProblem: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    throw new Error("UNAUTHORIZED")
  }

  // Call the AI Service Layer
  const structured = await extractStructuredRequirement(rawProblem)
  
  return structured
}

export async function publishRequirement(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    throw new Error("UNAUTHORIZED")
  }

  const departmentId = (session.user as any).departmentId
  
  const rawProblem = formData.get("rawProblem") as string
  const structuredStr = formData.get("structured") as string
  const location = formData.get("location") as string
  const budgetBand = formData.get("budgetBand") as string
  
  // Default minimal configurations for now
  const eligibility = JSON.stringify({ minTRL: 6, madeInIndia: true })
  const evaluationCriteria = JSON.stringify([
    { name: "Technical Fit", weight: 40 },
    { name: "Cost Efficiency", weight: 30 },
    { name: "Deployment Readiness", weight: 30 }
  ])

  const newReq = await prisma.requirement.create({
    data: {
      departmentId,
      rawProblem,
      structured: structuredStr,
      location,
      budgetBand,
      eligibility,
      evaluationCriteria,
      status: "OPEN"
    }
  })

  redirect(`/department/requirements/${newReq.id}/proposals`)
}
