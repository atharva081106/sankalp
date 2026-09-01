import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const templates = [
  {
    id: "problem-statement",
    title: "Problem Statement Builder",
    preview: "1. Background Context\n2. The Core Challenge (Outcome-focused)\n3. What success looks like (KPIs)\n4. Existing attempts (Why they failed)\n5. Operating Environment constraints",
  },
  {
    id: "pilot-agreement",
    title: "Pilot Agreement (Milestone-based)",
    preview: "Standard terms for short-term sandbox testing. Includes definition of deliverables, payment schedule linked to milestones, and termination clauses for both parties without penalty.",
  },
  {
    id: "ip-data",
    title: "IP & Data Governance Clause",
    preview: "Startup retains core IP. Department receives non-exclusive right to use the deployed solution. Data generated during the pilot belongs to the Department, with strict GDPR/DPDP Act compliance for PII.",
  },
  {
    id: "cyber-checklist",
    title: "Cybersecurity Checklist",
    preview: "1. Data encryption at rest & transit\n2. OWASP Top 10 compliance\n3. Role-based access control (RBAC)\n4. VAPT report required before production scale-up",
  },
  {
    id: "risk-register",
    title: "Pilot Risk Register",
    preview: "Matrix for identifying operational, technical, and regulatory risks during the pilot, with corresponding mitigation strategies and responsible owners.",
  },
]

export default function TemplatesLibrary() {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 border-b-2 border-border bg-background">
        <Button variant="ghost" size="sm" render={<Link href="/" />} className="uppercase">
          <ArrowLeft className="mr-2" /> Back
        </Button>
        <div className="font-heading font-bold text-xl uppercase tracking-tighter">Template Library</div>
      </header>

      <main className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
        <h1 className="font-heading font-bold text-5xl md:text-8xl uppercase tracking-tighter mb-6">
          Standardized <span className="text-accent">Templates</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl">
          Pre-approved legal and operational templates to reduce pilot setup time from months to days.
        </p>

        <Accordion className="w-full border-t-2 border-border">
          {templates.map((template) => (
            <AccordionItem key={template.id} value={template.id}>
              <AccordionTrigger>{template.title}</AccordionTrigger>
              <AccordionContent>
                <div className="bg-muted p-6 border-2 border-border mt-2 mb-6">
                  <h4 className="font-bold uppercase tracking-tight mb-4 text-muted-foreground">Preview</h4>
                  <pre className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed text-foreground">
                    {template.preview}
                  </pre>
                  
                  <div className="mt-8 pt-6 border-t-2 border-border flex flex-wrap gap-4">
                    <Button variant="default">
                      <Download className="mr-2" /> Download PDF
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2" /> Download DOCX
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </div>
  )
}
