import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, useInView, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Clock, MessageSquare, Moon, Zap, X, Check, Minus, FileText, Code2, Plug, ArrowRight } from "lucide-react"
import { WorkflowVisualization } from "./WorkflowVisualization"

function Navbar() {
  return (
    <nav className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-neutral-950 px-2 py-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)]">
        <a href="#" className="flex items-center gap-2 pl-2 pr-3">
          <span className="relative flex size-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-neutral-950" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">
            Mont
          </span>
        </a>

        <div className="hidden items-center gap-0.5 md:flex">
          <a
            href="#"
            className="flex items-center gap-0.5 rounded-full px-3 py-1.5 text-[13px] text-[#999999] transition-colors hover:text-white"
          >
            Features
            <ChevronDown className="size-3 opacity-60" />
          </a>
          <a
            href="#"
            className="rounded-full px-3 py-1.5 text-[13px] text-[#999999] transition-colors hover:text-white"
          >
            Pricing
          </a>
          <a
            href="#"
            className="rounded-full px-3 py-1.5 text-[13px] text-[#999999] transition-colors hover:text-white"
          >
            Blog
          </a>
          <a
            href="#"
            className="rounded-full px-3 py-1.5 text-[13px] text-[#999999] transition-colors hover:text-white"
          >
            Docs
          </a>
          <a
            href="#"
            className="rounded-full px-3 py-1.5 text-[13px] text-[#999999] transition-colors hover:text-white"
          >
            API
          </a>
          <Link
            to="/login"
            className="rounded-full px-3 py-1.5 text-[13px] text-[#999999] transition-colors hover:text-white"
          >
            Login
          </Link>
        </div>

        <Link to="/signup" className="ml-1 shrink-0 cursor-pointer whitespace-nowrap rounded-full bg-[#918DF6] px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#9580FF]">
          Start free trial
        </Link>
      </div>
    </nav>
  )
}

const logos = [
  { name: "Naver", weight: "font-bold", size: "text-[15px]", tracking: "tracking-tight" },
  { name: "G2G", weight: "font-light", size: "text-base", tracking: "tracking-wide" },
  { name: "G2A", weight: "font-semibold", size: "text-[15px]", tracking: "tracking-tight" },
  { name: "STEAM", weight: "font-medium", size: "text-sm", tracking: "tracking-widest uppercase" },
  { name: "PlayStation", weight: "font-extralight", size: "text-lg", tracking: "tracking-tight" },
  { name: "Xbox", weight: "font-black", size: "text-xs", tracking: "tracking-[0.2em] uppercase" },
] as const

function LogoCloud() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      <span className="text-[11px] font-medium tracking-widest text-[#999999]/60 uppercase">Supported platforms</span>
      {logos.map((logo) => (
        <span
          key={logo.name}
          className={`text-[#999999] ${logo.weight} ${logo.size} ${logo.tracking}`}
        >
          {logo.name}
        </span>
      ))}
    </div>
  )
}

const painPoints: {
  icon: typeof MessageSquare
  question: string
  description: string
  align: "left" | "right"
  isResolution?: boolean
  visualId: "chat-flood" | "slow-send" | "missed-order" | "instant-delivery"
}[] = [
  {
    icon: MessageSquare,
    question: "Spending all day glued to chat?",
    description: "You're manually responding to every order on WhatsApp and Telegram. That's not scaling — that's surviving.",
    align: "left",
    visualId: "chat-flood",
  },
  {
    icon: Clock,
    question: "Sending discount codes and restock alerts by hand?",
    description: "Copy-paste. Send. Repeat. For every customer, every platform, every time.",
    align: "right",
    visualId: "slow-send",
  },
  {
    icon: Moon,
    question: "Lost a customer because you were asleep?",
    description: "They ordered at 3 AM. You replied at 9 AM. They already bought from someone else.",
    align: "left",
    visualId: "missed-order",
  },
  {
    icon: Zap,
    question: "Mont delivers 24/7. Even when you don't.",
    description: "Auto-delivery in under 3 seconds. No missed orders. No lost customers.",
    align: "right",
    isResolution: true,
    visualId: "instant-delivery",
  },
]

function ChatFloodVisual({ animate }: { animate: boolean }) {
  const allMessages = [
    "Hi, is the Steam key available?",
    "When will it be delivered?",
    "Can I get a bulk discount?",
    "Hello? Still waiting...",
    "I paid 10 minutes ago",
    "Anyone there???",
    "How long does delivery take?",
    "I need 5x Xbox Game Pass",
    "Is Elden Ring in stock?",
    "Sent payment, check please",
    "Why is nobody responding?",
    "I've been waiting 30 min",
    "Do you have PS Plus codes?",
    "Need Windows 11 key ASAP",
    "Hello?? Are you online?",
    "This is ridiculous...",
    "Refund please",
    "I'm going to another seller",
    "Nvm, buying elsewhere",
  ]

  const [visibleMessages, setVisibleMessages] = useState<{ text: string; id: number; time: string }[]>([])
  const [badge, setBadge] = useState(0)
  const [leftChat, setLeftChat] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const idCounter = useRef(0)

  useEffect(() => {
    if (!animate) return
    setVisibleMessages([])
    setBadge(0)
    setLeftChat(false)
    idCounter.current = 0
    let msgIndex = 0

    const addMessage = () => {
      if (msgIndex >= allMessages.length) {
        setLeftChat(true)
        setTimeout(() => {
          setVisibleMessages([])
          setBadge(0)
          setLeftChat(false)
          msgIndex = 0
          idCounter.current = 0
          setTimeout(addMessage, 800)
        }, 2500)
        return
      }

      const text = allMessages[msgIndex]
      const id = idCounter.current++
      const mins = 14 + Math.floor(msgIndex / 3)
      const secs = (msgIndex * 7) % 60
      const time = `2:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0").slice(0, 2)}`
      setVisibleMessages(prev => [...prev.slice(-6), { text, id, time: time.slice(0, 4) + " PM" }])
      setBadge(prev => Math.min(prev + Math.floor(Math.random() * 3) + 1, 99))
      msgIndex++

      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 50)

      const delay = msgIndex < 4 ? 600 : msgIndex < 10 ? 400 : 250
      setTimeout(addMessage, delay)
    }

    const start = setTimeout(addMessage, 400)
    return () => clearTimeout(start)
  }, [animate])

  return (
    <div className="relative mt-4 h-[260px] w-full max-w-[400px] overflow-hidden rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center gap-2.5 px-3 py-2" style={{ backgroundColor: "#008069" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/60"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="flex size-8 items-center justify-center rounded-full bg-[#DFE5E7]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#8696A0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-white">Customers</p>
          <p className="text-[11px] text-white/70">online</p>
        </div>
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z" fill="white" fillOpacity="0.7"/></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="white" fillOpacity="0.7"/><circle cx="12" cy="12" r="1.5" fill="white" fillOpacity="0.7"/><circle cx="12" cy="19" r="1.5" fill="white" fillOpacity="0.7"/></svg>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-col gap-[3px] overflow-hidden px-3 py-2"
        style={{
          height: "calc(100% - 52px)",
          backgroundColor: "#EFEAE2",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3Ccircle cx='30' cy='25' r='0.8'/%3E%3Ccircle cx='50' cy='8' r='0.6'/%3E%3Ccircle cx='20' cy='45' r='0.7'/%3E%3Ccircle cx='45' cy='50' r='0.9'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      >
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="self-start"
            >
              <div
                className="relative px-2 py-1"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "0 8px 8px 8px",
                  boxShadow: "0 1px 0.5px rgba(11,20,26,0.13)",
                  maxWidth: 280,
                }}
              >
                <span className="text-[12.5px] leading-[1.35] text-[#111B21]">{msg.text}</span>
                <span className="ml-2 inline-block translate-y-[2px] text-[10px] text-[#667781]">{msg.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {leftChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="self-center py-1"
          >
            <span
              className="rounded-[7px] px-3 py-1 text-[11px] text-[#111B21]"
              style={{ backgroundColor: "#FFEECC", boxShadow: "0 1px 0.5px rgba(11,20,26,0.08)" }}
            >
              Customer left the chat
            </span>
          </motion.div>
        )}
      </div>

      <div className="pointer-events-none absolute right-3 top-[52px] z-10">
        <AnimatePresence>
          {badge > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              {badge > 99 ? "99+" : badge}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6" style={{ background: "linear-gradient(to top, #EFEAE2, transparent)" }} />
    </div>
  )
}

function SlowSendVisual({ animate }: { animate: boolean }) {
  const codes = [
    { code: "SUMMER-GTA-2X9K", customer: "john_doe" },
    { code: "VIP-ELDEN-7F3M", customer: "sarah_k" },
    { code: "RESTOCK-FIFA-Q4W", customer: "mike_92" },
  ]

  type Phase = "idle" | "move-to-cell" | "dragging" | "select-done" | "ctrl-c" | "move-to-chat" | "ctrl-v" | "sent"
  const [step, setStep] = useState(-1)
  const [phase, setPhase] = useState<Phase>("idle")
  const [cursorPos, setCursorPos] = useState({ x: 20, y: 30 })
  const [selectProgress, setSelectProgress] = useState(0)
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    if (!animate) return
    setStep(-1)
    setPhase("idle")
    setCursorPos({ x: 20, y: 30 })
    setSelectProgress(0)
    setAllDone(false)

    const timers: ReturnType<typeof setTimeout>[] = []
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)) }

    let currentStep = 0
    const rowYs = [82, 102, 122]

    const runCycle = () => {
      if (currentStep >= codes.length) {
        t(() => setAllDone(true), 400)
        return
      }
      const rowY = rowYs[currentStep]
      setStep(currentStep)
      setSelectProgress(0)

      setPhase("move-to-cell")
      setCursorPos({ x: 58, y: rowY })

      t(() => {
        setPhase("dragging")
        setSelectProgress(0)
        const start = performance.now()
        const dur = 1200
        let raf: number
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setSelectProgress(eased)
          setCursorPos({ x: 58 + eased * 108, y: rowY })
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        timers.push(setTimeout(() => cancelAnimationFrame(raf), dur + 50))
      }, 800)

      t(() => {
        setPhase("select-done")
        setSelectProgress(1)
      }, 2000)

      t(() => {
        setPhase("ctrl-c")
      }, 2400)

      t(() => {
        setPhase("move-to-chat")
        setCursorPos({ x: 290, y: rowY })
      }, 3200)

      t(() => {
        setPhase("ctrl-v")
      }, 4000)

      t(() => {
        setPhase("sent")
        setSelectProgress(0)
        currentStep++
        t(runCycle, 800)
      }, 4600)
    }

    t(runCycle, 600)
    return () => timers.forEach(clearTimeout)
  }, [animate, codes.length])

  const showSelection = phase === "dragging" || phase === "select-done" || phase === "ctrl-c"
  const showCtrlC = phase === "ctrl-c"
  const showCtrlV = phase === "ctrl-v"

  return (
    <div className="relative mt-4 w-full max-w-[620px]">
      <div className="flex gap-3">
        <div
          className="relative flex-1 overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" }}
        >
          <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] bg-neutral-100 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#FF5F57]" />
              <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="size-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="ml-1 text-[10px] font-medium tracking-[-0.32px] text-[#999999]">keys.xlsx</span>
          </div>
          <div className="px-0 py-0">
            <div className="flex items-center border-b border-[rgba(0,0,0,0.06)] bg-neutral-50/60 px-1.5 py-1">
              <span className="w-5 text-center text-[8px] font-medium text-[#999999]">#</span>
              <span className="flex-1 px-1 text-[8px] font-medium text-[#999999]">Key</span>
              <span className="w-14 px-1 text-[8px] font-medium text-[#999999]">Customer</span>
            </div>
            {codes.map((item, i) => {
              const isActive = step === i && showSelection
              const isCurrentRow = step === i && phase !== "idle" && phase !== "sent"
              return (
                <div
                  key={i}
                  className="flex items-center border-b border-[rgba(0,0,0,0.04)] px-1.5 py-[5px]"
                  style={{
                    backgroundColor: isCurrentRow ? "rgba(44,120,252,0.06)" : "transparent",
                  }}
                >
                  <span className="w-5 text-center font-mono text-[9px] text-[#999999]">{i + 1}</span>
                  <span className="relative flex-1 px-1 font-mono text-[9px] text-[#181925]">
                    {isActive && (
                      <span
                        className="absolute inset-y-[-1px] left-0.5 rounded-[2px] bg-[#2C78FC]/20"
                        style={{ width: `${selectProgress * 100}%`, maxWidth: "calc(100% - 4px)" }}
                      />
                    )}
                    <span className="relative">{item.code}</span>
                  </span>
                  <span className="w-14 px-1 font-mono text-[8px] text-[#999999]">{item.customer}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className="relative flex-1 overflow-hidden rounded-2xl border border-white/5 bg-[#0B141A]"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-2 border-b border-white/8 bg-[#1F2C34] px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#FF5F57]/70" />
              <span className="size-2.5 rounded-full bg-[#FEBC2E]/70" />
              <span className="size-2.5 rounded-full bg-[#28C840]/70" />
            </div>
            <span className="ml-1 text-[10px] font-medium text-[#E9EDEF]">WhatsApp</span>
          </div>
          <div className="flex flex-col gap-1.5 p-2.5">
            {codes.map((item, i) => {
              const visible = i < step || (i === step && (phase === "ctrl-v" || phase === "sent"))
              return visible ? (
                <motion.div
                  key={`msg-${i}`}
                  initial={{ opacity: 0, scale: 0.9, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="self-end max-w-[90%]"
                >
                  <div
                    className="rounded-lg px-2 py-1.5"
                    style={{
                      backgroundColor: "#005C4B",
                      borderTopRightRadius: "2px",
                    }}
                  >
                    <span className="block text-[7px] font-medium text-[#25D366]/70">{item.customer}</span>
                    <p className="mt-0.5 font-mono text-[9px] leading-tight text-[#E9EDEF]">{item.code}</p>
                    <span className="mt-0.5 block text-right text-[6px] text-[#8696A0]">
                      {`${9 + i}:${12 + i * 5} AM`}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div key={`empty-${i}`} />
              )
            })}
          </div>
        </div>
      </div>

      {animate && (
        <motion.div
          className="pointer-events-none absolute z-30"
          animate={{ left: cursorPos.x, top: cursorPos.y }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="drop-shadow-md">
            <path
              d="M1 1L1 15.5L4.5 12L8 19L10.5 18L7 11L12 10.5L1 1Z"
              fill="white"
              stroke="#181925"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          {showCtrlC && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[-22px] left-[18px] whitespace-nowrap rounded-md bg-[#181925] px-2 py-0.5 text-[9px] font-semibold tracking-tight text-white"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Ctrl+C
            </motion.span>
          )}
          {showCtrlV && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[-22px] left-[18px] whitespace-nowrap rounded-md bg-[#181925] px-2 py-0.5 text-[9px] font-semibold tracking-tight text-white"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            >
              Ctrl+V
            </motion.span>
          )}
        </motion.div>
      )}

      {allDone && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mt-4 flex w-full flex-col items-center gap-2.5 rounded-lg px-4 py-3"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,47,0,0.06) 0%, transparent 70%)",
          }}
        >
          <div className="relative h-[6px] w-full max-w-[360px] overflow-hidden rounded-full bg-[#FF2F00]/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "0.35%" }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 rounded-full bg-[#FF2F00]"
              style={{ minWidth: 3, boxShadow: "0 0 8px rgba(255,47,0,0.6)" }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="font-mono text-[14px] font-bold tracking-[-0.5px] text-[#FF2F00]"
          >
            3 of 847 sent...
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.35, 0.5] }}
            transition={{
              duration: 2.8,
              delay: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="font-mono text-[11px] font-medium tracking-[-0.32px] text-[#FF2F00]"
          >
            ~23 min remaining
          </motion.span>
        </motion.div>
      )}
    </div>
  )
}

function MissedOrderVisual({ animate }: { animate: boolean }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!animate) return
    setPhase(0)
    const t1 = setTimeout(() => setPhase(1), 600)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => setPhase(3), 3800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [animate])

  return (
    <div className="mt-4 w-full max-w-[360px] space-y-2 rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#0D1117] p-4">
      <div className="flex items-center gap-2">
        <motion.div
          animate={animate ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Moon className="size-4 text-[#6B7280]" />
        </motion.div>
        <span className="font-mono text-[11px] text-[#6B7280]">3:12 AM</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={animate && phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#25D366]">New order</span>
          <span className="font-mono text-[11px] text-[#25D366]">$49.99</span>
        </div>
        <span className="text-[10px] text-[#6B7280]">GTA V Premium — Telegram</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={animate && phase >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 py-1"
      >
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="inline-block size-1 rounded-full bg-[#6B7280]"
              animate={animate && phase >= 2 ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1.2, repeat: 2, delay: i * 0.2 }}
            />
          ))}
        </div>
        <span className="font-mono text-[10px] text-[#6B7280]">
          Waiting for reply... 6 hours
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={animate && phase >= 3 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-lg border border-[#FF2F00]/30 bg-[#FF2F00]/10 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <X className="size-3 text-[#FF2F00]" strokeWidth={3} />
          <span className="text-[11px] font-medium text-[#FF2F00]">Customer left</span>
        </div>
        <span className="text-[10px] text-[#FF2F00]/60">
          Bought from competitor at 3:14 AM
        </span>
      </motion.div>
    </div>
  )
}

function InstantDeliveryVisual({ animate }: { animate: boolean }) {
  const [timer, setTimer] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (!animate) return
    setTimer(0)
    setPhase(0)
    const t0 = setTimeout(() => setPhase(1), 500)
    const t1 = setTimeout(() => setPhase(2), 1200)
    const t2 = setTimeout(() => setPhase(3), 2000)
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2) }
  }, [animate])

  useEffect(() => {
    if (!animate || phase < 1) return
    if (phase >= 3) { setTimer(2.7); return }
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000
      setTimer(Math.min(elapsed * 1.2, 2.7))
      if (elapsed * 1.2 < 2.7) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animate, phase])

  return (
    <div className="mt-4 w-full max-w-[360px] space-y-2 rounded-xl border border-[#918DF6]/20 bg-[#0D1117] p-4">
      <div className="flex items-center gap-2">
        <Moon className="size-4 text-[#6B7280]" />
        <span className="font-mono text-[11px] text-[#6B7280]">3:12 AM</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={animate && phase >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-lg border border-[#25D366]/30 bg-[#25D366]/10 px-3 py-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#25D366]">New order</span>
          <span className="font-mono text-[11px] text-[#25D366]">$49.99</span>
        </div>
        <span className="text-[10px] text-[#6B7280]">GTA V Premium — Telegram</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={animate && phase >= 2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 py-0.5"
      >
        <motion.div
          animate={animate && phase >= 2 && phase < 3 ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="flex size-5 items-center justify-center rounded-full bg-[#918DF6]/20"
        >
          <Zap className="size-3 text-[#918DF6]" strokeWidth={2.5} />
        </motion.div>
        <span className="font-mono text-[10px] text-[#918DF6]">Mont processing...</span>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-[#918DF6]">
          {timer.toFixed(1)}s
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={animate && phase >= 3 ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-lg border border-[#33C758]/30 bg-[#33C758]/10 px-3 py-2"
      >
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={animate && phase >= 3 ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex size-4 items-center justify-center rounded-full bg-[#33C758]"
          >
            <Check className="size-2.5 text-white" strokeWidth={3} />
          </motion.div>
          <span className="text-[11px] font-medium text-[#33C758]">Key delivered</span>
          <span className="ml-auto font-mono text-[10px] text-[#33C758]">2.7s</span>
        </div>
        <span className="font-mono text-[10px] text-[#6B7280]">
          XXXX-XXXX-XXXX-7F3M
        </span>
      </motion.div>
    </div>
  )
}

function PainPointVisual({ visualId, animate }: { visualId: string; animate: boolean }) {
  switch (visualId) {
    case "chat-flood": return <ChatFloodVisual animate={animate} />
    case "slow-send": return <SlowSendVisual animate={animate} />
    case "missed-order": return <MissedOrderVisual animate={animate} />
    case "instant-delivery": return <InstantDeliveryVisual animate={animate} />
    default: return null
  }
}

function PainPointCard({ point }: { point: typeof painPoints[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isCardInView = useInView(cardRef, { once: true, margin: "-100px" })
  const Icon = point.icon
  const isLast = point.isResolution

  return (
    <motion.div
      ref={cardRef}
      initial={{
        opacity: 0,
        y: 40,
        x: point.align === "left" ? -30 : 30,
        scale: 0.88,
      }}
      animate={isCardInView ? {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      } : undefined}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex ${point.align === "right" ? "md:justify-end" : "md:justify-start"}`}
    >
      <div
        className={`relative max-w-2xl w-full overflow-hidden rounded-2xl border px-7 py-6 ${
          isLast
            ? "border-[#918DF6]/30 bg-gradient-to-br from-[#918DF6]/[0.05] to-[#918DF6]/[0.02]"
            : "border-[rgba(0,0,0,0.08)] bg-white"
        }`}
        style={{
          boxShadow: isLast
            ? "0 1px 3px rgba(145,141,246,0.08), 0 8px 32px rgba(145,141,246,0.06), inset 0 1px 0 rgba(145,141,246,0.08)"
            : "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)",
        }}
      >
        {isLast && (
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #918DF6 1px, transparent 1px), radial-gradient(circle at 80% 20%, #918DF6 1px, transparent 1px)", backgroundSize: "40px 40px, 60px 60px" }}
          />
        )}
        {isLast && <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-2xl bg-[#918DF6]" />}
        {!isLast && <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-2xl bg-[#FF2F00]/20" />}

        <div className="relative flex items-start gap-4">
          <span
            className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl ${
              isLast ? "bg-[#918DF6]/10 text-[#918DF6]" : "bg-[#FF2F00]/[0.06] text-[#FF2F00]"
            }`}
          >
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xl font-medium tracking-[-0.32px] leading-snug text-[#181925]">
              {point.question}
            </p>
            <p className="mt-1.5 text-base leading-relaxed tracking-[-0.32px] text-[#666666]">
              {point.description}
            </p>
            <PainPointVisual visualId={point.visualId} animate={isCardInView} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PainPointsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="w-full max-w-5xl px-4 pt-10 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-medium tracking-[-1.8px] text-[#181925] sm:text-4xl">
          Sound familiar?
        </h2>
        <p className="mt-2 text-base tracking-[-0.32px] text-[#666666]">
          The daily reality of selling digital products manually
        </p>
      </motion.div>

      <div className="relative flex flex-col gap-6">
        <div className="absolute top-8 bottom-8 left-1/2 hidden w-px -translate-x-1/2 md:block"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.06) 15%, rgba(0,0,0,0.06) 85%, transparent)" }}
        />

        {painPoints.map((point, i) => (
          <PainPointCard key={i} point={point} />
        ))}
      </div>
    </section>
  )
}

const comparisonRows = [
  { metric: "Avg. delivery time", manual: "2–6 hours", basic: "5–30 minutes", mont: "< 3 seconds", montGood: true, manualBad: true, basicBad: false },
  { metric: "Platforms supported", manual: "1–2", basic: "1 platform only", mont: "Naver, G2G, G2A, Web, + more", montGood: true, manualBad: true, basicBad: true },
  { metric: "Delivery channels", manual: "Email only", basic: "Email + 1 messenger", mont: "Email, Telegram, SMS, WhatsApp", montGood: true, manualBad: true, basicBad: false },
  { metric: "Monthly revenue (est.)", manual: "$800–2,000", basic: "$2,000–5,000", mont: "$5,000–15,000+", montGood: true, manualBad: true, basicBad: false },
  { metric: "Customer return rate", manual: "~12%", basic: "~25%", mont: "~47%", montGood: true, manualBad: true, basicBad: false },
  { metric: "Missed orders", manual: "15–30%", basic: "5–10%", mont: "< 0.1%", montGood: true, manualBad: true, basicBad: true },
  { metric: "Operating hours", manual: "Your waking hours", basic: "Platform hours", mont: "24/7/365", montGood: true, manualBad: true, basicBad: false },
  { metric: "Setup time", manual: "N/A", basic: "Days–weeks", mont: "5 minutes", montGood: true, manualBad: false, basicBad: true },
] as const

function ComparisonDesktopTable({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)] md:block"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" }}
    >
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[rgba(0,0,0,0.08)] bg-neutral-50/80">
            <th className="px-6 py-4 text-sm font-medium tracking-[-0.32px] text-[#999999]" />
            <th className="px-6 py-4 text-center">
              <span className="block text-sm font-medium tracking-[-0.32px] text-[#181925]">Doing it yourself</span>
              <span className="block text-xs tracking-[-0.32px] text-[#999999]">Manual</span>
            </th>
            <th className="border-x border-[rgba(0,0,0,0.08)] px-6 py-4 text-center">
              <span className="block text-sm font-medium tracking-[-0.32px] text-[#181925]">Limited tools</span>
              <span className="block text-xs tracking-[-0.32px] text-[#999999]">Single platform, single region</span>
            </th>
            <th className="relative px-7 py-4 text-center">
              <div className="absolute inset-0 bg-[#918DF6]/[0.06]" />
              <div className="absolute inset-y-0 left-0 w-[3px] bg-[#918DF6]" />
              <div className="relative mb-1.5 flex justify-center">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#918DF6] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  <Zap className="size-2.5" strokeWidth={2.5} />
                  BEST
                </span>
              </div>
              <span className="relative flex items-center justify-center gap-1.5 text-base font-bold tracking-[-0.32px] text-[#918DF6]">
                <span className="relative inline-flex size-5 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                  <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-white" />
                </span>
                Mont
              </span>
              <span className="relative block text-xs tracking-[-0.32px] text-[#666666]">Every platform, every region</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row, i) => (
            <tr
              key={row.metric}
              className={i < comparisonRows.length - 1 ? "border-b border-[rgba(0,0,0,0.08)]" : ""}
            >
              <td className="px-6 py-3.5 text-sm font-medium tracking-[-0.32px] text-[#181925]">
                {row.metric}
              </td>
              <td className="px-6 py-3.5 text-center">
                <span className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999]">
                  {row.manualBad && <X className="size-3.5 text-[#FF2F00]/60" strokeWidth={2.5} />}
                  {row.manual}
                </span>
              </td>
              <td className="border-x border-[rgba(0,0,0,0.08)] px-6 py-3.5 text-center">
                <span className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999]">
                  {row.basicBad ? (
                    <X className="size-3.5 text-[#FF2F00]/60" strokeWidth={2.5} />
                  ) : (
                    <Minus className="size-3.5 text-[#999999]/50" strokeWidth={2} />
                  )}
                  {row.basic}
                </span>
              </td>
              <td className="relative px-7 py-3.5 text-center">
                <div className="absolute inset-0 bg-[#918DF6]/[0.06]" />
                <div className="absolute inset-y-0 left-0 w-[3px] bg-[#918DF6]" />
                <span className="relative inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {row.montGood && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-[#33C758]/12">
                      <Check className="size-3 text-[#33C758]" strokeWidth={3} />
                    </span>
                  )}
                  {row.mont}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}

function ComparisonMobileCards({ isInView }: { isInView: boolean }) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {comparisonRows.map((row, i) => (
        <motion.div
          key={row.metric}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 + i * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
        >
          <p className="mb-3 text-sm font-medium tracking-[-0.32px] text-[#181925]">{row.metric}</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[-0.32px] text-[#999999]">Manual</span>
              <span className="inline-flex items-center gap-1 text-sm tracking-[-0.32px] text-[#999999]">
                {row.manualBad && <X className="size-3 text-[#FF2F00]/60" strokeWidth={2.5} />}
                {row.manual}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[-0.32px] text-[#999999]">Basic</span>
              <span className="inline-flex items-center gap-1 text-sm tracking-[-0.32px] text-[#999999]">
                {row.basicBad ? (
                  <X className="size-3 text-[#FF2F00]/60" strokeWidth={2.5} />
                ) : (
                  <Minus className="size-3 text-[#999999]/50" strokeWidth={2} />
                )}
                {row.basic}
              </span>
            </div>
            <div className="relative mt-0.5 flex items-center justify-between overflow-hidden rounded-lg bg-[#918DF6]/[0.07] px-2.5 py-1.5">
              <div className="absolute inset-y-0 left-0 w-[2px] bg-[#918DF6]" />
              <span className="text-xs font-semibold tracking-[-0.32px] text-[#918DF6]">Mont</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-[-0.32px] text-[#181925]">
                <span className="flex size-4 items-center justify-center rounded-full bg-[#33C758]/12">
                  <Check className="size-2.5 text-[#33C758]" strokeWidth={3} />
                </span>
                {row.mont}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function IntegrationSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  const steps = [
    {
      icon: FileText,
      title: "Drop in your supplier docs",
      description: "API documentation, CSV exports, webhook URLs — whatever your supplier gives you. Just paste it in.",
    },
    {
      icon: Code2,
      title: "Mont reads and connects",
      description: "No coding required. Mont parses the docs, maps the endpoints, and builds the integration automatically.",
    },
    {
      icon: Plug,
      title: "Start selling instantly",
      description: "Inventory syncs, orders flow in, keys deliver out. You're live across every platform in minutes.",
    },
  ]

  const suppliers = [
    { name: "Kinguin API", status: "Connected", color: "#33C758" },
    { name: "G2A Goldmine", status: "Connected", color: "#33C758" },
    { name: "Custom Supplier", status: "Syncing...", color: "#FFA600" },
    { name: "Eneba Marketplace", status: "Connected", color: "#33C758" },
  ]

  return (
    <section ref={ref} className="w-full max-w-5xl px-4 pt-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-medium tracking-[-1.8px] text-[#181925] sm:text-4xl">
          Every supplier. One integration.
        </h2>
        <p className="mt-2 max-w-lg mx-auto text-base tracking-[-0.32px] text-[#666666]">
          Your suppliers all have different APIs? Don't know how to code? Just drop in their docs — Mont handles the rest.
        </p>
      </motion.div>

      {isInView && (
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <div className="flex flex-col gap-0">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_1px_1px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.06)]">
                      <Icon className="size-[18px] text-[#918DF6]" strokeWidth={2} />
                    </span>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 bg-[rgba(0,0,0,0.08)] my-1" style={{ minHeight: 32 }} />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className="text-lg font-medium tracking-[-0.32px] text-[#181925]">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed tracking-[-0.32px] text-[#666666]">{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" }}
          >
            <div className="border-b border-[rgba(0,0,0,0.08)] bg-neutral-50/80 px-5 py-3">
              <p className="text-sm font-medium tracking-[-0.32px] text-[#181925]">Supplier Integrations</p>
              <p className="text-xs tracking-[-0.32px] text-[#999999]">Auto-configured from documentation</p>
            </div>

            <div className="divide-y divide-[rgba(0,0,0,0.08)]">
              {suppliers.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-[#918DF6]/8 text-xs font-semibold text-[#918DF6]">
                      API
                    </span>
                    <span className="text-sm font-medium tracking-[-0.32px] text-[#181925]">{s.name}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-medium tracking-[-0.32px]" style={{ color: s.color }}>
                    <span className="inline-block size-1.5 rounded-full animate-pulse" style={{ backgroundColor: s.color }} />
                    {s.status}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-[rgba(0,0,0,0.08)] px-5 py-3.5">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="flex items-center justify-between"
              >
                <span className="text-sm tracking-[-0.32px] text-[#666666]">Add new supplier</span>
                <span className="flex items-center gap-1 text-sm font-medium tracking-[-0.32px] text-[#918DF6]">
                  Upload docs <ArrowRight className="size-3.5" />
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  )
}

function ComparisonSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="w-full max-w-5xl px-4 pt-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-medium tracking-[-1.8px] text-[#181925] sm:text-4xl">
          See the difference
        </h2>
        <p className="mt-2 text-base tracking-[-0.32px] text-[#666666]">
          Manual hustle vs. full automation — the numbers speak
        </p>
      </motion.div>

      <ComparisonDesktopTable isInView={isInView} />
      <ComparisonMobileCards isInView={isInView} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12 flex flex-col items-center gap-4 text-center"
      >
        <p className="text-lg font-medium tracking-[-0.32px] text-[#181925]">
          Stop losing customers to slow delivery
        </p>
        <Button className="h-10 cursor-pointer rounded-full bg-[#918DF6] px-6 text-sm font-medium text-white transition-colors hover:bg-[#9580FF]">
          Start free trial
        </Button>
      </motion.div>
    </section>
  )
}


function App() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-white">
      <Navbar />

      <main className="relative z-10 flex flex-col items-center px-6 pt-28">
        <a
          href="#"
          className="mb-6 flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white/80 py-1 pr-3 pl-1.5 text-sm shadow-sm backdrop-blur transition-colors hover:border-[rgba(0,0,0,0.12)]"
        >
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white uppercase">
            Live
          </span>
          <span className="text-[#666666]">Now supporting Naver Store</span>
          <ChevronRight className="size-3.5 text-[#999999]" />
        </a>

        <h1 className="max-w-2xl text-center text-5xl leading-[1.1] font-bold tracking-tight text-[#181925] sm:text-6xl md:text-7xl">
          Sell digital products
          <br />
          on autopilot
        </h1>

        <p className="mt-6 max-w-lg text-center text-base leading-relaxed text-[#666666] sm:text-lg">
          Connect Naver Store, G2G, G2A, and your own site. Mont tracks orders,
          manages inventory, and auto-delivers keys in under 3 seconds.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button className="h-10 cursor-pointer rounded-full bg-[#918DF6] px-6 text-sm font-medium text-white transition-colors hover:bg-[#9580FF]">
            Start free trial
          </Button>
          <Button
            variant="outline"
            className="h-10 cursor-pointer rounded-full px-6 text-sm font-medium"
          >
            See how it works
          </Button>
        </div>

        <div className="mt-12 w-full max-w-2xl">
          <LogoCloud />
        </div>

        <div className="mt-20 flex w-full justify-center pb-24">
          <WorkflowVisualization />
        </div>

        <PainPointsSection />

        <IntegrationSection />

        <ComparisonSection />

        {/* Footer */}
        <footer className="mt-32 w-full border-t border-[#E5E5E5] py-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center text-xs leading-relaxed text-[#999999]">
            <div className="flex items-center gap-2">
              <span className="relative flex size-5 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-white" />
              </span>
              <span className="text-sm font-semibold text-[#181925]">Mont</span>
            </div>
            <p className="text-[#666666]">
              OneH International &middot; Representative YUCHAN HAN
            </p>
            <p>
              Business Registration No. 812-33-01680 &middot; 1914-S1, 11, Mirae-ro, Seo-gu, Incheon, Republic of Korea
            </p>
            <p className="mt-2 text-[#BBBBBB]">
              &copy; {new Date().getFullYear()} OneH International. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
