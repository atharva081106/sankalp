import React from "react"
import { cn } from "@/lib/utils"

interface StatNumberProps {
  number: string | number
  label: string
  className?: string
  numberClassName?: string
  labelClassName?: string
  decorative?: boolean
}

export function StatNumber({
  number,
  label,
  className,
  numberClassName,
  labelClassName,
  decorative = false,
}: StatNumberProps) {
  return (
    <div className={cn("flex flex-col items-start gap-1 relative z-0", className)}>
      <div 
        className={cn(
          "font-heading font-bold leading-none tracking-tighter text-[6rem] md:text-[8rem] lg:text-[10rem] text-muted-foreground/30",
          numberClassName
        )}
        aria-hidden={decorative}
      >
        {number}
      </div>
      <div className={cn("uppercase font-bold tracking-tight text-xs md:text-sm lg:text-lg border-l-4 border-border pl-3 mt-[-2rem] md:mt-[-3rem] z-10", labelClassName)}>
        {label}
      </div>
    </div>
  )
}
