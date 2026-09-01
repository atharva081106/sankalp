import Link from "next/link"
import { ChevronRight, ExternalLink, Mail, Phone } from "lucide-react"

export default function HelpdeskPage() {
  const faqs = [
    {
      question: "How do I register my startup on Sankalp?",
      answer: "Startups must be registered as legal entities in India. You can initialize your Tech Node via the 'Register Startup' flow. A DPIIT registration number is recommended but not mandatory for initial access."
    },
    {
      question: "What is the Technical Readiness Level (TRL)?",
      answer: "TRL is a globally accepted scale from 1 to 9 used to estimate the maturity of technologies. On Sankalp, you must accurately report your TRL. Over-claiming will result in a penalty during the technical evaluation phase."
    },
    {
      question: "How are pilots funded?",
      answer: "Pilots are funded based on the milestones defined in your proposal. Once a department validates a milestone in the dashboard, the corresponding payment is released. The budget band is defined in the initial requirement."
    },
    {
      question: "Who evaluates my proposal?",
      answer: "Proposals are evaluated by an independent technical committee assigned to the specific requirement. You can track your proposal's status in the Operations Log on your dashboard."
    },
    {
      question: "I am a government department. How do I post a requirement?",
      answer: "Once authenticated, navigate to your dashboard and click 'Initialize Requirement'. You can download the standard CSV template for structuring your problem statement before uploading it."
    }
  ]

  return (
    <div className="flex-1 bg-background text-foreground flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
      
      {/* Header */}
      <div className="mb-12 border-b-4 border-foreground pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="font-mono text-sm hover:underline uppercase font-bold">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="font-mono text-sm uppercase opacity-60">Helpdesk</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
          Helpdesk & FAQs
        </h1>
        <p className="text-xl font-mono uppercase mt-4 border-l-4 border-foreground pl-4 max-w-2xl opacity-80">
          Operational guidance and support for the Sankalp Innovation Portal.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Content - FAQs */}
        <div className="md:col-span-2 space-y-8">
          <h2 className="text-3xl font-black uppercase border-b-2 border-foreground pb-2">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-4 border-foreground p-6 bg-background shadow-[4px_4px_0_0_#DFE104] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#DFE104]">
                <h3 className="font-bold text-lg uppercase mb-2">{faq.question}</h3>
                <p className="font-mono text-sm opacity-80 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Contact */}
        <div className="space-y-6">
          <div className="border-4 border-foreground p-6 bg-foreground text-background shadow-[4px_4px_0_0_#DFE104]">
            <h3 className="text-xl font-black uppercase mb-4">Still Need Help?</h3>
            <p className="font-mono text-sm mb-6 opacity-90">
              Our support operators are available Monday through Friday, 0900 to 1800 IST.
            </p>
            
            <div className="space-y-4 font-mono text-sm">
              <a href="mailto:support@sankalp.gov.in" className="flex items-center gap-3 hover:text-accent transition-colors">
                <Mail className="w-5 h-5 shrink-0" />
                <span className="font-bold underline underline-offset-4">support@sankalp.gov.in</span>
              </a>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <span className="font-bold">1800-11-SANKALP</span>
              </div>
            </div>
          </div>

          <div className="border-4 border-foreground p-6 bg-accent/20">
            <h3 className="text-xl font-black uppercase mb-2">Resource Center</h3>
            <p className="font-mono text-sm mb-4 opacity-80">
              Download policy documents, API specifications, and standard operating procedures.
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase hover:bg-foreground hover:text-background px-2 py-1 transition-colors border-2 border-transparent hover:border-foreground">
              View Resources <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          
          {/* Internal Link to Chatbot Hint */}
          <div className="border-2 border-dashed border-foreground p-4 bg-muted/20">
            <p className="font-mono text-xs uppercase text-center font-bold">
              Tip: You can also ask Sankalp AI (bottom right) for immediate technical assistance.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
