import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const systemMessage = {
      role: 'system',
      content: 'You are Sankalp AI, an expert assistant for the Government of India Innovation Portal (Sankalp). You help startups understand government procurement, navigate the platform, draft proposals, and help departments structure their challenges. Keep your answers concise, practical, and highly relevant to gov-tech innovation. You have a brutalist, no-nonsense persona but are highly helpful. Do not use markdown headers.'
    }

    const payload = {
      model: 'mistral-small-latest',
      messages: [systemMessage, ...messages],
      max_tokens: 500,
      temperature: 0.7
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ZrwOGHIvyzwsmBGFQsbslvyp5HPESfcd`
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mistral API error:', errorText)
      return NextResponse.json({ error: 'Failed to fetch from Mistral AI' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ message: data.choices[0].message })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
