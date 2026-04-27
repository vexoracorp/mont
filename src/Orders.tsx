import { useState, useRef, useEffect, useCallback } from "react"
import {
  Copy,
  Check,
  Search,
  Loader2,
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
  type Order,
  type Currency,
  StatusBadge,
  DeliveryChannel,
  platformBadges,
  formatUSD,
  formatKRW,
} from "@/shared"

const allOrders: Order[] = [
  { id: "4X7PA", platform: "Naver Store", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", delivery: "Telegram", keyCode: "CNVA-PRO1-7F3M" },
  { id: "9K2BM", platform: "G2G", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", delivery: "Email", keyCode: "STMW-50GC-A2K9" },
  { id: "3F8QN", platform: "G2A", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", delivery: "SMS", keyCode: "XGPU-1MON-9D1P" },
  { id: "7W1DL", platform: "Naver Store", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", delivery: "Email", keyCode: "W11P-RKEY-QW8E" },
  { id: "6R5VC", platform: "G2G", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", delivery: "Telegram", keyCode: "ERNG-DLCX-5TN2" },
  { id: "2H9TE", platform: "G2A", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", delivery: "WhatsApp", keyCode: "FIFA-25UE-0000", errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered." },
  { id: "8M3KP", platform: "Naver Store", amount: 34.99, status: "Delivered", time: "1시간 전", product: "Adobe Creative Cloud 1개월", customer: "정하은", email: "haeun_j@naver.com", delivery: "Email", keyCode: "ADCC-1MON-R4TZ" },
  { id: "1Q6WJ", platform: "G2G", amount: 19.99, status: "Delivered", time: "2시간 전", product: "Minecraft Java Edition", customer: "David Park", email: "g2g_buyer_5512", delivery: "Telegram", keyCode: "MNCR-JAVA-K8PL" },
  { id: "5T4NR", platform: "Direct", amount: 89.99, status: "Delivered", time: "2시간 전", product: "Cyberpunk 2077 Ultimate Bundle", customer: "이서연", email: "seoyeon@gmail.com", delivery: "Email", keyCode: "CP77-ULTB-M3VX" },
  { id: "0L8FD", platform: "G2A", amount: 15.99, status: "Processing", time: "3시간 전", product: "Netflix Gift Card $25", customer: "Tom Wilson", email: "g2a_user_4421", delivery: "SMS", keyCode: "NFLX-25GC-W7HN" },
  { id: "4Y2GH", platform: "Naver Store", amount: 44.99, status: "Delivered", time: "3시간 전", product: "PS Plus Premium 3개월", customer: "한지민", email: "jimin_han@naver.com", delivery: "Telegram", keyCode: "PSPP-3MON-B5QA" },
  { id: "7N9XC", platform: "G2G", amount: 27.50, status: "Failed", time: "4시간 전", product: "Valorant Points 2050 VP", customer: "Sarah Lee", email: "g2g_buyer_9903", delivery: "Email", keyCode: "VLRN-2050-0000", errorStep: "Step 2 — Payment Verification", errorMessage: "Payment disputed by buyer's bank. Transaction reversed." },
  { id: "3K1MZ", platform: "Naver Store", amount: 39.99, status: "Delivered", time: "4시간 전", product: "Spotify Premium 6개월", customer: "오준서", email: "junseo_oh@naver.com", delivery: "SMS", keyCode: "SPTF-6MON-J2YD" },
  { id: "6P5BA", platform: "G2A", amount: 54.99, status: "Delivered", time: "5시간 전", product: "Hogwarts Legacy Deluxe", customer: "김태현", email: "g2a_user_6678", delivery: "WhatsApp", keyCode: "HWLG-DLXE-T9FC" },
  { id: "9D7QL", platform: "G2G", amount: 22.00, status: "Delivered", time: "5시간 전", product: "Roblox Gift Card $25", customer: "Emily Chen", email: "g2g_buyer_3345", delivery: "Email", keyCode: "RBLX-25GC-N4WP" },
  { id: "2V0SE", platform: "Direct", amount: 69.99, status: "Processing", time: "6시간 전", product: "Baldur's Gate 3 Digital Deluxe", customer: "박성민", email: "sungmin@vexora.team", delivery: "Telegram", keyCode: "BG3D-DLXE-H6RA" },
  { id: "8F3TK", platform: "Naver Store", amount: 18.99, status: "Delivered", time: "7시간 전", product: "YouTube Premium 3개월", customer: "윤서아", email: "seoa_yoon@naver.com", delivery: "Email", keyCode: "YTPM-3MON-C1GX" },
  { id: "5J9WN", platform: "G2G", amount: 32.50, status: "Delivered", time: "8시간 전", product: "Diablo IV Standard Edition", customer: "Michael Cho", email: "g2g_buyer_7721", delivery: "Telegram", keyCode: "D4SE-STND-P8LZ" },
  { id: "1R4HP", platform: "G2A", amount: 11.99, status: "Delivered", time: "9시간 전", product: "Discord Nitro 1개월", customer: "강예진", email: "g2a_user_2234", delivery: "SMS", keyCode: "DCNT-1MON-V5KB" },
  { id: "0X6CM", platform: "Naver Store", amount: 74.99, status: "Delivered", time: "10시간 전", product: "GTA V Premium + Whale Shark Card", customer: "이동현", email: "donghyun_lee@naver.com", delivery: "Email", keyCode: "GTAV-PWSC-S3QE" },
  { id: "2A3RF", platform: "G2G", amount: 14.99, status: "Delivered", time: "10시간 전", product: "League of Legends 1380 RP", customer: "Chris Yang", email: "g2g_buyer_4410", delivery: "Telegram", keyCode: "LOL1-380R-P7KM" },
  { id: "8B7WQ", platform: "Naver Store", amount: 59.99, status: "Delivered", time: "11시간 전", product: "Microsoft 365 Family 1년", customer: "김나연", email: "nayeon_k@naver.com", delivery: "Email", keyCode: "M365-FAM1-Y2NB" },
  { id: "5C4XE", platform: "G2A", amount: 39.99, status: "Processing", time: "11시간 전", product: "Starfield Standard Edition", customer: "Daniel Kwon", email: "g2a_user_5589", delivery: "SMS", keyCode: "STRF-STND-Q4WC" },
  { id: "3D9LP", platform: "Direct", amount: 9.99, status: "Delivered", time: "12시간 전", product: "Notion Plus 1개월", customer: "송유진", email: "yujin_song@gmail.com", delivery: "Email", keyCode: "NOTN-PLUS-F8RV" },
  { id: "7E2HN", platform: "G2G", amount: 84.99, status: "Delivered", time: "12시간 전", product: "Call of Duty MW3 Vault Edition", customer: "Ryan Park", email: "g2g_buyer_6632", delivery: "Telegram", keyCode: "CODM-W3VE-L5TA" },
  { id: "1F6JT", platform: "Naver Store", amount: 16.99, status: "Failed", time: "13시간 전", product: "ChatGPT Plus 1개월", customer: "임수빈", email: "subin_lim@naver.com", delivery: "Telegram", keyCode: "CGPT-PLUS-0000", errorStep: "Step 1 — Key Generation", errorMessage: "Inventory depleted. No available keys for this product." },
  { id: "4G8KV", platform: "G2A", amount: 29.99, status: "Delivered", time: "13시간 전", product: "EA Play Pro 1개월", customer: "Jason Lim", email: "g2a_user_8812", delivery: "Email", keyCode: "EAPL-PRO1-D3MX" },
  { id: "6H1MR", platform: "G2G", amount: 45.00, status: "Delivered", time: "14시간 전", product: "PlayStation Store $50 Card", customer: "Olivia Kang", email: "g2g_buyer_2278", delivery: "SMS", keyCode: "PSN5-0GCR-W9BN" },
  { id: "9J5NW", platform: "Naver Store", amount: 21.99, status: "Delivered", time: "14시간 전", product: "Figma Professional 1개월", customer: "조은서", email: "eunseo_cho@naver.com", delivery: "Email", keyCode: "FGMA-PRO1-K7QZ" },
  { id: "0K3PY", platform: "Direct", amount: 119.99, status: "Delivered", time: "15시간 전", product: "Adobe Photoshop + Lightroom 1년", customer: "이하준", email: "hajun@vexora.team", delivery: "Telegram", keyCode: "ADPL-1YAR-G4HS" },
  { id: "2L8QA", platform: "G2A", amount: 7.99, status: "Delivered", time: "15시간 전", product: "Spotify Gift Card $10", customer: "Amy Zhang", email: "g2a_user_1156", delivery: "Email", keyCode: "SPTF-10GC-N2VD" },
  { id: "5M4RB", platform: "G2G", amount: 37.50, status: "Processing", time: "16시간 전", product: "Apex Legends 4350 Coins", customer: "Kevin Shin", email: "g2g_buyer_7743", delivery: "Telegram", keyCode: "APEX-4350-C8WF" },
  { id: "8N7SC", platform: "Naver Store", amount: 49.99, status: "Delivered", time: "16시간 전", product: "Nintendo eShop $50 Card", customer: "황지우", email: "jiwoo_hwang@naver.com", delivery: "SMS", keyCode: "NESH-50GC-J6XP" },
  { id: "1P2TD", platform: "G2A", amount: 64.99, status: "Delivered", time: "17시간 전", product: "Red Dead Redemption 2 Ultimate", customer: "최민호", email: "g2a_user_9945", delivery: "WhatsApp", keyCode: "RDR2-ULTE-B1YQ" },
  { id: "4Q9UE", platform: "G2G", amount: 19.50, status: "Failed", time: "17시간 전", product: "Fortnite V-Bucks 2800", customer: "Sophia Yoo", email: "g2g_buyer_5501", delivery: "Email", keyCode: "FNVB-2800-0000", errorStep: "Step 2 — Payment Verification", errorMessage: "Currency mismatch: buyer paid in EUR, expected USD. Refund initiated." },
  { id: "7R6VF", platform: "Naver Store", amount: 32.99, status: "Delivered", time: "18시간 전", product: "Zoom Pro 1개월", customer: "배수현", email: "suhyun_bae@naver.com", delivery: "Email", keyCode: "ZOOM-PRO1-A5ZR" },
  { id: "3S1WG", platform: "Direct", amount: 44.99, status: "Delivered", time: "18시간 전", product: "Cursor Pro IDE 1개월", customer: "정우진", email: "woojin@vexora.team", delivery: "Telegram", keyCode: "CRSR-PRO1-M8LS" },
  { id: "6T5XH", platform: "G2G", amount: 26.99, status: "Delivered", time: "19시간 전", product: "Overwatch 2 Battle Pass", customer: "Nathan Kim", email: "g2g_buyer_3389", delivery: "SMS", keyCode: "OW2B-PASS-E4NT" },
  { id: "9U8YJ", platform: "G2A", amount: 17.99, status: "Delivered", time: "19시간 전", product: "Crunchyroll Premium 3개월", customer: "안서윤", email: "g2a_user_6623", delivery: "Email", keyCode: "CRNC-3MON-H7PU" },
  { id: "0V2ZK", platform: "Naver Store", amount: 89.99, status: "Delivered", time: "20시간 전", product: "Parallels Desktop Pro 1년", customer: "문재현", email: "jaehyun_moon@naver.com", delivery: "Telegram", keyCode: "PRLL-PRO1-R3GW" },
  { id: "3W7AL", platform: "G2G", amount: 55.00, status: "Delivered", time: "20시간 전", product: "Steam Wallet $60 Gift Card", customer: "Grace Choi", email: "g2g_buyer_8854", delivery: "Email", keyCode: "STMW-60GC-V9KX" },
  { id: "6X4BM", platform: "G2A", amount: 34.99, status: "Processing", time: "21시간 전", product: "Palworld Early Access", customer: "신예은", email: "g2a_user_4478", delivery: "WhatsApp", keyCode: "PLWL-EACC-T2DY" },
  { id: "9Y1CN", platform: "Direct", amount: 149.99, status: "Delivered", time: "21시간 전", product: "JetBrains All Products Pack 1년", customer: "권도윤", email: "doyun@vexora.team", delivery: "Email", keyCode: "JBAP-1YAR-U6FZ" },
  { id: "2Z6DP", platform: "Naver Store", amount: 27.99, status: "Delivered", time: "22시간 전", product: "Midjourney Standard 1개월", customer: "유하린", email: "harin_yu@naver.com", delivery: "SMS", keyCode: "MDJR-STD1-I8QA" },
  { id: "5A9EQ", platform: "G2G", amount: 41.50, status: "Delivered", time: "23시간 전", product: "Monster Hunter Wilds", customer: "Brandon Lee", email: "g2g_buyer_1167", delivery: "Telegram", keyCode: "MHWL-STND-W4LB" },
]

const TOTAL_ORDERS = 156

export default function Orders() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [platformFilter, setPlatformFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [deliveryFilter, setDeliveryFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const PAGE_SIZE = 10
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const handleCopyKey = (key: string) => {
    void navigator.clipboard.writeText(key)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 1500)
  }

  const filtered = allOrders.filter((o) => {
    if (platformFilter !== "All" && o.platform !== platformFilter) return false
    if (statusFilter !== "All" && o.status !== statusFilter) return false
    if (deliveryFilter !== "All" && o.delivery !== deliveryFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        o.id.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q)
      )
    }
    return true
  })

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [platformFilter, statusFilter, deliveryFilter, searchQuery])

  const visibleOrders = filtered.slice(0, displayCount)
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

  return (
    <DashboardLayout
      title="Orders"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4 pb-4 lg:px-8">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
        >
          {/* Filters */}
          <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-[rgba(0,0,0,0.08)] px-5 py-3">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="h-9 w-[130px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
            >
              <option>All</option>
              <option>Naver Store</option>
              <option>G2G</option>
              <option>G2A</option>
              <option>Direct</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 w-[120px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
            >
              <option>All</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Failed</option>
            </select>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value)}
              className="h-9 w-[120px] shrink-0 appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#181925] outline-none"
            >
              <option>All</option>
              <option>Telegram</option>
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp</option>
            </select>
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, product, customer..."
                className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th className="px-5 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Order ID</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Product</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Customer</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Platform</th>
                  <th className="px-3 py-2.5 text-right text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Amount</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Status</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Delivery</th>
                  <th className="px-5 py-2.5 text-right text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Time</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => {
                  const badge = platformBadges[order.platform]
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer border-b border-[rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50/60 ${
                        order.status === "Failed" ? "bg-[#D93025]/[0.02]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        #{order.id}
                      </td>
                      <td className="max-w-[240px] px-3 py-3">
                        <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                          {order.product}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-[14px] tracking-[-0.32px] text-[#181925]">
                        {order.customer}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {badge && (
                            <span className={`${badge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-[14px] tracking-[-0.32px] text-[#666666]">{order.platform}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {formatUSD(order.amount)}
                        </span>
                        {currency === "KRW" && (
                          <p className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                            {formatKRW(order.amount)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-3 py-3">
                        <DeliveryChannel channel={order.delivery} />
                      </td>
                      <td className="px-5 py-3 text-right text-[13px] tracking-[-0.32px] text-[#999999]">
                        {order.time}
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
                All {filtered.length} orders loaded
              </p>
            ) : (
              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                <span className="font-medium tabular-nums text-[#181925]">{visibleOrders.length}</span> of{" "}
                <span className="font-medium tabular-nums text-[#181925]">{TOTAL_ORDERS}</span> orders loaded
              </p>
            )}
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
