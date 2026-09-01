"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, X, Send, Loader2 } from "lucide-react"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'How can I help you?' }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error("API Error")

      const data = await res.json()
      setMessages([...newMessages, data.message])
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'SYSTEM ERROR. PLEASE RETRY.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-3 bg-accent text-foreground border-4 border-foreground shadow-[4px_4px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center"
        >
          <Bot className="w-6 h-6" strokeWidth={2.5} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] md:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-background/80 backdrop-blur-md border-4 border-foreground shadow-[8px_8px_0_0_#DFE104]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-4 border-foreground bg-foreground text-background">
            <div>
              <h3 className="font-heading font-black text-xl uppercase tracking-widest leading-none">Sankalp AI</h3>
              <p className="font-mono text-[10px] text-accent mt-1">NODE: ACTIVE // ASSISTANT</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] font-bold uppercase mb-1 opacity-50">
                  {m.role === 'user' ? 'USER' : 'SYS'}
                </span>
                <div 
                  className={`p-3 max-w-[85%] text-sm leading-relaxed border-2 border-foreground ${
                    m.role === 'user' 
                      ? 'bg-accent text-foreground shadow-[4px_4px_0_0_#000]' 
                      : 'bg-muted/30 text-foreground'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-start">
                 <span className="text-[10px] font-bold uppercase mb-1 opacity-50">SYS</span>
                 <div className="p-3 border-2 border-foreground bg-muted/30 flex items-center gap-2">
                   <Loader2 className="w-4 h-4 animate-spin" />
                   <span className="text-xs uppercase font-bold">Processing...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t-4 border-foreground bg-background/50">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="INPUT COMMAND..."
                className="flex-1 bg-background border-2 border-foreground p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-3 bg-foreground text-background hover:bg-accent hover:text-foreground border-2 border-foreground transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
