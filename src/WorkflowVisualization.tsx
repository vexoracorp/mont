import { useRef, useEffect, useState } from "react"
import { motion, useInView, AnimatePresence } from "motion/react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const whatsappMessages = [
  { sender: "Customer", text: "Hi, I need 2x Steam Wallet $50", time: "2:34 PM", outgoing: false },
  { sender: "You", text: "New order received! Processing now...", time: "2:34 PM", outgoing: true },
  { sender: "Customer", text: "Payment sent, please check", time: "2:35 PM", outgoing: false },
]

const telegramMessages = [
  { user: "@gamekeys_bot", text: "Order #4821 — Xbox Game Pass 3M", time: "14:36" },
  { user: "@gamekeys_bot", text: "Order #4822 — PS Plus 12 Month", time: "14:37" },
]

const platformNotifications: { platform: "naver" | "g2g" | "g2a" | "web"; label: string; text: string; sub: string; time: string }[] = [
  { platform: "naver", label: "N", text: "Naver Store", sub: "3 new orders — Google Play $50 x3", time: "2m ago" },
  { platform: "g2g", label: "G2G", text: "G2G Marketplace", sub: "Windows 11 Pro Key — $24.99", time: "4m ago" },
  { platform: "g2a", label: "G2A", text: "G2A Order", sub: "Spotify Premium 6M — $14.90", time: "5m ago" },
  { platform: "web", label: "W", text: "Website Webhook", sub: "Adobe Creative Cloud — $52.00", time: "6m ago" },
]

const processingSteps = [
  "Matching inventory...",
  "Key verified \u2713",
  "Delivering to buyer...",
  "Order complete \u2713",
  "Syncing stock levels...",
  "Checking duplicates...",
]

/* ------------------------------------------------------------------ */
/*  Animated flow line (SVG with moving dots)                          */
/* ------------------------------------------------------------------ */

function FlowLine({ direction = "right" }: { direction?: "right" | "left" }) {
  return (
    <div className="hidden items-center lg:flex" style={{ width: 64 }}>
      <svg width="64" height="32" viewBox="0 0 64 32" fill="none" className="overflow-visible">
        <line x1="0" y1="16" x2="64" y2="16" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
        {[0, 1, 2].map((i) => (
          <circle key={i} r="2.5" fill="#918DF6" opacity="0.7">
            <animate
              attributeName="cx"
              from={direction === "right" ? "-4" : "68"}
              to={direction === "right" ? "68" : "-4"}
              dur="2.4s"
              begin={`${i * 0.8}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values="16;16"
              dur="2.4s"
              begin={`${i * 0.8}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.8;0.8;0"
              dur="2.4s"
              begin={`${i * 0.8}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  WhatsApp bubble                                                    */
/* ------------------------------------------------------------------ */

function WhatsAppBubble({ sender, text, time, outgoing, index }: {
  sender: string; text: string; time: string; outgoing: boolean; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex items-end gap-1.5 ${outgoing ? "justify-end" : ""}`}
      style={{ marginTop: index > 0 ? -2 : 0 }}
    >
      {!outgoing && (
        <span className="mb-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-[10px] font-bold text-white">W</span>
      )}
      <div
        className="relative max-w-[260px] px-3 py-2"
        style={{
          backgroundColor: outgoing ? "#DCF8C6" : "#FFFFFF",
          borderRadius: outgoing ? "10px 10px 3px 10px" : "10px 10px 10px 3px",
          borderLeft: outgoing ? "none" : "2px solid #25D366",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        {!outgoing && (
          <span className="block text-[10px] font-semibold text-[#25D366]">{sender}</span>
        )}
        <p className="text-[12px] leading-[1.4] tracking-[-0.32px] text-[#181925]">{text}</p>
        <span className="mt-0.5 block text-right text-[10px] text-[#999999]">{time}</span>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Telegram bubble                                                    */
/* ------------------------------------------------------------------ */

function TelegramBubble({ user, text, time, index }: {
  user: string; text: string; time: string; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, y: 8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.35 + index * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-end gap-1.5"
      style={{ marginTop: index > 0 ? -2 : 0 }}
    >
      <span className="mb-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2AABEE] text-[10px] font-bold text-white">T</span>
      <div
        className="max-w-[260px] px-3 py-2"
        style={{
          backgroundColor: "#E3F2FD",
          borderRadius: "10px 10px 10px 3px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      >
        <span className="block text-[10px] font-semibold text-[#2AABEE]">{user}</span>
        <p className="text-[12px] leading-[1.4] tracking-[-0.32px] text-[#181925]">{text}</p>
        <span className="mt-0.5 block text-right text-[10px] text-[#999999]">{time}</span>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Platform notification toast                                        */
/* ------------------------------------------------------------------ */

function PlatformToast({ platform, label, text, sub, time, index }: {
  platform: "naver" | "g2g" | "g2a" | "web"; label: string; text: string; sub: string; time: string; index: number
}) {
  const colors: Record<string, { accent: string; bg: string }> = {
    naver: { accent: "#03C75A", bg: "rgba(3,199,90,0.06)" },
    g2g: { accent: "#E87A2A", bg: "rgba(232,122,42,0.06)" },
    g2a: { accent: "#F05A23", bg: "rgba(240,90,35,0.06)" },
    web: { accent: "#181925", bg: "rgba(24,25,37,0.04)" },
  }
  const c = colors[platform]
  const widths = [280, 300, 290, 275]

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.55 + index * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex items-center gap-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2"
      style={{ backgroundColor: c.bg, maxWidth: widths[index] ?? 290 }}
    >
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
        style={{ backgroundColor: c.accent }}
      >
        {label}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <span className="truncate text-[11px] font-medium tracking-[-0.32px] text-[#181925]">{text}</span>
          <span className="shrink-0 text-[10px] text-[#999999]">{time}</span>
        </div>
        <p className="truncate text-[10px] tracking-[-0.32px] text-[#666666]">{sub}</p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Center hub with progress ring + live feed                          */
/* ------------------------------------------------------------------ */

function MontHub() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % processingSteps.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col items-center gap-3 rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white px-6 py-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)", minWidth: 240 }}
    >
      {/* Logo with animated progress ring */}
      <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" className="absolute inset-0">
          <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5" />
          <circle
            cx="36" cy="36" r="32"
            fill="none"
            stroke="#918DF6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="201"
            strokeDashoffset="50"
            style={{ transformOrigin: "center" }}
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 36 36"
              to="360 36 36"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div className="relative flex size-12 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
          <span className="absolute top-1 right-1 size-4 rounded-full bg-white" />
        </div>
      </div>

      <div className="text-center">
        <p className="text-base font-semibold tracking-[-0.32px] text-[#181925]">Mont</p>
        <p className="text-xs tracking-[-0.32px] text-[#999999]">Processing engine</p>
      </div>

      {/* Live activity feed */}
      <div className="relative h-5 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-x-0 flex items-center justify-center gap-1.5"
          >
            <span className="inline-block size-2 shrink-0 animate-pulse rounded-full bg-[#33C758]" />
            <span className="text-xs tracking-[-0.32px] text-[#666666]">{processingSteps[stepIndex]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {["Auto-match", "Verify", "Deliver"].map((badge, i) => (
          <motion.span
            key={badge}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              opacity: { delay: 0.8 + i * 0.1, duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            className="rounded-full border border-[rgba(0,0,0,0.08)] bg-neutral-50 px-2.5 py-1 text-[10px] font-medium tracking-[-0.32px] text-[#666666]"
          >
            {badge}
          </motion.span>
        ))}
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-2xl font-semibold tracking-tight text-[#181925]"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          1,847
        </span>
        <span className="text-xs tracking-[-0.32px] text-[#666666]">orders today</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight text-[#33C758]" style={{ fontVariantNumeric: "tabular-nums" }}>98.7%</p>
          <p className="text-[10px] tracking-[-0.32px] text-[#999999]">Success rate</p>
        </div>
        <div className="h-6 w-px bg-[rgba(0,0,0,0.08)]" />
        <div className="text-center">
          <p className="text-lg font-semibold tracking-tight text-[#2C78FC]" style={{ fontVariantNumeric: "tabular-nums" }}>&lt; 3s</p>
          <p className="text-[10px] tracking-[-0.32px] text-[#999999]">Avg. delivery</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Delivery cards (right column)                                      */
/* ------------------------------------------------------------------ */

function EmailCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-[#2C78FC]/10 text-[#2C78FC]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </span>
          <span className="text-xs font-medium tracking-[-0.32px] text-[#181925]">Email Delivered</span>
        </div>
        <span className="text-xs text-[#33C758]">&#10003;</span>
      </div>
      <div className="mt-2 rounded-lg border border-[rgba(0,0,0,0.06)] bg-neutral-50 px-3 py-2">
        <p className="text-[10px] text-[#999999]">From: Mont Delivery</p>
        <p className="text-xs font-medium tracking-[-0.32px] text-[#181925]">Your order is ready</p>
        <div className="mt-1.5 rounded-md border border-dashed border-[rgba(0,0,0,0.12)] bg-white px-2 py-1.5 text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-[#181925]">X4K9R-M2NP7-Q8WL3</span>
        </div>
      </div>
    </motion.div>
  )
}

function TelegramBotCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-[#2AABEE]/10 text-[10px] font-bold text-[#2AABEE]">T</span>
          <span className="text-xs font-medium tracking-[-0.32px] text-[#181925]">Telegram Bot</span>
        </div>
        <span className="text-xs text-[#33C758]">&#10003;</span>
      </div>
      <div className="mt-2 rounded-lg bg-[#E3F2FD] px-3 py-2">
        <p className="text-[10px] tracking-[-0.32px] text-[#181925]">Your key has been delivered!</p>
        <p className="mt-0.5 font-mono text-xs text-[#666666]">X4K9R-M2NP7-Q8WL3</p>
        <div className="mt-2 rounded-md bg-[#2AABEE] px-3 py-1.5 text-center">
          <span className="text-xs font-medium text-white">View Order</span>
        </div>
      </div>
    </motion.div>
  )
}

function SmsCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-[#33C758]/10 text-[#33C758]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          <span className="text-xs font-medium tracking-[-0.32px] text-[#181925]">SMS Notification</span>
        </div>
        <span className="text-xs text-[#33C758]">&#10003;</span>
      </div>
      <div className="mt-2 flex items-start gap-2 rounded-lg border border-[rgba(0,0,0,0.06)] bg-neutral-50 px-3 py-2">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-[#999999]">Mont</p>
          <p className="text-[10px] tracking-[-0.32px] text-[#181925]">Your digital key has been sent. Check your email for details. Order #4821</p>
        </div>
      </div>
    </motion.div>
  )
}

function DataSyncCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-[#918DF6]/10 text-[#918DF6]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="m8 8 4-5 4 5"/><path d="m8 16 4 5 4-5"/></svg>
          </span>
          <span className="text-xs font-medium tracking-[-0.32px] text-[#181925]">CRM Synced</span>
        </div>
        <span className="text-xs text-[#33C758]">&#10003;</span>
      </div>
      <p className="mt-1.5 text-[10px] tracking-[-0.32px] text-[#666666]">buyer@gmail.com saved to customer database</p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function WorkflowVisualization() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section ref={sectionRef} className="w-full max-w-[90rem] px-4">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h2 className="text-3xl font-medium tracking-[-1.8px] text-[#181925] sm:text-4xl">
          How Mont works
        </h2>
        <p className="mt-2 text-base tracking-[-0.32px] text-[#666666]">
          From order chaos to instant delivery
        </p>
      </motion.div>

      {/* 3-column layout */}
      {isInView && (
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_auto_auto_1fr] lg:gap-0">

          {/* ── LEFT: Order Channels ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 pb-1.5">
              <span className="size-2 rounded-full bg-[#FF2F00]/60" />
              <span className="text-sm font-medium tracking-[-0.32px] text-[#666666]">Order Channels</span>
            </div>

            <div className="flex flex-col gap-1">
              {whatsappMessages.map((msg, i) => (
                <WhatsAppBubble key={i} {...msg} index={i} />
              ))}
            </div>

            <div className="flex flex-col gap-1">
              {telegramMessages.map((msg, i) => (
                <TelegramBubble key={i} {...msg} index={i} />
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              {platformNotifications.map((n, i) => (
                <PlatformToast key={n.platform} {...n} index={i} />
              ))}
            </div>
          </div>

          {/* Arrow left -> center */}
          <FlowLine direction="right" />

          {/* ── CENTER: Mont Hub ── */}
          <div className="flex items-center justify-center lg:px-2">
            <MontHub />
          </div>

          {/* Arrow center -> right */}
          <FlowLine direction="right" />

          {/* ── RIGHT: Auto-delivery ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 pb-1.5 lg:justify-start">
              <span className="size-2 rounded-full bg-[#33C758]/60" />
              <span className="text-sm font-medium tracking-[-0.32px] text-[#666666]">Auto-delivery</span>
            </div>

            <div className="flex flex-col gap-2">
              <EmailCard index={0} />
              <TelegramBotCard index={1} />
              <SmsCard index={2} />
              <DataSyncCard index={3} />
            </div>
          </div>

        </div>
      )}
    </section>
  )
}
