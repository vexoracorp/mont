import { useState } from "react"
import { Settings, Unplug, Globe, Download, Check, Package, Truck, Store } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"

type Merchant = {
  id: string
  name: string
  connected: boolean
  iconBg: string
  iconLabel: string
  storeName?: string
  connectedSince?: string
  orderCount?: number
  apiKey?: string
  description?: string
}

type PluginCategory = "Merchant" | "Provider" | "Delivery"

type Plugin = {
  id: string
  name: string
  author: string
  description: string
  fullDescription: string
  category: PluginCategory
  iconBg: string
  iconLabel: string
  installs: number
  installed: boolean
  version: string
  configSnippet: string
}

const merchants: Merchant[] = [
  {
    id: "naver",
    name: "Naver Store",
    connected: true,
    iconBg: "#03C75A",
    iconLabel: "N",
    storeName: "Vexora 디지털스토어",
    connectedSince: "2025-12-15",
    orderCount: 1247,
    apiKey: "nv-sk-••••••••7f3m",
  },
  {
    id: "g2g",
    name: "G2G",
    connected: true,
    iconBg: "#E87A2A",
    iconLabel: "G2G",
    storeName: "VexoraDigital",
    connectedSince: "2026-01-08",
    orderCount: 892,
    apiKey: "g2g-api-••••••••a2k9",
  },
  {
    id: "g2a",
    name: "G2A",
    connected: false,
    iconBg: "#F05A23",
    iconLabel: "G2A",
    description: "Connect your G2A Marketplace seller account to auto-deliver game keys and digital products",
  },
  {
    id: "direct",
    name: "Direct / Website",
    connected: false,
    iconBg: "#918DF6",
    iconLabel: "globe",
    description: "Set up webhook-based delivery for your own website or custom storefront",
  },
]

const connectedCount = merchants.filter((m) => m.connected).length
const totalOrders = merchants.reduce((sum, m) => sum + (m.orderCount ?? 0), 0)

const plugins: Plugin[] = [
  {
    id: "coupang",
    name: "Coupang Connector",
    author: "@devkim",
    description: "Connect Coupang marketplace for auto-delivery of digital products",
    fullDescription: "Seamlessly integrate with Coupang marketplace to automatically fulfill digital product orders. Supports real-time order sync, automatic key delivery, and inventory management. Compatible with all Coupang seller account tiers.",
    category: "Merchant",
    iconBg: "#E44D2E",
    iconLabel: "C",
    installs: 1200,
    installed: false,
    version: "v1.3.2",
    configSnippet: `import { CoupangConnector } from "mont-coupang"\n\nexport default CoupangConnector({\n  sellerId: process.env.COUPANG_SELLER_ID,\n  secretKey: process.env.COUPANG_SECRET,\n  autoDeliver: true,\n})`,
  },
  {
    id: "steam-market",
    name: "Steam Market Bridge",
    author: "@steamdev",
    description: "Sync Steam Community Market listings with Mont inventory",
    fullDescription: "Bridge your Steam Community Market listings directly into Mont. Automatically sync item listings, track market prices, and manage inventory across both platforms with real-time updates.",
    category: "Merchant",
    iconBg: "#1B2838",
    iconLabel: "S",
    installs: 890,
    installed: false,
    version: "v2.0.1",
    configSnippet: `import { SteamBridge } from "mont-steam"\n\nexport default SteamBridge({\n  apiKey: process.env.STEAM_API_KEY,\n  syncInterval: "5m",\n  priceTracking: true,\n})`,
  },
  {
    id: "shopee",
    name: "Shopee Digital",
    author: "@seagroup",
    description: "Sell digital products on Shopee marketplace",
    fullDescription: "Expand your reach to Southeast Asian markets by selling digital products on Shopee. Supports automatic order processing, multi-region pricing, and instant delivery through Shopee Chat integration.",
    category: "Merchant",
    iconBg: "#EE4D2D",
    iconLabel: "Sh",
    installs: 650,
    installed: false,
    version: "v1.1.0",
    configSnippet: `import { ShopeeDigital } from "mont-shopee"\n\nexport default ShopeeDigital({\n  shopId: process.env.SHOPEE_SHOP_ID,\n  partnerKey: process.env.SHOPEE_KEY,\n  regions: ["SG", "MY", "TH"],\n})`,
  },
  {
    id: "kinguin",
    name: "Kinguin Key Provider",
    author: "@kinguin",
    description: "Auto-restock game keys from Kinguin wholesale API",
    fullDescription: "Automatically restock your game key inventory from Kinguin wholesale. Set minimum stock thresholds, configure auto-purchase rules, and get real-time price alerts for optimal buying opportunities.",
    category: "Provider",
    iconBg: "#0EA5E9",
    iconLabel: "K",
    installs: 2100,
    installed: true,
    version: "v3.1.0",
    configSnippet: `import { KinguinProvider } from "mont-kinguin"\n\nexport default KinguinProvider({\n  apiKey: process.env.KINGUIN_API_KEY,\n  minStock: 5,\n  autoPurchase: true,\n  maxPrice: "wholesale",\n})`,
  },
  {
    id: "keygen",
    name: "Custom Key Generator",
    author: "@montlabs",
    description: "Generate serial keys with custom patterns and validation",
    fullDescription: "Create and manage custom serial keys with configurable patterns, checksum validation, and batch generation. Supports multiple key formats including alphanumeric, segmented, and UUID-based patterns.",
    category: "Provider",
    iconBg: "#918DF6",
    iconLabel: "Kg",
    installs: 3400,
    installed: true,
    version: "v2.4.1",
    configSnippet: `import { KeyGenerator } from "mont-keygen"\n\nexport default KeyGenerator({\n  pattern: "XXXX-XXXX-XXXX-XXXX",\n  charset: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",\n  checksum: true,\n})`,
  },
  {
    id: "eneba",
    name: "Eneba Supplier",
    author: "@eneba",
    description: "Source game keys from Eneba marketplace at wholesale prices",
    fullDescription: "Connect to Eneba marketplace to source game keys at competitive wholesale prices. Features automatic price comparison, bulk purchasing, and inventory sync with real-time availability checks.",
    category: "Provider",
    iconBg: "#FF6B35",
    iconLabel: "E",
    installs: 780,
    installed: false,
    version: "v1.0.4",
    configSnippet: `import { EnebaSupplier } from "mont-eneba"\n\nexport default EnebaSupplier({\n  clientId: process.env.ENEBA_CLIENT_ID,\n  clientSecret: process.env.ENEBA_SECRET,\n  currency: "EUR",\n})`,
  },
  {
    id: "discord",
    name: "Discord Bot Delivery",
    author: "@discorddev",
    description: "Deliver keys via Discord DM using a custom bot",
    fullDescription: "Set up a Discord bot that automatically delivers purchased keys via direct message. Supports server verification, role-based access, and delivery confirmation with read receipts.",
    category: "Delivery",
    iconBg: "#5865F2",
    iconLabel: "D",
    installs: 1800,
    installed: false,
    version: "v2.2.0",
    configSnippet: `import { DiscordDelivery } from "mont-discord"\n\nexport default DiscordDelivery({\n  botToken: process.env.DISCORD_BOT_TOKEN,\n  guildId: process.env.DISCORD_GUILD_ID,\n  confirmRead: true,\n})`,
  },
  {
    id: "kakao",
    name: "KakaoTalk Delivery",
    author: "@kakaodev",
    description: "Send product keys through KakaoTalk messaging",
    fullDescription: "Deliver digital products directly through KakaoTalk, Korea's most popular messaging platform. Supports template messages, delivery tracking, and customer support integration via KakaoTalk Channel.",
    category: "Delivery",
    iconBg: "#FEE500",
    iconLabel: "Kt",
    installs: 2600,
    installed: true,
    version: "v1.8.3",
    configSnippet: `import { KakaoDelivery } from "mont-kakao"\n\nexport default KakaoDelivery({\n  appKey: process.env.KAKAO_APP_KEY,\n  channelId: process.env.KAKAO_CHANNEL,\n  templateId: "delivery_key_v2",\n})`,
  },
  {
    id: "line",
    name: "LINE Delivery",
    author: "@linedev",
    description: "Deliver digital products via LINE messenger",
    fullDescription: "Integrate with LINE Messaging API to deliver digital products across Japan and Southeast Asia. Features rich message templates, delivery confirmation, and LINE Pay integration for seamless transactions.",
    category: "Delivery",
    iconBg: "#06C755",
    iconLabel: "L",
    installs: 540,
    installed: false,
    version: "v1.2.0",
    configSnippet: `import { LineDelivery } from "mont-line"\n\nexport default LineDelivery({\n  channelToken: process.env.LINE_CHANNEL_TOKEN,\n  channelSecret: process.env.LINE_SECRET,\n  richTemplate: true,\n})`,
  },
  {
    id: "slack",
    name: "Slack Notification",
    author: "@slackint",
    description: "Send delivery notifications to Slack channels",
    fullDescription: "Post real-time delivery notifications to your Slack workspace. Configure per-channel routing, custom message formats, and alert thresholds for failed deliveries. Supports Slack Block Kit for rich notifications.",
    category: "Delivery",
    iconBg: "#4A154B",
    iconLabel: "Sl",
    installs: 320,
    installed: false,
    version: "v1.0.2",
    configSnippet: `import { SlackNotify } from "mont-slack"\n\nexport default SlackNotify({\n  webhookUrl: process.env.SLACK_WEBHOOK,\n  channel: "#deliveries",\n  alertOnFailure: true,\n})`,
  },
]

function formatInstalls(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(n)
}

const categoryIcon: Record<PluginCategory, typeof Store> = {
  Merchant: Store,
  Provider: Package,
  Delivery: Truck,
}

const pluginFilters = ["All", "Merchant", "Provider", "Delivery"] as const
type PluginFilter = (typeof pluginFilters)[number]

export default function Merchants() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [connectTarget, setConnectTarget] = useState<Merchant | null>(null)
  const [pluginFilter, setPluginFilter] = useState<PluginFilter>("All")
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [activeTab, setActiveTab] = useState<"platforms" | "plugins">("platforms")

  const connectedMerchants = merchants.filter((m) => m.connected)
  const availableMerchants = merchants.filter((m) => !m.connected)
  const filteredPlugins =
    pluginFilter === "All"
      ? plugins
      : plugins.filter((p) => p.category === pluginFilter)

  return (
    <DashboardLayout
      title="Merchants"
      currency={currency}
      onCurrencyToggle={() => setCurrency((c) => (c === "USD" ? "KRW" : "USD"))}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6 lg:px-8">
        <div className="mb-4 flex items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-1" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)", width: "fit-content" }}>
          <button
            onClick={() => setActiveTab("platforms")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
              activeTab === "platforms"
                ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                : "text-[#666666] hover:text-[#181925]"
            }`}
          >
            <Store className="size-3.5" strokeWidth={2} />
            Platforms
            <span className={`text-[11px] tabular-nums ${activeTab === "platforms" ? "text-[#918DF6]" : "text-[#999999]"}`}>
              {merchants.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("plugins")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
              activeTab === "plugins"
                ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                : "text-[#666666] hover:text-[#181925]"
            }`}
          >
            <Package className="size-3.5" strokeWidth={2} />
            Plugin Store
            <span className={`text-[11px] tabular-nums ${activeTab === "plugins" ? "text-[#918DF6]" : "text-[#999999]"}`}>
              {plugins.length}
            </span>
          </button>
        </div>

        {activeTab === "platforms" ? (
          <>
            <p className="mb-4 text-[13px] tracking-[-0.32px] text-[#666666]">
              <span className="tabular-nums">{merchants.length}</span> platforms available
              {" · "}
              <span className="tabular-nums">{connectedCount}</span> connected
              {" · "}
              <span className="tabular-nums">{totalOrders.toLocaleString("en-US")}</span> total orders
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {connectedMerchants.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: m.iconBg }}
                >
                  {m.iconLabel === "globe" ? (
                    <Globe className="size-4" strokeWidth={2} />
                  ) : (
                    <span className={`font-bold leading-none ${m.iconLabel.length > 1 ? "text-[9px]" : "text-[14px]"}`}>
                      {m.iconLabel}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{m.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block size-1.5 rounded-full bg-[#34A853]" />
                    <span className="text-[12px] tracking-[-0.32px] text-[#34A853]">{m.storeName}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-3 text-[12px] tracking-[-0.32px] text-[#666666]">
                <span className="tabular-nums">{m.orderCount?.toLocaleString("en-US")} orders</span>
                <span className="text-[#CCCCCC]">·</span>
                <span className="tabular-nums text-[#999999]">{m.apiKey}</span>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5">
                <button className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]">
                  <Unplug className="size-3" strokeWidth={2} />
                  Disconnect
                </button>
                <button className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]">
                  <Settings className="size-3" strokeWidth={2} />
                  Settings
                </button>
              </div>
            </div>
          ))}

          {availableMerchants.map((m) => (
            <div
              key={m.id}
              className="flex flex-col rounded-xl border border-dashed border-[rgba(0,0,0,0.12)] bg-white p-3.5"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: m.iconBg }}
                >
                  {m.iconLabel === "globe" ? (
                    <Globe className="size-4" strokeWidth={2} />
                  ) : (
                    <span className={`font-bold leading-none ${m.iconLabel.length > 1 ? "text-[9px]" : "text-[14px]"}`}>
                      {m.iconLabel}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{m.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block size-1.5 rounded-full bg-[#CCCCCC]" />
                    <span className="text-[12px] tracking-[-0.32px] text-[#999999]">Not connected</span>
                  </div>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                {m.description}
              </p>
              <div className="mt-2.5">
                <button
                  onClick={() => setConnectTarget(m)}
                  className="flex h-7 items-center rounded-full bg-[#918DF6] px-3 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-[13px] tracking-[-0.32px] text-[#666666]">
              Browse community plugins to extend Mont
            </p>

            <div className="mb-4 flex items-center gap-2">
              {pluginFilters.map((f) => (
            <button
              key={f}
              onClick={() => setPluginFilter(f)}
              className={`flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                pluginFilter === f
                  ? "border-[#918DF6]/30 bg-[#918DF6]/[0.08] text-[#918DF6]"
                  : "border-[rgba(0,0,0,0.08)] bg-white text-[#666666] hover:bg-[rgba(0,0,0,0.02)]"
              }`}
            >
              {f !== "All" && (() => { const Icon = categoryIcon[f as PluginCategory]; return <Icon className="size-3.5" strokeWidth={2} /> })()}
              {f}
            </button>
          ))}
        </div>

        {/* Plugin grid */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlugins.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlugin(p)}
              className="flex flex-col rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4 text-left transition-colors hover:bg-[rgba(0,0,0,0.01)]"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: p.iconBg }}
                >
                  <span className={`font-bold leading-none ${p.iconLabel.length > 1 ? "text-[9px]" : "text-[14px]"}`}>
                    {p.iconLabel}
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{p.name}</p>
                  <p className="text-[12px] tracking-[-0.32px] text-[#999999]">{p.author}</p>
                </div>
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-snug tracking-[-0.32px] text-[#666666]">{p.description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-md border border-[rgba(0,0,0,0.08)] px-1.5 py-0.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666]">{p.category}</span>
                <span className="text-[12px] tabular-nums tracking-[-0.32px] text-[#999999]">{formatInstalls(p.installs)} installs</span>
                <span className="ml-auto">
                  {p.installed ? (
                    <span className="flex h-7 items-center gap-1 rounded-full bg-[#34A853]/10 px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#34A853]">
                      <Check className="size-3" strokeWidth={2.5} />
                      Installed
                    </span>
                  ) : (
                    <span className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      <Download className="size-3" strokeWidth={2} />
                      Install
                    </span>
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
          </>
        )}
      </div>

      {/* Connect Modal */}
      <Dialog
        open={connectTarget !== null}
        onOpenChange={(open) => {
          if (!open) setConnectTarget(null)
        }}
      >
        {connectTarget && (
          <DialogContent className="sm:max-w-md" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                Connect {connectTarget.name}
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                Enter your credentials to connect this platform.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                  API Key
                </label>
                <input
                  type="text"
                  placeholder="Enter your API key"
                  className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                  Store / Seller ID
                </label>
                <input
                  type="text"
                  placeholder="Enter your store ID"
                  className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                />
              </div>
              <label className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  defaultChecked
                  className="size-4 rounded border-[rgba(0,0,0,0.12)] accent-[#918DF6]"
                />
                <span className="text-[13px] tracking-[-0.32px] text-[#181925]">
                  Enable auto-delivery for new orders
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setConnectTarget(null)}
                  className="flex h-8 items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                >
                  Cancel
                </button>
                <button className="flex h-8 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]">
                  Connect
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Plugin Detail Modal */}
      <Dialog
        open={selectedPlugin !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPlugin(null)
        }}
      >
        {selectedPlugin && (
          <DialogContent className="sm:max-w-lg" showCloseButton>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: selectedPlugin.iconBg }}
                >
                  <span className={`font-bold leading-none ${selectedPlugin.iconLabel.length > 1 ? "text-[10px]" : "text-[16px]"}`}>
                    {selectedPlugin.iconLabel}
                  </span>
                </span>
                <div>
                  <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                    {selectedPlugin.name}
                  </DialogTitle>
                  <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{selectedPlugin.author}</p>
                </div>
              </div>
              <DialogDescription className="sr-only">Plugin details for {selectedPlugin.name}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <p className="text-[14px] leading-relaxed tracking-[-0.32px] text-[#666666]">{selectedPlugin.fullDescription}</p>

              <div className="flex items-center gap-3">
                <span className="rounded-md border border-[rgba(0,0,0,0.08)] px-2 py-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{selectedPlugin.category}</span>
                <span className="text-[13px] tabular-nums tracking-[-0.32px] text-[#999999]">{formatInstalls(selectedPlugin.installs)} installs</span>
                <span className="text-[13px] tabular-nums tracking-[-0.32px] text-[#999999]">{selectedPlugin.version}</span>
              </div>

              <div className="rounded-lg bg-neutral-50 p-4">
                <pre className="text-[13px] leading-relaxed tracking-[-0.32px] text-[#181925]"><code>{selectedPlugin.configSnippet}</code></pre>
              </div>

              <div className="flex items-center justify-end">
                {selectedPlugin.installed ? (
                  <button className="flex h-8 items-center gap-1.5 rounded-full border border-[#D93025]/20 bg-[#D93025]/[0.06] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/10">
                    Uninstall
                  </button>
                ) : (
                  <button className="flex h-8 items-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]">
                    <Download className="size-3.5" strokeWidth={2} />
                    Install
                  </button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  )
}
