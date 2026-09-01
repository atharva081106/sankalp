import { prisma } from "@/lib/prisma"
import LandingClient from "./landing-client"

export default async function Home() {
  // Live stats from DB
  const [requirementsCount, startupsCount, pilotsCount, procuredCount] = await Promise.all([
    prisma.requirement.count({ where: { status: { not: "CLOSED" } } }),
    prisma.startup.count(),
    prisma.requirement.count({ where: { status: "PILOTING" } }),
    prisma.requirement.count({ where: { status: "PROCURED" } }),
  ])

  return (
    <LandingClient
      stats={{
        requirements: requirementsCount,
        startups: startupsCount,
        pilots: pilotsCount,
        procured: procuredCount,
      }}
    />
  )
}
