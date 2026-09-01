"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function registerDepartment(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const ministry = formData.get("ministry") as string
  const jurisdiction = formData.get("jurisdiction") as string

  if (!email || !password || !name || !ministry || !jurisdiction) {
    return { error: "ALL FIELDS REQUIRED" }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "USER EXISTS" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "DEPARTMENT",
      verified: false, // requires admin verification
      department: {
        create: {
          name,
          ministry,
          jurisdiction
        }
      }
    }
  })

  return { success: true }
}

export async function registerStartup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const sector = formData.get("sector") as string
  const dpiitNumber = formData.get("dpiitNumber") as string
  const foundedYear = parseInt(formData.get("foundedYear") as string)
  const description = formData.get("description") as string
  const pricingModel = formData.get("pricingModel") as string

  // Note: For a real app, techStack and certifications would be array inputs. 
  // We'll mock them as empty arrays for the basic signup, and they can be updated in the profile.
  
  if (!email || !password || !name || !sector || !foundedYear || !description || !pricingModel) {
    return { error: "ALL REQUIRED FIELDS MUST BE FILLED" }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "USER EXISTS" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "STARTUP",
      verified: false, // requires admin verification
      startup: {
        create: {
          name,
          sector,
          dpiitNumber,
          foundedYear,
          description,
          pricingModel,
          techStack: "[]",
          certifications: "[]",
          pastDeployments: "[]"
        }
      }
    }
  })

  return { success: true }
}
