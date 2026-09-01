"use client"

import { useRouter } from "next/navigation"
import { Building2, Rocket } from "lucide-react"

export default function SignupRoleSelectionPage() {
  const router = useRouter()

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black uppercase mb-4 tracking-tighter">
          Initialize <span className="text-accent">Workspace</span>
        </h1>
        <p className="text-xl font-mono uppercase mb-12 max-w-2xl border-l-4 border-foreground pl-4">
          Select your operational domain to begin the onboarding sequence.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Department Card */}
          <button 
            onClick={() => router.push("/signup/department")}
            className="group relative text-left bg-background border-4 border-foreground p-8 transition-all hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <div className="absolute top-0 right-0 bg-accent text-background px-3 py-1 font-mono text-sm border-l-4 border-b-4 border-foreground uppercase font-bold group-hover:border-background">
              NODE: GOV
            </div>
            
            <Building2 className="w-16 h-16 mb-6 text-foreground group-hover:text-accent transition-colors" />
            
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">Government Department</h2>
            <p className="font-mono text-sm leading-relaxed mb-8 opacity-80">
              Procure innovation. Define challenges, discover validated capabilities, and run outcome-driven pilots without the red tape.
            </p>

            <div className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b-2 border-transparent group-hover:border-accent group-hover:text-accent pb-1 transition-all">
              Initialize Gov Profile &rarr;
            </div>
          </button>

          {/* Startup Card */}
          <button 
            onClick={() => router.push("/signup/startup")}
            className="group relative text-left bg-background border-4 border-foreground p-8 transition-all hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <div className="absolute top-0 right-0 bg-accent text-background px-3 py-1 font-mono text-sm border-l-4 border-b-4 border-foreground uppercase font-bold group-hover:border-background">
              NODE: TECH
            </div>
            
            <Rocket className="w-16 h-16 mb-6 text-foreground group-hover:text-accent transition-colors" />
            
            <h2 className="text-3xl font-black uppercase mb-4 tracking-tight">Innovative Startup</h2>
            <p className="font-mono text-sm leading-relaxed mb-8 opacity-80">
              Deploy your capabilities. Get matched to government requirements, bypass traditional tenders, and prove your solutions.
            </p>

            <div className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b-2 border-transparent group-hover:border-accent group-hover:text-accent pb-1 transition-all">
              Initialize Tech Profile &rarr;
            </div>
          </button>

        </div>
        
        <div className="mt-12 text-center">
          <p className="font-mono text-sm uppercase">
            Already have an active node? <a href="/login" className="font-bold underline decoration-2 underline-offset-4 hover:bg-accent hover:text-background px-1 transition-colors">Authenticate Here</a>
          </p>
        </div>
      </div>
    </div>
  )
}
