import { useState, useRef, useEffect, useCallback } from "react"
import {
  Users,
  Search,
  Loader2,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Tag,
  Plus,
  X,
  ChevronDown,
  Filter,
  Send,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import DashboardLayout from "@/DashboardLayout"
import {
  type Currency,
  StatusBadge,
  DeliveryChannel,
  platformBadges,
  formatUSD,
  formatKRW,
} from "@/shared"

type CustomerOrder = {
  orderId: string
  product: string
  amount: number
  status: "Delivered" | "Processing" | "Failed"
  date: string
  delivery: string
}

type Customer = {
  id: string
  name: string
  email: string
  platform: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  firstOrderDate: string
  status: "Active" | "Inactive"
  tags: string[]
  memo: string
  orders: CustomerOrder[]
  channelData: Record<string, string>
}

const allCustomers: Customer[] = [
  {
    id: "CUS001",
    name: "\uc774\uc815\ud6a8",
    email: "leolee12@naver.com",
    platform: "Naver Store",
    totalOrders: 3,
    totalSpent: 84.97,
    lastOrderDate: "Apr 25, 2026",
    firstOrderDate: "Mar 10, 2026",
    status: "Active",
    tags: ["VIP", "repeat"],
    memo: "단골 고객, 대량 구매 시 할인 적용",
    channelData: { "Email": "leolee12@naver.com", "Telegram": "@leolee_12", "Naver ID": "leolee12" },
    orders: [
      { orderId: "4X7PA", product: "\uce94\ubc14 \ud504\ub85c Canva PRO 12\uac1c\uc6d4", amount: 29.99, status: "Delivered", date: "Apr 25, 2026", delivery: "Telegram" },
      { orderId: "7K2NQ", product: "Notion Plus 1\uac1c\uc6d4", amount: 9.99, status: "Delivered", date: "Apr 12, 2026", delivery: "Telegram" },
      { orderId: "2M8PL", product: "Spotify Premium 6\uac1c\uc6d4", amount: 44.99, status: "Delivered", date: "Mar 10, 2026", delivery: "Telegram" },
    ],
  },
  {
    id: "CUS002",
    name: "Alex Turner",
    email: "g2g_buyer_8821",
    platform: "G2G",
    totalOrders: 2,
    totalSpent: 85.98,
    lastOrderDate: "Apr 25, 2026",
    firstOrderDate: "Apr 15, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "Email": "g2g_buyer_8821@g2g.com", "G2G ID": "g2g_buyer_8821" },
    orders: [
      { orderId: "9K2BM", product: "Steam Wallet $50 Gift Card", amount: 42.99, status: "Delivered", date: "Apr 25, 2026", delivery: "Email" },
      { orderId: "8N3QV", product: "Steam Wallet $50 Gift Card", amount: 42.99, status: "Delivered", date: "Apr 15, 2026", delivery: "Email" },
    ],
  },
  {
    id: "CUS003",
    name: "\uae40\uc218\ud604",
    email: "g2a_user_3347",
    platform: "G2A",
    totalOrders: 2,
    totalSpent: 25.98,
    lastOrderDate: "Apr 25, 2026",
    firstOrderDate: "Apr 8, 2026",
    status: "Active",
    tags: ["new"],
    memo: "G2A 신규 고객",
    channelData: { "SMS": "010-9876-5432", "G2A ID": "g2a_user_3347" },
    orders: [
      { orderId: "3F8QN", product: "Xbox Game Pass Ultimate 1\uac1c\uc6d4", amount: 12.99, status: "Processing", date: "Apr 25, 2026", delivery: "SMS" },
      { orderId: "5T2WK", product: "Xbox Game Pass Ultimate 1\uac1c\uc6d4", amount: 12.99, status: "Delivered", date: "Apr 8, 2026", delivery: "SMS" },
    ],
  },
  {
    id: "CUS004",
    name: "\ubc15\ubbfc\uc9c0",
    email: "minji_park@naver.com",
    platform: "Naver Store",
    totalOrders: 2,
    totalSpent: 49.98,
    lastOrderDate: "Apr 25, 2026",
    firstOrderDate: "Apr 2, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "Email": "minji_park@naver.com", "Naver ID": "minji_park" },
    orders: [
      { orderId: "4R9MN", product: "Windows 11 Pro Key", amount: 24.99, status: "Delivered", date: "Apr 2, 2026", delivery: "Email" },
    ],
  },
  {
    id: "CUS005",
    name: "James Kim",
    email: "g2g_buyer_1204",
    platform: "G2G",
    totalOrders: 3,
    totalSpent: 139.97,
    lastOrderDate: "Apr 24, 2026",
    firstOrderDate: "Mar 20, 2026",
    status: "Active",
    tags: ["VIP"],
    memo: "WhatsApp 배송 실패 이력 있음 — 번호 확인 필요",
    channelData: { "Telegram": "@jameskim_gg", "G2G ID": "g2g_buyer_1204", "WhatsApp": "+82-10-5555-1204" },
    orders: [
      { orderId: "6R5VC", product: "Elden Ring Shadow of the Erdtree DLC", amount: 59.99, status: "Delivered", date: "Apr 24, 2026", delivery: "Telegram" },
      { orderId: "3K7NP", product: "Minecraft Java Edition", amount: 29.99, status: "Delivered", date: "Apr 10, 2026", delivery: "Telegram" },
      { orderId: "9Q2ML", product: "Cyberpunk 2077 Ultimate Bundle", amount: 49.99, status: "Delivered", date: "Mar 20, 2026", delivery: "Telegram" },
    ],
  },
  {
    id: "CUS006",
    name: "\ucd5c\uc601\ud638",
    email: "g2a_user_7790",
    platform: "G2A",
    totalOrders: 1,
    totalSpent: 49.99,
    lastOrderDate: "Apr 24, 2026",
    firstOrderDate: "Apr 24, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "WhatsApp": "+82-10-3344-7790", "G2A ID": "g2a_user_7790" },
    orders: [
      { orderId: "2H9TE", product: "FIFA 25 Ultimate Edition", amount: 49.99, status: "Failed", date: "Apr 24, 2026", delivery: "WhatsApp" },
    ],
  },
  {
    id: "CUS007",
    name: "\uc815\ud558\uc740",
    email: "haeun_j@naver.com",
    platform: "Naver Store",
    totalOrders: 2,
    totalSpent: 69.98,
    lastOrderDate: "Apr 24, 2026",
    firstOrderDate: "Apr 5, 2026",
    status: "Active",
    tags: ["repeat"],
    memo: "Naver Store 단골",
    channelData: { "Email": "haeun_j@naver.com", "Naver ID": "haeun_j" },
    orders: [
      { orderId: "8M3KP", product: "Adobe Creative Cloud 1\uac1c\uc6d4", amount: 34.99, status: "Delivered", date: "Apr 24, 2026", delivery: "Email" },
      { orderId: "1N6QR", product: "Adobe Creative Cloud 1\uac1c\uc6d4", amount: 34.99, status: "Delivered", date: "Apr 5, 2026", delivery: "Email" },
    ],
  },
  {
    id: "CUS008",
    name: "David Park",
    email: "g2g_buyer_5512",
    platform: "G2G",
    totalOrders: 2,
    totalSpent: 39.98,
    lastOrderDate: "Apr 23, 2026",
    firstOrderDate: "Apr 10, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "Telegram": "@davidpark_gg", "G2G ID": "g2g_buyer_5512" },
    orders: [
      { orderId: "1Q6WJ", product: "Minecraft Java Edition", amount: 19.99, status: "Delivered", date: "Apr 23, 2026", delivery: "Telegram" },
      { orderId: "6V4KM", product: "Minecraft Java Edition", amount: 19.99, status: "Delivered", date: "Apr 10, 2026", delivery: "Telegram" },
    ],
  },
  {
    id: "CUS009",
    name: "\uc774\uc11c\uc5f0",
    email: "seoyeon@gmail.com",
    platform: "Direct",
    totalOrders: 2,
    totalSpent: 99.98,
    lastOrderDate: "Apr 23, 2026",
    firstOrderDate: "Apr 1, 2026",
    status: "Active",
    tags: ["VIP", "direct"],
    memo: "자사몰 직접 구매 고객, 특별 할인 대상",
    channelData: { "Email": "seoyeon@gmail.com" },
    orders: [
      { orderId: "5T4NR", product: "Cyberpunk 2077 Ultimate Bundle", amount: 89.99, status: "Delivered", date: "Apr 23, 2026", delivery: "Email" },
      { orderId: "8W2LP", product: "Notion Plus 1\uac1c\uc6d4", amount: 9.99, status: "Delivered", date: "Apr 1, 2026", delivery: "Email" },
    ],
  },
  {
    id: "CUS010",
    name: "\ud55c\uc9c0\ubbfc",
    email: "jimin_han@naver.com",
    platform: "Naver Store",
    totalOrders: 2,
    totalSpent: 89.98,
    lastOrderDate: "Apr 22, 2026",
    firstOrderDate: "Apr 3, 2026",
    status: "Active",
    tags: ["repeat"],
    memo: "",
    channelData: { "Email": "jimin_han@naver.com", "Telegram": "@jimin_han", "Naver ID": "jimin_han" },
    orders: [
      { orderId: "4Y2GH", product: "PS Plus Premium 3\uac1c\uc6d4", amount: 44.99, status: "Delivered", date: "Apr 22, 2026", delivery: "Telegram" },
      { orderId: "7M5NQ", product: "PS Plus Premium 3\uac1c\uc6d4", amount: 44.99, status: "Delivered", date: "Apr 3, 2026", delivery: "Telegram" },
    ],
  },
  {
    id: "CUS011",
    name: "\uc624\uc900\uc11c",
    email: "junseo_oh@naver.com",
    platform: "Naver Store",
    totalOrders: 1,
    totalSpent: 39.99,
    lastOrderDate: "Apr 21, 2026",
    firstOrderDate: "Apr 21, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "SMS": "010-1234-5678", "Naver ID": "junseo_oh" },
    orders: [
      { orderId: "3K1MZ", product: "Spotify Premium 6\uac1c\uc6d4", amount: 39.99, status: "Delivered", date: "Apr 21, 2026", delivery: "SMS" },
    ],
  },
  {
    id: "CUS012",
    name: "Emily Chen",
    email: "g2g_buyer_3345",
    platform: "G2G",
    totalOrders: 2,
    totalSpent: 44.00,
    lastOrderDate: "Apr 20, 2026",
    firstOrderDate: "Apr 5, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "Email": "g2g_buyer_3345@g2g.com", "G2G ID": "g2g_buyer_3345" },
    orders: [
      { orderId: "9D7QL", product: "Roblox Gift Card $25", amount: 22.00, status: "Delivered", date: "Apr 20, 2026", delivery: "Email" },
      { orderId: "2P8WN", product: "Roblox Gift Card $25", amount: 22.00, status: "Delivered", date: "Apr 5, 2026", delivery: "Email" },
    ],
  },
  {
    id: "CUS013",
    name: "Brandon Lee",
    email: "g2g_buyer_1167",
    platform: "G2G",
    totalOrders: 1,
    totalSpent: 41.50,
    lastOrderDate: "Apr 18, 2026",
    firstOrderDate: "Apr 18, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "Telegram": "@brandonlee_gg", "G2G ID": "g2g_buyer_1167" },
    orders: [
      { orderId: "5A9EQ", product: "Monster Hunter Wilds", amount: 41.50, status: "Delivered", date: "Apr 18, 2026", delivery: "Telegram" },
    ],
  },
  {
    id: "CUS014",
    name: "\uae40\ub098\uc5f0",
    email: "nayeon_k@naver.com",
    platform: "Naver Store",
    totalOrders: 1,
    totalSpent: 59.99,
    lastOrderDate: "Apr 14, 2026",
    firstOrderDate: "Apr 14, 2026",
    status: "Active",
    tags: [],
    memo: "",
    channelData: { "Email": "nayeon_k@naver.com", "Naver ID": "nayeon_k" },
    orders: [
      { orderId: "8B7WQ", product: "Microsoft 365 Family 1\ub144", amount: 59.99, status: "Delivered", date: "Apr 14, 2026", delivery: "Email" },
    ],
  },
  {
    id: "CUS015",
    name: "\uc1a1\uc720\uc9c4",
    email: "yujin_song@gmail.com",
    platform: "Direct",
    totalOrders: 1,
    totalSpent: 9.99,
    lastOrderDate: "Apr 13, 2026",
    firstOrderDate: "Apr 13, 2026",
    status: "Inactive",
    tags: [],
    memo: "",
    channelData: { "Email": "yujin_song@gmail.com" },
    orders: [
      { orderId: "3D9LP", product: "Notion Plus 1\uac1c\uc6d4", amount: 9.99, status: "Delivered", date: "Apr 13, 2026", delivery: "Email" },
    ],
  },
]

function getAvatarColor(name: string): string {
  const colors = ["#918DF6", "#1A73E8", "#34A853", "#E37400", "#D93025", "#2AABEE", "#F05A23"]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const PAGE_SIZE = 10

export default function Customers() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [searchQuery, setSearchQuery] = useState("")
  const [platformFilter, setPlatformFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [profileTab, setProfileTab] = useState<"information" | "orders" | "send">("information")
  const [customers, setCustomers] = useState<Customer[]>(allCustomers)
  const [sendChannel, setSendChannel] = useState("")
  const [sendFields, setSendFields] = useState<Record<string, string>>({})
  const [sendingMessage, setSendingMessage] = useState(false)

  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleAddTag = (customerId: string, tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId && !c.tags.includes(trimmed)
          ? { ...c, tags: [...c.tags, trimmed] }
          : c,
      ),
    )
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer((prev) =>
        prev && !prev.tags.includes(trimmed) ? { ...prev, tags: [...prev.tags, trimmed] } : prev,
      )
    }
    setTagInput("")
  }

  const handleRemoveTag = (customerId: string, tag: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, tags: c.tags.filter((t) => t !== tag) } : c,
      ),
    )
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer((prev) =>
        prev ? { ...prev, tags: prev.tags.filter((t) => t !== tag) } : prev,
      )
    }
  }

  const handleUpdateMemo = (customerId: string, memo: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId ? { ...c, memo } : c,
      ),
    )
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer((prev) =>
        prev ? { ...prev, memo } : prev,
      )
    }
  }

  const channelFieldDefs: Record<string, { key: string; label: string; type: "text" | "textarea" | "select"; placeholder: string; options?: string[]; required?: boolean }[]> = {
    Email: [
      { key: "subject", label: "Subject", type: "text", placeholder: "Email subject line", required: true },
      { key: "body", label: "Body", type: "textarea", placeholder: "Email body content..." },
    ],
    Telegram: [
      { key: "content", label: "Message", type: "textarea", placeholder: "Telegram message content..." },
      { key: "parse_mode", label: "Parse Mode", type: "select", placeholder: "", options: ["Plain", "HTML", "Markdown"] },
    ],
    SMS: [
      { key: "content", label: "Message", type: "textarea", placeholder: "SMS message (160 chars recommended)" },
    ],
    WhatsApp: [
      { key: "content", label: "Message", type: "textarea", placeholder: "WhatsApp message content..." },
      { key: "media_url", label: "Media URL", type: "text", placeholder: "https://... (optional)" },
    ],
    KakaoTalk: [
      { key: "content", label: "Message", type: "textarea", placeholder: "KakaoTalk message content..." },
      { key: "button_label", label: "Button Label", type: "text", placeholder: "e.g. View Details (optional)" },
      { key: "button_url", label: "Button URL", type: "text", placeholder: "https://... (optional)" },
    ],
  }

  const handleSendMessage = () => {
    if (!selectedCustomer || !sendChannel) return
    const fields = channelFieldDefs[sendChannel]
    if (!fields) return
    const hasRequired = fields.every((f) => !f.required || sendFields[f.key]?.trim())
    const hasContent = sendFields.content?.trim() || sendFields.body?.trim()
    if (!hasRequired && !hasContent) return
    setSendingMessage(true)
    setTimeout(() => {
      setSendingMessage(false)
      setSendFields({})
    }, 1200)
  }

  const filtered = customers.filter((c) => {
    if (platformFilter !== "All" && c.platform !== platformFilter) return false
    if (statusFilter !== "All" && c.status !== statusFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [platformFilter, statusFilter, searchQuery])

  const visibleCustomers = filtered.slice(0, displayCount)
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

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "Active").length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)

  const summaryCards = [
    { label: "Total Customers", value: totalCustomers.toString(), icon: Users, color: "#918DF6" },
    { label: "Active", value: activeCustomers.toString(), icon: TrendingUp, color: "#34A853" },
    { label: "Total Revenue", value: formatUSD(totalRevenue), icon: DollarSign, color: "#1A73E8" },
    { label: "Avg Order Value", value: formatUSD(avgOrderValue), icon: ShoppingCart, color: "#E37400" },
  ]

  return (
    <DashboardLayout
      title="Customers"
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
                    <p className="mt-1 text-[22px] font-bold tabular-nums leading-none tracking-[-0.32px] text-[#181925]">{card.value}</p>
                  </div>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${card.color}12` }}
                  >
                    <Icon className="size-4" style={{ color: card.color }} strokeWidth={2} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
        >
          {/* Filters */}
          <div className="flex shrink-0 flex-wrap items-center gap-2.5 border-b border-[rgba(0,0,0,0.08)] px-5 py-3">
            <div className="relative">
              <Filter className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="h-9 w-[140px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pr-3 pl-8 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
              >
                <option>All</option>
                <option>Naver Store</option>
                <option>G2G</option>
                <option>G2A</option>
                <option>Direct</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 w-[120px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
            </div>
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, tag..."
                className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-[#FAFAFA]">
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Customer</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Platform</th>
                  <th className="px-3 py-2.5 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Orders</th>
                  <th className="px-3 py-2.5 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Total Spent</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Last Order</th>
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleCustomers.map((customer, idx) => {
                  const badge = platformBadges[customer.platform]
                  const avatarColor = getAvatarColor(customer.name)
                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="group cursor-pointer border-b border-[rgba(0,0,0,0.05)] transition-colors hover:bg-[rgba(145,141,246,0.04)]"
                      style={{
                        backgroundColor: idx % 2 === 1 ? "rgba(0,0,0,0.015)" : undefined,
                      }}
                    >
                      <td className="relative px-5 py-3">
                        <div
                          className="absolute top-0 left-0 h-full w-[2px] opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: avatarColor }}
                        />
                        <div className="flex items-center gap-3">
                          <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ backgroundColor: avatarColor }}
                          >
                            {getInitials(customer.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                              {customer.name}
                            </p>
                            <p className="truncate text-[12px] tracking-[-0.32px] text-[#999999]">
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {badge && (
                            <span className={`${badge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{customer.platform}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {customer.totalOrders}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {formatUSD(customer.totalSpent)}
                        </span>
                        {currency === "KRW" && (
                          <p className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                            {formatKRW(customer.totalSpent)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-[13px] tracking-[-0.32px] text-[#666666]">
                          {customer.lastOrderDate}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                            customer.status === "Active"
                              ? "bg-[rgba(52,168,83,0.08)] text-[#34A853]"
                              : "bg-[rgba(102,102,102,0.08)] text-[#666666]"
                          }`}
                        >
                          {customer.status}
                        </span>
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
                All {filtered.length} customers loaded
              </p>
            ) : (
              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                <span className="font-medium tabular-nums text-[#181925]">{visibleCustomers.length}</span> of{" "}
                <span className="font-medium tabular-nums text-[#181925]">{filtered.length}</span> customers loaded
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Customer Detail Modal */}
      <Dialog open={selectedCustomer !== null} onOpenChange={(open) => { if (!open) { setSelectedCustomer(null); setTagInput(""); setProfileTab("information"); setSendChannel(""); setSendFields({}) } }}>
        {selectedCustomer && (
          <DialogContent className="sm:max-w-2xl" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                Customer Profile
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                {selectedCustomer.name} &middot; {selectedCustomer.email}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
                  style={{ backgroundColor: getAvatarColor(selectedCustomer.name) }}
                >
                  {getInitials(selectedCustomer.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {selectedCustomer.name}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        selectedCustomer.status === "Active"
                          ? "bg-[rgba(52,168,83,0.08)] text-[#34A853]"
                          : "bg-[rgba(102,102,102,0.08)] text-[#666666]"
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                    {(() => {
                      const badge = platformBadges[selectedCustomer.platform]
                      if (!badge) return null
                      return (
                        <span className={`${badge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
                          {badge.label}
                        </span>
                      )
                    })()}
                  </div>
                  <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="h-px bg-[rgba(0,0,0,0.08)]" />

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5">
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Total Orders</p>
                  <p className="mt-0.5 text-[18px] font-bold tabular-nums leading-none tracking-[-0.32px] text-[#181925]">
                    {selectedCustomer.totalOrders}
                  </p>
                </div>
                <div className="rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5">
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Total Spent</p>
                  <p className="mt-0.5 text-[18px] font-bold tabular-nums leading-none tracking-[-0.32px] text-[#181925]">
                    {formatUSD(selectedCustomer.totalSpent)}
                  </p>
                  {currency === "KRW" && (
                    <p className="mt-0.5 text-[11px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                      {formatKRW(selectedCustomer.totalSpent)}
                    </p>
                  )}
                </div>
                <div className="rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5">
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Avg Order Value</p>
                  <p className="mt-0.5 text-[18px] font-bold tabular-nums leading-none tracking-[-0.32px] text-[#181925]">
                    {formatUSD(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                  </p>
                </div>
                <div className="rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5">
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Customer Since</p>
                  <p className="mt-0.5 text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                    {selectedCustomer.firstOrderDate}
                  </p>
                </div>
              </div>

              <div className="h-px bg-[rgba(0,0,0,0.08)]" />

              {/* Tabs */}
              <div className="flex gap-1 rounded-lg bg-[rgba(0,0,0,0.04)] p-1">
                {(["information", "orders", "send"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setProfileTab(tab)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-[12px] font-semibold tracking-[-0.32px] transition-colors ${
                      profileTab === tab
                        ? "bg-white text-[#181925] shadow-sm"
                        : "text-[#999999] hover:text-[#666666]"
                    }`}
                  >
                    {tab === "information" ? "Information" : tab === "orders" ? "Order Logs" : "Send Message"}
                  </button>
                ))}
              </div>

              {profileTab === "information" && (
                <div className="flex flex-col gap-4">
                  {Object.keys(selectedCustomer.channelData).length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Channel Info</p>
                      <div className="mt-2 rounded-lg border border-[rgba(0,0,0,0.08)]">
                        {Object.entries(selectedCustomer.channelData).map(([key, value], i) => (
                          <div
                            key={key}
                            className={`flex items-center justify-between px-3 py-2${i < Object.keys(selectedCustomer.channelData).length - 1 ? " border-b border-[rgba(0,0,0,0.05)]" : ""}`}
                          >
                            <span className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">{key}</span>
                            <span className="text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Tags</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {selectedCustomer.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-[rgba(145,141,246,0.08)] px-2 py-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]"
                        >
                          <Tag className="size-3" strokeWidth={2} />
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(selectedCustomer.id, tag)}
                            className="ml-0.5 flex size-3.5 items-center justify-center rounded-full transition-colors hover:bg-[rgba(145,141,246,0.15)]"
                          >
                            <X className="size-2.5" strokeWidth={2.5} />
                          </button>
                        </span>
                      ))}
                      {selectedCustomer.tags.length === 0 && (
                        <span className="text-[12px] tracking-[-0.32px] text-[#999999]">No tags</span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag(selectedCustomer.id, tagInput)
                          }
                        }}
                        placeholder="Add tag..."
                        className="h-7 flex-1 rounded-md border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-2 text-[12px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
                      />
                      <button
                        onClick={() => handleAddTag(selectedCustomer.id, tagInput)}
                        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[rgba(0,0,0,0.12)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                      >
                        <Plus className="size-3.5 text-[#666666]" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Memo</p>
                    <textarea
                      value={selectedCustomer.memo}
                      onChange={(e) => handleUpdateMemo(selectedCustomer.id, e.target.value)}
                      placeholder="Add a note about this customer..."
                      rows={3}
                      className="mt-2 w-full resize-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-3 py-2 text-[13px] leading-relaxed tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {profileTab === "orders" && (
                <div>
                  <div className="max-h-[320px] overflow-y-auto rounded-lg border border-[rgba(0,0,0,0.08)]">
                    {selectedCustomer.orders.length > 0 ? selectedCustomer.orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] px-3 py-2.5 last:border-b-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                            {order.product}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="text-[11px] tracking-[-0.32px] text-[#999999]">
                              #{order.orderId}
                            </span>
                            <span className="text-[11px] tracking-[-0.32px] text-[#999999]">
                              {order.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <DeliveryChannel channel={order.delivery} />
                          <StatusBadge status={order.status} />
                          <span className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                            {formatUSD(order.amount)}
                          </span>
                        </div>
                      </div>
                    )) : (
                      <p className="px-3 py-6 text-center text-[13px] tracking-[-0.32px] text-[#999999]">No orders yet</p>
                    )}
                  </div>
                </div>
              )}

              {profileTab === "send" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Channel</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.keys(selectedCustomer.channelData).map((channel) => {
                        const channelType = channel === "Naver ID" || channel === "G2G ID" || channel === "G2A ID" ? null : channel
                        if (!channelType || !channelFieldDefs[channelType]) return null
                        return (
                          <button
                            key={channel}
                            onClick={() => { setSendChannel(channelType); setSendFields({}) }}
                            className={`rounded-md border px-3 py-1.5 text-[12px] font-medium tracking-[-0.32px] transition-colors ${
                              sendChannel === channelType
                                ? "border-[#918DF6] bg-[rgba(145,141,246,0.08)] text-[#918DF6]"
                                : "border-[rgba(0,0,0,0.12)] text-[#666666] hover:bg-[rgba(0,0,0,0.04)]"
                            }`}
                          >
                            {channelType}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {sendChannel && channelFieldDefs[sendChannel] && (
                    <>
                      <div className="flex flex-col gap-3">
                        {channelFieldDefs[sendChannel].map((field) => (
                          <div key={field.key}>
                            <label className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">
                              {field.label}
                              {field.required && <span className="ml-0.5 text-[#D93025]">*</span>}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                value={sendFields[field.key] ?? ""}
                                onChange={(e) => setSendFields((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                rows={4}
                                className="mt-1 w-full resize-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-3 py-2 text-[13px] leading-relaxed tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
                              />
                            ) : field.type === "select" ? (
                              <select
                                value={sendFields[field.key] ?? field.options?.[0] ?? ""}
                                onChange={(e) => setSendFields((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                className="mt-1 h-8 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none focus:border-[#918DF6]/40 focus:bg-white"
                              >
                                {field.options?.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={sendFields[field.key] ?? ""}
                                onChange={(e) => setSendFields((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="mt-1 h-8 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
                              />
                            )}
                            {field.key === "content" && sendChannel === "SMS" && (
                              <p className="mt-1 text-right text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                                {(sendFields.content ?? "").length} / 160
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-[11px] tracking-[-0.32px] text-[#999999]">
                          Sending to <span className="font-medium text-[#181925]">{selectedCustomer.channelData[sendChannel]}</span>
                        </p>
                        <button
                          onClick={handleSendMessage}
                          disabled={sendingMessage}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#918DF6] px-4 py-2 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:opacity-50"
                        >
                          {sendingMessage ? (
                            <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
                          ) : (
                            <Send className="size-3.5" strokeWidth={2} />
                          )}
                          {sendingMessage ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </>
                  )}

                  {!sendChannel && (
                    <p className="py-6 text-center text-[13px] tracking-[-0.32px] text-[#999999]">Select a channel to compose a message</p>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  )
}
