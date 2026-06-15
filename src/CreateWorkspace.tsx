import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  ChevronDown,
  Sparkles,
  Users,
  Crown,
  Rocket,
  Zap,
} from "lucide-react"

type Plan = "Free" | "Pro" | "Enterprise"
type Role = "Admin" | "Member" | "Viewer"
type Invite = { email: string; role: Role }

const presetColors = ["#918DF6", "#1A73E8", "#34A853", "#F59E0B", "#D93025", "#E91E63"]

const plans: { name: Plan; price: number; originalPrice: number; features: string[]; icon: typeof Crown; badge?: string; discount?: string; description: string }[] = [
  { name: "Free", price: 0, originalPrice: 0, features: ["1 platform", "100 orders/mo", "Email only", "Community support"], icon: Zap, description: "For side projects" },
  { name: "Pro", price: 29, originalPrice: 49, features: ["3 platforms", "Unlimited orders", "All channels", "Priority support"], icon: Sparkles, badge: "Most Popular", discount: "SAVE 40%", description: "For growing teams" },
  { name: "Enterprise", price: 99, originalPrice: 149, features: ["Unlimited platforms", "Unlimited orders", "All channels", "Dedicated support"], icon: Crown, discount: "SAVE 33%", description: "For scaling businesses" },
]

const stepLabels = ["Workspace", "Plan", "Team", "Done"]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {stepLabels.map((label, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors ${
                  isCompleted
                    ? "bg-[#34A853] text-white"
                    : isCurrent
                      ? "bg-[#918DF6] text-white"
                      : "bg-[rgba(0,0,0,0.06)] text-[#999999]"
                }`}
              >
                {isCompleted ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={`text-[12px] font-medium tracking-[-0.32px] ${
                  isCurrent ? "text-[#918DF6]" : isCompleted ? "text-[#34A853]" : "text-[#999999]"
                }`}
              >
                {label}
              </span>
            </div>
            {i < stepLabels.length - 1 && (
              <div
                className={`mx-4 mb-5 h-[2px] w-12 rounded-full transition-colors sm:w-20 ${
                  i < currentStep ? "bg-[#34A853]" : "bg-[rgba(0,0,0,0.08)]"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function RoleDropdown({ value, onChange }: { value: Role; onChange: (r: Role) => void }) {
  const [open, setOpen] = useState(false)
  const roles: Role[] = ["Admin", "Member", "Viewer"]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
      >
        {value}
        <ChevronDown className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-10 mt-1 w-28 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white py-1 shadow-lg">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { onChange(r); setOpen(false) }}
              className={`flex w-full items-center px-3 py-1.5 text-left text-[12px] font-medium tracking-[-0.32px] transition-colors hover:bg-[rgba(0,0,0,0.03)] ${
                r === value ? "text-[#918DF6]" : "text-[#666666]"
              }`}
            >
              {r}
              {r === value && <Check className="ml-auto size-3 text-[#918DF6]" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CreateWorkspace() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [wsName, setWsName] = useState("")
  const [wsColor, setWsColor] = useState("#918DF6")
  const [wsPlan, setWsPlan] = useState<Plan>("Free")
  const [invites, setInvites] = useState<Invite[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("Member")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const canNext =
    (currentStep === 0 && wsName.trim().length > 0) ||
    currentStep === 1 ||
    currentStep === 2

  const handleAddInvite = () => {
    const email = inviteEmail.trim()
    if (!email || invites.some((inv) => inv.email === email)) return
    setInvites((prev) => [...prev, { email, role: inviteRole }])
    setInviteEmail("")
    setInviteRole("Member")
  }

  const handleRemoveInvite = (email: string) => {
    setInvites((prev) => prev.filter((inv) => inv.email !== email))
  }

  const handleUpdateRole = (email: string, role: Role) => {
    setInvites((prev) => prev.map((inv) => (inv.email === email ? { ...inv, role } : inv)))
  }

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.08)] px-6 py-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
            Mont
          </span>
        </div>
        {currentStep < 3 && (
          <button
            type="button"
            onClick={() => void navigate("/dashboard")}
            className="text-[13px] font-medium tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
          >
            Cancel
          </button>
        )}
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-10 pb-12">
          <StepIndicator currentStep={currentStep} />

          <div className="relative mt-10 flex-1">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-[26px] font-bold tracking-[-0.32px] text-[#181925]">
                    Name your workspace
                  </h2>
                  <p className="mt-2 text-[15px] tracking-[-0.32px] text-[#666666]">
                    This is where your team manages orders, products, and channels.
                  </p>

                  <div className="mt-10 w-full max-w-sm">
                    <label htmlFor="ws-name" className="mb-2 block text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Workspace name
                    </label>
                    <input
                      id="ws-name"
                      type="text"
                      value={wsName}
                      onChange={(e) => setWsName(e.target.value)}
                      placeholder="e.g. Vexora Store"
                      autoFocus
                      className="h-11 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-4 text-[15px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none transition-colors focus:border-[#918DF6] focus:ring-2 focus:ring-[#918DF6]/20"
                    />

                    <div className="mt-6">
                      <label className="mb-3 block text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                        Color
                      </label>
                      <div className="flex items-center gap-3">
                        {presetColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setWsColor(color)}
                            className={`flex size-10 items-center justify-center rounded-full transition-all ${
                              wsColor === color ? "ring-2 ring-offset-2" : "hover:scale-110"
                            }`}
                            style={{ backgroundColor: color, ...(wsColor === color ? { outlineColor: color } : {}) }}
                          >
                            {wsColor === color && <Check className="size-4 text-white" strokeWidth={3} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {wsName.trim() && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-8 flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.08)] p-4"
                      >
                        <span
                          className="relative flex size-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: wsColor }}
                        >
                          <span className="absolute top-1 right-1 size-3.5 rounded-full bg-white" />
                        </span>
                        <div>
                          <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                            {wsName.trim()}
                          </p>
                          <p className="mt-0.5 text-[12px] tracking-[-0.32px] text-[#999999]">
                            Preview
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-[26px] font-bold tracking-[-0.32px] text-[#181925]">
                    Choose your plan
                  </h2>
                  <p className="mt-2 text-[15px] tracking-[-0.32px] text-[#666666]">
                    You can always change this later in settings.
                  </p>

                  <div className="mt-8 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      className={`rounded-full px-4 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-all ${
                        billingCycle === "monthly"
                          ? "bg-[#181925] text-white shadow-sm"
                          : "text-[#666666] hover:text-[#181925]"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("annual")}
                      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-all ${
                        billingCycle === "annual"
                          ? "bg-[#181925] text-white shadow-sm"
                          : "text-[#666666] hover:text-[#181925]"
                      }`}
                    >
                      Annual
                      <span className="rounded-full bg-[#34A853] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                        SAVE 20%
                      </span>
                    </button>
                  </div>

                  <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                    {plans.map((plan) => {
                      const isSelected = wsPlan === plan.name
                      const isPro = plan.name === "Pro"
                      const isEnterprise = plan.name === "Enterprise"
                      const Icon = plan.icon
                      const monthlyPrice = plan.price
                      const displayPrice = billingCycle === "annual" ? Math.round(monthlyPrice * 0.8) : monthlyPrice
                      const displayOriginal = billingCycle === "annual" ? Math.round(plan.originalPrice * 0.8) : plan.originalPrice
                      return (
                        <button
                          key={plan.name}
                          type="button"
                          onClick={() => setWsPlan(plan.name)}
                          className={`group relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 ${
                            isPro ? "sm:scale-[1.03] sm:z-10" : ""
                          } ${
                            isSelected
                              ? isPro
                                ? "border-[#918DF6] bg-[rgba(145,141,246,0.04)] shadow-[0_0_24px_rgba(145,141,246,0.15)]"
                                : "border-[#918DF6] bg-[rgba(145,141,246,0.03)]"
                              : isPro
                                ? "border-[#918DF6]/40 bg-white shadow-[0_0_16px_rgba(145,141,246,0.08)] hover:border-[#918DF6] hover:shadow-[0_0_24px_rgba(145,141,246,0.18)]"
                                : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.18)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                          } hover:-translate-y-0.5`}
                        >
                          {isPro && plan.badge && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#918DF6] px-3 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
                              {plan.badge}
                            </span>
                          )}

                          <div className="flex items-center gap-2">
                            <span className={`flex size-7 items-center justify-center rounded-lg ${
                              isPro ? "bg-[#918DF6]/10" : isEnterprise ? "bg-[#F59E0B]/10" : "bg-[rgba(0,0,0,0.04)]"
                            }`}>
                              <Icon className={`size-3.5 ${
                                isPro ? "text-[#918DF6]" : isEnterprise ? "text-[#F59E0B]" : "text-[#999999]"
                              }`} strokeWidth={2} />
                            </span>
                            <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                              {plan.name}
                            </p>
                            {isEnterprise && (
                              <Rocket className="size-3.5 text-[#F59E0B]" strokeWidth={2} />
                            )}
                          </div>

                          <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#999999]">
                            {plan.description}
                          </p>

                          <div className="mt-3 flex items-baseline gap-1.5">
                            {displayOriginal > 0 && displayOriginal !== displayPrice && (
                              <span className="text-[15px] font-medium tabular-nums tracking-[-0.32px] text-[#CCCCCC] line-through">
                                ${displayOriginal}
                              </span>
                            )}
                            <span className="text-[28px] font-bold tabular-nums tracking-[-0.5px] text-[#181925]">
                              ${displayPrice}
                            </span>
                            <span className="text-[13px] tracking-[-0.32px] text-[#999999]">/mo</span>
                            {plan.discount && displayPrice > 0 && (
                              <span className="ml-1 rounded-full bg-[#34A853]/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#34A853]">
                                {plan.discount}
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex flex-col gap-2">
                            {plan.features.map((f) => (
                              <div key={f} className="flex items-center gap-2">
                                <span className={`flex size-4 items-center justify-center rounded-full ${
                                  isPro ? "bg-[#918DF6]/10" : "bg-[#34A853]/10"
                                }`}>
                                  <Check className={`size-2.5 ${
                                    isPro ? "text-[#918DF6]" : "text-[#34A853]"
                                  }`} strokeWidth={3} />
                                </span>
                                <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{f}</span>
                              </div>
                            ))}
                          </div>

                          <div className={`mt-4 flex h-9 items-center justify-center rounded-lg text-[12px] font-semibold tracking-[-0.32px] transition-all ${
                            isSelected
                              ? "bg-[#918DF6] text-white"
                              : isPro
                                ? "bg-[#918DF6]/10 text-[#918DF6] group-hover:bg-[#918DF6]/15"
                                : "bg-[rgba(0,0,0,0.04)] text-[#666666] group-hover:bg-[rgba(0,0,0,0.06)]"
                          }`}>
                            {isSelected ? (
                              <span className="flex items-center gap-1.5">
                                <Check className="size-3.5" strokeWidth={2.5} />
                                Selected
                              </span>
                            ) : (
                              "Select plan"
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div className="mt-6 w-full">
                    {promoApplied ? (
                      <div className="flex items-center justify-between rounded-lg border border-[#34A853]/20 bg-[#34A853]/[0.04] px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                          <span className="text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">
                            Promo code applied
                          </span>
                          <span className="rounded-full bg-[#34A853]/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">
                            {promoCode.toUpperCase()}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setPromoApplied(false); setPromoCode("") }}
                          className="text-[12px] font-medium tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo code"
                          className="h-9 flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40"
                        />
                        <button
                          type="button"
                          onClick={() => { if (promoCode.trim()) setPromoApplied(true) }}
                          disabled={!promoCode.trim()}
                          className="flex h-9 shrink-0 items-center rounded-lg border border-[rgba(0,0,0,0.12)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center"
                >
                  <h2 className="text-[26px] font-bold tracking-[-0.32px] text-[#181925]">
                    Invite your team
                  </h2>
                  <p className="mt-2 text-[15px] tracking-[-0.32px] text-[#666666]">
                    Add team members by email. You can skip this and invite later.
                  </p>

                  <div className="mt-10 w-full max-w-md">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddInvite() } }}
                        placeholder="colleague@company.com"
                        className="h-10 flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3.5 text-[14px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none transition-colors focus:border-[#918DF6] focus:ring-2 focus:ring-[#918DF6]/20"
                      />
                      <RoleDropdown value={inviteRole} onChange={setInviteRole} />
                      <button
                        type="button"
                        onClick={handleAddInvite}
                        disabled={!inviteEmail.trim()}
                        className="flex h-10 items-center gap-1.5 rounded-lg bg-[#918DF6] px-3.5 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="size-4" strokeWidth={2} />
                        Add
                      </button>
                    </div>

                    {invites.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.01)]"
                      >
                        {invites.map((inv, i) => (
                          <div
                            key={inv.email}
                            className={`flex items-center gap-3 px-4 py-3 ${
                              i > 0 ? "border-t border-[rgba(0,0,0,0.06)]" : ""
                            }`}
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#918DF6]/10 text-[11px] font-semibold text-[#918DF6]">
                              {inv.email.charAt(0).toUpperCase()}
                            </div>
                            <p className="min-w-0 flex-1 truncate text-[14px] tracking-[-0.32px] text-[#181925]">
                              {inv.email}
                            </p>
                            <RoleDropdown value={inv.role} onChange={(r) => handleUpdateRole(inv.email, r)} />
                            <button
                              type="button"
                              onClick={() => handleRemoveInvite(inv.email)}
                              className="flex size-7 items-center justify-center rounded-md text-[#999999] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#666666]"
                            >
                              <X className="size-3.5" strokeWidth={2} />
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {invites.length === 0 && (
                      <div className="mt-8 flex flex-col items-center rounded-xl border border-dashed border-[rgba(0,0,0,0.12)] py-10">
                        <Users className="size-8 text-[#CCCCCC]" strokeWidth={1.5} />
                        <p className="mt-3 text-[14px] tracking-[-0.32px] text-[#999999]">
                          No invites yet
                        </p>
                        <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#CCCCCC]">
                          Add emails above or skip this step
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex flex-col items-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex size-16 items-center justify-center rounded-full bg-[#34A853]"
                  >
                    <Check className="size-8 text-white" strokeWidth={2.5} />
                  </motion.span>

                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="mt-6 text-[26px] font-bold tracking-[-0.32px] text-[#181925]"
                  >
                    You're all set!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    className="mt-2 text-[15px] tracking-[-0.32px] text-[#666666]"
                  >
                    Your workspace is ready to go.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                    className="mt-8 w-full max-w-sm rounded-xl border border-[rgba(0,0,0,0.08)] p-6"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="relative flex size-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: wsColor }}
                      >
                        <span className="absolute top-1 right-1 size-4 rounded-full bg-white" />
                      </span>
                      <div>
                        <p className="text-[16px] font-bold tracking-[-0.32px] text-[#181925]">
                          {wsName.trim()}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-[#918DF6]/10 px-2.5 py-0.5 text-[11px] font-semibold tracking-[-0.32px] text-[#918DF6]">
                            {wsPlan}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 h-px bg-[rgba(0,0,0,0.06)]" />

                    <div className="mt-4 flex items-center gap-2.5">
                      <Users className="size-4 text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[13px] tracking-[-0.32px] text-[#666666]">
                        {invites.length === 0
                          ? "No members invited"
                          : `${invites.length} member${invites.length > 1 ? "s" : ""} invited`}
                      </span>
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    type="button"
                    onClick={() => void navigate("/dashboard")}
                    className="mt-8 flex h-11 items-center gap-2 rounded-full bg-[#918DF6] px-8 text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                  >
                    Go to Dashboard
                    <ArrowRight className="size-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {currentStep < 3 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex h-10 items-center gap-2 rounded-full border border-[rgba(0,0,0,0.12)] px-5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] ${
                  currentStep === 0 ? "invisible" : ""
                }`}
              >
                <ArrowLeft className="size-4" />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canNext}
                className="flex h-10 items-center gap-2 rounded-full bg-[#918DF6] px-6 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {currentStep === 2 ? "Finish" : "Next"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
