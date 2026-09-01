"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function verifyUser(userId: string) {
  const session = await getServerSession(authOptions)
  
  // Basic RBAC
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("UNAUTHORIZED")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { verified: true }
  })

  revalidatePath("/admin/verifications")
}
