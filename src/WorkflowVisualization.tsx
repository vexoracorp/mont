import { useRef } from "react"
import { motion, useInView } from "motion/react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const orders = [
  { channel: "Naver Store", product: "Steam Wallet $50", price: "$100" },
  { channel: "G2G", product: "Windows 11 Pro Key", price: "$24.99" },
  { channel: "G2A", product: "Xbox Game Pass 3M", price: "$29.99" },
  { channel: "Website", product: "Spotify Premium 6M", price: "$14.90" },
  { channel: "Naver Store", product: "Google Play ₩50,000", price: "₩50,000" },
]

const deliveries = [
  { method: "Email", label: "Delivered" },
  { method: "Telegram", label: "Delivered" },
  { method: "SMS", label: "Delivered" },
]

/* ------------------------------------------------------------------ */
/*  Flow arrow (static, minimal)                                       */
/* ------------------------------------------------------------------ */

function FlowArrow() {
  return (
    <div className="hidden items-center lg:flex" style={{ width: 48 }}>
      <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
        <line x1="0" y1="12" x2="40" y2="12" stroke="rgba(0,0,0,0.10)" strokeWidth="1" />
        <polyline points="36,8 42,12 36,16" stroke="rgba(0,0,0,0.10)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function WorkflowVisualization() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section ref={sectionRef} className="w-full max-w-5xl px-4">
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

      {/* 3-column flow */}
      {isInView && (
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto_auto_auto_1fr] lg:gap-0">

          {/* ── LEFT: Incoming Orders ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="mb-2 text-sm font-medium tracking-[-0.32px] text-[#999999]">
              Incoming orders
            </p>
            <div
              className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              {orders.map((order, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4"
                  style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottom: i < orders.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  <span className="shrink-0 text-[12px] tracking-[-0.32px] text-[#999999]">
                    {order.channel}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                    {order.product}
                  </span>
                  <span
                    className="shrink-0 text-[13px] font-medium tracking-[-0.32px] text-[#666666]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {order.price}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Arrow → */}
          <FlowArrow />

          {/* ── CENTER: Mont Engine ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-center gap-3 px-6 py-6 lg:px-10"
          >
            {/* Logo mark */}
            <div className="relative flex size-14 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
              <span className="absolute top-1 right-1 size-4 rounded-full bg-white" />
            </div>

            <p className="text-lg font-semibold tracking-[-0.32px] text-[#181925]">Mont</p>

            <p
              className="text-sm tracking-[-0.32px] text-[#666666]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              Processing 1,847 orders
            </p>
          </motion.div>

          {/* Arrow → */}
          <FlowArrow />

          {/* ── RIGHT: Delivery Outputs ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="mb-2 text-sm font-medium tracking-[-0.32px] text-[#999999]">
              Auto-delivery
            </p>
            <div
              className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              {deliveries.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4"
                  style={{
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderBottom: i < deliveries.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  {/* Checkmark */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#918DF6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                    {d.method}
                  </span>
                  <span className="ml-auto text-[13px] tracking-[-0.32px] text-[#999999]">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      )}
    </section>
  )
}
