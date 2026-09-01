import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { StatNumber } from "@/components/ui/stat-number"
import { Button } from "@/components/ui/button"

const stages = [
  {
    title: "Challenge Identification",
    desc: "Departments post outcome-based problem statements (not rigid specs). Focus is on 'what we need to solve' instead of 'how to build it'.",
  },
  {
    title: "Startup Discovery & Screening",
    desc: "Startups discover challenges, apply, and get screened against relaxed eligibility. No prior turnover blockers. Integrates with Startup India & GeM.",
  },
  {
    title: "Expert Evaluation",
    desc: "Domain experts and evaluators score submissions against transparent, pre-defined criteria to shortlist the best innovative solutions.",
  },
  {
    title: "Pilot Design Wizard",
    desc: "Structured scoping of the sandbox: defining duration, explicit success metrics, data/IP terms, cybersecurity requirements, and a risk register.",
  },
  {
    title: "Milestone-Based Contracting",
    desc: "A pilot agreement is automatically generated from templates, breaking down the budget into clear, verifiable payment milestones.",
  },
  {
    title: "Performance Validation",
    desc: "Live dashboards track KPIs against targets. Third-party independent validators sign-off on milestone achievements.",
  },
  {
    title: "Transparent Payments",
    desc: "Milestone-linked payments with full transparency on status. Startups know exactly when and what they will be paid.",
  },
  {
    title: "Scale-Up Decision",
    desc: "Evidence-based go/no-go. Successful pilots unlock pathways to full procurement or multi-department rollout without re-tendering.",
  },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 border-b-2 border-border bg-background">
        <Button variant="ghost" size="sm" render={<Link href="/" />} className="uppercase">
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <div className="font-heading font-bold text-xl uppercase tracking-tighter">How It Works</div>
      </header>

      <main className="pt-32 pb-32 px-6 max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-5xl md:text-8xl uppercase tracking-tighter mb-12">
          The 8-Stage<br/><span className="text-accent">Innovation Pipeline</span>
        </h1>
        
        <div className="flex flex-col space-y-12 md:space-y-32 mt-24">
          {stages.map((stage, idx) => (
            <div 
              key={idx} 
              className="sticky bg-background border-2 border-border p-8 md:p-12 shadow-[12px_12px_0_0_#27272A] transition-colors hover:bg-foreground hover:text-background group"
              style={{ top: `${120 + idx * 24}px` }}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <StatNumber 
                  number={`0${idx + 1}`} 
                  label="Stage" 
                  className="group-hover:text-background"
                  numberClassName="text-border group-hover:text-muted" 
                  labelClassName="border-foreground"
                />
                <div className="flex-1 md:ml-12">
                  <h2 className="font-heading font-bold uppercase tracking-tighter text-3xl md:text-5xl mb-6">{stage.title}</h2>
                  <p className="text-xl md:text-2xl opacity-80 group-hover:opacity-100 max-w-3xl">
                    {stage.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
