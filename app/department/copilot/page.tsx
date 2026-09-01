"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrainCircuit, Send, TerminalSquare, PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ProcurementCopilotPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([
    {
      role: "assistant",
      content: "SYSTEM INITIALIZED. Procurement Copilot active. Describe your department's challenge or ask for capability mapping (e.g., 'What capabilities exist for urban flood management?')"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setLoading(true)

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `ANALYZING QUERY: "${userMessage}"\n\nI found 14 active nodes in the Capability Graph related to this domain.\n\nKey validated capabilities available in the ecosystem:\n- IoT-based real-time sensors (TRL 8)\n- Edge Compute analytics (TRL 9)\n- Drone-based thermal imaging (TRL 7)\n\nRecommendation: Initialize a new requirement focusing on these capabilities. I have pre-filled the Auto-Gen Wizard for you.`
      }])
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-8 max-w-7xl mx-auto w-full h-[calc(100vh-80px)]">
      
      <div className="mb-8 border-b-4 border-foreground pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent text-foreground font-mono px-3 py-1 text-sm font-bold uppercase flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            SYS.COPILOT
          </span>
          <span className="font-mono text-sm opacity-60 uppercase font-bold">NODE: GOV</span>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter">
          Procurement <span className="text-accent">Copilot</span>
        </h1>
        <p className="text-xl font-mono uppercase mt-2 opacity-80 max-w-2xl">
          Query the capability graph and auto-generate requirements.
        </p>
      </div>

      <div className="flex-1 flex flex-col border-4 border-foreground shadow-[8px_8px_0_0_#DFE104] bg-background overflow-hidden relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] md:max-w-[60%] p-4 border-2 border-foreground ${msg.role === 'user' ? 'bg-foreground text-background' : 'bg-muted/30 text-foreground font-mono'}`}>
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 opacity-60 font-bold uppercase text-xs">
                    <TerminalSquare className="w-3 h-3" />
                    System Response
                  </div>
                )}
                
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                
                {/* Mock Action Button for Assistant */}
                {msg.role === 'assistant' && i > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-foreground/30">
                    <Button 
                      render={<Link href="/department/requirements/new" />}
                      className="w-full rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-bold tracking-widest uppercase flex gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Initialize Requirement
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="max-w-[80%] p-4 border-2 border-foreground bg-muted/30 text-foreground font-mono flex items-center gap-3">
                 <div className="w-2 h-4 bg-accent animate-pulse"></div>
                 <span className="uppercase font-bold text-xs">Processing Query...</span>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t-4 border-foreground bg-background flex gap-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Query the capability graph..."
            className="flex-1 rounded-none border-2 border-foreground bg-background p-6 font-mono text-lg focus-visible:ring-accent focus-visible:ring-offset-2"
          />
          <Button 
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-none border-2 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-bold tracking-widest uppercase h-auto px-8"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>

      </div>
    </div>
  )
}
