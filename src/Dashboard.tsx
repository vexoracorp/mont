import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import DashboardLayout from "@/DashboardLayout"
import {
  type Order,
  type Currency,
  StatusBadge,
  DeliveryChannel,
  platformBadges,
  formatUSD,
  formatKRW,
} from "@/shared"

// ─── Mock Data ───────────────────────────────────────────────

const sparklineData = {
  orders: [180, 220, 195, 240, 280, 310, 290].map((v, i) => ({ v, i })),
  revenue: [5420, 6180, 5890, 7340, 8120, 9450, 7990].map((v, i) => ({ v, i })),
  success: [99.2, 99.5, 99.3, 99.8, 99.6, 99.9, 99.7].map((v, i) => ({ v, i })),
  delivery: [3.1, 2.8, 2.9, 2.5, 2.6, 2.3, 2.4].map((v, i) => ({ v, i })),
}

const platformData = [
  { name: "Naver Store", value: 42, color: "#34A853" },
  { name: "G2G", value: 35, color: "#1A73E8" },
  { name: "G2A", value: 18, color: "#E37400" },
  { name: "Direct", value: 5, color: "#918DF6" },
]

const orders: Order[] = [
  { id: "4X7PA", platform: "Naver Store", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", delivery: "Telegram", keyCode: "XXXX-XXXX-7F3M" },
  { id: "9K2BM", platform: "G2G", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", delivery: "Email", keyCode: "XXXX-XXXX-A2K9" },
  { id: "3F8QN", platform: "G2A", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", delivery: "SMS", keyCode: "XXXX-XXXX-9D1P" },
  { id: "7W1DL", platform: "Naver Store", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", delivery: "Email", keyCode: "XXXX-XXXX-QW8E" },
  { id: "6R5VC", platform: "G2G", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", delivery: "Telegram", keyCode: "XXXX-XXXX-5TN2" },
  { id: "2H9TE", platform: "G2A", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", delivery: "WhatsApp", keyCode: "XXXX-XXXX-0000", errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered." },
]

const inventory = [
  { name: "GTA V Premium", remaining: 142, total: 200 },
  { name: "Xbox Game Pass", remaining: 67, total: 150 },
  { name: "PS Plus 12M", remaining: 34, total: 80 },
  { name: "Elden Ring", remaining: 8, total: 100 },
  { name: "Windows 11 Pro", remaining: 3, total: 50 },
  { name: "FIFA 25", remaining: 12, total: 60 },
]

// ─── Sparkline ───────────────────────────────────────────────

function Sparkline({ data, color }: { data: { v: number; i: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Metric Card ─────────────────────────────────────────────

function MetricCard({
  label,
  value,
  change,
  dotColor,
  positive,
  sparkData,
  secondaryValue,
}: {
  label: string
  value: string
  change: string
  dotColor: string
  positive: boolean
  sparkData: { v: number; i: number }[]
  secondaryValue?: string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div
        className="absolute top-0 bottom-0 left-0 w-[3px]"
        style={{ backgroundColor: dotColor }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-[14px] font-medium tracking-[-0.32px] text-[#666666]">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {positive ? (
            <TrendingUp className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
          )}
          <span className="text-[14px] font-semibold tracking-[-0.32px] text-[#34A853]">
            {change}
          </span>
        </div>
      </div>
      <p className="mt-1 text-[24px] font-semibold leading-tight tracking-[-0.32px] tabular-nums text-[#181925]">
        {value}
      </p>
      {secondaryValue && (
        <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] tabular-nums text-[#999999]">
          {secondaryValue}
        </p>
      )}
      <div className="mt-1">
        <Sparkline data={sparkData} color={dotColor} />
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────

export default function Dashboard() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [copiedKey, setCopiedKey] = useState(false)

  const handleCopyKey = (key: string) => {
    void navigator.clipboard.writeText(key)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 1500)
  }

  return (
    <DashboardLayout
      title="Overview"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
        <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-4 lg:px-8">
          {/* KPI Metrics — 4 cards */}
          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Orders"
              value="2,847"
              change="+12.5%"
              dotColor="#1A73E8"
              positive
              sparkData={sparklineData.orders}
            />
            <MetricCard
              label="Revenue"
              value={currency === "KRW" ? "₩70,168,800" : "$48,392"}
              change="+8.2%"
              dotColor="#34A853"
              positive
              sparkData={sparklineData.revenue}
              secondaryValue={currency === "KRW" ? "≈ $48,392" : "≈ ₩70,168,800"}
            />
            <MetricCard
              label="Delivery Success"
              value="99.7%"
              change="+0.3%"
              dotColor="#34A853"
              positive
              sparkData={sparklineData.success}
            />
            <MetricCard
              label="Avg Delivery Time"
              value="2.4s"
              change="-0.8s"
              dotColor="#918DF6"
              positive={false}
              sparkData={sparklineData.delivery}
            />
          </div>

          {/* Main content: Orders table + Platform Split side by side */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
            {/* Recent Orders */}
            <div
              className="flex flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                    Recent Orders
                  </h2>
                  <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                    Last 6 transactions
                  </p>
                </div>
                <button className="flex items-center gap-1 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]">
                  View all
                  <ArrowRight className="size-3.5" strokeWidth={2} />
                </button>
              </div>
              <div className="flex items-center gap-3 px-5 pb-3">
                <select className="h-9 w-24 shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none">
                  <option>All</option>
                  <option>Naver Store</option>
                  <option>G2G</option>
                  <option>G2A</option>
                </select>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-3 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                </div>
              </div>
              <div className="overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
                  {orders.map((order) => {
                    const badge = platformBadges[order.platform]
                    return (
                      <button
                        key={order.id}
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className={`flex w-full flex-col rounded-xl border border-[rgba(0,0,0,0.08)] p-4 text-left transition-colors hover:bg-neutral-50/60 ${
                          order.status === "Failed" ? "bg-[#D93025]/[0.03]" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                            {order.product}
                          </p>
                          <div className="flex shrink-0 flex-col items-end gap-1">
                            <StatusBadge status={order.status} />
                            <DeliveryChannel channel={order.delivery} />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.customer}</span>
                          <span className="text-[#999999]">·</span>
                          {badge && (
                            <span className={`${badge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{order.platform}</span>
                          <span className="text-[#999999]">·</span>
                          <span className="text-[12px] tracking-[-0.32px] text-[#999999]">{order.time}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[15px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                              {formatUSD(order.amount)}
                            </span>
                            {currency === "KRW" && (
                              <span className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                                {formatKRW(order.amount)}
                              </span>
                            )}
                          </div>
                          {order.status === "Failed" && order.errorMessage && (
                            <span className="inline-flex items-center truncate rounded-lg bg-[#D93025]/8 px-3 py-1 text-[13px] font-semibold tracking-[-0.2px] text-[#D93025]">
                              {order.errorStep}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col gap-4 overflow-y-auto">
              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 pt-4 pb-5"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Platform Split
                </h2>
                <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  Order distribution
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {platformData.map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="w-[80px] shrink-0 text-[14px] tracking-[-0.32px] text-[#666666]">
                        {p.name}
                      </span>
                      <div className="flex-1">
                        <div className="h-[7px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${p.value}%`, backgroundColor: p.color }}
                          />
                        </div>
                      </div>
                      <span className="w-10 shrink-0 text-right text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {p.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 pt-4 pb-5"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  All Inventory
                </h2>
                <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  Keys remaining
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {inventory.map((item) => {
                    const pct = (item.remaining / item.total) * 100
                    const barColor = pct > 30 ? "#33C758" : pct > 15 ? "#E37400" : "#D93025"
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] tracking-[-0.32px] text-[#181925]">
                            {item.name}
                          </span>
                          <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                            {item.remaining}
                            <span className="font-normal text-[#999999]">/{item.total}</span>
                          </span>
                        </div>
                        <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        <Dialog open={selectedOrder !== null} onOpenChange={(open) => { if (!open) { setSelectedOrder(null); setCopiedKey(false) } }}>
          {selectedOrder && (
            <DialogContent className="sm:max-w-md" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                  Order #{selectedOrder.id}
                </DialogTitle>
                <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                  {selectedOrder.product}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                {/* Status & Amount */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Amount</p>
                    <p className="mt-1 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                      {formatUSD(selectedOrder.amount)}
                      <span className="ml-1.5 text-[12px] font-medium text-[#999999]">
                        (≈ {formatKRW(selectedOrder.amount)})
                      </span>
                    </p>
                  </div>
                </div>

                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                {/* Error Details (Failed orders only) */}
                {selectedOrder.status === "Failed" && selectedOrder.errorMessage && (
                  <>
                    <div className="rounded-lg border border-[#D93025]/15 bg-[#D93025]/[0.04] px-4 py-3">
                      <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#D93025]">
                        {selectedOrder.errorStep}
                      </p>
                      <p className="mt-1.5 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                        {selectedOrder.errorMessage}
                      </p>
                    </div>
                    <div className="h-px bg-[rgba(0,0,0,0.08)]" />
                  </>
                )}

                {/* Customer */}
                <div>
                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Customer</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Name</p>
                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.customer}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Email</p>
                      <p className="mt-0.5 truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Platform</p>
                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.platform}</p>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                {/* Delivery */}
                <div>
                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Delivery</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Method</p>
                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.delivery}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Delivered at</p>
                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">Apr 25, 2026 · {selectedOrder.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Key Code</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <p className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{selectedOrder.keyCode}</p>
                        <button
                          onClick={() => handleCopyKey(selectedOrder.keyCode)}
                          className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                        >
                          {copiedKey ? (
                            <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                          ) : (
                            <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                {/* Transaction */}
                <div>
                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Transaction</p>
                  <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2.5">
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Order ID</p>
                      <p className="mt-0.5 text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Platform Fee</p>
                      <p className="mt-0.5 text-[13px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">
                        {formatUSD(selectedOrder.amount * 0.05)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Net Revenue</p>
                      <p className="mt-0.5 text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">
                        {formatUSD(selectedOrder.amount * 0.95)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
    </DashboardLayout>
  )
}
