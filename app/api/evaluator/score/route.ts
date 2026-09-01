import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { proposalId } = await req.json()

    if (!proposalId) {
      return NextResponse.json({ error: "Missing proposalId" }, { status: 400 })
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        requirement: true,
        startup: true
      }
    })

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    if (proposal.aiEvaluation) {
      return NextResponse.json(JSON.parse(proposal.aiEvaluation))
    }

    // Call Mistral API
    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Mistral API key not configured" }, { status: 500 })
    }

    const prompt = `
You are an expert technical evaluator for the Indian Government.
You are evaluating a startup's proposal for a government requirement.

Requirement Problem Statement:
${proposal.requirement.rawProblem}

Startup Pitch:
${proposal.pitch}

Make in India (Class-1 Local Supplier) Status: ${proposal.startup.makeInIndia ? "YES" : "NO"}

If the startup has Make in India status = YES, you MUST heavily boost their feasibility score and explicitly cite the "Public Procurement (Preference to Make in India) Order 2017" in your recommendation.

Based on the above, provide a strict JSON response evaluating the pitch against the requirement.
Do NOT use markdown code blocks. Return raw JSON only, with the following format:
{
  "feasibilityScore": number (1-10),
  "riskLevel": string ("LOW", "MEDIUM", "HIGH"),
  "recommendation": string (1-sentence summary recommendation),
  "strengths": string[],
  "weaknesses": string[]
}
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
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("Mistral API Error:", errText)
      return NextResponse.json({ error: "AI Evaluation failed" }, { status: 500 })
    }

    const data = await res.json()
    const content = data.choices[0].message.content

    // Save to DB
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { aiEvaluation: content }
    })

    return NextResponse.json(JSON.parse(content))

  } catch (error: any) {
    console.error("Score Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
