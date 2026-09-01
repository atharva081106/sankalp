import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 })
    }

    // Fetch context (all active pilots)
    const pilots = await prisma.pilot.findMany({
      include: {
        proposal: {
          include: {
            startup: true,
            requirement: {
              include: { department: true }
            }
          }
        }
      }
    })

    const contextData = pilots.map(p => ({
      pilotId: p.id,
      startup: p.proposal.startup.name,
      department: p.proposal.requirement.department.name,
      project: p.proposal.requirement.structured,
      fundingScore: p.proposal.opportunityScore,
      MII_Status: p.proposal.startup.makeInIndia ? "Class-I Local Supplier" : "N/A"
    }))

    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Mistral API key not configured" }, { status: 500 })
    }

    const prompt = `
You are the Central Public Information Officer (CPIO) for the Government of India's Sankalp Procurement Portal.
A citizen has filed a Right to Information (RTI) query.

Citizen's Query: "${query}"

System Context (Active Government Pilots):
${JSON.stringify(contextData, null, 2)}

Instructions:
1. Respond formally and bureaucratically, as an official RTI reply under the Right to Information Act, 2005.
2. Include a mock RTI Registration Number (e.g., RTI/SANKALP/2026/0045) at the top.
3. Answer the query based ONLY on the System Context provided. 
4. If the information is not in the context, formally deny the request stating "Information not available on record as per Section 2(f) of the RTI Act."
5. Format the response beautifully using Markdown, with official greetings and sign-offs (e.g., "By Order, CPIO, Sankalp Portal").
`

    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Mistral API Error:", errText)
      return NextResponse.json({ error: "RTI processing failed" }, { status: 500 })
    }

    const data = await res.json()
    const content = data.choices[0].message.content

    return NextResponse.json({ response: content })

  } catch (error: any) {
    console.error("RTI Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
