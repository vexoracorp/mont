import { useState, useRef, useEffect, useCallback } from "react"
import {
  Search,
  Loader2,
  Database,
  Key,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  X,
  Copy,
  Check,
  AlertTriangle,
  ChevronDown,
  Gamepad2,
  CreditCard,
  RefreshCw,
  Monitor,
  Filter,
} from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"

type InventoryStatus = "Available" | "Reserved" | "Delivered" | "Expired"

type ProductCategory = "Game Key" | "Gift Card" | "Subscription" | "Software"

type InventoryItem = {
  id: string
  product: string
  keyCode: string
  deliveryCode: string
  status: InventoryStatus
  addedDate: string
  deliveredTo: string
  category: ProductCategory
}

const statusConfig: Record<InventoryStatus, { color: string; bg: string; icon: typeof Check }> = {
  Available: { color: "#34A853", bg: "rgba(52,168,83,0.08)", icon: Check },
  Reserved: { color: "#E37400", bg: "rgba(227,116,0,0.08)", icon: Clock },
  Delivered: { color: "#1A73E8", bg: "rgba(26,115,232,0.08)", icon: ArrowUpRight },
  Expired: { color: "#D93025", bg: "rgba(217,48,37,0.08)", icon: X },
}

const categoryConfig: Record<ProductCategory, { color: string; bg: string; icon: typeof Gamepad2 }> = {
  "Game Key": { color: "#918DF6", bg: "rgba(145,141,246,0.08)", icon: Gamepad2 },
  "Gift Card": { color: "#E37400", bg: "rgba(227,116,0,0.08)", icon: CreditCard },
  "Subscription": { color: "#1A73E8", bg: "rgba(26,115,232,0.08)", icon: RefreshCw },
  "Software": { color: "#34A853", bg: "rgba(52,168,83,0.08)", icon: Monitor },
}

const allInventory: InventoryItem[] = [
  { id: "INV001", product: "Steam Wallet $50 Gift Card", keyCode: "5294-7183-6042-9517", deliveryCode: "STK04HMALNTK", status: "Delivered", addedDate: "Apr 20, 2026", deliveredTo: "Alex Turner", category: "Gift Card" },
  { id: "INV002", product: "Steam Wallet $50 Gift Card", keyCode: "8431-2057-9964-7182", deliveryCode: "", status: "Available", addedDate: "Apr 21, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV003", product: "Xbox Game Pass Ultimate 1M", keyCode: "XGP9L2R7M5QA", deliveryCode: "Q8N4V1K7P3LS", status: "Delivered", addedDate: "Apr 18, 2026", deliveredTo: "김수현", category: "Subscription" },
  { id: "INV004", product: "Xbox Game Pass Ultimate 1M", keyCode: "XKT4P9Q2M7LD", deliveryCode: "", status: "Reserved", addedDate: "Apr 22, 2026", deliveredTo: "", category: "Subscription" },
  { id: "INV005", product: "PlayStation Plus Premium 3M", keyCode: "PSP4N8V2K7HT", deliveryCode: "M6R2X9Q4L8PA", status: "Delivered", addedDate: "Apr 15, 2026", deliveredTo: "한지민", category: "Subscription" },
  { id: "INV006", product: "PlayStation Plus Premium 3M", keyCode: "PSY8L3M6Q1RN", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Subscription" },
  { id: "INV007", product: "Netflix Gift Card $25", keyCode: "6729-1438-5502-3461", deliveryCode: "", status: "Expired", addedDate: "Mar 10, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV008", product: "Netflix Gift Card $25", keyCode: "9184-7762-1305-4890", deliveryCode: "", status: "Expired", addedDate: "Mar 12, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV009", product: "Elden Ring Shadow of the Erdtree", keyCode: "4HK9N-T2VPL-8RWMX", deliveryCode: "H2K7M9R4V6QZ", status: "Delivered", addedDate: "Apr 19, 2026", deliveredTo: "James Kim", category: "Game Key" },
  { id: "INV010", product: "Elden Ring Shadow of the Erdtree", keyCode: "J3Q8Z-L7N5C-H2T9P", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Game Key" },
  { id: "INV011", product: "Adobe Creative Cloud 1M", keyCode: "F7N2-Q9PV-8WLX-3HDJ", deliveryCode: "R5M8T2Q7L4NB", status: "Delivered", addedDate: "Apr 17, 2026", deliveredTo: "정하은", category: "Software" },
  { id: "INV012", product: "Adobe Creative Cloud 1M", keyCode: "K4M8-R2TX-7PQN-5VLD", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software" },
  { id: "INV013", product: "Spotify Premium 6M", keyCode: "SPT6M8KN4WPR", deliveryCode: "L9Q4V7M2X8HD", status: "Delivered", addedDate: "Apr 16, 2026", deliveredTo: "오준서", category: "Subscription" },
  { id: "INV014", product: "Spotify Premium 6M", keyCode: "SPT4N7Q2L8VX", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Subscription" },
  { id: "INV015", product: "Windows 11 Pro Key", keyCode: "VK7JG-NPHTM-C97JM-9MPGT-3V66T", deliveryCode: "W3Q8N6M2L9PX", status: "Delivered", addedDate: "Apr 14, 2026", deliveredTo: "박민지", category: "Software" },
  { id: "INV016", product: "Windows 11 Pro Key", keyCode: "Q9D8F-L2M7V-R4P3X-T6N8K-5W1HJ", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software" },
  { id: "INV017", product: "Windows 11 Pro Key", keyCode: "R4M7K-N8P2V-X5L9Q-T3H6J-1W8DF", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software" },
  { id: "INV018", product: "Cyberpunk 2077 Ultimate Bundle", keyCode: "P9D4A-3N7TX-K6WQ8", deliveryCode: "C8V2M6Q9L4RP", status: "Delivered", addedDate: "Apr 13, 2026", deliveredTo: "이서연", category: "Game Key" },
  { id: "INV019", product: "Cyberpunk 2077 Ultimate Bundle", keyCode: "R7H2M-K5Q9V-N4TLC", deliveryCode: "", status: "Available", addedDate: "Apr 22, 2026", deliveredTo: "", category: "Game Key" },
  { id: "INV020", product: "Microsoft 365 Family 1Y", keyCode: "Q5R8M-3N6P2-L7K4V", deliveryCode: "J7N4M2Q8L5TX", status: "Delivered", addedDate: "Apr 12, 2026", deliveredTo: "김나연", category: "Software" },
  { id: "INV021", product: "Microsoft 365 Family 1Y", keyCode: "D8P4L-9VQ2T-H3M7R", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Software" },
  { id: "INV022", product: "Roblox Gift Card $25", keyCode: "2559-6481-0374-9026", deliveryCode: "N4L8Q2V7M5HD", status: "Delivered", addedDate: "Apr 11, 2026", deliveredTo: "Emily Chen", category: "Gift Card" },
  { id: "INV023", product: "Roblox Gift Card $25", keyCode: "4308-5921-7640-2187", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV024", product: "Roblox Gift Card $25", keyCode: "6651-2048-9376-5813", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV025", product: "YouTube Premium 3M", keyCode: "YTP8Q6M3R1LD", deliveryCode: "V2M9Q4L7N8PX", status: "Delivered", addedDate: "Apr 10, 2026", deliveredTo: "윤서아", category: "Subscription" },
  { id: "INV026", product: "YouTube Premium 3M", keyCode: "YTP4L8N2Q7MV", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Subscription" },
  { id: "INV027", product: "Monster Hunter Wilds", keyCode: "6VMR2-X8KQH-4PZ7L", deliveryCode: "K5M8Q2V7L4NT", status: "Delivered", addedDate: "Apr 9, 2026", deliveredTo: "Brandon Lee", category: "Game Key" },
  { id: "INV028", product: "Monster Hunter Wilds", keyCode: "8F3WQ-N6L2P-V9R5K", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Game Key" },
  { id: "INV029", product: "Steam Wallet $50 Gift Card", keyCode: "5724-8391-6408-2157", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV030", product: "Steam Wallet $50 Gift Card", keyCode: "7083-1956-4270-8641", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV031", product: "Xbox Game Pass Ultimate 1M", keyCode: "XQ4N7L2M8VPA", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Subscription" },
  { id: "INV032", product: "Elden Ring Shadow of the Erdtree", keyCode: "2ZP6C-J8X4M-T7QHN", deliveryCode: "", status: "Expired", addedDate: "Mar 5, 2026", deliveredTo: "", category: "Game Key" },
  { id: "INV033", product: "Spotify Premium 6M", keyCode: "SPT8N2V5Q7LR", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Subscription" },
  { id: "INV034", product: "Adobe Creative Cloud 1M", keyCode: "L3M8Q7V2N4PX", deliveryCode: "T6Q9M2R7L5HD", status: "Delivered", addedDate: "Apr 8, 2026", deliveredTo: "송유진", category: "Software" },
  { id: "INV035", product: "Windows 11 Pro Key", keyCode: "H7N2Q-L9M4V-P3X8R-T6K1J-5W9FD", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Software" },
  { id: "INV036", product: "PlayStation Plus Premium 3M", keyCode: "PSP9K4M7Q2VL", deliveryCode: "G8M2Q6L9V4NX", status: "Delivered", addedDate: "Apr 7, 2026", deliveredTo: "David Park", category: "Subscription" },
  { id: "INV037", product: "Cyberpunk 2077 Ultimate Bundle", keyCode: "T5Q8M2L7V9PX", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Game Key" },
  { id: "INV038", product: "Microsoft 365 Family 1Y", keyCode: "P8V4M7Q2L9TX", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software" },
  { id: "INV039", product: "Netflix Gift Card $25", keyCode: "1298-4075-6631-2584", deliveryCode: "", status: "Expired", addedDate: "Feb 28, 2026", deliveredTo: "", category: "Gift Card" },
  { id: "INV040", product: "Roblox Gift Card $25", keyCode: "9513-6248-1705-4932", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card" },
]

function maskKey(key: string): string {
  if (key.length <= 8) return key
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date("Apr 26, 2026")
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function getAvailableByProduct(): { product: string; available: number; total: number }[] {
  const map = new Map<string, { available: number; total: number }>()
  for (const item of allInventory) {
    const entry = map.get(item.product) ?? { available: 0, total: 0 }
    entry.total++
    if (item.status === "Available") entry.available++
    map.set(item.product, entry)
  }
  return Array.from(map.entries())
    .map(([product, counts]) => ({ product, ...counts }))
    .filter((p) => p.available <= 1 && p.total > 1)
    .sort((a, b) => a.available - b.available)
}

const PAGE_SIZE = 15

export default function Inventory() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [productFilter, setProductFilter] = useState("All")
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const uniqueProducts = Array.from(new Set(allInventory.map((i) => i.product))).sort()
  const lowStockProducts = getAvailableByProduct()

  const handleCopyKey = (id: string, key: string) => {
    void navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const filtered = allInventory.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false
    if (productFilter !== "All" && item.product !== productFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        item.id.toLowerCase().includes(q) ||
        item.product.toLowerCase().includes(q) ||
        item.keyCode.toLowerCase().includes(q) ||
        item.deliveredTo.toLowerCase().includes(q)
      )
    }
    return true
  })

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [statusFilter, productFilter, searchQuery])

  const visibleItems = filtered.slice(0, displayCount)
  const allLoaded = displayCount >= filtered.length

  const loadMore = useCallback(() => {
    if (loading || allLoaded) return
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length))
      setLoading(false)
    }, 600)
  }, [loading, allLoaded, filtered.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  const counts = {
    total: allInventory.length,
    available: allInventory.filter((i) => i.status === "Available").length,
    reserved: allInventory.filter((i) => i.status === "Reserved").length,
    delivered: allInventory.filter((i) => i.status === "Delivered").length,
    expired: allInventory.filter((i) => i.status === "Expired").length,
  }

  const summaryCards = [
    { label: "Total Keys", value: counts.total, icon: Database, color: "#918DF6", pct: 100 },
    { label: "Available", value: counts.available, icon: Key, color: "#34A853", pct: Math.round((counts.available / counts.total) * 100) },
    { label: "Reserved", value: counts.reserved, icon: Clock, color: "#E37400", pct: Math.round((counts.reserved / counts.total) * 100) },
    { label: "Delivered", value: counts.delivered, icon: CheckCircle2, color: "#1A73E8", pct: Math.round((counts.delivered / counts.total) * 100) },
  ]

  return (
    <DashboardLayout
      title="Inventory"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4 pb-4 lg:px-8">
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3.5"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="absolute top-0 left-0 h-full w-[3px]"
                  style={{ backgroundColor: card.color }}
                />
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">{card.label}</p>
                    <p className="mt-1 text-[28px] font-bold tabular-nums leading-none tracking-[-0.32px] text-[#181925]">{card.value}</p>
                  </div>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.color}12` }}
                  >
                    <Icon className="size-4" style={{ color: card.color }} strokeWidth={2} />
                  </span>
                </div>
                <p className="mt-2 text-[12px] font-medium tabular-nums tracking-[-0.32px]" style={{ color: card.color }}>
                  {card.pct}% of total
                </p>
              </div>
            )
          })}
        </div>

        {lowStockProducts.length > 0 && (
          <div
            className="mb-3 flex items-center gap-2.5 rounded-xl border border-[#E37400]/15 px-4 py-2.5"
            style={{ backgroundColor: "rgba(227,116,0,0.04)" }}
          >
            <AlertTriangle className="size-4 shrink-0 text-[#E37400]" strokeWidth={2} />
            <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
              Low stock:{" "}
              {lowStockProducts.map((p, i) => (
                <span key={p.product}>
                  <span className="font-semibold text-[#181925]">{p.product}</span>
                  <span className="text-[#999999]"> ({p.available} left)</span>
                  {i < lowStockProducts.length - 1 && <span className="text-[#999999]"> · </span>}
                </span>
              ))}
            </p>
          </div>
        )}

        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
        >
          <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-b border-[rgba(0,0,0,0.08)] px-5 py-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 w-[140px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pr-3 pl-8 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
              >
                <option>All</option>
                <option>Available</option>
                <option>Reserved</option>
                <option>Delivered</option>
                <option>Expired</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
            </div>
            <div className="relative">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="h-9 w-[230px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
              >
                <option>All</option>
                {uniqueProducts.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
            </div>
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, product, key, customer..."
                className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-[#FAFAFA]">
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Product</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Key Code</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Status</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Added</th>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Delivered to</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item, idx) => {
                  const sc = statusConfig[item.status]
                  const StatusIcon = sc.icon
                  const cc = categoryConfig[item.category]
                  const CatIcon = cc.icon
                  const isCopied = copiedId === item.id
                  return (
                    <tr
                      key={item.id}
                      className="group border-b border-[rgba(0,0,0,0.05)] transition-colors"
                      style={{
                        backgroundColor: idx % 2 === 1 ? "rgba(0,0,0,0.015)" : undefined,
                      }}
                    >
                      <td className="relative px-5 py-3">
                        <div
                          className="absolute top-0 left-0 h-full w-[2px] opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: sc.color }}
                        />
                        <div className="flex items-center gap-2.5">
                          <span
                            className="flex size-6 shrink-0 items-center justify-center rounded"
                            style={{ backgroundColor: cc.bg }}
                          >
                            <CatIcon className="size-3.5" style={{ color: cc.color }} strokeWidth={2} />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                              {item.product}
                            </span>
                            <span
                              className="text-[11px] font-medium tracking-[-0.32px]"
                              style={{ color: cc.color }}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[13px] tracking-[0.5px] text-[#666666]">
                            {maskKey(item.keyCode)}
                          </span>
                          <button
                            onClick={() => handleCopyKey(item.id, item.keyCode)}
                            className="flex size-6 shrink-0 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.06)]"
                            title="Copy full key"
                          >
                            {isCopied ? (
                              <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                            ) : (
                              <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          <StatusIcon className="size-3" strokeWidth={2.5} />
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="text-[13px] tracking-[-0.32px] text-[#666666]"
                          title={item.addedDate}
                        >
                          {getRelativeTime(item.addedDate)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {item.deliveredTo ? (
                          <div className="flex items-center gap-2">
                            <span
                              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                              style={{ backgroundColor: sc.color }}
                            >
                              {item.deliveredTo.charAt(0)}
                            </span>
                            <span className="text-[14px] tracking-[-0.32px] text-[#181925]">
                              {item.deliveredTo}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[14px] text-[#999999]">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div ref={sentinelRef} className="h-1 shrink-0" />
          </div>

          <div className="flex shrink-0 items-center justify-center border-t border-[rgba(0,0,0,0.08)] px-5 py-3">
            {loading ? (
              <Loader2 className="size-4 animate-spin text-[#999999]" strokeWidth={2} />
            ) : allLoaded ? (
              <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                All {filtered.length} keys loaded
              </p>
            ) : (
              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                <span className="font-medium tabular-nums text-[#181925]">{visibleItems.length}</span> of{" "}
                <span className="font-medium tabular-nums text-[#181925]">{filtered.length}</span> keys loaded
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
