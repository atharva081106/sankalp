import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are Sankalp AI, an expert assistant for the Government of India Innovation Portal (Sankalp). 
You help startups understand government procurement, navigate the platform, draft proposals, and help departments structure their challenges. 
Keep answers concise (under 150 words), practical, and relevant to GovTech innovation in India.
You have a brutalist, no-nonsense persona but are highly helpful.
Do not use markdown headers or bullet asterisks. Use plain text only.
Key facts about Sankalp:
- Startups browse open requirements from govt departments and submit proposals
- AI scoring evaluates proposals automatically on a 0-100 scale
- Approved proposals become milestone-based pilots with phased funding
- The Live Ledger tracks all spending publicly for RTI compliance
- Demo login: deepinder@zomato.com / password123 (Startup), head@ministryofurbandev.gov.in / password123 (Dept)`
    })

    // Convert messages to Gemini format (skip system messages)
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }))

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1]
    const result = await chat.sendMessage(lastMessage.content)
    const text = result.response.text()

    return NextResponse.json({
      message: { role: 'assistant', content: text }
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
