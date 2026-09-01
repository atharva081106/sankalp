"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ShieldCheck, X } from "lucide-react"
import { approveMilestone } from "../actions"

export function ApproveMilestoneButton({ milestoneId }: { milestoneId: string }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [step, setStep] = useState(1)

  const handleSignAndApprove = async () => {
    setLoading(true)
    try {
      // Simulate UIDAI verification
      await new Promise(r => setTimeout(r, 1500))
      
      await approveMilestone(milestoneId)
      setSuccess(true)
      setShowModal(false)
      triggerConfetti()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const triggerConfetti = () => {
    const el = document.createElement("div")
    el.innerHTML = `
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:9999;pointer-events:none;text-align:center;">
        <div style="font-size:100px;animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;">💰</div>
        <div style="font-family:monospace;font-size:24px;font-weight:900;background:#000;color:#DFE104;padding:10px 20px;text-transform:uppercase;animation: fadeUp 1s forwards;margin-top:20px;">FUNDS DISBURSED</div>
      </div>
      <style>
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      </style>
    `
    document.body.appendChild(el)
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el)
    }, 3000)
  }

  if (success) {
    return (
      <span className="flex items-center gap-1 text-green-600 font-bold uppercase text-sm border-2 border-green-600 px-3 py-1 bg-green-50">
        <CheckCircle2 className="w-4 h-4" /> PAID
      </span>
    )
  }

  return (
    <>
      <Button 
        onClick={() => setShowModal(true)} 
        disabled={loading}
        size="sm" 
        className="rounded-none border-2 border-foreground bg-accent text-foreground font-mono text-xs font-bold uppercase transition-colors hover:bg-foreground hover:text-background shadow-[2px_2px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        Approve & Disburse
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-background border-4 border-foreground shadow-[12px_12px_0_0_#000] p-8 max-w-md w-full relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-foreground hover:text-destructive">
              <X className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-foreground/20">
              <ShieldCheck className="w-8 h-8 text-accent" />
              <div>
                <h3 className="font-black text-xl uppercase tracking-widest">e-Pramaan</h3>
                <p className="font-mono text-xs uppercase font-bold opacity-60">Digital Signature Verification</p>
              </div>
            </div>

            {step === 1 ? (
              <div className="space-y-4 font-mono">
                <p className="text-sm opacity-80 mb-4">Financial disbursements require a Level 3 Digital Signature Certificate (DSC) or Aadhaar e-Sign authentication.</p>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Aadhaar Virtual ID (VID)</label>
                  <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full border-2 border-foreground p-3 bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent tracking-widest" />
                </div>
                <Button 
                  onClick={() => {
                    setLoading(true)
                    setTimeout(() => {
                      setLoading(false)
                      setStep(2)
                    }, 1000)
                  }}
                  disabled={loading}
                  className="w-full rounded-none border-2 border-foreground font-bold uppercase bg-foreground text-background hover:bg-accent hover:text-foreground tracking-widest"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Request OTP"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 font-mono">
                <div className="bg-green-50 text-green-700 border-2 border-green-600 p-3 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> OTP Sent to UIDAI Registered Mobile
                </div>
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Enter 6-Digit OTP</label>
                  <input type="text" placeholder="••••••" className="w-full border-2 border-foreground p-3 bg-muted/30 focus:outline-none focus:ring-2 focus:ring-accent tracking-widest text-center text-xl font-black" />
                </div>
                <Button 
                  onClick={handleSignAndApprove}
                  disabled={loading}
                  className="w-full rounded-none border-2 border-foreground font-bold uppercase bg-accent text-foreground hover:bg-foreground hover:text-background tracking-widest h-12"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Verify & Sign Work Order"}
                </Button>
                <p className="text-[10px] opacity-60 text-center uppercase">By signing, you authorize the disbursement of exchequer funds.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
