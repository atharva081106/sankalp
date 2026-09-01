"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function requestMilestoneValidation(milestoneId: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "STARTUP") {
    throw new Error("Unauthorized")
  }

  // Basic security check could go here
  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "SUBMITTED" }
  })

  revalidatePath("/startup/pilots/[id]", "page")
}
