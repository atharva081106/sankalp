import React from "react"
import FastMarquee from "react-fast-marquee"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  className?: string
  direction?: "left" | "right" | "up" | "down"
  autoFill?: boolean
}

export function Marquee({
  children,
  speed = 80,
  className,
  direction = "left",
  autoFill = true,
}: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden border-y-2 border-border bg-accent text-accent-foreground py-2", className)}>
      <FastMarquee
        speed={speed}
        direction={direction}
        autoFill={autoFill}
        gradient={false}
        className="overflow-hidden flex items-center"
      >
        {children}
      </FastMarquee>
    </div>
  )
}
