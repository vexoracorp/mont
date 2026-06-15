import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Plus,
  Package,
  TrendingUp,
  ClipboardList,
  KeyRound,
  Plug,
  Upload,
  RefreshCw,
  ExternalLink,
  Circle,
  Eye,
  EyeOff,
  Settings,
  Copy,
  Check,
  X,
  RotateCcw,
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
  platformBadges,
  formatUSD,
  formatKRW,
  StatusBadge,
  deliveryChannels,
} from "@/shared"

type ProductStatus = "Active" | "Draft" | "Out of Stock"
type ProductCategory = "Game Key" | "Gift Card" | "Subscription" | "Software License"

type Product = {
  id: string
  name: string
  price: number
  description: string
  platforms: string[]
  stock: number
  totalSold: number
  status: ProductStatus
  category: ProductCategory
  color: string
}

const allProducts: Product[] = [
  { id: "P001", name: "Steam Wallet $50 Gift Card", price: 42.99, description: "Digital gift card for Steam platform. Redeemable for games, DLC, and in-game items. Region: Global.", platforms: ["G2G", "G2A", "Naver Store"], stock: 234, totalSold: 1847, status: "Active", category: "Gift Card", color: "#1B2838" },
  { id: "P002", name: "Xbox Game Pass Ultimate 1M", price: 12.99, description: "1 month of Xbox Game Pass Ultimate. Includes Xbox Live Gold, EA Play, and access to 400+ games on console, PC, and cloud.", platforms: ["G2A", "Naver Store"], stock: 89, totalSold: 923, status: "Active", category: "Subscription", color: "#107C10" },
  { id: "P003", name: "PlayStation Plus Premium 3M", price: 44.99, description: "3 months of PS Plus Premium. Access to game catalog, classic games, cloud streaming, and online multiplayer.", platforms: ["Naver Store", "Direct"], stock: 56, totalSold: 412, status: "Active", category: "Subscription", color: "#003087" },
  { id: "P004", name: "Netflix Gift Card $25", price: 22.99, description: "Netflix digital gift card worth $25. Can be applied to any Netflix subscription plan.", platforms: ["G2G", "G2A", "Naver Store"], stock: 0, totalSold: 2103, status: "Out of Stock", category: "Gift Card", color: "#E50914" },
  { id: "P005", name: "Elden Ring Shadow of the Erdtree", price: 39.99, description: "DLC expansion for Elden Ring. Explore the Land of Shadow in this massive expansion to the award-winning action RPG.", platforms: ["G2G", "G2A"], stock: 145, totalSold: 678, status: "Active", category: "Game Key", color: "#C4A44A" },
  { id: "P006", name: "Adobe Creative Cloud 1M", price: 54.99, description: "1 month subscription to Adobe Creative Cloud. Includes Photoshop, Illustrator, Premiere Pro, and 20+ creative apps.", platforms: ["Naver Store", "Direct"], stock: 34, totalSold: 567, status: "Active", category: "Software License", color: "#FF0000" },
  { id: "P007", name: "Spotify Premium 6M", price: 39.99, description: "6 months of Spotify Premium. Ad-free music, offline downloads, and high-quality audio streaming.", platforms: ["Naver Store", "G2A"], stock: 178, totalSold: 1456, status: "Active", category: "Subscription", color: "#1DB954" },
  { id: "P008", name: "Windows 11 Pro Key", price: 24.99, description: "Genuine Windows 11 Professional license key. Includes BitLocker, Remote Desktop, Hyper-V, and enterprise features.", platforms: ["G2G", "G2A", "Naver Store", "Direct"], stock: 312, totalSold: 3201, status: "Active", category: "Software License", color: "#0078D4" },
  { id: "P009", name: "Cyberpunk 2077 Ultimate Bundle", price: 59.99, description: "Cyberpunk 2077 base game + Phantom Liberty expansion. Experience Night City in this open-world RPG.", platforms: ["G2G", "Direct"], stock: 67, totalSold: 234, status: "Active", category: "Game Key", color: "#FCE300" },
  { id: "P010", name: "Nintendo eShop $50 Card", price: 46.99, description: "Digital gift card for Nintendo eShop. Purchase games, DLC, and subscriptions on Nintendo Switch.", platforms: ["Naver Store", "G2A"], stock: 0, totalSold: 891, status: "Out of Stock", category: "Gift Card", color: "#E60012" },
  { id: "P011", name: "Microsoft 365 Family 1Y", price: 89.99, description: "1 year of Microsoft 365 Family. Up to 6 users, 1TB OneDrive each, Word, Excel, PowerPoint, and more.", platforms: ["Naver Store", "Direct"], stock: 23, totalSold: 445, status: "Active", category: "Software License", color: "#D83B01" },
  { id: "P012", name: "Baldur's Gate 3 Digital Deluxe", price: 69.99, description: "Digital Deluxe edition of Baldur's Gate 3. Includes base game, digital artbook, soundtrack, and exclusive dice skin.", platforms: ["G2G"], stock: 12, totalSold: 156, status: "Draft", category: "Game Key", color: "#8B0000" },
  { id: "P013", name: "YouTube Premium 3M", price: 29.99, description: "3 months of YouTube Premium. Ad-free videos, background play, YouTube Music Premium included.", platforms: ["Naver Store"], stock: 201, totalSold: 1023, status: "Active", category: "Subscription", color: "#FF0000" },
  { id: "P014", name: "JetBrains All Products 1Y", price: 149.99, description: "1 year license for all JetBrains IDEs. IntelliJ IDEA, WebStorm, PyCharm, and more for professional development.", platforms: ["Direct"], stock: 8, totalSold: 89, status: "Draft", category: "Software License", color: "#000000" },
  { id: "P015", name: "Roblox Gift Card $25", price: 22.00, description: "Roblox digital gift card. Redeem for Robux or a Roblox Premium subscription.", platforms: ["G2G", "Naver Store"], stock: 456, totalSold: 2890, status: "Active", category: "Gift Card", color: "#E2231A" },
  { id: "P016", name: "Monster Hunter Wilds", price: 59.99, description: "Standard edition of Monster Hunter Wilds. Hunt massive monsters in a vast open world with up to 4 players.", platforms: ["G2G", "G2A", "Naver Store"], stock: 98, totalSold: 345, status: "Active", category: "Game Key", color: "#2D5016" },
]

// ─── Detail Dialog Types & Mock Data ─────────────────────────

type DetailTab = "overview" | "orders" | "licenses" | "merchants"

const detailTabs: { label: string; value: DetailTab; icon: typeof Package }[] = [
  { label: "Overview", value: "overview", icon: Package },
  { label: "Order Logs", value: "orders", icon: ClipboardList },
  { label: "License Stock", value: "licenses", icon: KeyRound },
  { label: "Merchants", value: "merchants", icon: Plug },
]

type ProductOrder = {
  orderId: string
  customer: string
  amount: number
  status: "Delivered" | "Processing" | "Failed"
  date: string
  platform: string
  delivery: "Email" | "Telegram" | "SMS" | "WhatsApp"
  deliveryTarget: string
  keyCode: string
}

type LicenseKey = {
  code: string
  type: "key" | "link" | "file" | "image" | "subscription"
  status: "Available" | "Delivered" | "Expired"
  addedDate: string
  source: string
}

type MerchantConnection = {
  platform: string
  connected: boolean
  lastSync: string | null
  listingUrl: string | null
  autoSync: boolean
  externalProductId: string
  priceOverride: number | null
  autoDelivery: boolean
  stockSync: boolean
  webhookUrl: string
}

function getMockOrders(productId: string): ProductOrder[] {
  return [
    { orderId: `${productId}-ORD-4821`, customer: "김민수", amount: 42.99, status: "Delivered", date: "2026-04-28 14:32", platform: "Naver Store", delivery: "Email", deliveryTarget: "minsu.kim@gmail.com", keyCode: "XXXX-ABCD-1234-EFGH" },
    { orderId: `${productId}-ORD-4819`, customer: "Alex Turner", amount: 42.99, status: "Delivered", date: "2026-04-28 11:05", platform: "G2A", delivery: "Email", deliveryTarget: "alex.turner@outlook.com", keyCode: "XXXX-IJKL-5678-MNOP" },
    { orderId: `${productId}-ORD-4815`, customer: "이지은", amount: 42.99, status: "Processing", date: "2026-04-27 22:18", platform: "G2G", delivery: "Telegram", deliveryTarget: "@jieun_lee", keyCode: "XXXX-QRST-9012-UVWX" },
    { orderId: `${productId}-ORD-4810`, customer: "Sarah Chen", amount: 42.99, status: "Delivered", date: "2026-04-27 09:44", platform: "G2A", delivery: "WhatsApp", deliveryTarget: "+1-555-0142", keyCode: "XXXX-YZAB-3456-CDEF" },
    { orderId: `${productId}-ORD-4802`, customer: "박준혁", amount: 42.99, status: "Failed", date: "2026-04-26 16:51", platform: "Naver Store", delivery: "SMS", deliveryTarget: "+82-10-9876-5432", keyCode: "XXXX-GHIJ-7890-KLMN" },
    { orderId: `${productId}-ORD-4798`, customer: "James Wilson", amount: 42.99, status: "Delivered", date: "2026-04-26 08:12", platform: "Direct", delivery: "Email", deliveryTarget: "j.wilson@proton.me", keyCode: "XXXX-OPQR-2345-STUV" },
    { orderId: `${productId}-ORD-4791`, customer: "최유진", amount: 42.99, status: "Delivered", date: "2026-04-25 19:30", platform: "Naver Store", delivery: "Telegram", deliveryTarget: "@yujin_choi", keyCode: "XXXX-WXYZ-6789-ABCD" },
  ]
}

function getMockLicenses(productId: string): LicenseKey[] {
  return [
    { code: `${productId}-XXXX-ABCD-1234`, type: "key", status: "Available", addedDate: "2026-04-28", source: "Manual Upload" },
    { code: `${productId}-XXXX-EFGH-5678`, type: "key", status: "Available", addedDate: "2026-04-28", source: "API Fetch" },
    { code: `${productId}-XXXX-IJKL-9012`, type: "key", status: "Delivered", addedDate: "2026-04-27", source: "Manual Upload" },
    { code: `${productId}-XXXX-MNOP-3456`, type: "link", status: "Delivered", addedDate: "2026-04-26", source: "API Fetch" },
    { code: `${productId}-XXXX-QRST-7890`, type: "key", status: "Expired", addedDate: "2026-04-20", source: "Manual Upload" },
    { code: `${productId}-XXXX-UVWX-2345`, type: "subscription", status: "Available", addedDate: "2026-04-25", source: "API Fetch" },
    { code: `${productId}-XXXX-YZAB-6789`, type: "key", status: "Available", addedDate: "2026-04-24", source: "Bulk Import" },
    { code: `${productId}-XXXX-CDEF-0123`, type: "file", status: "Delivered", addedDate: "2026-04-23", source: "Manual Upload" },
  ]
}

function getMockMerchants(productId: string, platforms: string[]): MerchantConnection[] {
  const allMerchants: Record<string, MerchantConnection> = {
    "G2G": { platform: "G2G", connected: true, lastSync: "2026-04-28 14:00", listingUrl: "https://g2g.com/offer/steam-wallet-50", autoSync: true, externalProductId: `G2G-SKU-${productId.replace("P", "")}91`, priceOverride: null, autoDelivery: true, stockSync: true, webhookUrl: `https://api.mont.shop/webhooks/g2g/${productId}` },
    "G2A": { platform: "G2A", connected: true, lastSync: "2026-04-28 13:45", listingUrl: "https://g2a.com/steam-wallet-50-usd", autoSync: true, externalProductId: `G2A-PROD-${productId.replace("P", "")}47`, priceOverride: 44.99, autoDelivery: true, stockSync: false, webhookUrl: `https://api.mont.shop/webhooks/g2a/${productId}` },
    "Naver Store": { platform: "Naver Store", connected: true, lastSync: "2026-04-28 12:30", listingUrl: "https://smartstore.naver.com/mont/products/123", autoSync: false, externalProductId: `naver-prod-${productId.replace("P", "")}345`, priceOverride: 45.99, autoDelivery: false, stockSync: true, webhookUrl: `https://api.mont.shop/webhooks/naver/${productId}` },
    "Direct": { platform: "Direct", connected: true, lastSync: null, listingUrl: "https://mont.shop/p/steam-wallet-50", autoSync: false, externalProductId: productId, priceOverride: null, autoDelivery: true, stockSync: false, webhookUrl: `https://api.mont.shop/webhooks/direct/${productId}` },
  }
  const all = Object.keys(allMerchants)
  return all.map((key) => {
    if (platforms.includes(key)) return allMerchants[key]
    return { ...allMerchants[key], connected: false, lastSync: null, listingUrl: null, autoSync: false, externalProductId: "", priceOverride: null, autoDelivery: false, stockSync: false, webhookUrl: "" }
  })
}

const orderStatusStyles: Record<string, string> = {
  Delivered: "bg-[#34A853] text-white",
  Processing: "bg-[#E37400] text-white",
  Failed: "bg-[#D93025] text-white",
}

const licenseStatusStyles: Record<string, string> = {
  Available: "text-[#34A853] bg-[#34A853]/10",
  Delivered: "text-[#2C78FC] bg-[#2C78FC]/10",
  Expired: "text-[#D93025] bg-[#D93025]/10",
}

const licenseTypeLabels: Record<string, string> = {
  key: "Key",
  link: "Link",
  file: "File",
  image: "Image",
  subscription: "Sub",
}

function maskCode(code: string): string {
  const parts = code.split("-")
  return parts.map((p, i) => (i <= 1 ? p : "••••")).join("-")
}

const statusStyles: Record<ProductStatus, string> = {
  Active: "bg-[#34A853] text-white",
  Draft: "bg-[#E37400] text-white",
  "Out of Stock": "bg-[#D93025] text-white",
}

const tabs: { label: string; value: string }[] = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Draft", value: "Draft" },
  { label: "Out of Stock", value: "Out of Stock" },
]

export default function Products() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTab>("overview")
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedMerchantSettings, setSelectedMerchantSettings] = useState<MerchantConnection | null>(null)
  const [merchantEditValues, setMerchantEditValues] = useState<{
    externalProductId: string
    priceOverride: string
    autoDelivery: boolean
    stockSync: boolean
  } | null>(null)
  const [merchantSettingsSaved, setMerchantSettingsSaved] = useState(false)
  const [copiedWebhook, setCopiedWebhook] = useState<string | null>(null)
  const [copiedOrderKey, setCopiedOrderKey] = useState(false)

  const filtered = allProducts.filter((p) => {
    if (activeTab !== "All" && p.status !== activeTab) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  const tabCounts: Record<string, number> = {
    All: allProducts.length,
    Active: allProducts.filter((p) => p.status === "Active").length,
    Draft: allProducts.filter((p) => p.status === "Draft").length,
    "Out of Stock": allProducts.filter((p) => p.status === "Out of Stock").length,
  }

  return (
    <DashboardLayout
      title="Products"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4 pb-4 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
            />
          </div>
          <button className="flex h-9 items-center gap-2 rounded-lg bg-[#918DF6] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#7D79E8]">
            <Plus className="size-4" strokeWidth={2} />
            Add Product
          </button>
        </div>

        <div className="mb-4 flex gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-1" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                activeTab === tab.value
                  ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                  : "text-[#666666] hover:text-[#181925]"
              }`}
            >
              {tab.label}
              <span className={`text-[11px] tabular-nums ${activeTab === tab.value ? "text-[#918DF6]" : "text-[#999999]"}`}>
                {tabCounts[tab.value]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex items-start gap-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5 text-left transition-all hover:border-[rgba(0,0,0,0.14)] hover:shadow-sm"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold text-white"
                  style={{ backgroundColor: product.color }}
                >
                  {product.name.charAt(0)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {product.name}
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[product.status]}`}>
                      {product.status}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[12px] tracking-[-0.32px] text-[#999999]">{product.category}</span>
                    <span className="text-[#CCCCCC]">·</span>
                    <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                      {formatUSD(product.price)}
                    </span>
                    {currency === "KRW" && (
                      <span className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                        {formatKRW(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-3">
                    <div className="flex gap-1">
                      {product.platforms.map((platform) => {
                        const badge = platformBadges[platform]
                        if (!badge) return null
                        return (
                          <span
                            key={platform}
                            className={`${badge.bg} inline-flex items-center rounded px-1.5 py-0.5 font-bold text-white ${badge.textSize}`}
                          >
                            {badge.label}
                          </span>
                        )
                      })}
                    </div>
                    <span className="text-[#CCCCCC]">·</span>
                    <div className="flex items-center gap-1">
                      <Package className="size-3 text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[12px] tabular-nums tracking-[-0.32px] text-[#666666]">
                        {product.stock}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="size-3 text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[12px] tabular-nums tracking-[-0.32px] text-[#666666]">
                        {product.totalSold.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="size-10 text-[#999999]" strokeWidth={1.2} />
              <p className="mt-3 text-[14px] font-medium tracking-[-0.32px] text-[#666666]">No products found</p>
              <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#999999]">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={selectedProduct !== null && selectedMerchantSettings === null} onOpenChange={(open) => { if (!open) { setSelectedProduct(null); setDetailTab("overview"); setSelectedOrderId(null); setSelectedMerchantSettings(null); setCopiedOrderKey(false) } }}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-2xl" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                {selectedProduct.name}
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                {selectedProduct.category} · {selectedProduct.id}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-1" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              {detailTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.value}
                    onClick={() => setDetailTab(tab.value)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                      detailTab === tab.value
                        ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                        : "text-[#666666] hover:text-[#181925]"
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={2} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {detailTab === "overview" && (
                <div className="flex flex-col gap-4">
                  <div
                    className="flex h-24 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${selectedProduct.color}12` }}
                  >
                    <span
                      className="flex size-12 items-center justify-center rounded-xl text-[18px] font-bold text-white"
                      style={{ backgroundColor: selectedProduct.color }}
                    >
                      {selectedProduct.name.charAt(0)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Price</p>
                      <p className="mt-1 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {formatUSD(selectedProduct.price)}
                      </p>
                      <p className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                        {formatKRW(selectedProduct.price)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Status</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-semibold ${statusStyles[selectedProduct.status]}`}>
                          {selectedProduct.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Description</p>
                    <p className="mt-1 text-[13px] leading-relaxed tracking-[-0.32px] text-[#181925]">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Platforms</p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {selectedProduct.platforms.map((platform) => {
                        const badge = platformBadges[platform]
                        if (!badge) return null
                        return (
                          <span
                            key={platform}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 py-1 text-[12px] font-medium tracking-[-0.32px] text-[#181925]"
                          >
                            <span className={`${badge.bg} inline-flex size-3.5 items-center justify-center rounded text-white ${badge.textSize}`} style={{ fontSize: "7px" }}>
                              {badge.label}
                            </span>
                            {platform}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                  <div>
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Inventory & Sales</p>
                    <div className="mt-2 grid grid-cols-3 gap-x-4">
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">In Stock</p>
                        <p className="mt-0.5 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {selectedProduct.stock}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Total Sold</p>
                        <p className="mt-0.5 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">
                          {selectedProduct.totalSold.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Revenue</p>
                        <p className="mt-0.5 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {formatUSD(selectedProduct.price * selectedProduct.totalSold)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "orders" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Recent Orders</p>
                    <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">{getMockOrders(selectedProduct.id).length} orders</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getMockOrders(selectedProduct.id).map((order) => {
                      const pBadge = platformBadges[order.platform]
                      return (
                        <button
                          key={order.orderId}
                          onClick={() => setSelectedOrderId(order.orderId)}
                          className="flex items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.08)] p-3 text-left transition-all hover:border-[rgba(0,0,0,0.14)] hover:shadow-sm cursor-pointer"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{order.orderId}</span>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${orderStatusStyles[order.status]}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{order.customer}</span>
                              <span className="text-[#CCCCCC]">·</span>
                              <span className="text-[12px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{formatUSD(order.amount)}</span>
                              <span className="text-[#CCCCCC]">·</span>
                              {pBadge && (
                                <span className={`${pBadge.bg} inline-flex items-center rounded px-1.5 py-0.5 font-bold text-white ${pBadge.textSize}`}>
                                  {pBadge.label}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="shrink-0 text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">{order.date}</span>
                        </button>
                      )
                    })}
                  </div>

                  <Dialog open={selectedOrderId !== null} onOpenChange={(open) => { if (!open) { setSelectedOrderId(null); setCopiedOrderKey(false) } }}>
                    {(() => {
                      const order = getMockOrders(selectedProduct.id).find((o) => o.orderId === selectedOrderId)
                      if (!order) return null
                      const pBadge = platformBadges[order.platform]
                      const ch = deliveryChannels[order.delivery]
                      const statusDot = order.status === "Delivered" ? "bg-[#34A853]" : order.status === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"
                      return (
                        <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden" showCloseButton={false}>
                          <div className="flex items-start justify-between border-b border-[rgba(0,0,0,0.08)] px-6 py-4">
                            <div>
                              <DialogHeader className="p-0 space-y-1">
                                <div className="flex items-center gap-3">
                                  <DialogTitle className="text-[20px] font-bold tracking-[-0.32px] text-[#181925]">
                                    Order #{order.orderId}
                                  </DialogTitle>
                                  <StatusBadge status={order.status} />
                                </div>
                                <DialogDescription className="text-[15px] font-medium tracking-[-0.32px] text-[#666666]">
                                  {selectedProduct.name}
                                </DialogDescription>
                              </DialogHeader>
                            </div>
                            <button onClick={() => { setSelectedOrderId(null); setCopiedOrderKey(false) }} className="mt-0.5 flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.06)]">
                              <X className="size-4 text-[#666666]" strokeWidth={2} />
                            </button>
                          </div>

                          <div className="max-h-[70vh] overflow-y-auto">
                            <div className="bg-[rgba(0,0,0,0.02)] px-6 py-5">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                                  <p className="text-[10px] font-semibold tracking-[-0.32px] text-[#999999]">Source</p>
                                  <div className="flex items-center gap-1.5">
                                    {pBadge && <span className={`${pBadge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${pBadge.textSize}`}>{pBadge.label}</span>}
                                    <span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.platform}</span>
                                  </div>
                                  <p className="max-w-full truncate text-[11px] tracking-[-0.32px] text-[#666666]">{order.platform}</p>
                                </div>

                                <div className="flex shrink-0 flex-col items-center gap-0.5">
                                  <span className="text-[10px] font-mono tabular-nums tracking-[-0.32px] text-[#999999] bg-[rgba(0,0,0,0.04)] rounded px-1.5 py-0.5">{"\u2014"}</span>
                                  <span className="text-[#999999]">&rarr;</span>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                                  <p className="text-[10px] font-semibold tracking-[-0.32px] text-[#999999]">License</p>
                                  <p className="max-w-full truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedProduct.name}</p>
                                  <p className="max-w-full truncate font-mono text-[11px] tracking-[-0.32px] text-[#666666]">{order.keyCode}</p>
                                </div>

                                <div className="flex shrink-0 flex-col items-center gap-0.5">
                                  <span className="text-[10px] font-mono tabular-nums tracking-[-0.32px] text-[#999999] bg-[rgba(0,0,0,0.04)] rounded px-1.5 py-0.5">{"\u2014"}</span>
                                  <span className="text-[#999999]">&rarr;</span>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                                  <p className="text-[10px] font-semibold tracking-[-0.32px] text-[#999999]">Channel</p>
                                  <div className="flex items-center gap-1.5">
                                    {ch && <span style={{ color: ch.color }}>{ch.icon}</span>}
                                    <span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.delivery}</span>
                                    <span className={`size-1.5 rounded-full ${statusDot}`} />
                                  </div>
                                  <p className="max-w-full truncate text-[11px] tracking-[-0.32px] text-[#666666]">{order.deliveryTarget || ""}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-0 divide-x divide-[rgba(0,0,0,0.08)]">
                              <div className="flex flex-col gap-5 p-6">
                                <div>
                                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">PRODUCT</p>
                                  <p className="mt-2.5 text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedProduct.name}</p>
                                  <p className="mt-1 text-[12px] tabular-nums tracking-[-0.32px] text-[#666666]">
                                    {formatKRW(order.amount)} ({formatUSD(order.amount)})
                                  </p>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <div>
                                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">BUYER</p>
                                  <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                      <p className="text-[11px] tracking-[-0.32px] text-[#999999]">Name</p>
                                      <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.customer}</p>
                                    </div>
                                    <div>
                                      <p className="text-[11px] tracking-[-0.32px] text-[#999999]">Platform</p>
                                      <div className="mt-0.5 flex items-center gap-1.5">
                                        {pBadge && <span className={`${pBadge.bg} inline-flex size-3.5 shrink-0 items-center justify-center rounded font-bold text-white ${pBadge.textSize}`}>{pBadge.label}</span>}
                                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.platform}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <div>
                                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">DELIVERY DETAILS</p>
                                  <div className="mt-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)]">
                                    <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.06)] px-3.5 py-3">
                                      {ch && <span className="text-base" style={{ color: ch.color }}>{ch.icon}</span>}
                                      <div className="flex-1">
                                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{order.delivery}</p>
                                        <p className="text-[11px] tracking-[-0.32px] text-[#666666]">{order.deliveryTarget || "\u2014"}</p>
                                      </div>
                                      <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.06)] bg-white px-2 py-0.5">
                                        <span className={`size-1.5 rounded-full ${statusDot}`} />
                                        <span className="text-[11px] font-medium tracking-[-0.32px] text-[#181925]">
                                          {order.status === "Delivered" ? "Delivered" : order.status === "Processing" ? "Pending" : "Failed"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-3.5 py-3 text-[11px] tracking-[-0.32px]">
                                      <div>
                                        <p className="text-[#999999]">From</p>
                                        <p className="mt-0.5 font-medium text-[#181925]">{order.platform}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#999999]">To</p>
                                        <p className="mt-0.5 font-medium text-[#181925]">{order.customer}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#999999]">Time</p>
                                        <p className="mt-0.5 font-medium text-[#181925]">{order.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#999999]">Channel Target</p>
                                        <p className="mt-0.5 truncate font-mono font-medium text-[#181925]">{order.deliveryTarget || "\u2014"}</p>
                                      </div>
                                    </div>
                                    <div className="border-t border-[rgba(0,0,0,0.06)] px-3.5 py-2.5">
                                      <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                                        <RotateCcw className="size-3" strokeWidth={2} />
                                        Resend via {order.delivery}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-5 p-6">
                                <div>
                                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">LICENSE</p>
                                  <div className="mt-2.5 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-3 py-2">
                                      <span className={`size-1.5 shrink-0 rounded-full ${statusDot}`} />
                                      <span className="flex-1 truncate font-mono text-[12px] tracking-[-0.32px] text-[#181925]">{order.keyCode}</span>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(order.keyCode)
                                          setCopiedOrderKey(true)
                                          setTimeout(() => setCopiedOrderKey(false), 2000)
                                        }}
                                        className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                                      >
                                        {copiedOrderKey ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}
                                      </button>
                                    </div>
                                  </div>
                                  {order.keyCode.endsWith("0000") && (
                                    <p className="mt-2 text-[11px] tracking-[-0.32px] text-[#E37400]">{"\u26A0"} Key ends with 0000 — may be a placeholder</p>
                                  )}
                                  <div className="mt-2.5 flex gap-2">
                                    <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                                      Reassign License
                                    </button>
                                    <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                                      <RotateCcw className="size-3" strokeWidth={2} />
                                      Retry
                                    </button>
                                  </div>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <div>
                                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">DANGER ZONE</p>
                                  <div className="mt-2.5 flex gap-2">
                                    <button className="inline-flex h-8 items-center rounded-lg border border-[rgba(0,0,0,0.08)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/[0.04]">
                                      Cancel Order
                                    </button>
                                    <button className="inline-flex h-8 items-center rounded-lg bg-[#D93025] px-3 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#c12b20]">
                                      Delete Order
                                    </button>
                                  </div>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <Link
                                  to="/dashboard/orders"
                                  className="flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:bg-[#918DF6]/[0.06]"
                                >
                                  <ExternalLink className="size-3.5" strokeWidth={2} />
                                  View in Orders
                                </Link>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      )
                    })()}
                  </Dialog>
                </div>
              )}

              {detailTab === "licenses" && (() => {
                const licenses = getMockLicenses(selectedProduct.id)
                const available = licenses.filter((l) => l.status === "Available").length
                const delivered = licenses.filter((l) => l.status === "Delivered").length
                const expired = licenses.filter((l) => l.status === "Expired").length
                return (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">License Inventory</p>
                      <Link to="/dashboard/licenses" className="flex items-center gap-1.5 rounded-lg bg-[#918DF6] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#7D79E8]">
                        <Upload className="size-3" strokeWidth={2} />
                        Add Keys
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5">
                        <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Available</p>
                        <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#34A853]">{available}</p>
                      </div>
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5">
                        <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Delivered</p>
                        <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#2C78FC]">{delivered}</p>
                      </div>
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5">
                        <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Expired</p>
                        <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#D93025]">{expired}</p>
                      </div>
                    </div>

                    <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                    <div>
                      <p className="mb-2 text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Sources</p>
                      <div className="flex gap-2">
                        {["Manual Upload", "API Fetch", "Bulk Import"].map((src) => {
                          const count = licenses.filter((l) => l.source === src).length
                          return (
                            <span key={src} className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 py-1 text-[11px] font-medium tracking-[-0.32px] text-[#666666]">
                              {src}
                              <span className="tabular-nums text-[#999999]">{count}</span>
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                    <div className="flex flex-col gap-1.5">
                      {licenses.map((lic) => (
                        <div
                          key={lic.code}
                          className="flex items-center gap-3 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <code className="text-[12px] tabular-nums tracking-[-0.32px] text-[#181925]">{maskCode(lic.code)}</code>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${licenseStatusStyles[lic.status]}`}>
                                {lic.status}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[10px] font-medium tracking-[-0.32px] text-[#666666]">
                                {licenseTypeLabels[lic.type]}
                              </span>
                              <span className="text-[#CCCCCC]">·</span>
                              <span className="text-[11px] tracking-[-0.32px] text-[#999999]">{lic.source}</span>
                              <span className="text-[#CCCCCC]">·</span>
                              <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">{lic.addedDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {detailTab === "merchants" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Merchant Platforms</p>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-1.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:text-[#181925]">
                      <RefreshCw className="size-3" strokeWidth={2} />
                      Sync All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {getMockMerchants(selectedProduct.id, selectedProduct.platforms).map((merchant) => {
                      const badge = platformBadges[merchant.platform]
                      return (
                        <div
                          key={merchant.platform}
                          className={`rounded-lg border p-3.5 ${merchant.connected ? "border-[rgba(0,0,0,0.08)]" : "border-dashed border-[rgba(0,0,0,0.12)] opacity-60"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              {badge && (
                                <span className={`${badge.bg} inline-flex size-7 items-center justify-center rounded-lg font-bold text-white ${badge.textSize}`}>
                                  {badge.label}
                                </span>
                              )}
                              <div>
                                <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{merchant.platform}</p>
                                <div className="flex items-center gap-1">
                                  <Circle
                                    className={`size-2 ${merchant.connected ? "fill-[#34A853] text-[#34A853]" : "fill-[#D93025] text-[#D93025]"}`}
                                    strokeWidth={0}
                                  />
                                  <span className={`text-[11px] font-medium tracking-[-0.32px] ${merchant.connected ? "text-[#34A853]" : "text-[#D93025]"}`}>
                                    {merchant.connected ? "Connected" : "Disconnected"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {merchant.connected && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedMerchantSettings(merchant)
                                      setMerchantEditValues({
                                        externalProductId: merchant.externalProductId,
                                        priceOverride: merchant.priceOverride !== null ? String(merchant.priceOverride) : "",
                                        autoDelivery: merchant.autoDelivery,
                                        stockSync: merchant.stockSync,
                                      })
                                      setMerchantSettingsSaved(false)
                                    }}
                                    className="flex size-7 items-center justify-center rounded-md border border-[rgba(0,0,0,0.08)] text-[#999999] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                                    title="Integration settings"
                                  >
                                    <Settings className="size-3.5" strokeWidth={2} />
                                  </button>
                                  <button
                                    className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${merchant.autoSync ? "bg-[#918DF6]" : "bg-[rgba(0,0,0,0.12)]"}`}
                                    title={merchant.autoSync ? "Auto-sync on" : "Auto-sync off"}
                                  >
                                    <span className={`size-5 rounded-full bg-white shadow-sm transition-transform ${merchant.autoSync ? "translate-x-4" : "translate-x-0"}`} />
                                  </button>
                                </>
                              )}
                              {!merchant.connected && (
                                <button className="rounded-lg bg-[#918DF6] px-3 py-1 text-[11px] font-medium text-white transition-colors hover:bg-[#7D79E8]">
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>

                          {merchant.connected && (
                            <div className="mt-2.5 flex flex-col gap-1.5 rounded-md bg-[rgba(0,0,0,0.02)] p-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Last Sync</span>
                                <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">
                                  {merchant.lastSync ?? "Never"}
                                </span>
                              </div>
                              {merchant.listingUrl && (
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Listing</span>
                                  <span className="flex items-center gap-1 text-[11px] tracking-[-0.32px] text-[#918DF6]">
                                    <ExternalLink className="size-3" strokeWidth={2} />
                                    View Listing
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Auto-Sync</span>
                                <span className="flex items-center gap-1 text-[11px] tracking-[-0.32px] text-[#666666]">
                                  {merchant.autoSync ? <Eye className="size-3" strokeWidth={2} /> : <EyeOff className="size-3" strokeWidth={2} />}
                                  {merchant.autoSync ? "Enabled" : "Disabled"}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={selectedMerchantSettings !== null} onOpenChange={(open) => { if (!open) { setSelectedMerchantSettings(null); setMerchantEditValues(null); setMerchantSettingsSaved(false) } }}>
        {selectedMerchantSettings && merchantEditValues && (() => {
          const merchant = selectedMerchantSettings
          const badge = platformBadges[merchant.platform]
          return (
            <DialogContent className="sm:max-w-[420px]">
              <DialogHeader>
                <div className="flex items-center gap-2.5">
                  {badge && (
                    <span className={`${badge.bg} inline-flex size-8 items-center justify-center rounded-lg font-bold text-white ${badge.textSize}`}>
                      {badge.label}
                    </span>
                  )}
                  <div>
                    <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {merchant.platform} Integration
                    </DialogTitle>
                    <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                      Integration settings for this product on {merchant.platform}.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">Product ID / SKU</label>
                  <input
                    type="text"
                    value={merchantEditValues.externalProductId}
                    onChange={(e) => setMerchantEditValues({ ...merchantEditValues, externalProductId: e.target.value })}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">Price Override</label>
                  <input
                    type="text"
                    value={merchantEditValues.priceOverride}
                    onChange={(e) => setMerchantEditValues({ ...merchantEditValues, priceOverride: e.target.value })}
                    placeholder="Leave empty to use default price"
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMerchantEditValues({ ...merchantEditValues, autoDelivery: !merchantEditValues.autoDelivery })}
                  className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5"
                >
                  <span className="text-[13px] tracking-[-0.32px] text-[#181925]">Auto-Delivery</span>
                  <div
                    className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${merchantEditValues.autoDelivery ? "bg-[#918DF6]" : "bg-[rgba(0,0,0,0.12)]"}`}
                  >
                    <span className={`size-4 rounded-full bg-white shadow-sm transition-transform ${merchantEditValues.autoDelivery ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMerchantEditValues({ ...merchantEditValues, stockSync: !merchantEditValues.stockSync })}
                  className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5"
                >
                  <span className="text-[13px] tracking-[-0.32px] text-[#181925]">Stock Sync</span>
                  <div
                    className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${merchantEditValues.stockSync ? "bg-[#918DF6]" : "bg-[rgba(0,0,0,0.12)]"}`}
                  >
                    <span className={`size-4 rounded-full bg-white shadow-sm transition-transform ${merchantEditValues.stockSync ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">Webhook URL</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={merchant.webhookUrl}
                      className="h-9 min-w-0 flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.02)] px-3 text-[12px] tabular-nums tracking-[-0.32px] text-[#666666] outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(merchant.webhookUrl)
                        setCopiedWebhook(merchant.platform)
                        setTimeout(() => setCopiedWebhook(null), 2000)
                      }}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.12)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                      title="Copy webhook URL"
                    >
                      {copiedWebhook === merchant.platform ? (
                        <Check className="size-3.5 text-[#34A853]" strokeWidth={2} />
                      ) : (
                        <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] tracking-[-0.32px] text-[#999999]">Auto-generated. Cannot be edited.</p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => { setSelectedMerchantSettings(null); setMerchantEditValues(null); setMerchantSettingsSaved(false) }}
                    className="flex h-8 items-center rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setMerchantSettingsSaved(true)
                      setTimeout(() => setMerchantSettingsSaved(false), 1500)
                    }}
                    className="flex h-8 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                  >
                    {merchantSettingsSaved ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="size-3.5" strokeWidth={2.5} />
                        Saved!
                      </span>
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </div>
              </div>
            </DialogContent>
          )
        })()}
      </Dialog>
    </DashboardLayout>
  )
}
