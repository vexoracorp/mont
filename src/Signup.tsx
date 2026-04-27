import { useState, useRef, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, Zap, User, Lock, Eye, EyeOff, Store, ChevronDown, Check, Tag } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

type Step = "initial" | "verify" | "profile" | "store" | "plan"

const STEPS: Step[] = ["initial", "verify", "profile", "store", "plan"]

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current)
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {STEPS.map((s, i) => (
        <motion.div
          key={s}
          initial={false}
          animate={{
            width: i === idx ? 24 : 8,
            backgroundColor: i <= idx ? "#918DF6" : "rgba(0,0,0,0.12)",
          }}
          transition={{ duration: 0.3, ease }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  )
}

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0D0D14] p-10 lg:flex lg:w-[380px] xl:w-[420px] shrink-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="relative flex size-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Mont</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="relative z-10"
      >
        <h2 className="text-[28px] leading-[1.15] font-medium tracking-[-0.32px] text-white">
          Start selling in
          <br />
          under 5 minutes.
        </h2>
        <p className="mt-4 max-w-[320px] text-sm leading-relaxed tracking-[-0.32px] text-[#999999]">
          Connect your platforms, upload your inventory, and let Mont handle every order automatically.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {[
            "Auto-delivery across all platforms",
            "Real-time inventory sync",
            "No coding required",
          ].map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease }}
              className="flex items-center gap-2.5"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#918DF6]/15">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.5L4 7.5L8 3" stroke="#918DF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-sm tracking-[-0.32px] text-[#999999]">{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 flex items-center gap-2"
      >
        <Zap className="size-3.5 text-[#918DF6]" strokeWidth={2} />
        <span className="text-xs tracking-[-0.32px] text-[#666666]">
          Free to start — no credit card required
        </span>
      </motion.div>
    </div>
  )
}

function MobileBrandHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="relative overflow-hidden bg-[#0D0D14] px-6 py-8 lg:hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="relative flex size-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Mont</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1 text-xs tracking-[-0.32px] text-[#999999] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3" />
          Home
        </Link>
      </div>
      <p className="relative z-10 mt-4 text-lg font-medium tracking-[-0.32px] text-white">
        Create your account
      </p>
      <p className="relative z-10 mt-1 text-sm tracking-[-0.32px] text-[#999999]">
        Start selling digital products on autopilot
      </p>
    </motion.div>
  )
}

function VerificationCodeInput({ onBack, email, onVerified }: { onBack: () => void; email: string; onVerified: () => void }) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...code]
    next[index] = value.slice(-1)
    setCode(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const next = [...code]
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i]
    }
    setCode(next)
    const focusIndex = Math.min(pasted.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  return (
    <motion.div
      key="verify"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
      >
        <ArrowLeft className="size-3.5" />
        Change email
      </button>

      <div className="mb-2">
        <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
          Check your email
        </h2>
        <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[#181925]">{email}</span>
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (code.every((d) => d !== "")) onVerified() }} className="mt-8 flex flex-col gap-6">
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="size-12 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white text-center text-lg font-semibold tracking-[-0.32px] text-[#181925] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
            />
          ))}
        </div>

        <Button
          type="submit"
          className="h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
        >
          Verify and continue
        </Button>
      </form>

      <p className="mt-6 text-center text-sm tracking-[-0.32px] text-[#666666]">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          className="font-medium text-[#918DF6] transition-colors hover:text-[#9580FF]"
        >
          Resend
        </button>
      </p>
    </motion.div>
  )
}

function ProfileStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /\d/.test(password) },
    { label: "One special character (!@#$...)", met: /[^A-Za-z0-9]/.test(password) },
  ]

  const allRulesMet = rules.every((r) => r.met)
  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
  const confirmTouched = confirm.length > 0
  const valid = name.trim().length > 0 && allRulesMet && passwordsMatch

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
        Set up your profile
      </h2>
      <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
        Tell us a bit about yourself
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (valid) onContinue() }}
        className="mt-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="fullname" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
            <input
              id="fullname"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
            <input
              id="password"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-10 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
            >
              {showPw ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5">
              {rules.map((rule) => (
                <div key={rule.label} className="flex items-center gap-2">
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                      rule.met ? "bg-[#33C758]" : "bg-[rgba(0,0,0,0.08)]"
                    }`}
                  >
                    {rule.met && <Check className="size-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-xs tracking-[-0.32px] transition-colors ${
                      rule.met ? "text-[#33C758]" : "text-[#999999]"
                    }`}
                  >
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-10 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
            >
              {showConfirm ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>
          {confirmTouched && (
            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                  passwordsMatch ? "bg-[#33C758]" : "bg-[#FF2F00]"
                }`}
              >
                {passwordsMatch ? (
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                ) : (
                  <span className="text-[9px] font-bold text-white">✕</span>
                )}
              </span>
              <span
                className={`text-xs tracking-[-0.32px] ${
                  passwordsMatch ? "text-[#33C758]" : "text-[#FF2F00]"
                }`}
              >
                {passwordsMatch ? "Passwords match" : "Passwords don't match"}
              </span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!valid}
          className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </Button>
      </form>
    </motion.div>
  )
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "KRW", label: "KRW — Korean Won" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "JPY", label: "JPY — Japanese Yen" },
]

function StoreStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [storeName, setStoreName] = useState("")
  const [currency, setCurrency] = useState("USD")

  const slug = useMemo(() => slugify(storeName), [storeName])
  const valid = storeName.trim().length > 0

  return (
    <motion.div
      key="store"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease }}
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
        Set up your store
      </h2>
      <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
        Configure your storefront basics
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); if (valid) onContinue() }}
        className="mt-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="storename" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
            Store name
          </label>
          <div className="relative">
            <Store className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
            <input
              id="storename"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="My awesome store"
              className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
            />
          </div>
          {slug && (
            <p className="text-xs tracking-[-0.32px] text-[#999999]">
              <span className="font-medium text-[#918DF6]">{slug}</span>.mont.app
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="currency" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
            Default currency
          </label>
          <div className="relative">
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="h-10 w-full appearance-none rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-4 pr-10 text-sm tracking-[-0.32px] text-[#181925] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!valid}
          className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </Button>
      </form>
    </motion.div>
  )
}

const PLANS = [
  {
    id: "free",
    name: "Starter",
    desc: "For getting started",
    price: "$0",
    period: "/mo",
    features: ["Up to 100 orders/mo", "1 platform", "Email delivery only"],
    badge: null,
    cta: "Select",
  },
  {
    id: "pro",
    name: "Pro",
    desc: "For growing businesses",
    price: "$29",
    period: "/mo",
    features: ["Unlimited orders", "All platforms", "All delivery channels", "Priority support"],
    badge: "Most popular",
    cta: "Select",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "For large-scale operations",
    price: "Custom",
    period: "",
    features: ["Custom limits", "Dedicated support", "SLA guarantee", "Full API access"],
    badge: null,
    cta: "Contact us",
  },
] as const

type PromoPhase = "idle" | "rocket" | "explode" | "slash" | "done"

const EXPLOSION_PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2
  const dist = 80 + Math.random() * 100
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: Math.random() * 720 - 360,
    scale: Math.random() * 0.5 + 0.5,
    color: ["#918DF6", "#F59E0B", "#22C55E", "#3B82F6", "#EC4899", "#EF4444"][i % 6],
    shape: i % 3 === 0 ? "rounded-full" : i % 3 === 1 ? "rounded-sm" : "rounded-none",
    delay: Math.random() * 0.1,
  }
})

const ROCKET_SPARKS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  xOff: (Math.random() - 0.5) * 16,
  delay: i * 0.06,
  size: Math.random() * 3 + 2,
  color: ["#F59E0B", "#EF4444", "#918DF6", "#F59E0B"][i % 4],
}))

const LAUNCH_STEPS = [
  "Opening your market...",
  "Preparing product catalog...",
  "Connecting payment system...",
  "Almost there!",
] as const

function PlanStep({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<string>("pro")
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoPhase, setPromoPhase] = useState<PromoPhase>("idle")
  const [launching, setLaunching] = useState(false)
  const [launchStep, setLaunchStep] = useState(0)
  const navigate = useNavigate()

  const promoApplied = promoPhase === "done"
  const isAnimating = promoPhase !== "idle" && promoPhase !== "done"

  function handleApply() {
    if (!promoCode.trim() || isAnimating) return
    setPromoPhase("rocket")
    setTimeout(() => setPromoPhase("explode"), 800)
    setTimeout(() => setPromoPhase("slash"), 1300)
    setTimeout(() => setPromoPhase("done"), 2400)
  }

  function getPrice(plan: (typeof PLANS)[number]) {
    if (promoPhase !== "slash" && promoPhase !== "done") return null
    if (plan.id === "pro") return "$20"
    return null
  }

  function handleLaunch() {
    if (!selected || launching) return
    setLaunching(true)
    setLaunchStep(0)
    setTimeout(() => setLaunchStep(1), 800)
    setTimeout(() => setLaunchStep(2), 1600)
    setTimeout(() => setLaunchStep(3), 2400)
    setTimeout(() => navigate("/dashboard"), 3400)
  }

  return (
    <motion.div
      key="plan"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease }}
      className="relative"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </button>

      <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
        Choose your plan
      </h2>
      <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
        You can always change this later
      </p>

      <motion.div
        className="-mx-4 mt-8 sm:-mx-16 lg:-mx-24"
        animate={
          promoPhase === "explode"
            ? { x: [0, -3, 3, -2, 2, -1, 1, 0] }
            : { x: 0 }
        }
        transition={
          promoPhase === "explode"
            ? { duration: 0.35, delay: 0.05 }
            : { duration: 0 }
        }
      >
        <div className="flex flex-col items-stretch gap-3 px-4 sm:flex-row sm:px-0">
          {PLANS.map((plan, i) => {
            const isSelected = selected === plan.id
            const isPro = plan.id === "pro"
            const isEnterprise = plan.id === "enterprise"
            const discountedPrice = getPrice(plan)
            const showEnterpriseBadge = (promoPhase === "slash" || promoPhase === "done") && isEnterprise
            return (
              <motion.button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  promoPhase === "slash"
                    ? { opacity: 1, y: 0, scale: [1, 1.02, 1] }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={
                  promoPhase === "slash"
                    ? { duration: 0.3, delay: 0.05 * i }
                    : { duration: 0.4, delay: 0.08 * i, ease }
                }
                className={`relative flex flex-1 flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                  isPro
                    ? isSelected
                      ? "border-[#918DF6] bg-[#181925] shadow-lg shadow-[#918DF6]/10"
                      : "border-[#181925]/20 bg-[#181925] shadow-lg shadow-black/8 hover:border-[#918DF6]/60"
                    : isSelected
                      ? "border-[#918DF6] bg-[#918DF6]/[0.03]"
                      : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.18)]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-[#918DF6] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                    {plan.badge}
                  </span>
                )}

                {showEnterpriseBadge && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.15 }}
                    className="absolute -top-2.5 right-5 rounded-full bg-[#22C55E] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase"
                  >
                    30% off
                  </motion.span>
                )}

                {isSelected && (
                  <span className="absolute top-5 right-5 flex size-5 items-center justify-center rounded-full bg-[#918DF6]">
                    <Check className="size-3 text-white" strokeWidth={3} />
                  </span>
                )}

                <span className={`text-[13px] font-semibold tracking-[-0.32px] ${isPro ? "text-white/70" : "text-[#999999]"}`}>
                  {plan.name}
                </span>

                <span className="mt-3 flex items-baseline gap-1.5">
                  <AnimatePresence mode="wait">
                    {discountedPrice ? (
                      <motion.span
                        key="discounted"
                        initial={{ opacity: 0, scale: 1.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="flex items-baseline gap-1.5"
                      >
                        <span className="text-[28px] font-bold tracking-[-0.5px] leading-none text-[#22C55E]">
                          {discountedPrice}
                        </span>
                        <span className={`text-sm tracking-[-0.32px] line-through ${isPro ? "text-white/30" : "text-[#999999]"}`}>
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className={`text-sm tracking-[-0.32px] ${isPro ? "text-white/40" : "text-[#999999]"}`}>
                            {plan.period}
                          </span>
                        )}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="original"
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-baseline gap-0.5"
                      >
                        <span className={`${plan.price === "Custom" ? "text-[22px]" : "text-[28px]"} font-bold tracking-[-0.5px] leading-none ${isPro ? "text-white" : "text-[#181925]"}`}>
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className={`text-sm tracking-[-0.32px] ${isPro ? "text-white/40" : "text-[#999999]"}`}>
                            {plan.period}
                          </span>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>

                <span className={`mt-1.5 text-[11px] tracking-[-0.2px] ${isPro ? "text-white/50" : "text-[#999999]"}`}>
                  {plan.desc}
                </span>

                <div className={`my-4 h-px ${isPro ? "bg-white/10" : "bg-black/6"}`} />

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-[12px] tracking-[-0.2px] ${isPro ? "text-white/70" : "text-[#666666]"}`}>
                      <span className={`mt-px flex size-4 shrink-0 items-center justify-center rounded-full ${isPro ? "bg-[#918DF6]/25" : "bg-[#918DF6]/10"}`}>
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5.5L4 7.5L8 3" stroke={isPro ? "#c4c2ff" : "#918DF6"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {promoPhase === "rocket" && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
            <motion.div
              initial={{ bottom: -10, left: "50%", x: "-50%", opacity: 1 }}
              animate={{ bottom: "100%", opacity: [1, 1, 0.8] }}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              className="absolute text-5xl"
              style={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.7))" }}
            >
              🚀
            </motion.div>
            {ROCKET_SPARKS.map((spark) => (
              <motion.div
                key={spark.id}
                initial={{ bottom: -10, left: "50%", x: spark.xOff, opacity: 0.9, scale: 1 }}
                animate={{ bottom: "100%", opacity: [0, 0.9, 0.6, 0], scale: [0.5, 1, 0.3] }}
                transition={{ duration: 0.75, delay: spark.delay, ease: [0.4, 0, 0.2, 1] }}
                className="absolute rounded-full"
                style={{
                  width: spark.size,
                  height: spark.size,
                  backgroundColor: spark.color,
                  filter: `blur(${spark.size > 3.5 ? 1 : 0}px)`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {promoPhase === "explode" && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
              <motion.div
                initial={{ opacity: 0.9, scale: 0 }}
                animate={{ opacity: [0.9, 0.4, 0], scale: [0, 3.5] }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="size-16 rounded-full border-2 border-[#F59E0B]"
                style={{ boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
              />
              <motion.div
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: [1, 0], scale: [0, 2] }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 m-auto size-8 rounded-full bg-white"
                style={{ filter: "blur(8px)" }}
              />
              {EXPLOSION_PARTICLES.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                  animate={{
                    x: p.x,
                    y: p.y,
                    opacity: [1, 1, 0],
                    scale: [0, p.scale, 0],
                    rotate: p.rotate,
                  }}
                  transition={{ duration: 0.7, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute left-1/2 top-1/2 size-2.5 ${p.shape}`}
                  style={{ backgroundColor: p.color }}
                />
              ))}
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {promoApplied ? (
            <motion.div
              key="promo-applied"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#22C55E]/8 py-2.5"
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-[#22C55E]">
                <Check className="size-2.5 text-white" strokeWidth={3} />
              </span>
              <span className="text-[13px] font-medium tracking-[-0.32px] text-[#22C55E]">
                {promoCode.toUpperCase()} applied — 30% off
              </span>
            </motion.div>
          ) : (
            <motion.div key="promo-input" layout>
              {!promoOpen ? (
                <motion.button
                  key="promo-toggle"
                  type="button"
                  onClick={() => setPromoOpen(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex w-full items-center justify-center gap-1.5 py-1 text-[13px] tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                >
                  <Tag className="size-3.5" />
                  Have a promo code?
                </motion.button>
              ) : (
                <motion.div
                  key="promo-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApply()}
                      placeholder="Enter code"
                      disabled={isAnimating}
                      className="h-9 flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleApply}
                      disabled={!promoCode.trim() || isAnimating}
                      className="h-9 rounded-lg bg-[#181925] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d] disabled:opacity-40"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        type="button"
        onClick={handleLaunch}
        disabled={!selected || launching}
        className="mt-5 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Start selling
      </Button>

      <AnimatePresence>
        {launching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D14]"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease }}
              className="absolute top-10 left-10 z-10 flex items-center gap-2"
            >
              <span className="relative flex size-6 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-white">Mont</span>
            </motion.div>

            <div className="relative z-10 flex flex-col items-center gap-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative size-16"
              >
                <svg viewBox="0 0 64 64" fill="none" className="size-full">
                  <circle cx="32" cy="32" r="28" stroke="#918DF6" strokeWidth="2" opacity="0.15" />
                  <motion.circle
                    cx="32" cy="32" r="28"
                    stroke="#918DF6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="176"
                    initial={{ strokeDashoffset: 176 }}
                    animate={{ strokeDashoffset: [176, 44, 176] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                  />
                </svg>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease }}
                  className="absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full bg-[#918DF6]/10"
                >
                  <span className="relative flex size-4 items-center justify-center">
                    <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                    <span className="absolute top-px right-px size-1.5 rounded-full bg-[#0D0D14]" />
                  </span>
                </motion.div>
              </motion.div>

              <div className="relative h-10 w-80 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={launchStep}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease }}
                    className="absolute inset-0 text-center text-xl font-medium tracking-[-0.32px] text-white/80"
                  >
                    {LAUNCH_STEPS[launchStep]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex gap-2">
                {LAUNCH_STEPS.map((_, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      width: i === launchStep ? 24 : 6,
                      backgroundColor: i <= launchStep ? "#918DF6" : "rgba(255,255,255,0.12)",
                    }}
                    transition={{ duration: 0.35, ease }}
                    className="h-1.5 rounded-full"
                  />
                ))}
              </div>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-[#918DF6]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.4, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Signup() {
  const [step, setStep] = useState<Step>("initial")
  const [email, setEmail] = useState("")

  return (
    <div className="flex min-h-svh bg-white">
      <BrandPanel />

      <div className="flex flex-1 flex-col">
        <MobileBrandHeader />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-[13px] leading-relaxed text-amber-700">
              Currently in test mode. No requests are sent to the server.
            </div>
            {step !== "initial" && <StepIndicator current={step} />}
            <AnimatePresence mode="wait">
              {step === "initial" ? (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 hidden lg:block"
                  >
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                    >
                      <ArrowLeft className="size-4" />
                      Back to home
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05, ease }}
                    className="mb-10 hidden lg:block"
                  >
                    <h1 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Create your account
                    </h1>
                    <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
                      Start selling digital products on autopilot
                    </p>
                  </motion.div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-sm font-medium tracking-[-0.32px] text-[#181925] transition-colors hover:bg-neutral-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#2AABEE] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#229ED9]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z"/>
                      </svg>
                      Continue with Telegram
                    </button>
                  </div>

                  <div className="my-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
                    <span className="text-sm tracking-[-0.32px] text-[#999999]">or</span>
                    <div className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (email.trim()) setStep("verify")
                    }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                    >
                      Continue with email
                    </Button>
                  </form>

                  <p className="mt-8 text-center text-sm tracking-[-0.32px] text-[#666666]">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-[#918DF6] transition-colors hover:text-[#9580FF]"
                    >
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              ) : step === "verify" ? (
                <VerificationCodeInput
                  email={email}
                  onBack={() => setStep("initial")}
                  onVerified={() => setStep("profile")}
                />
              ) : step === "profile" ? (
                <ProfileStep
                  onBack={() => setStep("verify")}
                  onContinue={() => setStep("store")}
                />
              ) : step === "store" ? (
                <StoreStep
                  onBack={() => setStep("profile")}
                  onContinue={() => setStep("plan")}
                />
              ) : (
                <PlanStep onBack={() => setStep("store")} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
