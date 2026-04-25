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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

// ─── Mock Data ───────────────────────────────────────────────

const revenueData = [
  { day: "Mon", revenue: 5420 },
  { day: "Tue", revenue: 6180 },
  { day: "Wed", revenue: 5890 },
  { day: "Thu", revenue: 7340 },
  { day: "Fri", revenue: 8120 },
  { day: "Sat", revenue: 9450 },
  { day: "Sun", revenue: 7990 },
]

const revenueChartConfig: ChartConfig = {
  revenue: {
    label: "Revenue",
    color: "#918DF6",
  },
}

const platformData = [
  { name: "Naver Store", value: 42, color: "#33C758" },
  { name: "G2G", value: 35, color: "#2C78FC" },
  { name: "G2A", value: 18, color: "#FFA600" },
  { name: "Direct", value: 5, color: "#918DF6" },
]

const platformChartConfig: ChartConfig = {
  value: { label: "Orders %" },
  "Naver Store": { label: "Naver Store", color: "#33C758" },
  G2G: { label: "G2G", color: "#2C78FC" },
  G2A: { label: "G2A", color: "#FFA600" },
  Direct: { label: "Direct", color: "#918DF6" },
}

const orders = [
  { id: "ORD-2847", platform: "Naver Store", product: "GTA V Premium Edition", amount: 29.99, status: "Delivered" as const, time: "2 min ago" },
  { id: "ORD-2846", platform: "G2G", product: "Elden Ring", amount: 42.99, status: "Delivered" as const, time: "8 min ago" },
  { id: "ORD-2845", platform: "G2A", product: "Xbox Game Pass 1 Month", amount: 12.99, status: "Processing" as const, time: "15 min ago" },
  { id: "ORD-2844", platform: "Naver Store", product: "Windows 11 Pro Key", amount: 24.99, status: "Delivered" as const, time: "23 min ago" },
  { id: "ORD-2843", platform: "G2G", product: "PS Plus 12 Months", amount: 59.99, status: "Delivered" as const, time: "41 min ago" },
  { id: "ORD-2842", platform: "G2A", product: "FIFA 25 Standard", amount: 49.99, status: "Failed" as const, time: "1 hour ago" },
  { id: "ORD-2841", platform: "Naver Store", product: "Elden Ring", amount: 42.99, status: "Delivered" as const, time: "1 hour ago" },
  { id: "ORD-2840", platform: "G2G", product: "GTA V Premium Edition", amount: 29.99, status: "Delivered" as const, time: "2 hours ago" },
  { id: "ORD-2839", platform: "Direct", product: "Windows 11 Pro Key", amount: 24.99, status: "Delivered" as const, time: "3 hours ago" },
  { id: "ORD-2838", platform: "Naver Store", product: "Xbox Game Pass 1 Month", amount: 12.99, status: "Processing" as const, time: "3 hours ago" },
]

const inventory = [
  { name: "GTA V Premium Edition", remaining: 142, total: 200 },
  { name: "Elden Ring", remaining: 8, total: 100 },
  { name: "Xbox Game Pass 1 Month", remaining: 67, total: 150 },
  { name: "Windows 11 Pro Key", remaining: 3, total: 50 },
  { name: "PS Plus 12 Months", remaining: 34, total: 80 },
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
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.08)] px-5 pt-6 pb-5">
        <span className="relative flex size-7 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
          <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-[#F5F5F6]" />
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
          Mont
        </span>
      </div>

      {/* Nav */}
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

        {/* Separator */}
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

      {/* User */}
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

// ─── Metric Card ─────────────────────────────────────────────

function MetricCard({
  label,
  value,
  change,
  changeLabel,
  dotColor,
  positive,
}: {
  label: string
  value: string
  change: string
  changeLabel: string
  dotColor: string
  positive: boolean
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 pt-4 pb-4 transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div
        className="absolute top-0 bottom-0 left-0 w-[3px]"
        style={{ backgroundColor: dotColor }}
      />
      <div className="flex items-center gap-2">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-[32px] font-semibold leading-tight tracking-[-0.32px] tabular-nums text-[#181925]">
        {value}
      </p>
      <div className="mt-2 flex items-center gap-1.5">
        {positive ? (
          <TrendingUp className="size-3.5 text-[#33C758]" strokeWidth={2.5} />
        ) : (
          <TrendingDown className="size-3.5 text-[#33C758]" strokeWidth={2.5} />
        )}
        <span className="text-[13px] font-medium tracking-[-0.32px] text-[#33C758]">
          {change}
        </span>
        <span className="text-[12px] tracking-[-0.32px] text-[#999999]">
          {changeLabel}
        </span>
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
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[12px] font-medium tracking-[-0.32px] ${styles[status]}`}>
      {status}
    </span>
  )
}

// ─── Inventory Row ───────────────────────────────────────────

function InventoryRow({ item }: { item: typeof inventory[number] }) {
  const pct = (item.remaining / item.total) * 100
  const barColor = pct > 30 ? "#33C758" : pct > 15 ? "#FFA600" : "#FF2F00"
  const isLow = item.remaining < 10

  return (
    <div className="flex items-center gap-4 py-3.5">
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold text-white"
        style={{ backgroundColor: barColor }}
      >
        {item.name.charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
            {item.name}
          </p>
          {isLow && (
            <Badge className="h-[18px] gap-0.5 rounded-md border-0 bg-[#FF2F00]/10 px-1.5 text-[10px] font-medium text-[#FF2F00]">
              <AlertTriangle className="size-2.5" />
              Low stock
            </Badge>
          )}
        </div>
        <div className="mt-2 h-[8px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: barColor }}
          />
        </div>
      </div>
      <span className="shrink-0 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
        {item.remaining}
        <span className="font-normal text-[#999999]"> / {item.total}</span>
      </span>
      {isLow && (
        <Button
          variant="ghost"
          className="h-7 rounded-full border border-[rgba(0,0,0,0.08)] px-3 text-[12px] font-medium text-[#666666] hover:bg-[rgba(0,0,0,0.04)]"
        >
          Restock
        </Button>
      )}
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "reports">("overview")

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
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header
          className="sticky top-0 z-30 border-b border-[rgba(0,0,0,0.08)] bg-[#F7F7F8]/80 backdrop-blur-sm"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center justify-between px-6 pt-4 pb-3 lg:px-8">
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
              <h1 className="text-2xl font-bold tracking-[-0.32px] text-[#181925]">
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
          </div>
          <div className="flex gap-0 px-6 lg:px-8">
            {(["overview", "analytics", "reports"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 pb-2.5 text-[13px] font-medium capitalize tracking-[-0.32px] transition-colors ${
                  activeTab === tab
                    ? "text-[#181925]"
                    : "text-[#999999] hover:text-[#666666]"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute right-0 bottom-0 left-0 h-[2px] rounded-full bg-[#918DF6]" />
                )}
              </button>
            ))}
          </div>
        </header>

        <div className="px-6 pt-5 pb-12 lg:px-8">
          {/* KPI Metrics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Total Orders"
              value="2,847"
              change="+12.5%"
              changeLabel="from last month"
              dotColor="#2C78FC"
              positive
            />
            <MetricCard
              label="Revenue"
              value="$48,392"
              change="+8.2%"
              changeLabel="from last month"
              dotColor="#33C758"
              positive
            />
            <MetricCard
              label="Delivery Success"
              value="99.7%"
              change="+0.3%"
              changeLabel="from last month"
              dotColor="#33C758"
              positive
            />
            <MetricCard
              label="Avg Delivery Time"
              value="2.4s"
              change="-0.8s"
              changeLabel="from last month"
              dotColor="#918DF6"
              positive={false}
            />
          </div>

          {/* Orders (left) + Revenue Chart (right) */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_480px]">
            {/* Recent Orders */}
            <Card
              className="border-[rgba(0,0,0,0.08)] bg-white transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <CardHeader className="p-6">
                <CardTitle className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Recent Orders
                </CardTitle>
                <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                  Last 10 transactions
                </p>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[rgba(0,0,0,0.08)] bg-neutral-50/80 hover:bg-neutral-50/80">
                      <TableHead className="pl-6 text-[12px] font-semibold tracking-[-0.32px] text-[#666666]">Order</TableHead>
                      <TableHead className="text-[12px] font-semibold tracking-[-0.32px] text-[#666666]">Platform</TableHead>
                      <TableHead className="text-[12px] font-semibold tracking-[-0.32px] text-[#666666]">Product</TableHead>
                      <TableHead className="text-right text-[12px] font-semibold tracking-[-0.32px] text-[#666666]">Amount</TableHead>
                      <TableHead className="text-[12px] font-semibold tracking-[-0.32px] text-[#666666]">Status</TableHead>
                      <TableHead className="pr-6 text-right text-[12px] font-semibold tracking-[-0.32px] text-[#666666]">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-[rgba(0,0,0,0.08)] transition-colors hover:bg-neutral-50/50">
                        <TableCell className="pl-6 font-mono text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-[14px] tracking-[-0.32px] text-[#666666]">
                          {order.platform}
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate text-[14px] tracking-[-0.32px] text-[#181925]">
                          {order.product}
                        </TableCell>
                        <TableCell className="text-right font-mono text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          ${order.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="pr-6 text-right text-[12px] tracking-[-0.32px] text-[#999999]">
                          {order.time}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="border-t border-[rgba(0,0,0,0.08)] px-6 py-3">
                  <button className="flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]">
                    View all orders
                    <ArrowRight className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card
              className="border-[rgba(0,0,0,0.08)] bg-white transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <CardHeader className="p-6">
                <CardTitle className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Revenue Trend
                </CardTitle>
                <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                  Last 7 days
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ChartContainer config={revenueChartConfig} className="aspect-auto h-[300px] w-full">
                  <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#918DF6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#918DF6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#999999" }}
                      dy={8}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#999999" }}
                      tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                      dx={-4}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => (
                            <span className="font-mono text-xs font-medium tabular-nums text-[#181925]">
                              ${Number(value).toLocaleString()}
                            </span>
                          )}
                        />
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#918DF6"
                      strokeWidth={2.5}
                      fill="url(#revenueGradient)"
                      dot={{ r: 3, fill: "#918DF6", stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 5, fill: "#918DF6", stroke: "#fff", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Platform Split + Inventory */}
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <Card
              className="border-[rgba(0,0,0,0.08)] bg-white transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <CardHeader className="p-6">
                <CardTitle className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Platform Split
                </CardTitle>
                <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                  Order distribution
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <ChartContainer config={platformChartConfig} className="aspect-auto h-[200px] w-full">
                  <BarChart data={platformData} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 13, fill: "#666666" }}
                      width={95}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => (
                            <span className="font-mono text-xs font-medium tabular-nums text-[#181925]">
                              {value}%
                            </span>
                          )}
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 6, 6, 0]}
                      barSize={28}
                      label={{ position: "right", fontSize: 12, fill: "#181925", fontWeight: 600, formatter: (v) => `${v}%` }}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>

                <div className="my-4 h-px bg-[rgba(0,0,0,0.08)]" />

                <div className="flex flex-col gap-3.5">
                  {platformData.map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-[14px] tracking-[-0.32px] text-[#666666]">{p.name}</span>
                      </div>
                      <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {p.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card
              className="border-[rgba(0,0,0,0.08)] bg-white transition-shadow hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)]"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <CardHeader className="p-6">
                <CardTitle className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Inventory Status
                </CardTitle>
                <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                  Keys remaining per product
                </p>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.08)]">
                  {inventory.map((item) => (
                    <InventoryRow key={item.name} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
