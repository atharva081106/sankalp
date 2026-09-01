"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function approveMilestone(milestoneId: string) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "DEPARTMENT") {
    throw new Error("Unauthorized")
  }

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: "PAID" }
  })

  revalidatePath("/department/pilots/[id]", "page")
}
