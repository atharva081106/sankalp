"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Search, Sprout, Car, Droplets, HeartPulse, Brain, Wifi, Building2, ShieldCheck } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { Button } from "@/components/ui/button"

const domains = [
  {
    num: "01",
    icon: Sprout,
    title: "Agritech & Smart Farming",
    examples: "IoT Soil Health Sensors, Satellite Telemetry",
    startups: "1,240+",
    authorized: "₹480 CR",
  },
  {
    num: "02",
    icon: Car,
    title: "Smart Cities & Mobility",
    examples: "AI Traffic Signals, Emergency Corridors",
    startups: "2,850+",
    authorized: "₹620 CR",
  },
  {
    num: "03",
    icon: Droplets,
    title: "Cleantech & Water",
    examples: "Pipeline Contamination Probes",
    startups: "940+",
    authorized: "₹390 CR",
  },
  {
    num: "04",
    icon: HeartPulse,
    title: "Healthtech & Medical",
    examples: "Remote Telemedicine Devices",
    startups: "1,520+",
    authorized: "₹538 CR",
  },
  {
    num: "05",
    icon: Brain,
    title: "AI & Data Governance",
    examples: "Fraud Detection, NLP for Citizen Services",
    startups: "1,100+",
    authorized: "₹410 CR",
  },
  {
    num: "06",
    icon: Wifi,
    title: "Connectivity & Digital Infra",
    examples: "Last-Mile Broadband, Edge Compute Nodes",
    startups: "780+",
    authorized: "₹295 CR",
  },
  {
    num: "07",
    icon: Building2,
    title: "Urban Planning & Housing",
    examples: "Drone Surveys, Smart Metering",
    startups: "650+",
    authorized: "₹210 CR",
  },
  {
    num: "08",
    icon: ShieldCheck,
    title: "Defence & Space Tech",
    examples: "Orbital Rockets, Surveillance Drones",
    startups: "320+",
    authorized: "₹880 CR",
  },
]

const foundersData = [
  { img: '/founders/deepinder.png', name: 'Zomato', label: 'DEEPINDER GOYAL' },
  { img: '/founders/falguni.png', name: 'Nykaa', label: 'FALGUNI NAYAR' },
  { img: '/founders/nikhil.png', name: 'Zerodha', label: 'NIKHIL KAMATH' },
  { img: '/founders/ritesh.png', name: 'Oyo', label: 'RITESH AGARWAL' },
  { img: '/founders/aman.png', name: 'boAt', label: 'AMAN GUPTA' },
]

interface LandingClientProps {
  stats: {
    requirements: number
    startups: number
    pilots: number
    procured: number
  }
}

export default function LandingClient({ stats }: LandingClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [founderIdx, setFounderIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFounderIdx((prev) => (prev + 1) % foundersData.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Utility bar ─────────────────────────────────── */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-background border-b border-border/40 text-[10px] font-mono font-bold uppercase text-muted-foreground">
        <span>Government of India Innovation Portal</span>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-foreground transition-colors">English</span>
          <Link href="/helpdesk" className="hover:text-foreground transition-colors">Helpdesk &amp; FAQs</Link>
        </div>
      </div>

      {/* ── Main navbar ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-background border-b-2 border-border">
        <div className="flex items-center gap-4 px-6 py-3">
          {/* Logo block */}
          <Link href="/" className="flex items-center gap-3 shrink-0 mr-4">
            <div className="w-9 h-9 bg-accent flex items-center justify-center font-black text-foreground text-sm">SK</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-xl uppercase tracking-tighter leading-none">Sankalp</span>
                <span className="bg-accent text-foreground font-mono text-[9px] font-black uppercase px-1.5 py-0.5">GOV TECH</span>
              </div>
              <div className="font-mono text-[9px] uppercase text-muted-foreground font-bold tracking-widest">National Innovation Marketplace</div>
            </div>
          </Link>

          {/* Search */}
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim()) {
                router.push(`/requirements?q=${encodeURIComponent(searchQuery.trim())}`)
              } else {
                router.push('/requirements')
              }
            }}
            className="flex-1 hidden md:flex items-center border-2 border-border bg-background max-w-xl"
          >
            <Search className="ml-3 w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges, departments, pilots..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm font-mono uppercase text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button type="submit" className="bg-accent text-foreground font-mono font-black text-xs uppercase px-4 py-2.5 hover:bg-foreground hover:text-background transition-colors">
              Search
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-3 ml-auto shrink-0">
            <Link href="/transparency" className="hidden md:flex items-center gap-2 font-mono font-bold uppercase text-xs hover:text-accent mr-4">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Live Ledger
            </Link>
            <Button render={<Link href="/login" />} variant="ghost" size="sm" className="font-mono font-black uppercase text-xs border-0">
              Login
            </Button>
            <Button
              render={<Link href="/signup/startup" />}
              size="sm"
              className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-black uppercase text-xs tracking-widest"
            >
              Register Startup
            </Button>
          </div>
        </div>

      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative bg-background px-6 md:px-10 pt-4 pb-6 flex flex-col justify-center items-center overflow-hidden border-b-4 border-foreground" style={{ minHeight: 'calc(100vh - 170px)' }}>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-20 w-full max-w-7xl relative z-10">
          {/* Left Text Block */}
          <div className="flex-1 shrink-0 w-full">
            {/* Eyebrow */}
            <p className="font-mono text-xs font-bold uppercase text-muted-foreground tracking-widest mb-6">
              India's Premier Public Sector Innovation Marketplace
            </p>

            {/* Headline */}
            <h1
              className="font-heading font-black uppercase leading-[0.88] tracking-tighter"
              style={{ fontSize: "clamp(3.5rem, 8.5vw, 9.5rem)" }}
            >
              Procurement<br />
              <span className="text-accent">Reimagined.</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 font-mono font-bold uppercase text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
              Bridging the gap between government needs and startup innovation. We cut the red tape to deliver rapid, transparent procurement.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                render={<Link href="/requirements" />}
                className="rounded-none border-2 border-foreground bg-accent text-foreground hover:bg-foreground hover:text-background font-black uppercase tracking-widest text-sm px-6 py-3 h-auto shadow-[4px_4px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2"
              >
                Browse Challenges <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                render={<Link href="/signup/startup" />}
                variant="outline"
                className="rounded-none border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background font-black uppercase tracking-widest text-sm px-6 py-3 h-auto"
              >
                Register Startup
              </Button>
            </div>
          </div>

          {/* Right Slideshow Block */}
          <div className="hidden md:block relative shrink-0 w-72 h-72 lg:w-[28rem] lg:h-[28rem] border-4 border-foreground shadow-[10px_10px_0_0_#DFE104] overflow-hidden bg-foreground">
            {foundersData.map((founder, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 transition-opacity duration-1000 ${i === founderIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={founder.img} alt={founder.name} className="w-full h-full object-cover grayscale" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-foreground text-background border-t-4 border-foreground">
                  <p className="font-heading font-black text-2xl uppercase tracking-tighter leading-none">{founder.label}</p>
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-accent mt-1">{founder.name}</p>
                </div>
              </div>
            ))}
            <div className="absolute top-4 right-4 z-20 bg-accent text-foreground font-mono text-xs font-black uppercase px-3 py-1.5 border-2 border-foreground shadow-[3px_3px_0_0_#000]">
              FOUNDER SPOTLIGHT
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Marquee ───────────────────────────────── */}
      <Marquee speed={80} className="border-y-4 border-foreground bg-accent text-foreground py-2">
        <span className="mx-8 font-black text-lg md:text-2xl uppercase tracking-tighter">{stats.requirements} Requirements Live</span>
        <span className="mx-4 font-black text-lg">·</span>
        <span className="mx-8 font-black text-lg md:text-2xl uppercase tracking-tighter">{stats.startups} Startups Onboarded</span>
        <span className="mx-4 font-black text-lg">·</span>
        <span className="mx-8 font-black text-lg md:text-2xl uppercase tracking-tighter">{stats.pilots} Pilots Running</span>
        <span className="mx-4 font-black text-lg">·</span>
        <span className="mx-8 font-black text-lg md:text-2xl uppercase tracking-tighter">₹{stats.procured * 25}CR Tracked</span>
        <span className="mx-4 font-black text-lg">·</span>
      </Marquee>

      {/* ── Innovation Domains ──────────────────────────── */}
      <section className="px-6 md:px-10 py-8 bg-background">
        <h2 className="font-heading font-black uppercase tracking-tighter text-3xl md:text-4xl mb-4">
          Innovation Domains
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-l-2 border-t-2 border-border/60">
          {domains.map((d) => {
            const Icon = d.icon
            return (
              <div
                key={d.num}
                className="border-r-2 border-b-2 border-border/60 p-3 flex flex-col gap-2 group hover:bg-muted/10 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                  <span className="font-heading font-black text-3xl text-muted-foreground/20 leading-none select-none">{d.num}</span>
                </div>

                <div>
                  <h3 className="font-heading font-black uppercase tracking-tighter text-xs md:text-sm leading-tight">{d.title}</h3>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground leading-relaxed">{d.examples}</p>
                </div>

                <div className="mt-auto pt-2 border-t border-border/50">
                  <p className="font-mono font-black text-[10px] uppercase">{d.startups} Startups</p>
                  <p className="font-mono font-bold text-[9px] uppercase text-accent">{d.authorized} Authorized</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Outcome Ticker ──────────────────────────────── */}
      <Marquee speed={50} direction="right" className="border-y-2 border-foreground bg-foreground text-background py-0.5">
        <span className="mx-6 font-black text-xs md:text-sm uppercase tracking-tighter">Water Leakage Pilot · 34% Reduction in 60 Days</span>
        <span className="mx-3 opacity-40 font-black text-xs">·</span>
        <span className="mx-6 font-black text-xs md:text-sm uppercase tracking-tighter">Traffic AI Pilot · 22% Congestion Drop at 4 Junctions</span>
        <span className="mx-3 opacity-40 font-black text-xs">·</span>
        <span className="mx-6 font-black text-xs md:text-sm uppercase tracking-tighter">Agricultural IoT · 18% Water Savings Validated</span>
        <span className="mx-3 opacity-40 font-black text-xs">·</span>
        <span className="mx-6 font-black text-xs md:text-sm uppercase tracking-tighter">Time-to-Pilot Avg: 14 Days vs 2 Years Traditional</span>
        <span className="mx-3 opacity-40 font-black text-xs">·</span>
      </Marquee>

      {/* ── CTA Split ───────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-t-4 border-foreground">
        <div className="p-8 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-foreground group hover:bg-accent hover:text-foreground transition-colors duration-300 flex flex-col justify-between min-h-[30vh]">
          <div>
            <span className="font-mono text-[10px] font-black uppercase text-muted-foreground group-hover:text-foreground/60 block mb-3">Startup Track</span>
            <h3 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2">I am a<br />Startup</h3>
            <p className="font-mono text-xs text-muted-foreground group-hover:text-foreground/80 max-w-sm">
              Browse live challenges and submit your solution for a real, funded pilot.
            </p>
          </div>
          <Button
            render={<Link href="/signup/startup" />}
            className="mt-6 self-start rounded-none border-2 border-foreground bg-foreground text-background group-hover:bg-background group-hover:text-foreground font-black uppercase text-xs tracking-widest px-4 py-2 h-auto transition-colors flex items-center gap-2"
          >
            Explore Opportunities <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="p-8 md:p-12 group hover:bg-foreground hover:text-background transition-colors duration-300 flex flex-col justify-between min-h-[30vh]">
          <div>
            <span className="font-mono text-[10px] font-black uppercase text-muted-foreground group-hover:text-background/60 block mb-3">Gov Track</span>
            <h3 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter mb-2">I am a<br />Department</h3>
            <p className="font-mono text-xs text-muted-foreground group-hover:text-background/80 max-w-sm">
              Post problem statements, AI-structure your requirements, track pilot KPIs in real time.
            </p>
          </div>
          <Button
            render={<Link href="/signup/department" />}
            className="mt-6 self-start rounded-none border-2 border-foreground bg-accent text-foreground group-hover:bg-background group-hover:text-foreground font-black uppercase text-xs tracking-widest px-4 py-2 h-auto transition-colors flex items-center gap-2"
          >
            Post a Requirement <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t-2 border-border px-6 md:px-10 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-heading font-black uppercase tracking-tighter text-xl">Sankalp</div>
          <div className="font-mono text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Open Innovation Procurement · Government × Startup</div>
        </div>
        <nav className="flex flex-wrap gap-6 font-mono font-bold uppercase text-xs text-muted-foreground">
          <Link href="/requirements" className="hover:text-foreground transition-colors">Challenges</Link>
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="/transparency" className="hover:text-foreground transition-colors">Live Ledger</Link>
          <Link href="/templates" className="hover:text-foreground transition-colors">Templates</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
        </nav>
      </footer>

    </div>
  )
}
