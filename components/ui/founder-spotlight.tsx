"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const founders = [
  {
    name: "Sachin Bansal & Binny Bansal",
    company: "Flipkart",
    sector: "E-COMMERCE",
    note: "Built India's largest homegrown e-commerce marketplace from a Bengaluru apartment.",
    image: "/founders/flipkart.jpg",
  },
  {
    name: "Bhavish Aggarwal",
    company: "Ola",
    sector: "MOBILITY",
    note: "Scaled ride-hailing across India, then moved into EVs and AI.",
    image: "/founders/ola.jpg",
  },
  {
    name: "Ritesh Agarwal",
    company: "OYO",
    sector: "HOSPITALITY",
    note: "Founded India's largest hotel-tech chain as a teenager.",
    image: "/founders/oyo.jpg",
  },
  {
    name: "Deepinder Goyal",
    company: "Zomato (Eternal)",
    sector: "FOOD-TECH",
    note: "Took a restaurant-listing side project to a public food-delivery giant.",
    image: "/founders/zomato.jpg",
  },
  {
    name: "Falguni Nayar",
    company: "Nykaa",
    sector: "BEAUTY & RETAIL",
    note: "Left a banking career at 50 to build India's leading beauty-tech platform.",
    image: "/founders/nykaa.jpg",
  },
  {
    name: "Nithin Kamath & Nikhil Kamath",
    company: "Zerodha",
    sector: "FINTECH",
    note: "Built India's largest stockbroker profitably, without ever raising outside funding.",
    image: "/founders/zerodha.jpg",
  },
  {
    name: "Vidit Aatrey & Sanjeev Barnwal",
    company: "Meesho",
    sector: "SOCIAL COMMERCE",
    note: "Turned WhatsApp-based reselling into a nationwide e-commerce platform.",
    image: "/founders/meesho.jpg",
  },
  {
    name: "Harshil Mathur & Shashank Kumar",
    company: "Razorpay",
    sector: "FINTECH",
    note: "Built payment infrastructure now used by hundreds of thousands of Indian businesses.",
    image: "/founders/razorpay.jpg",
  },
  {
    name: "Byju Raveendran",
    company: "BYJU'S",
    sector: "ED-TECH",
    note: "Scaled a teaching-video app into one of India's best-known ed-tech brands.",
    image: "/founders/byjus.jpg",
  },
  {
    name: "Pawan Chandana & Naga Bharath Daka",
    company: "Skyroot Aerospace",
    sector: "SPACE-TECH",
    note: "Ex-ISRO engineers building India's first privately developed orbital rockets.",
    image: "/founders/skyroot.jpg",
  },
]

export function FounderSpotlight() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false

  const total = founders.length

  const goTo = useCallback(
    (idx: number) => {
      setVisible(false)
      setTimeout(() => {
        setCurrent((idx + total) % total)
        setVisible(true)
      }, 150)
    },
    [total]
  )

  const prev = useCallback(() => goTo(current - 1), [current, goTo])
  const next = useCallback(() => goTo(current + 1), [current, goTo])

  // Auto-advance — disabled under prefers-reduced-motion
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return
    const id = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(id)
  }, [current, goTo, isPaused, prefersReducedMotion])

  // Keyboard navigation
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    el.addEventListener("keydown", onKey)
    return () => el.removeEventListener("keydown", onKey)
  }, [prev, next])

  const f = founders[current]
  const padded = String(current + 1).padStart(2, "0")
  const paddedTotal = String(total).padStart(2, "0")

  return (
    <section className="py-24 border-t-4 border-foreground bg-background">
      {/* Section header */}
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-muted-foreground tracking-widest block mb-4">
              INSPIRATION NODE
            </span>
            <h2
              className="font-heading font-bold uppercase tracking-tighter leading-[0.85]"
              style={{ fontSize: "clamp(2.5rem, 7vw, 8rem)" }}
            >
              Builders Who've{" "}
              <br className="hidden md:block" />
              <span className="text-accent">Done It.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="font-mono text-sm uppercase font-bold text-muted-foreground leading-relaxed">
              THE NEXT ONE COULD BE ON THIS PLATFORM.
            </p>
            <Button
              render={<Link href="/signup/startup" />}
              className="mt-4 rounded-none border-4 border-foreground bg-foreground text-background hover:bg-accent hover:text-foreground font-black tracking-widest uppercase shadow-[4px_4px_0_0_#DFE104]"
            >
              Register Your Startup
            </Button>
          </div>
        </div>
      </div>

      {/* Full-bleed slideshow block */}
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label="Founder spotlight slideshow"
        aria-roledescription="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="relative mx-0 border-y-4 border-foreground focus:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-inset"
        style={{ aspectRatio: "21/9" }}
      >
        {/* aria-live region */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {`Slide ${current + 1} of ${total}: ${f.name}, ${f.company}`}
        </div>

        {/* Background image — fills block */}
        <div
          className="absolute inset-0 transition-opacity duration-150"
          style={{ opacity: visible ? 1 : 0 }}
          aria-hidden="true"
        >
          <Image
            src={f.image}
            alt=""
            fill
            priority={current === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Slide counter — top right, muted massive fraction */}
        <div className="absolute top-6 right-6 z-20 font-heading font-black text-4xl md:text-6xl text-background/30 select-none pointer-events-none tracking-tighter leading-none">
          {padded} <span className="text-2xl md:text-4xl">/</span> {paddedTotal}
        </div>

        {/* Text overlay panel — solid, no gradient, anchored bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 border-t-2 border-accent transition-opacity duration-150"
          style={{
            backgroundColor: "rgba(9,9,11,0.92)",
            opacity: visible ? 1 : 0,
          }}
        >
          <div className="px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {/* Name */}
              <h3 className="font-heading font-black uppercase tracking-tighter text-foreground leading-tight"
                style={{ fontSize: "clamp(1.5rem, 4vw, 3.5rem)" }}>
                {f.name}
              </h3>
              {/* Company · Sector */}
              <p className="font-mono text-sm md:text-base font-bold uppercase text-accent mt-1">
                {f.company} · {f.sector}
              </p>
              {/* Note */}
              <p className="font-mono text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {f.note}
              </p>
            </div>

            {/* Nav controls — bottom right */}
            <div className="flex flex-col items-end gap-4 shrink-0">
              {/* Arrow buttons */}
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous founder"
                  className="w-12 h-12 border-2 border-foreground bg-transparent text-foreground hover:bg-accent hover:text-foreground hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" strokeWidth={3} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next founder"
                  className="w-12 h-12 border-2 border-foreground bg-transparent text-foreground hover:bg-accent hover:text-foreground hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </button>
              </div>

              {/* Dot indicators */}
              <div className="flex gap-1.5" role="tablist" aria-label="Go to slide">
                {founders.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === current}
                    aria-label={`Go to slide ${i + 1}: ${founders[i].name}`}
                    onClick={() => goTo(i)}
                    className={`h-1 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                      i === current
                        ? "w-6 bg-accent"
                        : "w-2 bg-foreground/40 hover:bg-foreground/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile aspect — override to taller */}
      <style>{`
        @media (max-width: 768px) {
          [style*="aspect-ratio: 21"] {
            aspect-ratio: 4/5 !important;
          }
        }
      `}</style>
    </section>
  )
}
