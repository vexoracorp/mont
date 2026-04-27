import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Database,
  BarChart3,
  Settings,
  Menu,
  Check,
  Upload,
  Plug,
  FileSpreadsheet,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  ArrowLeft,
  ArrowRight,
  Rocket,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// ─── Nav Items (same as Dashboard) ──────────────────────────

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { label: "Products", icon: Package, href: "/dashboard/products" },
  { label: "Inventory", icon: Database, href: "/dashboard/inventory" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

// ─── Sidebar ────────────────────────────────────────────────

function SidebarContent() {
  const mainNav = navItems.slice(0, 4)
  const secondaryNav = navItems.slice(4)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.08)] px-5 pt-6 pb-5">
        <span className="relative flex size-7 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
          <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-[#F5F5F6]" />
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
          Mont
        </span>
      </div>

      <nav className="flex flex-1 flex-col px-3 pt-4">
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.href}
                className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
              >
                <Icon className="size-[18px]" strokeWidth={1.8} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="mx-3 my-3 h-px bg-[rgba(0,0,0,0.08)]" />

        <div className="flex flex-col gap-0.5">
          {secondaryNav.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.href}
                className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
              >
                <Icon className="size-[18px]" strokeWidth={1.8} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-[rgba(0,0,0,0.08)] px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#918DF6]/10 text-[11px] font-semibold text-[#918DF6]">
            YC
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
              Yuchan
            </p>
            <p className="truncate text-[11px] tracking-[-0.32px] text-[#999999]">
              yuchan@vexora.team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step Data ──────────────────────────────────────────────

const steps = [
  { label: "Marketplace", number: 1 },
  { label: "Provider", number: 2 },
  { label: "Delivery", number: 3 },
]

const platforms = [
  { id: "telegram-bot", name: "Telegram Bot", description: "Sell directly through your own Telegram bot", badge: "T", badgeBg: "#2AABEE", tier: "free" as const },
  { id: "mont-website", name: "Mont Website", description: "Auto-generated storefront hosted by Mont", badge: "M", badgeBg: "#918DF6", tier: "free" as const },
  { id: "naver", name: "Naver Store", description: "Korea's largest e-commerce platform", badge: "N", badgeBg: "#03C75A", tier: "pro" as const },
  { id: "g2g", name: "G2G", description: "Global digital goods marketplace", badge: "G2G", badgeBg: "#E87A2A", tier: "pro" as const },
  { id: "g2a", name: "G2A", description: "Game keys & software marketplace", badge: "G2A", badgeBg: "#F05A23", tier: "pro" as const },
  { id: "coupang", name: "Coupang", description: "Korea's rocket delivery platform", badge: "C", badgeBg: "#D93025", tier: "pro" as const },
]

const providers = [
  { id: "manual", name: "Manual Upload", description: "Upload product keys and codes manually through the dashboard", icon: Upload },
  { id: "api", name: "API Integration", description: "Connect your supplier API for automatic inventory sync", icon: Plug },
  { id: "csv", name: "CSV Import", description: "Bulk import products from spreadsheet files", icon: FileSpreadsheet },
]

const deliveryMethods = [
  { id: "email", name: "Email", icon: Mail },
  { id: "telegram", name: "Telegram", icon: Send },
  { id: "whatsapp", name: "WhatsApp", icon: MessageSquare },
  { id: "sms", name: "SMS", icon: Smartphone },
  { id: "inapp", name: "In-app", icon: Package },
]

// ─── Onboarding ─────────────────────────────────────────────

export default function Onboarding() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [connectedPlatforms, setConnectedPlatforms] = useState<Set<string>>(new Set())
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<Set<string>>(new Set())
  const [upgradeDialog, setUpgradeDialog] = useState<string | null>(null)
  const [telegramDialog, setTelegramDialog] = useState(false)
  const [telegramPhase, setTelegramPhase] = useState<"loading" | "form" | "connecting" | "done">("loading")
  const [botName, setBotName] = useState("")
  const [botStoreName, setBotStoreName] = useState("")
  const [botToken, setBotToken] = useState("")
  const [websiteDialog, setWebsiteDialog] = useState(false)
  const [websitePhase, setWebsitePhase] = useState<"loading" | "form" | "connecting" | "done">("loading")
  const [siteStoreName, setSiteStoreName] = useState("")
  const [siteSlug, setSiteSlug] = useState("")

  const openTelegramSetup = () => {
    setTelegramDialog(true)
    setTelegramPhase("loading")
    setTimeout(() => setTelegramPhase("form"), 1800)
  }

  const openWebsiteSetup = () => {
    setWebsiteDialog(true)
    setWebsitePhase("loading")
    setTimeout(() => setWebsitePhase("form"), 1500)
  }

  const completeWebsiteSetup = () => {
    setWebsitePhase("connecting")
    setTimeout(() => {
      setWebsitePhase("done")
      setTimeout(() => {
        setWebsiteDialog(false)
        setConnectedPlatforms((prev) => new Set(prev).add("mont-website"))
        setSiteStoreName("")
        setSiteSlug("")
      }, 1200)
    }, 2000)
  }

  const completeTelegramSetup = () => {
    setTelegramPhase("connecting")
    setTimeout(() => {
      setTelegramPhase("done")
      setTimeout(() => {
        setTelegramDialog(false)
        setConnectedPlatforms((prev) => new Set(prev).add("telegram-bot"))
        setBotName("")
        setBotStoreName("")
        setBotToken("")
      }, 1200)
    }, 2000)
  }

  const togglePlatform = (id: string) => {
    const platform = platforms.find((p) => p.id === id)
    if (platform?.tier === "pro") {
      setUpgradeDialog(platform.name)
      return
    }
    if (id === "telegram-bot") {
      openTelegramSetup()
      return
    }
    if (id === "mont-website") {
      openWebsiteSetup()
      return
    }
    setConnectedPlatforms((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleDelivery = (id: string) => {
    setSelectedDelivery((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const canContinue =
    (currentStep === 0 && connectedPlatforms.size > 0) ||
    (currentStep === 1 && selectedProvider !== null) ||
    (currentStep === 2 && selectedDelivery.size > 0)

  return (
    <div className="flex h-svh bg-[#F7F7F8]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[240px] shrink-0 border-r border-[rgba(0,0,0,0.08)] bg-[#F5F5F6] lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] bg-[#F5F5F6] p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header
          className="flex shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-[#F7F7F8]/80 px-6 py-3 backdrop-blur-sm lg:px-8"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
            </Sheet>
            <h1 className="text-[20px] font-bold tracking-[-0.32px] text-[#181925]">
              Setup
            </h1>
          </div>
          <Link
            to="/dashboard"
            className="text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:text-[#181925]"
          >
            Skip for now
          </Link>
        </header>

        {/* Onboarding Body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col px-6 pt-8 pb-12">
            {/* Step Progress */}
            <div className="mb-10 flex items-center justify-center gap-0">
              {steps.map((step, i) => {
                const isCompleted = i < currentStep
                const isCurrent = i === currentStep
                return (
                  <div key={step.number} className="flex items-center">
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
                        {isCompleted ? <Check className="size-4" strokeWidth={2.5} /> : step.number}
                      </div>
                      <span
                        className={`text-[12px] font-medium tracking-[-0.32px] ${
                          isCurrent ? "text-[#918DF6]" : isCompleted ? "text-[#34A853]" : "text-[#999999]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`mx-4 mb-5 h-[2px] w-16 rounded-full transition-colors sm:w-24 ${
                          i < currentStep ? "bg-[#34A853]" : "bg-[rgba(0,0,0,0.08)]"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Step Content */}
            <div className="relative flex-1">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <h2 className="text-[22px] font-bold tracking-[-0.32px] text-[#181925]">
                      Connect your marketplace
                    </h2>
                    <p className="mt-1.5 text-[14px] tracking-[-0.32px] text-[#666666]">
                      Choose the platforms where you sell digital products.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {platforms.map((p) => {
                        const connected = connectedPlatforms.has(p.id)
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => togglePlatform(p.id)}
                            className={`group flex flex-col rounded-xl border p-4 text-left transition-all ${
                              connected
                                ? "border-[#34A853]/40 bg-[#34A853]/[0.04]"
                                : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.16)]"
                            }`}
                            style={{ boxShadow: connected ? "none" : "0 1px 1px rgba(0,0,0,0.06)" }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span
                                  className="flex size-8 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                                  style={{ backgroundColor: p.badgeBg }}
                                >
                                  {p.badge}
                                </span>
                                <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                                  {p.name}
                                </span>
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                                  p.tier === "free"
                                    ? "bg-[#34A853]/10 text-[#34A853]"
                                    : "bg-[#918DF6]/10 text-[#918DF6]"
                                }`}>
                                  {p.tier === "free" ? "Free" : "Pro"}
                                </span>
                              </div>
                              {connected && (
                                <span className="flex size-6 items-center justify-center rounded-full bg-[#34A853]">
                                  <Check className="size-3.5 text-white" strokeWidth={2.5} />
                                </span>
                              )}
                            </div>
                            <p className="mt-2 text-[13px] tracking-[-0.32px] text-[#666666]">
                              {p.description}
                            </p>
                            <div className="mt-3">
                              <span
                                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                                  connected
                                    ? "bg-[#34A853]/10 text-[#34A853]"
                                    : "bg-[rgba(0,0,0,0.04)] text-[#666666] group-hover:bg-[#918DF6]/10 group-hover:text-[#918DF6]"
                                }`}
                              >
                                {connected ? "Connected" : "Connect"}
                              </span>
                            </div>
                          </button>
                        )
                      })}
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
                  >
                    <h2 className="text-[22px] font-bold tracking-[-0.32px] text-[#181925]">
                      Set up product provider
                    </h2>
                    <p className="mt-1.5 text-[14px] tracking-[-0.32px] text-[#666666]">
                      How do you want to add products to your inventory?
                    </p>

                    <div className="mt-6 flex flex-col gap-3">
                      {providers.map((p) => {
                        const selected = selectedProvider === p.id
                        const Icon = p.icon
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProvider(p.id)}
                            className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
                              selected
                                ? "border-[#918DF6]/40 bg-[#918DF6]/[0.04]"
                                : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.16)]"
                            }`}
                            style={{ boxShadow: selected ? "none" : "0 1px 1px rgba(0,0,0,0.06)" }}
                          >
                            <div
                              className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                selected ? "bg-[#918DF6]/10" : "bg-[rgba(0,0,0,0.04)]"
                              }`}
                            >
                              <Icon
                                className={`size-5 ${selected ? "text-[#918DF6]" : "text-[#666666]"}`}
                                strokeWidth={1.8}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                                {p.name}
                              </p>
                              <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#666666]">
                                {p.description}
                              </p>
                            </div>
                            <div
                              className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                selected
                                  ? "border-[#918DF6] bg-[#918DF6]"
                                  : "border-[rgba(0,0,0,0.16)] bg-white"
                              }`}
                            >
                              {selected && <Check className="size-3 text-white" strokeWidth={3} />}
                            </div>
                          </button>
                        )
                      })}
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
                  >
                    <h2 className="text-[22px] font-bold tracking-[-0.32px] text-[#181925]">
                      Choose delivery methods
                    </h2>
                    <p className="mt-1.5 text-[14px] tracking-[-0.32px] text-[#666666]">
                      How should keys be delivered to your customers? Select all that apply.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {deliveryMethods.map((d) => {
                        const selected = selectedDelivery.has(d.id)
                        const Icon = d.icon
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => toggleDelivery(d.id)}
                            className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition-all ${
                              selected
                                ? "border-[#918DF6]/40 bg-[#918DF6]/[0.04]"
                                : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.16)]"
                            }`}
                            style={{ boxShadow: selected ? "none" : "0 1px 1px rgba(0,0,0,0.06)" }}
                          >
                            <div
                              className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                                selected ? "bg-[#918DF6]/10" : "bg-[rgba(0,0,0,0.04)]"
                              }`}
                            >
                              <Icon
                                className={`size-5 ${selected ? "text-[#918DF6]" : "text-[#666666]"}`}
                                strokeWidth={1.8}
                              />
                            </div>
                            <span
                              className={`text-[14px] font-medium tracking-[-0.32px] ${
                                selected ? "text-[#918DF6]" : "text-[#181925]"
                              }`}
                            >
                              {d.name}
                            </span>
                            <div
                              className={`flex size-5 items-center justify-center rounded border-2 transition-colors ${
                                selected
                                  ? "border-[#918DF6] bg-[#918DF6]"
                                  : "border-[rgba(0,0,0,0.16)] bg-white"
                              }`}
                            >
                              {selected && <Check className="size-3 text-white" strokeWidth={3} />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 0}
                className="gap-2 text-[14px] font-medium tracking-[-0.32px] text-[#666666] disabled:opacity-0"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>

              {currentStep < 2 ? (
                <Button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="gap-2 rounded-full bg-[#918DF6] px-6 text-[14px] font-medium text-white hover:bg-[#7D79E8] disabled:opacity-40"
                >
                  Continue
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => void navigate("/dashboard")}
                  disabled={!canContinue}
                  className="gap-2 rounded-full bg-[#918DF6] px-6 text-[14px] font-medium text-white hover:bg-[#7D79E8] disabled:opacity-40"
                >
                  <Rocket className="size-4" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={telegramDialog} onOpenChange={(open) => { if (!open) setTelegramDialog(false) }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <AnimatePresence mode="wait">
            {telegramPhase === "loading" ? (
              <motion.div
                key="tg-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center py-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="flex size-12 items-center justify-center rounded-full border-2 border-[#2AABEE]/20 border-t-[#2AABEE]"
                />
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-5 text-[15px] font-medium tracking-[-0.32px] text-[#181925]"
                >
                  Opening Mont MiniApp...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="mt-1.5 text-[13px] tracking-[-0.32px] text-[#999999]"
                >
                  Connecting to Telegram
                </motion.p>
              </motion.div>
            ) : telegramPhase === "connecting" ? (
              <motion.div
                key="tg-connecting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center py-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex size-12 items-center justify-center rounded-full border-2 border-[#2AABEE]/20 border-t-[#2AABEE]"
                />
                <p className="mt-5 text-[15px] font-medium tracking-[-0.32px] text-[#181925]">
                  Connecting your bot...
                </p>
                <p className="mt-1.5 text-[13px] tracking-[-0.32px] text-[#999999]">
                  Verifying token with Telegram
                </p>
              </motion.div>
            ) : telegramPhase === "done" ? (
              <motion.div
                key="tg-done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center py-10"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex size-14 items-center justify-center rounded-full bg-[#34A853]"
                >
                  <Check className="size-7 text-white" strokeWidth={2.5} />
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-5 text-[16px] font-semibold tracking-[-0.32px] text-[#181925]"
                >
                  Bot connected!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="mt-1.5 text-[13px] tracking-[-0.32px] text-[#999999]"
                >
                  Your Telegram bot is ready to sell
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="tg-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#2AABEE] text-[10px] font-bold text-white">T</span>
                    Telegram Bot Setup
                  </DialogTitle>
                  <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                    Configure your Telegram bot to start selling through chat.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="bot-name" className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Bot name
                    </label>
                    <input
                      id="bot-name"
                      type="text"
                      value={botName}
                      onChange={(e) => setBotName(e.target.value)}
                      placeholder="e.g. MyStoreBot"
                      className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-3.5 text-[14px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#2AABEE] focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="bot-store" className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Store display name
                    </label>
                    <input
                      id="bot-store"
                      type="text"
                      value={botStoreName}
                      onChange={(e) => setBotStoreName(e.target.value)}
                      placeholder="e.g. Mont Digital Store"
                      className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-3.5 text-[14px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#2AABEE] focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="bot-token" className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                      BotFather token
                    </label>
                    <input
                      id="bot-token"
                      type="text"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder="Paste token from @BotFather"
                      className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-3.5 font-mono text-[13px] tracking-[-0.32px] text-[#181925] placeholder:font-sans placeholder:text-[#999999] transition-colors focus:border-[#2AABEE] focus:outline-none focus:ring-2 focus:ring-[#2AABEE]/20"
                    />
                    <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                      Open <span className="font-medium text-[#2AABEE]">@BotFather</span> on Telegram → /newbot → copy the token
                    </p>
                  </div>

                  <Button
                    onClick={completeTelegramSetup}
                    disabled={!botName.trim() || !botStoreName.trim() || !botToken.trim()}
                    className="mt-1 h-10 w-full rounded-full bg-[#2AABEE] text-[14px] font-medium text-white hover:bg-[#229ED9] disabled:opacity-40"
                  >
                    Connect Bot
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Dialog open={websiteDialog} onOpenChange={(open) => { if (!open) setWebsiteDialog(false) }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <AnimatePresence mode="wait">
            {websitePhase === "loading" ? (
              <motion.div
                key="ws-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center py-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="flex size-12 items-center justify-center rounded-full border-2 border-[#918DF6]/20 border-t-[#918DF6]"
                />
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-5 text-[15px] font-medium tracking-[-0.32px] text-[#181925]"
                >
                  Preparing your storefront...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  className="mt-1.5 text-[13px] tracking-[-0.32px] text-[#999999]"
                >
                  Setting up mont.shop
                </motion.p>
              </motion.div>
            ) : websitePhase === "form" ? (
              <motion.div
                key="ws-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-[#918DF6] text-[10px] font-bold text-white">M</span>
                    Mont Website Setup
                  </DialogTitle>
                  <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                    Create your storefront on mont.shop
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="site-store" className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Store name
                    </label>
                    <input
                      id="site-store"
                      type="text"
                      value={siteStoreName}
                      onChange={(e) => {
                        setSiteStoreName(e.target.value)
                        setSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
                      }}
                      placeholder="e.g. BVE Market"
                      className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-3.5 text-[14px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="site-slug" className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Store URL
                    </label>
                    <div className="flex items-center overflow-hidden rounded-xl border border-[rgba(0,0,0,0.12)] transition-colors focus-within:border-[#918DF6] focus-within:ring-2 focus-within:ring-[#918DF6]/20">
                      <span className="shrink-0 bg-[rgba(0,0,0,0.03)] px-3.5 py-2.5 text-[13px] font-medium tracking-[-0.32px] text-[#999999]">
                        mont.shop/
                      </span>
                      <input
                        id="site-slug"
                        type="text"
                        value={siteSlug}
                        onChange={(e) => setSiteSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="your-store"
                        className="h-10 w-full bg-white px-2 text-[14px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                      />
                    </div>
                    {siteSlug && (
                      <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                        Your store will be at <span className="font-medium text-[#918DF6]">mont.shop/{siteSlug}</span>
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={completeWebsiteSetup}
                    disabled={!siteStoreName.trim() || !siteSlug.trim()}
                    className="mt-1 h-10 w-full rounded-full bg-[#918DF6] text-[14px] font-medium text-white hover:bg-[#7D79E8] disabled:opacity-40"
                  >
                    Create Storefront
                  </Button>
                </div>
              </motion.div>
            ) : websitePhase === "connecting" ? (
              <motion.div
                key="ws-connecting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center py-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="flex size-12 items-center justify-center rounded-full border-2 border-[#918DF6]/20 border-t-[#918DF6]"
                />
                <p className="mt-5 text-[15px] font-medium tracking-[-0.32px] text-[#181925]">
                  Creating your storefront...
                </p>
                <p className="mt-1.5 text-[13px] tracking-[-0.32px] text-[#999999]">
                  Deploying to mont.shop/{siteSlug}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ws-done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center py-10"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex size-14 items-center justify-center rounded-full bg-[#34A853]"
                >
                  <Check className="size-7 text-white" strokeWidth={2.5} />
                </motion.span>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-5 text-[16px] font-semibold tracking-[-0.32px] text-[#181925]"
                >
                  Storefront is live!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="mt-1.5 text-[13px] tracking-[-0.32px] text-[#918DF6]"
                >
                  mont.shop/{siteSlug}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Dialog open={upgradeDialog !== null} onOpenChange={(open) => { if (!open) setUpgradeDialog(null) }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
              {upgradeDialog} requires a Pro plan. Upgrade to connect external marketplaces and unlock unlimited orders.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-3">
            <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#918DF6]/[0.04] p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">Pro Plan</span>
                <span className="flex items-baseline gap-0.5">
                  <span className="text-[22px] font-bold tracking-[-0.5px] text-[#181925]">$29</span>
                  <span className="text-[13px] tracking-[-0.32px] text-[#999999]">/mo</span>
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {["Unlimited orders", "All marketplace platforms", "All delivery channels", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] tracking-[-0.32px] text-[#666666]">
                    <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#918DF6]/10">
                      <Check className="size-2.5 text-[#918DF6]" strokeWidth={2.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => setUpgradeDialog(null)}
              className="h-10 w-full rounded-full bg-[#918DF6] text-[14px] font-medium text-white hover:bg-[#7D79E8]"
            >
              Upgrade to Pro
            </Button>
            <button
              type="button"
              onClick={() => setUpgradeDialog(null)}
              className="text-[13px] tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
            >
              Maybe later
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
