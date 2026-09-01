"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { requestMilestoneValidation } from "../actions"

export function SubmitMilestoneButton({ milestoneId }: { milestoneId: string }) {
  const [loading, setLoading] = useState(false)

  const handleAction = async () => {
    setLoading(true)
    try {
      await requestMilestoneValidation(milestoneId)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleAction} 
      disabled={loading}
      size="sm" 
      variant="outline" 
      className="rounded-none border-2 border-foreground font-mono text-xs font-bold uppercase transition-colors hover:bg-foreground hover:text-background"
    >
      {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
      {loading ? "Submitting..." : "Request Validation"}
    </Button>
  )
}
