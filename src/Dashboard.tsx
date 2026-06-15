import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react"
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts"
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

const sparkDates = ["4/22", "4/23", "4/24", "4/25", "4/26", "4/27", "4/28"]

const sparklineData = {
  orders: [180, 220, 195, 240, 280, 310, 290].map((v, i) => ({ v, date: sparkDates[i] })),
  revenue: [5420, 6180, 5890, 7340, 8120, 9450, 7990].map((v, i) => ({ v, date: sparkDates[i] })),
  success: [99.2, 99.5, 99.3, 99.8, 99.6, 99.9, 99.7].map((v, i) => ({ v, date: sparkDates[i] })),
  delivery: [3.1, 2.8, 2.9, 2.5, 2.6, 2.3, 2.4].map((v, i) => ({ v, date: sparkDates[i] })),
}

const platformData = [
  { name: "Naver Store", value: 42, color: "#34A853" },
  { name: "G2G", value: 35, color: "#1A73E8" },
  { name: "G2A", value: 18, color: "#E37400" },
  { name: "Direct", value: 5, color: "#918DF6" },
]

const orders: Order[] = [
  { id: "4X7PA", platform: "Naver Store", storeName: "건렬이의 디지털스토어", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", phone: "010-9803-2514", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "XXXX-XXXX-7F3M", recipientName: "이정효", recipientPhone: "010-9803-2514", customerMemo: "leolee12@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-7F3M", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "2.1s" } },
  { id: "9K2BM", platform: "G2G", storeName: "G2G Marketplace", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", phone: "010-3421-7788", delivery: "Email", deliveryTarget: "g2g_buyer_8821", keyCode: "XXXX-XXXX-A2K9", recipientName: "Alex Turner", recipientPhone: "010-3421-7788", customerMemo: "g2g_buyer_8821", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-A2K9", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.8s", deliveryConfirmed: "3.0s" } },
  { id: "3F8QN", platform: "G2A", storeName: "G2A Marketplace", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", phone: "010-5567-1234", delivery: "SMS", deliveryTarget: "010-5567-1234", keyCode: "XXXX-XXXX-9D1P", recipientName: "김수현", recipientPhone: "010-5567-1234", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-9D1P", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.1s" } },
  { id: "7W1DL", platform: "Naver Store", storeName: "몽키디지털", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", phone: "010-8812-3390", delivery: "Email", deliveryTarget: "minji_park@naver.com", keyCode: "XXXX-XXXX-QW8E", recipientName: "박민지", recipientPhone: "010-8812-3390", customerMemo: "minji_park@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-QW8E", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "1.5s" } },
  { id: "6R5VC", platform: "G2G", storeName: "G2G Marketplace", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", phone: "010-2290-4567", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "XXXX-XXXX-5TN2", recipientName: "James Kim", recipientPhone: "010-2290-4567", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-5TN2", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.1s", deliveryConfirmed: "3.4s" } },
  { id: "2H9TE", platform: "G2A", storeName: "G2A Marketplace", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", phone: "010-7741-9023", delivery: "WhatsApp", deliveryTarget: "+82 10-7741-9023", keyCode: "XXXX-XXXX-0000", recipientName: "최영호", recipientPhone: "010-7741-9023", customerMemo: "g2a_user_7790", adminMemo: "WhatsApp 재발송 필요", errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered.", quantity: 1, items: [{ keyCode: "XXXX-XXXX-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.5s" } },
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

function SparklineTooltipContent({
  active,
  payload,
  formatter,
}: {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: ReadonlyArray<Record<string, any>>
  formatter: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const value = typeof entry.value === "number" ? entry.value : 0
  const date = typeof entry.payload?.date === "string" ? entry.payload.date : ""
  return (
    <div
      className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 py-1.5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{date}</p>
      <p className="text-[13px] font-semibold tracking-[-0.32px] tabular-nums text-[#181925]">
        {formatter(value)}
      </p>
    </div>
  )
}

function Sparkline({
  data,
  color,
  formatter,
}: {
  data: { v: number; date: string }[]
  color: string
  formatter: (value: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "#999999", fontFamily: "Plus Jakarta Sans Variable, system-ui, sans-serif" }}
          interval="preserveStartEnd"
        />
        <Tooltip
          content={({ active, payload }) => (
            <SparklineTooltipContent active={active} payload={payload} formatter={formatter} />
          )}
          cursor={false}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          activeDot={{ r: 3, stroke: "#ffffff", strokeWidth: 2, fill: color }}
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
  formatter,
}: {
  label: string
  value: string
  change: string
  dotColor: string
  positive: boolean
  sparkData: { v: number; date: string }[]
  secondaryValue?: string
  formatter: (value: number) => string
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
        <Sparkline data={sparkData} color={dotColor} formatter={formatter} />
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState<Currency>("KRW")

  return (
    <DashboardLayout
      title="Overview"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
        <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-4 lg:px-8">
          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Orders"
              value="2,847"
              change="+12.5%"
              dotColor="#1A73E8"
              positive
              sparkData={sparklineData.orders}
              formatter={(v) => `${v.toLocaleString()} orders`}
            />
            <MetricCard
              label="Revenue"
              value={currency === "KRW" ? "₩70,168,800" : "$48,392"}
              change="+8.2%"
              dotColor="#34A853"
              positive
              sparkData={sparklineData.revenue}
              secondaryValue={currency === "KRW" ? "≈ $48,392" : "≈ ₩70,168,800"}
              formatter={(v) => currency === "KRW" ? formatKRW(v) : formatUSD(v)}
            />
            <MetricCard
              label="Delivery Success"
              value="99.7%"
              change="+0.3%"
              dotColor="#34A853"
              positive
              sparkData={sparklineData.success}
              formatter={(v) => `${v}%`}
            />
            <MetricCard
              label="Avg Delivery Time"
              value="2.4s"
              change="-0.8s"
              dotColor="#918DF6"
              positive={false}
              sparkData={sparklineData.delivery}
              formatter={(v) => `${v}s`}
            />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
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
                <button
                  onClick={() => navigate("/dashboard/orders")}
                  className="flex items-center gap-1 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]"
                >
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
                        onClick={() => navigate(`/dashboard/orders?order=${order.id}`)}
                        className={`flex w-full flex-col rounded-xl border border-[rgba(0,0,0,0.08)] p-4 text-left transition-colors hover:bg-neutral-50/60 ${
                          order.status === "Failed" ? "bg-[#D93025]/[0.06] border-[#D93025]/25" : "bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <p className="min-w-0 flex-1 text-[15px] font-semibold leading-snug tracking-[-0.32px] text-[#181925]">
                            {order.product}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <DeliveryChannel channel={order.delivery} />
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
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
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
                            <span className="inline-flex items-center rounded-lg bg-[#D93025]/8 px-3 py-1 text-[13px] font-semibold tracking-[-0.2px] text-[#D93025]">
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
    </DashboardLayout>
  )
}
