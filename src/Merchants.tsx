import { useState } from "react"
import { Settings, Unplug, Globe, Download, Check, Package, Truck, Store, Eye, EyeOff } from "lucide-react"
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

type SettingsFieldBase = {
  key: string
  label: string
  helperText?: string
  section?: string
  halfWidth?: boolean
}

type SettingsFieldText = SettingsFieldBase & {
  type: "text"
  placeholder?: string
  defaultValue?: string
}

type SettingsFieldPassword = SettingsFieldBase & {
  type: "password"
  placeholder?: string
  defaultValue?: string
}

type SettingsFieldCheckbox = SettingsFieldBase & {
  type: "checkbox"
  defaultValue?: boolean
}

type SettingsFieldSelect = SettingsFieldBase & {
  type: "select"
  options: string[]
  defaultValue?: string
}

type SettingsFieldNumber = SettingsFieldBase & {
  type: "number"
  placeholder?: string
  defaultValue?: number
}

type SettingsField =
  | SettingsFieldText
  | SettingsFieldPassword
  | SettingsFieldCheckbox
  | SettingsFieldSelect
  | SettingsFieldNumber

type PlatformSettingsConfig = {
  description: string
  fields: SettingsField[]
  storeNameKey: string
  apiKeyKey: string
}

const platformSettingsConfigs: Record<string, PlatformSettingsConfig> = {
  naver: {
    description: "Configure your Naver Commerce API connection.",
    storeNameKey: "storeName",
    apiKeyKey: "apiKey",
    fields: [
      { key: "storeName", label: "Store Name", type: "text", placeholder: "Your Naver store name", section: "Connection", halfWidth: true },
      { key: "apiKey", label: "API Key", type: "password", placeholder: "Naver Commerce API key", section: "Connection" },
      { key: "secretKey", label: "Secret Key", type: "password", placeholder: "Naver Commerce secret key", section: "Connection" },
      { key: "autoDelivery", label: "Auto-delivery", type: "checkbox", defaultValue: true, section: "Delivery", halfWidth: true },
      { key: "orderSyncInterval", label: "Order sync interval", type: "select", options: ["Real-time", "Every 5 min", "Every 15 min", "Every 30 min"], defaultValue: "Real-time", section: "Delivery", halfWidth: true },
      { key: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://your-domain.com/naver/webhook", section: "Integration" },
    ],
  },
  g2g: {
    description: "Configure your G2G Marketplace API connection.",
    storeNameKey: "sellerName",
    apiKeyKey: "apiKey",
    fields: [
      { key: "sellerName", label: "Seller Name", type: "text", placeholder: "Your G2G seller name", section: "Connection", halfWidth: true },
      { key: "apiKey", label: "API Key", type: "password", placeholder: "G2G API key", section: "Connection" },
      { key: "priceMarkup", label: "Price markup %", type: "number", placeholder: "e.g. 5", defaultValue: 5, section: "Pricing", halfWidth: true },
      { key: "defaultCurrency", label: "Default currency", type: "select", options: ["USD", "EUR", "KRW"], defaultValue: "USD", section: "Pricing", halfWidth: true },
      { key: "autoDelivery", label: "Auto-delivery", type: "checkbox", defaultValue: true, section: "Delivery", halfWidth: true },
      { key: "inventorySync", label: "Inventory sync", type: "checkbox", defaultValue: true, section: "Delivery", halfWidth: true },
    ],
  },
  g2a: {
    description: "Configure your G2A Marketplace API connection.",
    storeNameKey: "sellerId",
    apiKeyKey: "apiKey",
    fields: [
      { key: "sellerId", label: "Seller ID", type: "text", placeholder: "Your G2A seller ID", section: "Connection", halfWidth: true },
      { key: "apiKey", label: "API Key", type: "password", placeholder: "G2A API key", section: "Connection" },
      { key: "apiSecret", label: "API Secret", type: "password", placeholder: "G2A API secret", section: "Connection" },
      { key: "autoDelivery", label: "Auto-delivery", type: "checkbox", defaultValue: true, section: "Delivery", halfWidth: true },
      { key: "returnPolicy", label: "Return policy", type: "select", options: ["Standard 14-day", "Extended 30-day", "No returns"], defaultValue: "Standard 14-day", section: "Delivery", halfWidth: true },
      { key: "sandboxMode", label: "Sandbox mode", type: "checkbox", defaultValue: false, helperText: "Enable for testing only", section: "Advanced", halfWidth: true },
    ],
  },
  direct: {
    description: "Configure your custom webhook delivery endpoint.",
    storeNameKey: "siteUrl",
    apiKeyKey: "webhookSecret",
    fields: [
      { key: "siteUrl", label: "Site URL", type: "text", placeholder: "https://your-site.com", section: "Endpoints" },
      { key: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://your-site.com/api/webhook", section: "Endpoints" },
      { key: "deliveryCallbackUrl", label: "Delivery callback URL", type: "text", placeholder: "https://your-site.com/api/callback", section: "Endpoints" },
      { key: "webhookSecret", label: "Webhook Secret", type: "password", placeholder: "Your webhook signing secret", section: "Security" },
      { key: "autoDelivery", label: "Auto-delivery", type: "checkbox", defaultValue: true, section: "Delivery", halfWidth: true },
      { key: "rateLimit", label: "Rate limit", type: "number", placeholder: "requests/min", defaultValue: 60, section: "Delivery", halfWidth: true },
    ],
  },
}

const initialMerchants: Merchant[] = [
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

const initialPlugins: Plugin[] = [
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
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants)
  const [plugins, setPlugins] = useState<Plugin[]>(initialPlugins)
  const [connectTarget, setConnectTarget] = useState<Merchant | null>(null)
  const [connectApiKey, setConnectApiKey] = useState("")
  const [connectStoreId, setConnectStoreId] = useState("")
  const [pluginFilter, setPluginFilter] = useState<PluginFilter>("All")
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)
  const [activeTab, setActiveTab] = useState<"platforms" | "plugins">("platforms")
  const [settingsTarget, setSettingsTarget] = useState<Merchant | null>(null)
  const [settingsValues, setSettingsValues] = useState<Record<string, string | boolean | number>>({})
  const [settingsPasswordVisible, setSettingsPasswordVisible] = useState<Record<string, boolean>>({})

  const connectedCount = merchants.filter((m) => m.connected).length
  const totalOrders = merchants.reduce((sum, m) => sum + (m.orderCount ?? 0), 0)
  const connectedMerchants = merchants.filter((m) => m.connected)
  const availableMerchants = merchants.filter((m) => !m.connected)
  const filteredPlugins =
    pluginFilter === "All"
      ? plugins
      : plugins.filter((p) => p.category === pluginFilter)

  function handleConnect() {
    if (!connectTarget) return
    const maskedKey = connectApiKey.length > 4
      ? connectApiKey.slice(0, 4) + "-••••••••" + connectApiKey.slice(-4)
      : connectApiKey
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === connectTarget.id
          ? {
              ...m,
              connected: true,
              storeName: connectStoreId || m.name,
              connectedSince: new Date().toISOString().split("T")[0],
              orderCount: 0,
              apiKey: maskedKey,
            }
          : m
      )
    )
    setConnectTarget(null)
    setConnectApiKey("")
    setConnectStoreId("")
  }

  function handleDisconnect(id: string) {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              connected: false,
              storeName: undefined,
              connectedSince: undefined,
              orderCount: undefined,
              apiKey: undefined,
            }
          : m
      )
    )
  }

  function openSettings(m: Merchant) {
    const config = platformSettingsConfigs[m.id]
    if (!config) return
    const initial: Record<string, string | boolean | number> = {}
    for (const field of config.fields) {
      if (field.key === config.storeNameKey && m.storeName) {
        initial[field.key] = m.storeName
      } else if (field.key === config.apiKeyKey && m.apiKey) {
        initial[field.key] = m.apiKey
      } else if (field.type === "checkbox") {
        initial[field.key] = field.defaultValue ?? false
      } else if (field.type === "number") {
        initial[field.key] = field.defaultValue ?? 0
      } else if (field.type === "select") {
        initial[field.key] = field.defaultValue ?? field.options[0]
      } else {
        initial[field.key] = (field as SettingsFieldText | SettingsFieldPassword).defaultValue ?? ""
      }
    }
    setSettingsTarget(m)
    setSettingsValues(initial)
    setSettingsPasswordVisible({})
  }

  function handleSaveSettings() {
    if (!settingsTarget) return
    const config = platformSettingsConfigs[settingsTarget.id]
    if (!config) return
    const rawStoreName = String(settingsValues[config.storeNameKey] ?? "")
    const rawApiKey = String(settingsValues[config.apiKeyKey] ?? "")
    const maskedKey = rawApiKey.includes("••••")
      ? rawApiKey
      : rawApiKey.length > 4
        ? rawApiKey.slice(0, 4) + "-••••••••" + rawApiKey.slice(-4)
        : rawApiKey
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === settingsTarget.id
          ? { ...m, storeName: rawStoreName, apiKey: maskedKey }
          : m
      )
    )
    setSettingsTarget(null)
  }

  function handleToggleInstall(pluginId: string) {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === pluginId
          ? { ...p, installed: !p.installed, installs: p.installed ? p.installs - 1 : p.installs + 1 }
          : p
      )
    )
    if (selectedPlugin && selectedPlugin.id === pluginId) {
      setSelectedPlugin((prev) =>
        prev ? { ...prev, installed: !prev.installed, installs: prev.installed ? prev.installs - 1 : prev.installs + 1 } : null
      )
    }
  }

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
                <button
                  onClick={() => handleDisconnect(m.id)}
                  className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                >
                  <Unplug className="size-3" strokeWidth={2} />
                  Disconnect
                </button>
                <button
                  onClick={() => openSettings(m)}
                  className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                >
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
                    <span
                      role="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleInstall(p.id) }}
                      className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] hover:bg-[rgba(0,0,0,0.02)]"
                    >
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
          if (!open) {
            setConnectTarget(null)
            setConnectApiKey("")
            setConnectStoreId("")
          }
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
                  value={connectApiKey}
                  onChange={(e) => setConnectApiKey(e.target.value)}
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
                  value={connectStoreId}
                  onChange={(e) => setConnectStoreId(e.target.value)}
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
                  onClick={() => { setConnectTarget(null); setConnectApiKey(""); setConnectStoreId("") }}
                  className="flex h-8 items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnect}
                  className="flex h-8 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                >
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
                  <button
                    onClick={() => handleToggleInstall(selectedPlugin.id)}
                    className="flex h-8 items-center gap-1.5 rounded-full border border-[#D93025]/20 bg-[#D93025]/[0.06] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/10"
                  >
                    Uninstall
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleInstall(selectedPlugin.id)}
                    className="flex h-8 items-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                  >
                    <Download className="size-3.5" strokeWidth={2} />
                    Install
                  </button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Settings Modal */}
      <Dialog
        open={settingsTarget !== null}
        onOpenChange={(open) => {
          if (!open) setSettingsTarget(null)
        }}
      >
        {settingsTarget && (() => {
          const config = platformSettingsConfigs[settingsTarget.id]
          if (!config) return null

          const sections: { name: string; fields: SettingsField[] }[] = []
          for (const field of config.fields) {
            const sectionName = field.section ?? ""
            const last = sections[sections.length - 1]
            if (last && last.name === sectionName) {
              last.fields.push(field)
            } else {
              sections.push({ name: sectionName, fields: [field] })
            }
          }

          const renderField = (field: SettingsField) => {
            if (field.type === "checkbox") {
              return (
                <label key={field.key} className={`flex flex-col gap-1${field.halfWidth ? "" : " col-span-2"}`}>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={Boolean(settingsValues[field.key])}
                      onChange={(e) => setSettingsValues((prev) => ({ ...prev, [field.key]: e.target.checked }))}
                      className="size-4 rounded border-[rgba(0,0,0,0.12)] accent-[#918DF6]"
                    />
                    <span className="text-[13px] tracking-[-0.32px] text-[#181925]">
                      {field.label}
                    </span>
                  </div>
                  {field.helperText && (
                    <span className="ml-[26px] text-[11px] tracking-[-0.32px] text-[#E8A838]">{field.helperText}</span>
                  )}
                </label>
              )
            }

            if (field.type === "select") {
              return (
                <div key={field.key} className={field.halfWidth ? "" : "col-span-2"}>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    {field.label}
                  </label>
                  <select
                    value={String(settingsValues[field.key] ?? "")}
                    onChange={(e) => setSettingsValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {field.helperText && (
                    <span className="mt-1 block text-[11px] tracking-[-0.32px] text-[#999999]">{field.helperText}</span>
                  )}
                </div>
              )
            }

            if (field.type === "number") {
              return (
                <div key={field.key} className={field.halfWidth ? "" : "col-span-2"}>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    value={settingsValues[field.key] as number ?? 0}
                    onChange={(e) => setSettingsValues((prev) => ({ ...prev, [field.key]: Number(e.target.value) }))}
                    placeholder={field.placeholder}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                  {field.helperText && (
                    <span className="mt-1 block text-[11px] tracking-[-0.32px] text-[#999999]">{field.helperText}</span>
                  )}
                </div>
              )
            }

            if (field.type === "password") {
              const visible = settingsPasswordVisible[field.key] ?? false
              return (
                <div key={field.key} className={field.halfWidth ? "" : "col-span-2"}>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type={visible ? "text" : "password"}
                      value={String(settingsValues[field.key] ?? "")}
                      onChange={(e) => setSettingsValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-9 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSettingsPasswordVisible((prev) => ({ ...prev, [field.key]: !visible }))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
                    >
                      {visible ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                    </button>
                  </div>
                  {field.helperText && (
                    <span className="mt-1 block text-[11px] tracking-[-0.32px] text-[#999999]">{field.helperText}</span>
                  )}
                </div>
              )
            }

            return (
              <div key={field.key} className={field.halfWidth ? "" : "col-span-2"}>
                <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={String(settingsValues[field.key] ?? "")}
                  onChange={(e) => setSettingsValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                />
                {field.helperText && (
                  <span className="mt-1 block text-[11px] tracking-[-0.32px] text-[#999999]">{field.helperText}</span>
                )}
              </div>
            )
          }

          return (
            <DialogContent className="sm:max-w-2xl" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                  {settingsTarget.name} Settings
                </DialogTitle>
                <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                  {config.description}
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-5">
                {sections.map((section, sIdx) => (
                  <div key={section.name || sIdx}>
                    {section.name && (
                      <div className={`flex items-center gap-3 ${sIdx > 0 ? "pt-1" : ""} pb-3`}>
                        {sIdx > 0 && <div className="h-px flex-1 bg-[rgba(0,0,0,0.06)]" />}
                        <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#999999]">
                          {section.name}
                        </span>
                        <div className="h-px flex-1 bg-[rgba(0,0,0,0.06)]" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      {section.fields.map(renderField)}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setSettingsTarget(null)}
                    className="flex h-8 items-center rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="flex h-8 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                  >
                    Save
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
