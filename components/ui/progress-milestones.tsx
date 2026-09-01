import React from "react"
import { cn } from "@/lib/utils"

export interface Milestone {
  id: string
  title: string
  status: "pending" | "submitted" | "validated" | "paid"
}

interface ProgressMilestonesProps {
  milestones: Milestone[]
  className?: string
}

export function ProgressMilestones({ milestones, className }: ProgressMilestonesProps) {
  return (
    <div className={cn("flex flex-row items-center w-full", className)}>
      {milestones.map((milestone, index) => {
        const isCompleted = milestone.status === "paid" || milestone.status === "validated" || milestone.status === "submitted"
        const isCurrent = milestone.status === "pending" && (index === 0 || milestones[index - 1].status !== "pending")

        return (
          <div key={milestone.id} className="flex flex-row items-center flex-1 last:flex-none">
            {/* Node */}
            <div className="flex flex-col items-center gap-2 relative">
              <div
                className={cn(
                  "w-6 h-6 border-2 flex items-center justify-center shrink-0 font-bold text-xs bg-background",
                  isCompleted ? "border-accent bg-accent text-accent-foreground" : "border-border",
                  isCurrent ? "border-foreground ring-2 ring-foreground/20" : ""
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span className={cn(
                "absolute top-8 text-xs font-bold uppercase tracking-tight w-24 text-center whitespace-normal leading-tight",
                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>
                {milestone.title}
              </span>
            </div>
            
            {/* Line */}
            {index < milestones.length - 1 && (
              <div 
                className={cn(
                  "flex-1 h-1 mx-2",
                  isCompleted ? "bg-accent" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
