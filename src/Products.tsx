import { useState } from "react"
import {
  Search,
  Plus,
  Package,
  TrendingUp,
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

      <Dialog open={selectedProduct !== null} onOpenChange={(open) => { if (!open) setSelectedProduct(null) }}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                {selectedProduct.name}
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                {selectedProduct.category} · {selectedProduct.id}
              </DialogDescription>
            </DialogHeader>

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
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  )
}
