import { useState } from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Database,
  BarChart3,
  Settings,
  Menu,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// ─── Mock Data ───────────────────────────────────────────────

const sparklineData = {
  orders: [180, 220, 195, 240, 280, 310, 290].map((v, i) => ({ v, i })),
  revenue: [5420, 6180, 5890, 7340, 8120, 9450, 7990].map((v, i) => ({ v, i })),
  success: [99.2, 99.5, 99.3, 99.8, 99.6, 99.9, 99.7].map((v, i) => ({ v, i })),
  delivery: [3.1, 2.8, 2.9, 2.5, 2.6, 2.3, 2.4].map((v, i) => ({ v, i })),
}

const platformData = [
  { name: "Naver Store", value: 42, color: "#33C758" },
  { name: "G2G", value: 35, color: "#2C78FC" },
  { name: "G2A", value: 18, color: "#FFA600" },
  { name: "Direct", value: 5, color: "#918DF6" },
]

const orders = [
  { id: "ORD-2847", platform: "Naver Store", amount: 29.99, status: "Delivered" as const, time: "2 min ago" },
  { id: "ORD-2846", platform: "G2G", amount: 42.99, status: "Delivered" as const, time: "8 min ago" },
  { id: "ORD-2845", platform: "G2A", amount: 12.99, status: "Processing" as const, time: "15 min ago" },
  { id: "ORD-2844", platform: "Naver Store", amount: 24.99, status: "Delivered" as const, time: "23 min ago" },
  { id: "ORD-2843", platform: "G2G", amount: 59.99, status: "Delivered" as const, time: "41 min ago" },
  { id: "ORD-2842", platform: "G2A", amount: 49.99, status: "Failed" as const, time: "1 hour ago" },
]

const inventory = [
  { name: "Elden Ring", remaining: 8, total: 100 },
  { name: "Windows 11 Pro Key", remaining: 3, total: 50 },
  { name: "FIFA 25 Standard", remaining: 12, total: 60 },
]

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders", active: false },
  { label: "Products", icon: Package, href: "/dashboard/products", active: false },
  { label: "Inventory", icon: Database, href: "/dashboard/inventory", active: false },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics", active: false },
  { label: "Settings", icon: Settings, href: "/dashboard/settings", active: false },
]

// ─── Sidebar ─────────────────────────────────────────────────

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
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium tracking-[-0.32px] transition-colors ${
                  item.active
                    ? "bg-[#918DF6]/[0.12] text-[#918DF6]"
                    : "text-[#666666] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                }`}
              >
                {item.active && (
                  <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-[#918DF6]" />
                )}
                <Icon className="size-[18px]" strokeWidth={item.active ? 2.2 : 1.8} />
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
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium tracking-[-0.32px] transition-colors ${
                  item.active
                    ? "bg-[#918DF6]/[0.12] text-[#918DF6]"
                    : "text-[#666666] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                }`}
              >
                {item.active && (
                  <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-[#918DF6]" />
                )}
                <Icon className="size-[18px]" strokeWidth={item.active ? 2.2 : 1.8} />
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
}: {
  label: string
  value: string
  change: string
  dotColor: string
  positive: boolean
  sparkData: { v: number; i: number }[]
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
          <span className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {positive ? (
            <TrendingUp className="size-3 text-[#33C758]" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="size-3 text-[#33C758]" strokeWidth={2.5} />
          )}
          <span className="text-[12px] font-medium tracking-[-0.32px] text-[#33C758]">
            {change}
          </span>
        </div>
      </div>
      <p className="mt-1 text-[24px] font-semibold leading-tight tracking-[-0.32px] tabular-nums text-[#181925]">
        {value}
      </p>
      <div className="mt-1">
        <Sparkline data={sparkData} color={dotColor} />
      </div>
    </div>
  )
}

// ─── Status Badge ────────────────────────────────────────────

function StatusBadge({ status }: { status: "Delivered" | "Processing" | "Failed" }) {
  const styles = {
    Delivered: "bg-[#33C758]/10 text-[#33C758]",
    Processing: "bg-[#FFA600]/10 text-[#FFA600]",
    Failed: "bg-[#FF2F00]/10 text-[#FF2F00]",
  }
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-[-0.32px] ${styles[status]}`}>
      {status}
    </span>
  )
}

// ─── Dashboard ───────────────────────────────────────────────

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const lowStock = inventory.filter((item) => item.remaining < 20)

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

      {/* Main Content — no scroll */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header — compact */}
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
              Overview
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex h-8 items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-3.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]">
              <Calendar className="size-3.5" strokeWidth={2} />
              Apr 19 – Apr 25, 2026
            </button>
            <Button className="hidden h-8 rounded-full bg-[#918DF6] px-4 text-[13px] font-medium text-white hover:bg-[#9580FF] sm:flex">
              Export
            </Button>
          </div>
        </header>

        {/* Dashboard body */}
        <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-4 lg:px-8">
          {/* KPI Metrics — 4 cards */}
          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Orders"
              value="2,847"
              change="+12.5%"
              dotColor="#2C78FC"
              positive
              sparkData={sparklineData.orders}
            />
            <MetricCard
              label="Revenue"
              value="$48,392"
              change="+8.2%"
              dotColor="#33C758"
              positive
              sparkData={sparklineData.revenue}
            />
            <MetricCard
              label="Delivery Success"
              value="99.7%"
              change="+0.3%"
              dotColor="#33C758"
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

          {/* Main content: Orders table (left) + Right panel */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
            {/* Recent Orders */}
            <div
              className="flex flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between px-5 pt-3.5 pb-2.5">
                <div>
                  <h2 className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                    Recent Orders
                  </h2>
                  <p className="text-[11px] tracking-[-0.32px] text-[#999999]">
                    Last 6 transactions
                  </p>
                </div>
                <button className="flex items-center gap-1 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]">
                  View all
                  <ArrowRight className="size-3" strokeWidth={2} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[rgba(0,0,0,0.08)] bg-neutral-50/80 hover:bg-neutral-50/80">
                      <TableHead className="h-8 pl-5 text-[11px] font-semibold tracking-[-0.32px] text-[#666666]">Order</TableHead>
                      <TableHead className="h-8 text-[11px] font-semibold tracking-[-0.32px] text-[#666666]">Platform</TableHead>
                      <TableHead className="h-8 text-right text-[11px] font-semibold tracking-[-0.32px] text-[#666666]">Amount</TableHead>
                      <TableHead className="h-8 text-[11px] font-semibold tracking-[-0.32px] text-[#666666]">Status</TableHead>
                      <TableHead className="h-8 pr-5 text-right text-[11px] font-semibold tracking-[-0.32px] text-[#666666]">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-[rgba(0,0,0,0.08)] transition-colors hover:bg-neutral-50/50">
                        <TableCell className="h-10 pl-5 font-mono text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                          {order.id}
                        </TableCell>
                        <TableCell className="h-10 text-[13px] tracking-[-0.32px] text-[#666666]">
                          {order.platform}
                        </TableCell>
                        <TableCell className="h-10 text-right font-mono text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          ${order.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="h-10">
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="h-10 pr-5 text-right text-[11px] tracking-[-0.32px] text-[#999999]">
                          {order.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Right panel: Platform Split + Low Stock Alerts */}
            <div className="flex flex-col gap-4">
              {/* Platform Split */}
              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 pt-3.5 pb-4"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Platform Split
                </h2>
                <p className="text-[11px] tracking-[-0.32px] text-[#999999]">
                  Order distribution
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {platformData.map((p) => (
                    <div key={p.name} className="flex items-center gap-2.5">
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="w-[72px] shrink-0 text-[13px] tracking-[-0.32px] text-[#666666]">
                        {p.name}
                      </span>
                      <div className="flex-1">
                        <div className="h-[6px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${p.value}%`, backgroundColor: p.color }}
                          />
                        </div>
                      </div>
                      <span className="w-8 shrink-0 text-right text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {p.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div
                className="flex-1 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 pt-3.5 pb-4"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5 text-[#FFA600]" strokeWidth={2.2} />
                  <h2 className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                    Low Stock Alerts
                  </h2>
                </div>
                <p className="text-[11px] tracking-[-0.32px] text-[#999999]">
                  Products below 20 keys
                </p>
                {lowStock.length === 0 ? (
                  <p className="mt-3 text-[13px] tracking-[-0.32px] text-[#33C758]">
                    All products stocked ✓
                  </p>
                ) : (
                  <div className="mt-3 flex flex-col gap-3">
                    {lowStock.map((item) => {
                      const pct = (item.remaining / item.total) * 100
                      const barColor = pct > 15 ? "#FFA600" : "#FF2F00"
                      return (
                        <div key={item.name}>
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] tracking-[-0.32px] text-[#181925]">
                              {item.name}
                            </span>
                            <span className="text-[13px] font-semibold tabular-nums tracking-[-0.32px]" style={{ color: barColor }}>
                              {item.remaining}
                              <span className="font-normal text-[#999999]">/{item.total}</span>
                            </span>
                          </div>
                          <div className="mt-1 h-[5px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, backgroundColor: barColor }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
