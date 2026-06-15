import { useState, useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  UserPlus,
  Crown,
} from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import {
  type Currency,
  formatUSD,
  formatKRW,
} from "@/shared"

// ─── Types ───────────────────────────────────────────────────

type TimeRange = "7d" | "30d" | "90d"

// ─── Mock Data Generators ────────────────────────────────────

function generateRevenueData(range: TimeRange) {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
  const base = range === "7d" ? 1200 : range === "30d" ? 900 : 600
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const label = range === "90d"
      ? `${d.getMonth() + 1}/${d.getDate()}`
      : `${d.getMonth() + 1}/${d.getDate()}`
    return {
      date: label,
      revenue: Math.round(base + Math.random() * 800 + Math.sin(i * 0.4) * 300),
    }
  })
}

function generateOrdersData(range: TimeRange) {
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90
  const base = range === "7d" ? 35 : range === "30d" ? 28 : 18
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      orders: Math.round(base + Math.random() * 20 + Math.sin(i * 0.5) * 8),
    }
  })
}

const platformBreakdown = [
  { name: "Naver Store", value: 42, color: "#34A853" },
  { name: "G2G", value: 31, color: "#1A73E8" },
  { name: "G2A", value: 19, color: "#E37400" },
  { name: "Direct", value: 8, color: "#918DF6" },
]

const topProducts = [
  { name: "캔바 프로 Canva PRO 12개월", revenue: 8420, orders: 281, spark: [40, 55, 48, 62, 70, 65, 78] },
  { name: "Steam Wallet $50 Gift Card", revenue: 6890, orders: 138, spark: [30, 42, 38, 50, 45, 55, 60] },
  { name: "Windows 11 Pro Key", revenue: 5240, orders: 210, spark: [25, 30, 35, 28, 40, 38, 45] },
  { name: "Xbox Game Pass Ultimate 1개월", revenue: 3980, orders: 307, spark: [50, 45, 55, 60, 52, 65, 58] },
  { name: "Elden Ring Shadow of the Erdtree", revenue: 3560, orders: 59, spark: [10, 18, 25, 35, 42, 38, 48] },
]

const deliveryTrend = [
  { day: "Mon", avgTime: 2.8, successRate: 99.2 },
  { day: "Tue", avgTime: 2.5, successRate: 99.5 },
  { day: "Wed", avgTime: 2.9, successRate: 99.3 },
  { day: "Thu", avgTime: 2.3, successRate: 99.8 },
  { day: "Fri", avgTime: 2.6, successRate: 99.6 },
  { day: "Sat", avgTime: 2.1, successRate: 99.9 },
  { day: "Sun", avgTime: 2.4, successRate: 99.7 },
]

const topCustomers = [
  { name: "이정효", orders: 47, spent: 1420 },
  { name: "Alex Turner", orders: 38, spent: 1180 },
  { name: "James Kim", orders: 31, spent: 980 },
  { name: "박민지", orders: 28, spent: 870 },
  { name: "김수현", orders: 22, spent: 640 },
]

// ─── Card Shell ──────────────────────────────────────────────

const cardShadow = "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)"

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-[rgba(0,0,0,0.08)] bg-white ${className}`}
      style={{ boxShadow: cardShadow }}
    >
      {children}
    </div>
  )
}

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="px-5 pt-4 pb-3">
      <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{title}</h2>
      <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{subtitle}</p>
    </div>
  )
}

// ─── Mini Sparkline ──────────────────────────────────────────

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const points = data.map((v, i) => ({ v, i }))
  return (
    <ResponsiveContainer width={64} height={24}>
      <AreaChart data={points} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`mini-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#mini-${color.replace("#", "")})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Analytics Page ──────────────────────────────────────────

export default function Analytics() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [range, setRange] = useState<TimeRange>("7d")

  const revenueData = useMemo(() => generateRevenueData(range), [range])
  const ordersData = useMemo(() => generateOrdersData(range), [range])

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0)
  const totalOrders = ordersData.reduce((s, d) => s + d.orders, 0)

  const fmtRevenue = (n: number) => currency === "KRW" ? formatKRW(n) : formatUSD(n)
  const ranges: TimeRange[] = ["7d", "30d", "90d"]

  return (
    <DashboardLayout
      title="Analytics"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden px-6 pt-4 pb-6 lg:px-8">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-white p-1" style={{ boxShadow: cardShadow }}>
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] transition-colors ${
                  range === r
                    ? "bg-[#918DF6] text-white"
                    : "text-[#666666] hover:bg-[rgba(0,0,0,0.04)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] tracking-[-0.32px] text-[#999999]">
              {totalOrders.toLocaleString()} orders
            </span>
            <span className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
              {fmtRevenue(totalRevenue)}
            </span>
          </div>
        </div>

        {/* Revenue + Orders — Numeric Cards */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Revenue Card */}
          <Card>
            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">Revenue</h2>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                  <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">+8.2%</span>
                </div>
              </div>
              <p className="text-[13px] tracking-[-0.32px] text-[#999999]">Revenue breakdown</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-3">
                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#34A853]" />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Today</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.32px] text-[#181925]">
                    {fmtRevenue(7990)}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="size-3 text-[#34A853]" strokeWidth={2.5} />
                    <span className="text-[11px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">+12.4%</span>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-3">
                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[rgba(52,168,83,0.4)]" />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Yesterday</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.32px] text-[#181925]">
                    {fmtRevenue(9450)}
                  </p>
                  <p className="mt-1 text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                    vs {fmtRevenue(8120)}
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-3">
                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[rgba(52,168,83,0.2)]" />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">This Month</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.32px] text-[#181925]">
                    {fmtRevenue(totalRevenue)}
                  </p>
                  <p className="mt-1 text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                    {revenueData.length} days
                  </p>
                </div>
              </div>

              <div className="mt-4 h-[120px] px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData.slice(-7)} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34A853" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#34A853" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#999999" }}
                    />
                    <YAxis hide />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#34A853"
                      strokeWidth={2}
                      fill="url(#revGrad)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Orders Card */}
          <Card>
            <div className="px-5 pt-4 pb-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">Orders</h2>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-[#1A73E8]" strokeWidth={2.5} />
                  <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#1A73E8]">+12.5%</span>
                </div>
              </div>
              <p className="text-[13px] tracking-[-0.32px] text-[#999999]">Order breakdown</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-3">
                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#1A73E8]" />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Today</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.32px] text-[#181925]">
                    290
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <TrendingUp className="size-3 text-[#34A853]" strokeWidth={2.5} />
                    <span className="text-[11px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">+6.5%</span>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-3">
                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[rgba(26,115,232,0.4)]" />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Yesterday</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.32px] text-[#181925]">
                    310
                  </p>
                  <p className="mt-1 text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                    vs 280
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-3">
                  <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[rgba(26,115,232,0.2)]" />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">This Month</p>
                  <p className="mt-1.5 text-[20px] font-semibold tabular-nums leading-tight tracking-[-0.32px] text-[#181925]">
                    {totalOrders.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                    {ordersData.length} days
                  </p>
                </div>
              </div>

              <div className="mt-4 h-[120px] px-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ordersData.slice(-7)} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1A73E8" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#1A73E8" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#999999" }}
                    />
                    <YAxis hide />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#1A73E8"
                      strokeWidth={2}
                      fill="url(#ordGrad)"
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Platform Breakdown + Top Products */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          {/* Platform Breakdown */}
          <Card>
            <CardHeader title="Platform Breakdown" subtitle="Revenue share by platform" />
            <div className="flex flex-col gap-3.5 px-5 pb-5">
              {platformBreakdown.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="w-[80px] shrink-0 truncate text-[14px] tracking-[-0.32px] text-[#666666]">
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
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader title="Top Products" subtitle="Top 5 by revenue" />
            <div className="overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-[rgba(0,0,0,0.08)]">
                    <th className="px-5 pb-2 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Product</th>
                    <th className="px-3 pb-2 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Revenue</th>
                    <th className="px-3 pb-2 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Orders</th>
                    <th className="px-5 pb-2 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={p.name} className={i < topProducts.length - 1 ? "border-b border-[rgba(0,0,0,0.04)]" : ""}>
                      <td className="max-w-[200px] truncate px-5 py-3 text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                        {p.name}
                      </td>
                      <td className="px-3 py-3 text-right text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {fmtRevenue(p.revenue)}
                      </td>
                      <td className="px-3 py-3 text-right text-[14px] tabular-nums tracking-[-0.32px] text-[#666666]">
                        {p.orders.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end">
                          <MiniSparkline data={p.spark} color="#34A853" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Delivery Performance + Customer Metrics */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {/* Delivery Performance */}
          <Card>
            <CardHeader title="Delivery Performance" subtitle="Avg delivery time & success rate" />
            <div className="grid grid-cols-2 gap-4 px-5 pb-2">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#918DF6]/10">
                  <Clock className="size-4 text-[#918DF6]" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[12px] tracking-[-0.32px] text-[#999999]">Avg Time</p>
                  <p className="text-[18px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">2.4s</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#34A853]/10">
                  <CheckCircle2 className="size-4 text-[#34A853]" strokeWidth={2} />
                </span>
                <div>
                  <p className="text-[12px] tracking-[-0.32px] text-[#999999]">Success Rate</p>
                  <p className="text-[18px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">99.7%</p>
                </div>
              </div>
            </div>
            <div className="relative h-[180px] px-2 pb-3">
              <div className="absolute top-0 bottom-0 left-0 w-[3px] rounded-l-xl bg-[#918DF6]" />
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={deliveryTrend} margin={{ top: 12, right: 12, left: 12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="delGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#918DF6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#918DF6" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#999999" }}
                  />
                  <YAxis hide />
                  <Area
                    type="monotone"
                    dataKey="avgTime"
                    stroke="#918DF6"
                    strokeWidth={2}
                    fill="url(#delGrad)"
                    dot={false}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-7 gap-1 px-5 pb-4">
              {deliveryTrend.map((d) => {
                const min = 99.0
                const max = 100.0
                const pct = ((d.successRate - min) / (max - min)) * 100
                return (
                  <div key={d.day} className="flex flex-col items-center gap-1">
                    <span className="text-[11px] tracking-[-0.32px] text-[#999999]">{d.day}</span>
                    <div className="relative flex h-[48px] w-full items-end justify-center rounded bg-[rgba(0,0,0,0.03)]">
                      <div
                        className="w-full rounded bg-[#34A853]/20"
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                      {d.successRate.toFixed(1)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Customer Metrics */}
          <Card>
            <CardHeader title="Customer Metrics" subtitle="New vs returning & top customers" />
            <div className="grid grid-cols-2 gap-4 px-5 pb-4">
              <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-4 py-3">
                <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#1A73E8]" />
                <div className="flex items-center gap-2">
                  <UserPlus className="size-4 text-[#1A73E8]" strokeWidth={2} />
                  <span className="text-[12px] tracking-[-0.32px] text-[#999999]">New</span>
                </div>
                <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">342</p>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp className="size-3 text-[#34A853]" strokeWidth={2.5} />
                  <span className="text-[12px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">+18.3%</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] px-4 py-3">
                <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-[#918DF6]" />
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-[#918DF6]" strokeWidth={2} />
                  <span className="text-[12px] tracking-[-0.32px] text-[#999999]">Returning</span>
                </div>
                <p className="mt-1 text-[22px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">1,247</p>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingUp className="size-3 text-[#34A853]" strokeWidth={2.5} />
                  <span className="text-[12px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">+7.1%</span>
                </div>
              </div>
            </div>

            {/* Ratio bar */}
            <div className="px-5 pb-4">
              <div className="flex h-[8px] w-full overflow-hidden rounded-full">
                <div className="h-full bg-[#1A73E8]" style={{ width: "21.5%" }} />
                <div className="h-full bg-[#918DF6]" style={{ width: "78.5%" }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[12px] tracking-[-0.32px] text-[#666666]">
                  <span className="size-2 rounded-full bg-[#1A73E8]" />
                  New 21.5%
                </span>
                <span className="flex items-center gap-1.5 text-[12px] tracking-[-0.32px] text-[#666666]">
                  <span className="size-2 rounded-full bg-[#918DF6]" />
                  Returning 78.5%
                </span>
              </div>
            </div>

            {/* Top Customers */}
            <div className="border-t border-[rgba(0,0,0,0.08)] px-5 pt-3 pb-4">
              <div className="mb-2 flex items-center gap-1.5">
                <Crown className="size-3.5 text-[#E37400]" strokeWidth={2} />
                <span className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">Top Customers</span>
              </div>
              <div className="flex flex-col gap-2">
                {topCustomers.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[rgba(0,0,0,0.05)] text-[11px] font-semibold tabular-nums text-[#666666]">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px] tracking-[-0.32px] text-[#181925]">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-[13px] tabular-nums tracking-[-0.32px] text-[#666666]">
                      {c.orders} orders
                    </span>
                    <span className="w-20 shrink-0 text-right text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                      {fmtRevenue(c.spent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
