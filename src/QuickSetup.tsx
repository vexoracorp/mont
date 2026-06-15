import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Check,
  CheckCircle2,
  Clock3,
  CirclePlus,
  Eye,
  EyeOff,
  Mail,
  MessageSquare,
  Package,
  ShieldCheck,
  Rocket,
  Search,
  Send,
  Smartphone,
  Unplug,
  Upload,
} from "lucide-react"

type MerchantOption = {
  id: string
  name: string
  badge: string
  badgeBg: string
  status: "connected" | "ready"
  description: string
  detail: string
}

type MerchantCredentialField = {
  key: string
  label: string
  placeholder: string
  type: "text" | "password"
}

type MerchantOperationalMeta = {
  verificationLabel: string
  syncMode: string
  syncDetail: string
}

type MerchantGuide = {
  title: string
  steps: string[]
  ipLabel: string
}

type ProductOption = {
  id: string
  name: string
  category: string
  badge: string
  badgeBg: string
  merchantHint: string
}

type ProductMapping = {
  productId: string
  productName: string
  category: string
  merchantSku: string
}

type MerchantImportedListing = {
  id: string
  name: string
  sku: string
}

type LicenseOption = {
  id: string
  name: string
  icon: typeof Upload
  type: "manual" | "provider"
}

type ProviderOption = {
  id: string
  name: string
  badge: string
  badgeBg: string
}

type ChannelOption = {
  id: string
  name: string
  icon: typeof Mail
  color: string
}

const merchantOptions: MerchantOption[] = [
  {
    id: "naver",
    name: "Naver Store",
    badge: "N",
    badgeBg: "#03C75A",
    status: "connected",
    description: "Sync orders from your main Korean storefront.",
    detail: "Store Name + API Key + Secret Key",
  },
  {
    id: "g2g",
    name: "G2G",
    badge: "G2G",
    badgeBg: "#E87A2A",
    status: "connected",
    description: "Pull global marketplace orders into Mont automatically.",
    detail: "Seller Name + API Key",
  },
  {
    id: "website",
    name: "Mont Website",
    badge: "M",
    badgeBg: "#918DF6",
    status: "ready",
    description: "Launch a storefront hosted by Mont with direct checkout.",
    detail: "Site URL + Webhook URL + Webhook Secret",
  },
  {
    id: "g2a",
    name: "G2A",
    badge: "G2A",
    badgeBg: "#F05A23",
    status: "ready",
    description: "Connect your G2A seller account when you are ready.",
    detail: "Seller ID + API Key + API Secret",
  },
]

const merchantCredentialFields: Record<string, MerchantCredentialField[]> = {
  naver: [
    { key: "storeName", label: "Store Name", placeholder: "Your Naver store name", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "Naver Commerce API key", type: "password" },
    { key: "secretKey", label: "Secret Key", placeholder: "Naver Commerce secret key", type: "password" },
  ],
  g2g: [
    { key: "sellerName", label: "Seller Name", placeholder: "Your G2G seller name", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "G2G API key", type: "password" },
  ],
  g2a: [
    { key: "sellerId", label: "Seller ID", placeholder: "Your G2A seller ID", type: "text" },
    { key: "apiKey", label: "API Key", placeholder: "G2A API key", type: "password" },
    { key: "apiSecret", label: "API Secret", placeholder: "G2A API secret", type: "password" },
  ],
  website: [
    { key: "siteUrl", label: "Site URL", placeholder: "https://your-site.com", type: "text" },
    { key: "webhookUrl", label: "Webhook URL", placeholder: "https://your-site.com/api/webhook", type: "text" },
    { key: "webhookSecret", label: "Webhook Secret", placeholder: "Your webhook signing secret", type: "password" },
  ],
}

const merchantOperationalMeta: Record<string, MerchantOperationalMeta> = {
  naver: {
    verificationLabel: "Commerce API verified",
    syncMode: "Webhook + real-time sync",
    syncDetail: "Paid orders are pushed into Mont the moment checkout completes.",
  },
  g2g: {
    verificationLabel: "Seller API verified",
    syncMode: "Marketplace polling",
    syncDetail: "Mont checks for new paid orders on a recurring seller sync interval.",
  },
  g2a: {
    verificationLabel: "Seller credentials verified",
    syncMode: "Marketplace polling",
    syncDetail: "Mont periodically ingests new paid orders from the G2A seller feed.",
  },
  website: {
    verificationLabel: "Webhook secret verified",
    syncMode: "Webhook ingestion",
    syncDetail: "Your storefront posts checkout events straight into the Mont workflow.",
  },
}

const merchantGuides: Record<string, MerchantGuide> = {
  naver: {
    title: "Naver registration guide",
    steps: [
      "Open Naver Commerce API settings and create a production app.",
      "Copy the Store Name, API Key, and Secret Key into Mont.",
      "Confirm order access is enabled before testing the connection.",
    ],
    ipLabel: "Add 1.1.1.1 to the Naver Commerce API allowlist before testing.",
  },
  g2g: {
    title: "G2G registration guide",
    steps: [
      "Open your G2G seller integration settings and generate an API key.",
      "Enter the seller name exactly as it appears in G2G.",
      "Make sure the key has order read access enabled.",
    ],
    ipLabel: "Add 1.1.1.1 to the G2G API allowlist before testing.",
  },
  g2a: {
    title: "G2A registration guide",
    steps: [
      "Create or open your G2A seller API application.",
      "Copy the Seller ID, API Key, and API Secret into Mont.",
      "Enable production order access for the credential pair you created.",
    ],
    ipLabel: "Add 1.1.1.1 to the G2A seller API allowlist before testing.",
  },
  website: {
    title: "Website registration guide",
    steps: [
      "Set up your storefront webhook endpoint and delivery callback URL.",
      "Generate a webhook signing secret and save it inside Mont.",
      "Point your checkout completion webhook to the Mont-compatible payload flow.",
    ],
    ipLabel: "Allow requests from 1.1.1.1 on your webhook or firewall rules before testing.",
  },
}

const productOptions: ProductOption[] = [
  {
    id: "steam-wallet-50",
    name: "Steam Wallet 50 USD",
    category: "Gift Card",
    badge: "SW",
    badgeBg: "#1B2838",
    merchantHint: "Match to the listing or merchant SKU that sells this exact denomination.",
  },
  {
    id: "chatgpt-plus-1m",
    name: "ChatGPT Plus 1M",
    category: "Subscription",
    badge: "AI",
    badgeBg: "#10A37F",
    merchantHint: "Use the merchant product ID that should trigger this subscription delivery.",
  },
  {
    id: "jetbrains-1y",
    name: "JetBrains All Products 1Y",
    category: "Software License",
    badge: "JB",
    badgeBg: "#000000",
    merchantHint: "Bind the marketplace listing or storefront SKU to this 1-year license product.",
  },
  {
    id: "adobe-cc-1m",
    name: "Adobe CC 1M",
    category: "Subscription",
    badge: "CC",
    badgeBg: "#FA0F00",
    merchantHint: "Map the storefront product handle or external SKU used for this plan.",
  },
]

const merchantImportedProductIds: Record<string, MerchantImportedListing[]> = {
  naver: [
    { id: "naver-steam-50", name: "Steam Wallet 50 USD", sku: "NAVER-PROD-12345" },
    { id: "naver-chatgpt-1m", name: "ChatGPT Plus 1M", sku: "NAVER-SKU-PLUS-1M" },
    { id: "naver-jb-1y", name: "JetBrains All Products 1Y", sku: "NAVER-JB-1Y-009" },
  ],
  g2g: [
    { id: "g2g-steam-50", name: "Steam Wallet 50 USD", sku: "G2G-SKU-5081" },
    { id: "g2g-chatgpt-1m", name: "ChatGPT Plus 1M", sku: "G2G-CHATGPT-1M" },
    { id: "g2g-adobe-cc", name: "Adobe CC 1M", sku: "G2G-ADOBE-CC-1M" },
  ],
  g2a: [
    { id: "g2a-steam-50", name: "Steam Wallet 50 USD", sku: "G2A-PROD-2047" },
    { id: "g2a-jb-1y", name: "JetBrains All Products 1Y", sku: "G2A-JB-1Y-332" },
    { id: "g2a-adobe-cc", name: "Adobe CC 1M", sku: "G2A-SUB-CC1M" },
  ],
  website: [
    { id: "direct-steam-50", name: "Steam Wallet 50 USD", sku: "direct-steam-50" },
    { id: "direct-chatgpt-1m", name: "ChatGPT Plus 1M", sku: "direct-chatgpt-plus" },
    { id: "direct-jetbrains-1y", name: "JetBrains All Products 1Y", sku: "direct-jetbrains-1y" },
  ],
}

const productTypeOptions = ["Gift Card", "Subscription", "Software License", "Game Key"] as const

function inferProductType(name: string) {
  const normalized = name.trim().toLowerCase()

  if (!normalized) return "Software License"
  if (normalized.includes("wallet") || normalized.includes("gift") || normalized.includes("card")) return "Gift Card"
  if (normalized.includes("plus") || normalized.includes("subscription") || normalized.includes("month") || normalized.includes("1m") || normalized.includes("monthly")) return "Subscription"
  if (normalized.includes("key") || normalized.includes("steam") || normalized.includes("code")) return "Game Key"
  return "Software License"
}

const licenseOptions: LicenseOption[] = [
  { id: "manual", name: "Manual upload", icon: Upload, type: "manual" },
  { id: "provider", name: "Connect provider", icon: Unplug, type: "provider" },
]

const providerOptions: ProviderOption[] = [
  { id: "kinguin", name: "Kinguin API", badge: "K", badgeBg: "#1A73E8" },
  { id: "g2a-provider", name: "G2A Marketplace", badge: "G2A", badgeBg: "#F05A23" },
  { id: "manual-api", name: "Manual API", badge: "API", badgeBg: "#918DF6" },
]

const channelOptions: ChannelOption[] = [
  { id: "email", name: "Email", icon: Mail, color: "#2C78FC" },
  { id: "telegram", name: "Telegram", icon: Send, color: "#2AABEE" },
  { id: "whatsapp", name: "WhatsApp", icon: MessageSquare, color: "#25D366" },
  { id: "sms", name: "SMS", icon: Smartphone, color: "#33C758" },
]

type ActivePanel = "merchant" | "product" | "license" | "channel" | null

function StatusPill({ status }: { status: MerchantOption["status"] }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#34A853]/10 px-2 py-0.5 text-[10px] font-semibold tracking-[-0.32px] text-[#34A853]">
        Connected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[rgba(0,0,0,0.05)] px-2 py-0.5 text-[10px] font-semibold tracking-[-0.32px] text-[#666666]">
      Ready
    </span>
  )
}

function FlowNode({
  label,
  filled,
  badge,
  badgeBg,
  name,
  subtitle,
  statusLine,
  active,
  extra,
  onClick,
}: {
  label: string
  filled: boolean
  badge?: string
  badgeBg?: string
  name?: string
  subtitle?: string
  statusLine?: string
  active?: boolean
  extra?: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex min-h-[186px] w-[224px] flex-col rounded-[24px] border-2 p-4 text-left transition-all ${
        filled
          ? "border-[#34A853]/36 bg-[linear-gradient(180deg,#FBFDFC_0%,#F4FBF6_100%)] shadow-[0_10px_28px_rgba(52,168,83,0.08)]"
          : "border-dashed border-[rgba(0,0,0,0.14)] bg-white hover:border-[#918DF6]/50 hover:shadow-[0_8px_24px_rgba(145,141,246,0.10)]"
      } ${active ? "ring-2 ring-[#918DF6]/30 ring-offset-4 ring-offset-white" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">{label}</p>
        {filled ? <CheckCircle2 className="size-5 shrink-0 text-[#34A853]" strokeWidth={2.2} /> : null}
      </div>
      {filled ? (
        <div className="mt-3 flex flex-1 flex-col">
          {badge && (
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-[18px] text-[18px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
              style={{ backgroundColor: badgeBg }}
            >
              {badge}
            </span>
          )}
          {!badge ? extra : null}
          <div className="mt-4 min-w-0 space-y-1">
            <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{name}</p>
            {subtitle ? <p className="text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">{subtitle}</p> : null}
          </div>
          {statusLine ? (
            <div className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-[#34A853]/10 px-2.5 py-1 text-[10px] font-semibold tracking-[-0.32px] text-[#2E7D32]">
              <ShieldCheck className="size-3" strokeWidth={2.2} />
              {statusLine}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CirclePlus className="size-8 text-[#918DF6]/60 transition-colors group-hover:text-[#918DF6]" strokeWidth={1.5} />
          </motion.div>
          <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999] transition-colors group-hover:text-[#918DF6]">
            Click to add
          </p>
        </div>
      )}
    </button>
  )
}

function Connector({
  active,
  title,
  detail,
}: {
  active: boolean
  title: string
  detail: string
}) {
  return (
    <div className="mx-2 flex w-[188px] flex-col items-center gap-2">
      <div
        className={`w-full rounded-2xl border px-3.5 py-3 text-left shadow-sm transition-colors ${
          active
            ? "border-[#34A853]/18 bg-white shadow-[0_10px_24px_rgba(52,168,83,0.08)]"
            : "border-[rgba(0,0,0,0.08)] bg-white"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[-0.32px] ${
              active ? "bg-[#34A853]/10 text-[#2E7D32]" : "bg-[rgba(0,0,0,0.04)] text-[#999999]"
            }`}
          >
            {title}
          </div>
          <div className={`h-px flex-1 ${active ? "bg-[#34A853]/25" : "bg-[rgba(0,0,0,0.08)]"}`} />
        </div>

        <div className="mt-3 relative flex items-center">
          <div className={`h-2 w-2 rounded-full ${active ? "bg-[#34A853]" : "bg-[#D1D5DB]"}`} />
          <div className="relative flex-1 px-2">
            <div
              className={`h-[2px] w-full rounded-full ${
                active ? "bg-[linear-gradient(90deg,rgba(52,168,83,0.32)_0%,#34A853_55%,rgba(52,168,83,0.32)_100%)]" : "bg-[rgba(0,0,0,0.10)]"
              }`}
            />
            {active ? (
              <motion.div
                className="absolute top-1/2 left-2 size-2 -translate-y-1/2 rounded-full bg-[#34A853] shadow-[0_0_0_4px_rgba(52,168,83,0.12)]"
                animate={{ x: [0, 132, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </div>
          <div
            className={`flex size-6 items-center justify-center rounded-full border ${
              active ? "border-[#34A853]/20 bg-[#34A853]/10 text-[#34A853]" : "border-[rgba(0,0,0,0.08)] bg-white text-[#D1D5DB]"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6.5 3.5L9 6L6.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed tracking-[-0.32px] text-[#666666]">
          {detail}
        </p>
      </div>
    </div>
  )
}

export default function QuickSetup() {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [merchantDraftId, setMerchantDraftId] = useState<string>(merchantOptions[0]?.id ?? "naver")
  const [merchantDraftValues, setMerchantDraftValues] = useState<Record<string, string>>({})
  const [merchantConnectionValues, setMerchantConnectionValues] = useState<Record<string, string>>({})
  const [visibleMerchantSecrets, setVisibleMerchantSecrets] = useState<Record<string, boolean>>({})
  const [merchantTestState, setMerchantTestState] = useState<"idle" | "testing" | "success">("idle")

  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [productMappings, setProductMappings] = useState<ProductMapping[]>([])
  const [productMerchantSku, setProductMerchantSku] = useState("")
  const [selectedImportedListingIds, setSelectedImportedListingIds] = useState<Set<string>>(new Set())
  const [productNameDraft, setProductNameDraft] = useState("")
  const [productCategoryDraft, setProductCategoryDraft] = useState("Software License")
  const [productSkuMode, setProductSkuMode] = useState<"manual" | "import">("manual")
  const [mappingModalOpen, setMappingModalOpen] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set())

  const merchantData = useMemo(
    () => merchantOptions.find((m) => m.id === selectedMerchant) ?? null,
    [selectedMerchant],
  )
  const merchantOps = useMemo(() => {
    if (!selectedMerchant) return null
    return merchantOperationalMeta[selectedMerchant] ?? null
  }, [selectedMerchant])
  const merchantDraftData = useMemo(
    () => merchantOptions.find((m) => m.id === merchantDraftId) ?? merchantOptions[0] ?? null,
    [merchantDraftId],
  )
  const licenseData = useMemo(
    () => licenseOptions.find((l) => l.id === selectedLicense) ?? null,
    [selectedLicense],
  )
  const productData = useMemo(
    () => productOptions.find((product) => product.id === selectedProductId) ?? null,
    [selectedProductId],
  )

  const allConfigured = !!selectedMerchant && productMappings.length > 0 && !!selectedLicense && selectedChannels.size > 0

  const filteredMerchants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return merchantOptions
    return merchantOptions.filter((m) =>
      [m.name, m.detail, m.description].some((v) => v.toLowerCase().includes(q)),
    )
  }, [searchQuery])

  const filteredProviders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return providerOptions
    return providerOptions.filter((p) => p.name.toLowerCase().includes(q))
  }, [searchQuery])


  const importedMerchantProductIds = useMemo(() => {
    if (!selectedMerchant) return []
    return merchantImportedProductIds[selectedMerchant] ?? []
  }, [selectedMerchant])

  const toggleImportedListing = (listingId: string) => {
    setSelectedImportedListingIds((current) => {
      const next = new Set(current)
      if (next.has(listingId)) next.delete(listingId)
      else next.add(listingId)
      return next
    })
  }

  const toggleChannel = (id: string) => {
    setSelectedChannels((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const openPanel = (panel: ActivePanel) => {
    setSearchQuery("")
    if (panel === "merchant" && selectedMerchant) {
      setMerchantDraftId(selectedMerchant)
      setMerchantDraftValues(merchantConnectionValues)
      setMerchantTestState("success")
    } else if (panel === "merchant") {
      setMerchantTestState("idle")
    }
    setActivePanel(panel)
  }

  const closePanel = () => {
    setActivePanel(null)
    setSearchQuery("")
  }

  const handleLaunch = () => {
    navigate("/dashboard")
  }

  const openMappingModal = () => {
    setSelectedProductId(null)
    setProductNameDraft("")
    setProductCategoryDraft("Software License")
    setProductMerchantSku("")
    setSelectedImportedListingIds(new Set())
    setProductSkuMode("manual")
    setSearchQuery("")
    setMappingModalOpen(true)
  }

  const closeMappingModal = () => {
    setMappingModalOpen(false)
  }

  const connectProduct = () => {
    if (!selectedProductId) return

    const inferredName = productData?.name ?? productNameDraft.trim()
    const inferredCategory = productData?.category ?? inferProductType(productNameDraft)

    if (!inferredName) return

    const selectedImportedListings = importedMerchantProductIds.filter((listing) => selectedImportedListingIds.has(listing.id))

    const merchantSkus =
      productSkuMode === "import"
        ? selectedImportedListings.map((listing) => listing.sku)
        : productMerchantSku.trim().length > 0
          ? [productMerchantSku.trim()]
          : []

    if (merchantSkus.length === 0) return

    setProductMappings((current) => {
      const next = current.filter((mapping) => !merchantSkus.includes(mapping.merchantSku))
      return [
        ...next,
        ...merchantSkus.map((merchantSku) => ({
          productId: selectedProductId,
          productName: inferredName,
          category: inferredCategory,
          merchantSku,
        })),
      ]
    })

    setProductMerchantSku("")
    setSelectedImportedListingIds(new Set())
    closeMappingModal()
  }

  const createInlineProduct = () => {
    if (productNameDraft.trim().length === 0) return

    const slug = productNameDraft
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    setSelectedProductId(slug || "custom-product")
    setProductCategoryDraft(inferProductType(productNameDraft))
  }

  const updateMerchantDraftValue = (key: string, value: string) => {
    setMerchantTestState("idle")
    setMerchantDraftValues((current) => ({ ...current, [key]: value }))
  }

  const merchantDraftFields = useMemo(() => {
    return merchantCredentialFields[merchantDraftId] ?? []
  }, [merchantDraftId])

  const merchantGuide = useMemo(() => {
    return merchantGuides[merchantDraftId] ?? null
  }, [merchantDraftId])

  const merchantFormReady = useMemo(() => {
    return merchantDraftFields.every((field) => (merchantDraftValues[field.key] ?? "").trim().length > 0)
  }, [merchantDraftFields, merchantDraftValues])

  const merchantPrimaryIdentity = useMemo(() => {
    if (!merchantData) return undefined

    if (merchantData.id === "naver") return merchantConnectionValues.storeName
    if (merchantData.id === "g2g") return merchantConnectionValues.sellerName
    if (merchantData.id === "g2a") return merchantConnectionValues.sellerId
    if (merchantData.id === "website") return merchantConnectionValues.siteUrl
    return undefined
  }, [merchantData, merchantConnectionValues])

  const connectMerchant = () => {
    if (!merchantDraftData || !merchantFormReady || merchantTestState !== "success") return
    setSelectedMerchant(merchantDraftData.id)
    setMerchantConnectionValues(merchantDraftValues)
    closePanel()
  }

  const testMerchantConnection = () => {
    if (!merchantFormReady) return
    setMerchantTestState("testing")
    window.setTimeout(() => {
      setMerchantTestState("success")
    }, 900)
  }

  const licenseNodeName = useMemo(() => {
    if (!licenseData) return undefined
    if (licenseData.type === "provider" && selectedProvider) {
      const prov = providerOptions.find((p) => p.id === selectedProvider)
      return prov?.name ?? licenseData.name
    }
    return licenseData.name
  }, [licenseData, selectedProvider])

  const licenseNodeBadge = useMemo(() => {
    if (!licenseData) return undefined
    if (licenseData.type === "provider" && selectedProvider) {
      const prov = providerOptions.find((p) => p.id === selectedProvider)
      return prov?.badge
    }
    return undefined
  }, [licenseData, selectedProvider])

  const licenseNodeBadgeBg = useMemo(() => {
    if (!licenseData) return undefined
    if (licenseData.type === "provider" && selectedProvider) {
      const prov = providerOptions.find((p) => p.id === selectedProvider)
      return prov?.badgeBg
    }
    return "#918DF6"
  }, [licenseData, selectedProvider])

  const productNodeExtra = useMemo(() => {
    if (!productData) return undefined
    return (
      <span
        className="flex size-14 items-center justify-center rounded-[18px] text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
        style={{ backgroundColor: productData.badgeBg }}
      >
        {productData.badge}
      </span>
    )
  }, [productData])

  const channelNodeExtra = useMemo(() => {
    if (selectedChannels.size === 0) return undefined
    const channels = channelOptions.filter((c) => selectedChannels.has(c.id))
    return (
      <div className="flex -space-x-1">
        {channels.slice(0, 4).map((ch) => {
          const Icon = ch.icon
          return (
            <span
              key={ch.id}
              className="flex size-7 items-center justify-center rounded-full border-2 border-white"
              style={{ backgroundColor: `${ch.color}20`, color: ch.color }}
            >
              <Icon className="size-3.5" strokeWidth={2} />
            </span>
          )
        })}
      </div>
    )
  }, [selectedChannels])

  const merchantSubtitle = merchantData
    ? merchantPrimaryIdentity
      ? `${merchantPrimaryIdentity}`
      : merchantData.detail
    : undefined

  const merchantStatusLine = merchantOps?.verificationLabel

  const productSubtitle = productMappings.length > 0
    ? `${productMappings.length} mapping${productMappings.length > 1 ? "s" : ""} ready`
    : productData
      ? `${productData.category} · ${productMerchantSku || "Merchant SKU pending"}`
      : undefined

  const licenseSubtitle = useMemo(() => {
    if (!licenseData) return undefined
    if (licenseData.type === "provider") {
      return selectedProvider && productData
        ? `${productData.name} will pull supplier stock automatically`
        : "Pick a provider to attach live inventory"
    }
    return productData ? `${productData.name} will use your uploaded keys, links, or files` : "Use your own uploaded keys, files, or links"
  }, [licenseData, selectedProvider, productData])

  const channelSubtitle = useMemo(() => {
    if (selectedChannels.size === 0) return undefined
    const names = channelOptions
      .filter((channel) => selectedChannels.has(channel.id))
      .map((channel) => channel.name)

    if (names.length === 1) return `Deliver through ${names[0]}`
    if (names.length === 2) return `Deliver through ${names[0]} and ${names[1]}`
    return `Deliver through ${names[0]} +${names.length - 1} more`
  }, [selectedChannels])

  const merchantToProduct = useMemo(() => {
    if (!merchantData) {
      return {
        title: "Waiting for source",
        detail: "Choose the storefront that should send orders into this flow and enter its access credentials.",
      }
    }

    if (!productData) {
      return {
        title: "Connection ready",
        detail: `${merchantData.name} credentials are saved and ${merchantOps?.syncMode.toLowerCase() ?? "order sync"} is ready. Create the product mapping that incoming orders should match against.`,
      }
    }

    return {
      title: "Product matched",
      detail: `${merchantData.name} orders will first resolve into ${productData.name} using merchant SKU ${productMerchantSku}.`,
    }
  }, [merchantData, merchantOps, productData, productMerchantSku])

  const productToLicense = useMemo(() => {
    if (!productData) {
      return {
        title: "Waiting for product",
        detail: "Create or pick the product that this merchant listing should map into before choosing inventory.",
      }
    }

    if (!licenseData) {
      return {
        title: "Ready for inventory",
        detail: `${productData.name} is mapped. Now decide where its license stock should come from.`,
      }
    }

    return {
      title: "Inventory linked",
      detail:
        licenseData.type === "provider"
          ? `${productData.name} will request stock from ${licenseNodeName ?? "your provider"} when mapped orders arrive.`
          : `${productData.name} will consume manual inventory stored inside Mont when mapped orders arrive.`,
    }
  }, [productData, licenseData, licenseNodeName])

  const licenseToChannel = useMemo(() => {
    if (!licenseData) {
      return {
        title: "Waiting for inventory",
        detail: "Attach a license source after product mapping, before choosing how the customer receives delivery.",
      }
    }

    if (selectedChannels.size === 0) {
      return {
        title: "Inventory resolved",
        detail: "The fulfillment source is ready. Pick which channels should send the result out.",
      }
    }

    const channelNames = channelOptions
      .filter((channel) => selectedChannels.has(channel.id))
      .map((channel) => channel.name)
      .join(", ")

    return {
      title: "Delivery linked",
      detail: `Resolved licenses will be pushed through ${channelNames}.`,
    }
  }, [licenseData, selectedChannels])

  const executionPreview = useMemo(() => {
    return [
      {
        label: "Trigger",
        value: merchantData
          ? `${merchantData.name} is authenticated. ${merchantOps?.syncDetail ?? "Paid orders can now enter Mont."}`
          : "Waiting for merchant connection",
      },
      {
        label: "Product",
        value: productData
          ? `${productData.name} is mapped to merchant SKU ${productMerchantSku}`
          : "Create the product and assign the merchant listing first",
      },
      {
        label: "Verify",
        value: merchantData
          ? `${merchantOps?.verificationLabel ?? "Credentials verified"} · ${merchantOps?.syncMode ?? "Order sync ready"}`
          : "Waiting for credential verification",
      },
      {
        label: "Resolve",
        value: licenseData
          ? licenseData.type === "provider"
            ? `${licenseNodeName ?? "Provider"} returns a deliverable key`
            : "Mont reserves one item from manual inventory"
          : "Waiting for license source",
      },
      {
        label: "Deliver",
        value: selectedChannels.size > 0 ? channelSubtitle ?? "Channels selected" : "Waiting for channels",
      },
    ]
  }, [merchantData, merchantOps, productData, productMerchantSku, licenseData, licenseNodeName, selectedChannels, channelSubtitle])

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.08)] px-6 py-4 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">Mont</span>
        </div>
        <Link
          to="/dashboard"
          className="text-[13px] font-medium tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
        >
          Skip for now
        </Link>
      </header>

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center px-6 pt-10 pb-12">
          <div className="text-center">
            <p className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">Quick Setup</p>
            <h1 className="mt-1 text-[28px] font-bold tracking-[-0.5px] text-[#181925]">
              Build your fulfillment flow
            </h1>
            <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed tracking-[-0.32px] text-[#666666]">
              Connect a merchant, decide how licenses are supplied, and choose delivery channels — wire your automation in one pass.
            </p>
          </div>

          <div className="mt-14 flex items-center justify-center gap-3 xl:gap-4">
            <FlowNode
              label="Merchant"
              filled={!!merchantData}
              badge={merchantData?.badge}
              badgeBg={merchantData?.badgeBg}
              name={merchantData?.name}
              subtitle={merchantSubtitle}
              statusLine={merchantStatusLine}
              active={activePanel === "merchant"}
              onClick={() => openPanel("merchant")}
            />
            <Connector
              active={!!merchantData && !!selectedProductId}
              title={merchantToProduct.title}
              detail={merchantToProduct.detail}
            />
            <FlowNode
              label="Product"
              filled={!!productData}
              name={productData?.name}
              subtitle={productSubtitle}
              active={activePanel === "product"}
              extra={productNodeExtra}
              onClick={() => openPanel("product")}
            />
            <Connector
              active={!!productData && !!selectedLicense}
              title={productToLicense.title}
              detail={productToLicense.detail}
            />
            <FlowNode
              label="License"
              filled={!!selectedLicense}
              badge={licenseNodeBadge}
              badgeBg={licenseNodeBadgeBg}
              name={licenseNodeName}
              subtitle={licenseSubtitle}
              active={activePanel === "license"}
              extra={
                licenseData && !licenseNodeBadge ? (
                  <span className="flex size-14 items-center justify-center rounded-[18px] bg-[#918DF6]/10 text-[#918DF6]">
                    <licenseData.icon className="size-6" strokeWidth={1.9} />
                  </span>
                ) : undefined
              }
              onClick={() => openPanel("license")}
            />
            <Connector
              active={!!selectedLicense && selectedChannels.size > 0}
              title={licenseToChannel.title}
              detail={licenseToChannel.detail}
            />
            <FlowNode
              label="Channel"
              filled={selectedChannels.size > 0}
              name={selectedChannels.size > 0 ? `${selectedChannels.size} channel${selectedChannels.size > 1 ? "s" : ""}` : undefined}
              subtitle={channelSubtitle}
              active={activePanel === "channel"}
              extra={channelNodeExtra}
              onClick={() => openPanel("channel")}
            />
          </div>

          <div className="mt-10 grid w-full max-w-6xl gap-4 lg:grid-cols-5">
            {executionPreview.map((step) => (
              <div
                key={step.label}
                className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)] px-5 py-4 text-left"
              >
                <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">{step.label}</p>
                <p className="mt-2 text-[14px] leading-relaxed font-medium tracking-[-0.32px] text-[#181925]">{step.value}</p>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {allConfigured && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="mt-12"
              >
                <p className="mb-4 text-center text-[13px] tracking-[-0.32px] text-[#666666]">
                  {merchantData?.name} → {productData?.name} → {licenseNodeName} → {channelOptions
                    .filter((channel) => selectedChannels.has(channel.id))
                    .map((channel) => channel.name)
                    .join(", ")}
                </p>
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="inline-flex h-12 items-center gap-2.5 rounded-full bg-[#918DF6] px-7 text-[15px] font-semibold tracking-[-0.32px] text-white shadow-[0_12px_32px_rgba(145,141,246,0.28)] transition-all hover:bg-[#7D79E8] hover:shadow-[0_16px_40px_rgba(145,141,246,0.36)]"
                >
                  <Rocket className="size-4.5" strokeWidth={2} />
                  Launch workspace
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Dialog open={activePanel !== null} onOpenChange={(open) => !open && closePanel()}>
          <DialogContent className="sm:max-w-[720px] max-h-[82vh] overflow-y-auto rounded-[24px] border border-[rgba(0,0,0,0.08)] bg-white p-0 shadow-[0_20px_64px_rgba(24,25,37,0.12)]">
            <DialogHeader className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4 text-left">
              <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                {activePanel === "merchant" && "Connect merchant"}
                {activePanel === "product" && "Product mappings"}
                {activePanel === "license" && "Configure license source"}
                {activePanel === "channel" && "Choose delivery channels"}
              </DialogTitle>
              <DialogDescription className="mt-1 text-[13px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                {activePanel === "merchant" &&
                  "Choose the storefront platform and enter the credentials Mont should use to pull new orders."}
                {activePanel === "product" &&
                  "Manage your product-to-merchant SKU mappings. Add new mappings or remove existing ones."}
                {activePanel === "license" &&
                  "Choose where this mapped product should pull its deliverable inventory from."}
                {activePanel === "channel" &&
                  "Pick one or more customer delivery channels for the final fulfillment handoff."}
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-4">
              {activePanel !== "channel" && activePanel !== "product" && (
                <div className="mb-4 flex h-10 items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.10)] bg-white px-3">
                  <Search className="size-4 shrink-0 text-[#999999]" strokeWidth={2} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      activePanel === "merchant"
                        ? "Search merchants…"
                        : "Search providers…"
                    }
                    className="w-full bg-transparent text-[13px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                  />
                </div>
              )}

              {activePanel === "merchant" && (
                <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
                  <div className="flex flex-col gap-2">
                    {filteredMerchants.map((merchant) => {
                      const selected = merchantDraftId === merchant.id
                      return (
                        <button
                          key={merchant.id}
                          type="button"
                          onClick={() => {
                            setMerchantDraftId(merchant.id)
                            setMerchantDraftValues({})
                            setMerchantTestState("idle")
                          }}
                          className={`rounded-xl border px-3.5 py-3 text-left transition-all ${
                            selected
                              ? "border-[#918DF6] bg-[#918DF6]/[0.05]"
                              : "border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.14)] hover:bg-[rgba(0,0,0,0.015)]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                              <span
                                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                                style={{ backgroundColor: merchant.badgeBg }}
                              >
                                {merchant.badge}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{merchant.name}</p>
                                  <StatusPill status={merchant.status} />
                                </div>
                                <p className="mt-0.5 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">{merchant.description}</p>
                                <p className="mt-1 text-[10px] tracking-[-0.32px] text-[#999999]">{merchant.detail}</p>
                              </div>
                              {selected ? <Check className="size-4 shrink-0 text-[#34A853]" strokeWidth={2.5} /> : null}
                            </div>
                        </button>
                      )
                    })}
                  </div>

                  {merchantDraftData ? (
                    <div className="rounded-2xl border border-[rgba(145,141,246,0.16)] bg-[#918DF6]/[0.04] p-3.5">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold text-white"
                          style={{ backgroundColor: merchantDraftData.badgeBg }}
                        >
                          {merchantDraftData.badge}
                        </span>
                        <div>
                          <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">Connect {merchantDraftData.name}</p>
                          <p className="mt-0.5 text-[12px] tracking-[-0.32px] text-[#666666]">Enter the credentials Mont should use during onboarding.</p>
                        </div>
                      </div>

                      <div className="mt-3.5 grid gap-2.5">
                        {merchantDraftFields.map((field) => {
                          const isPassword = field.type === "password"
                          const visible = visibleMerchantSecrets[field.key] ?? false
                          return (
                            <label key={field.key} className="block">
                              <span className="mb-1 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                                {field.label}
                              </span>
                              <div className="relative">
                                <input
                                  type={isPassword && !visible ? "password" : "text"}
                                  value={merchantDraftValues[field.key] ?? ""}
                                  onChange={(event) => updateMerchantDraftValue(field.key, event.target.value)}
                                  placeholder={field.placeholder}
                                  className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.10)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none transition-colors placeholder:text-[#999999] focus:border-[#918DF6]"
                                />
                                {isPassword ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setVisibleMerchantSecrets((current) => ({
                                        ...current,
                                        [field.key]: !visible,
                                      }))
                                    }
                                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#181925]"
                                  >
                                    {visible ? <EyeOff className="size-4" strokeWidth={2} /> : <Eye className="size-4" strokeWidth={2} />}
                                  </button>
                                ) : null}
                              </div>
                            </label>
                          )
                        })}
                      </div>

                      {merchantGuide ? (
                        <div className="mt-3.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2.5">
                          <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#181925]">{merchantGuide.title}</p>
                          <ol className="mt-2 space-y-1.5 pl-4 text-[11px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                            {merchantGuide.steps.map((step) => (
                              <li key={step} className="list-decimal">
                                {step}
                              </li>
                            ))}
                          </ol>
                          <div className="mt-2 rounded-lg bg-[#FFF7E8] px-2.5 py-2 text-[11px] font-medium tracking-[-0.32px] text-[#A15C00]">
                            {merchantGuide.ipLabel}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-3.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2.5">
                        <div className="flex items-center gap-2 text-[#34A853]">
                          <ShieldCheck className="size-4" strokeWidth={2.1} />
                          <p className="text-[12px] font-semibold tracking-[-0.32px]">
                            {merchantOperationalMeta[merchantDraftData.id]?.verificationLabel}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[#666666]">
                          <Clock3 className="size-3.5" strokeWidth={2} />
                          <p className="text-[12px] tracking-[-0.32px]">
                            {merchantOperationalMeta[merchantDraftData.id]?.syncMode}
                          </p>
                        </div>
                        <p className="mt-1.5 text-[11px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                          {merchantOperationalMeta[merchantDraftData.id]?.syncDetail}
                        </p>
                        {merchantTestState === "success" ? (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#34A853]/10 px-2 py-1 text-[10px] font-semibold tracking-[-0.32px] text-[#2E7D32]">
                            <CheckCircle2 className="size-3.5" strokeWidth={2.2} />
                            API test passed · ready to connect
                          </div>
                        ) : null}
                      </div>

                      <div className="mt-3.5 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={closePanel}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] px-3.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)] hover:text-[#181925]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={testMerchantConnection}
                          disabled={!merchantFormReady || merchantTestState === "testing"}
                          className="inline-flex h-9 min-w-[108px] shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-[#918DF6]/20 bg-[#918DF6]/10 px-3 text-[13px] font-semibold tracking-[-0.32px] text-[#918DF6] transition-colors hover:bg-[#918DF6]/15 disabled:opacity-40"
                        >
                          {merchantTestState === "testing" ? "Testing API..." : merchantTestState === "success" ? "API tested" : "Test API"}
                        </button>
                        <button
                          type="button"
                          onClick={connectMerchant}
                          disabled={!merchantFormReady || merchantTestState !== "success"}
                          className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-[#918DF6] px-3.5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8] disabled:opacity-40"
                        >
                          Connect {merchantDraftData.name}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {activePanel === "product" && (
                <div className="space-y-4">
                  {productMappings.length > 0 ? (
                    <div className="rounded-xl border border-[#34A853]/16 bg-[#34A853]/[0.03] px-3.5 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-[#34A853]" strokeWidth={2.2} />
                          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">Product mappings</p>
                        </div>
                        <span className="rounded-full bg-[#34A853]/10 px-2 py-0.5 text-[10px] font-semibold tracking-[-0.32px] text-[#2E7D32]">{productMappings.length}</span>
                      </div>
                      <div className="mt-2.5 space-y-1.5">
                        {productMappings.map((mapping, index) => (
                          <div key={`${mapping.productId}-${mapping.merchantSku}`} className="flex items-center gap-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] bg-white px-2.5 py-2">
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#181925] text-[9px] font-bold text-white">
                              {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[12px] font-semibold tracking-[-0.32px] text-[#181925]">{mapping.productName}</p>
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="shrink-0 rounded-full bg-[rgba(0,0,0,0.04)] px-2 py-0.5 text-[10px] font-medium tracking-[-0.32px] text-[#666666]">{mapping.category}</span>
                                <span className="text-[10px] tracking-[-0.32px] text-[#999999]">→</span>
                                <span className="truncate text-[10px] font-medium tracking-[-0.32px] text-[#666666]">{mapping.merchantSku}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setProductMappings((current) => current.filter((m) => m.merchantSku !== mapping.merchantSku))}
                              className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[#999999] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#D93025]"
                              title="Remove mapping"
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[rgba(145,141,246,0.28)] bg-[#918DF6]/[0.04] px-5 py-6 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#918DF6]/10 text-[#918DF6]">
                        <Package className="size-5" strokeWidth={1.9} />
                      </div>
                      <p className="mt-3 text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">No mappings yet</p>
                      <p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                        Create your first product mapping to bind a merchant listing or external SKU to a Mont product.
                      </p>
                    </div>
                  )}

                  <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3.5 py-3">
                    <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#181925]">Why this comes before license source</p>
                    <p className="mt-1 text-[11px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                      Mont must know which product an incoming merchant order resolves into before it can decide whether to use manual inventory or provider stock.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-[rgba(0,0,0,0.06)] pt-3">
                    <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                      {productMappings.length > 0 ? `${productMappings.length} mapping${productMappings.length > 1 ? "s" : ""} ready` : "Add at least one mapping to continue"}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={openMappingModal}
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#918DF6]/20 bg-[#918DF6]/10 px-3 text-[13px] font-semibold tracking-[-0.32px] text-[#918DF6] transition-colors hover:bg-[#918DF6]/15"
                      >
                        <CirclePlus className="size-3.5" strokeWidth={2.2} />
                        New mapping
                      </button>
                      <button
                        type="button"
                        onClick={closePanel}
                        disabled={productMappings.length === 0}
                        className="inline-flex h-9 items-center justify-center rounded-xl bg-[#918DF6] px-4 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8] disabled:opacity-40"
                      >
                        Done with mappings
                      </button>
                    </div>
                  </div>

                  <Dialog open={mappingModalOpen} onOpenChange={(open) => !open && closeMappingModal()}>
                    <DialogContent className="sm:max-w-[780px] rounded-[24px] border border-[rgba(0,0,0,0.08)] bg-white p-0 shadow-[0_20px_64px_rgba(24,25,37,0.12)] overflow-hidden">
                      <DialogHeader className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4 text-left">
                        <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                          New product mapping
                        </DialogTitle>
                        <DialogDescription className="mt-0.5 text-[13px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                          Select a merchant listing on the left, then pick or create a Mont product on the right.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid grid-cols-2 divide-x divide-[rgba(0,0,0,0.07)]" style={{ minHeight: 340 }}>

                        <div className="flex flex-col p-4 gap-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Merchant listing</p>
                            <div className="inline-flex rounded-full bg-[rgba(0,0,0,0.05)] p-0.5">
                              <button
                                type="button"
                                onClick={() => setProductSkuMode("import")}
                                className={`inline-flex h-5 items-center justify-center rounded-full px-2.5 text-[10px] font-medium tracking-[-0.32px] transition-all ${
                                  productSkuMode === "import"
                                    ? "bg-white text-[#181925] shadow-[0_1px_2px_rgba(0,0,0,0.10)]"
                                    : "text-[#666666] hover:text-[#181925]"
                                }`}
                              >
                                From merchant
                              </button>
                              <button
                                type="button"
                                onClick={() => setProductSkuMode("manual")}
                                className={`inline-flex h-5 items-center justify-center rounded-full px-2.5 text-[10px] font-medium tracking-[-0.32px] transition-all ${
                                  productSkuMode === "manual"
                                    ? "bg-white text-[#181925] shadow-[0_1px_2px_rgba(0,0,0,0.10)]"
                                    : "text-[#666666] hover:text-[#181925]"
                                }`}
                              >
                                Manual
                              </button>
                            </div>
                          </div>

                          {productSkuMode === "import" ? (
                            importedMerchantProductIds.length > 0 ? (
                              <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] flex-1">
                                {importedMerchantProductIds.map((listing, i) => {
                                  const isSelected = selectedImportedListingIds.has(listing.id)
                                  return (
                                    <button
                                      key={listing.id}
                                      type="button"
                                      onClick={() => toggleImportedListing(listing.id)}
                                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                                        i > 0 ? "border-t border-[rgba(0,0,0,0.06)]" : ""
                                      } ${isSelected ? "bg-[#918DF6]/[0.05]" : "hover:bg-[rgba(0,0,0,0.02)]"}`}
                                    >
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{listing.name}</p>
                                        <p className="mt-0.5 font-mono text-[11px] tracking-[-0.32px] text-[#999999]">{listing.sku}</p>
                                      </div>
                                      <div className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${isSelected ? "border-[#918DF6] bg-[#918DF6]" : "border-[rgba(0,0,0,0.14)] bg-white"}`}>
                                        {isSelected && <Check className="size-2.5 text-white" strokeWidth={3} />}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                            ) : (
                              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-[rgba(0,0,0,0.10)] px-4 py-8 text-center">
                                <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">No listings synced</p>
                                <p className="mt-1 text-[12px] leading-relaxed tracking-[-0.32px] text-[#999999]">Connect and sync the merchant first, or enter the SKU manually.</p>
                                <button
                                  type="button"
                                  onClick={() => setProductSkuMode("manual")}
                                  className="mt-3 inline-flex h-7 items-center rounded-full bg-[rgba(0,0,0,0.05)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.08)]"
                                >
                                  Enter manually
                                </button>
                              </div>
                            )
                          ) : (
                            <div className="space-y-1.5">
                              <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Merchant Product ID / SKU</p>
                              <input
                                type="text"
                                value={productMerchantSku}
                                onChange={(event) => setProductMerchantSku(event.target.value)}
                                placeholder="e.g. NAVER-PROD-12345"
                                className="h-9 w-full rounded-xl border border-[rgba(0,0,0,0.10)] bg-white px-3 font-mono text-[13px] tracking-[-0.32px] text-[#181925] outline-none transition-colors placeholder:font-sans placeholder:text-[#999999] focus:border-[#918DF6]"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col p-4 gap-3">
                          <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Mont product</p>

                          <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]">
                            {productOptions.map((product, i) => {
                              const isSelected = selectedProductId === product.id
                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedProductId(product.id)
                                    setProductNameDraft("")
                                  }}
                                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                                    i > 0 ? "border-t border-[rgba(0,0,0,0.06)]" : ""
                                  } ${isSelected ? "bg-[#918DF6]/[0.05]" : "hover:bg-[rgba(0,0,0,0.02)]"}`}
                                >
                                  <span
                                    className="flex size-6 shrink-0 items-center justify-center rounded-md text-[8px] font-bold text-white"
                                    style={{ backgroundColor: product.badgeBg }}
                                  >
                                    {product.badge}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{product.name}</p>
                                    <p className="mt-0.5 text-[10px] tracking-[-0.32px] text-[#999999]">{product.category}</p>
                                  </div>
                                  {isSelected && <Check className="size-3.5 shrink-0 text-[#918DF6]" strokeWidth={2.5} />}
                                </button>
                              )
                            })}
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="h-px flex-1 bg-[rgba(0,0,0,0.07)]" />
                            <span className="text-[10px] tracking-[-0.32px] text-[#999999]">or create new</span>
                            <div className="h-px flex-1 bg-[rgba(0,0,0,0.07)]" />
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              value={productNameDraft}
                              onChange={(event) => {
                                setProductNameDraft(event.target.value)
                                setProductCategoryDraft(inferProductType(event.target.value))
                                if (event.target.value.trim()) setSelectedProductId(null)
                              }}
                              placeholder="e.g. Notion Plus 1Y"
                              className="h-9 w-full rounded-xl border border-[rgba(0,0,0,0.10)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none transition-colors placeholder:text-[#999999] focus:border-[#918DF6]"
                            />
                            {productNameDraft.trim().length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                {productTypeOptions.map((option) => {
                                  const isActive = productCategoryDraft === option
                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => setProductCategoryDraft(option)}
                                      className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium tracking-[-0.32px] transition-colors ${
                                        isActive
                                          ? "bg-[#918DF6] text-white"
                                          : "bg-[rgba(0,0,0,0.05)] text-[#666666] hover:bg-[rgba(0,0,0,0.08)]"
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  )
                                })}
                                <button
                                  type="button"
                                  onClick={createInlineProduct}
                                  className="ml-auto inline-flex h-6 shrink-0 items-center rounded-full bg-[#918DF6] px-3 text-[11px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8]"
                                >
                                  Create
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-[rgba(0,0,0,0.08)] px-5 py-3">
                        <button
                          type="button"
                          onClick={closeMappingModal}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-[rgba(0,0,0,0.04)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.07)] hover:text-[#181925]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={connectProduct}
                          disabled={!selectedProductId || (productSkuMode === "manual" ? productMerchantSku.trim().length === 0 : selectedImportedListingIds.size === 0)}
                          className="inline-flex h-9 items-center justify-center rounded-full bg-[#918DF6] px-5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8] disabled:opacity-40"
                        >
                          Add mapping
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {activePanel === "license" && (
                !productData ? (
                  <div className="rounded-2xl border border-dashed border-[rgba(145,141,246,0.28)] bg-[#918DF6]/[0.04] px-5 py-6 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#918DF6]/10 text-[#918DF6]">
                      <Package className="size-5" strokeWidth={1.9} />
                    </div>
                    <p className="mt-3 text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">Create the product first</p>
                    <p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                      License source comes after product mapping. Mont needs a mapped product before it can decide whether to use manual inventory or provider stock.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActivePanel("product")}
                      className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#918DF6] px-4 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8]"
                    >
                      Go to product mapping
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                    <div className="space-y-3">
                      <div className="rounded-2xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)] px-4 py-3">
                        <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Mapped product</p>
                        <p className="mt-1 text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{productData.name}</p>
                        <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">Merchant SKU {productMerchantSku}</p>
                      </div>

                      <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Source type</p>
                      {licenseOptions.map((option) => {
                        const selected = selectedLicense === option.id
                        const Icon = option.icon
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setSelectedLicense(option.id)
                              if (option.type === "manual") setSelectedProvider(null)
                            }}
                            className={`rounded-xl border px-4 py-3.5 text-left transition-all ${
                              selected
                                ? "border-[#918DF6] bg-[#918DF6]/[0.05]"
                                : "border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.14)]"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`flex size-9 items-center justify-center rounded-lg ${selected ? "bg-[#918DF6]/12 text-[#918DF6]" : "bg-[rgba(0,0,0,0.04)] text-[#666666]"}`}>
                                <Icon className="size-4.5" strokeWidth={1.9} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{option.name}</p>
                                <p className="mt-0.5 text-[11px] tracking-[-0.32px] text-[#666666]">
                                  {option.type === "manual"
                                    ? `Use inventory already uploaded for ${productData.name}.`
                                    : `Resolve stock from a provider when ${productData.name} orders arrive.`}
                                </p>
                              </div>
                              {selected && <Check className="ml-auto size-4 shrink-0 text-[#34A853]" strokeWidth={2.5} />}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    <div className="rounded-2xl border border-[rgba(145,141,246,0.16)] bg-[#918DF6]/[0.04] p-4">
                      <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">Inventory mapping</p>
                      <p className="mt-1 text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">Choose how {productData.name} gets fulfilled</p>
                      <p className="mt-1 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                        Once the merchant listing matches this product, Mont will use the source below to fetch or reserve the deliverable license.
                      </p>

                      {selectedLicense === "provider" ? (
                        <div className="mt-4 space-y-2.5">
                          <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Choose provider</p>
                          {filteredProviders.map((provider) => {
                            const selected = selectedProvider === provider.id
                            return (
                              <button
                                key={provider.id}
                                type="button"
                                onClick={() => setSelectedProvider(provider.id)}
                                className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                                  selected
                                    ? "border-[#918DF6] bg-white shadow-[0_10px_24px_rgba(145,141,246,0.08)]"
                                    : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.14)]"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
                                    style={{ backgroundColor: provider.badgeBg }}
                                  >
                                    {provider.badge}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{provider.name}</p>
                                    <p className="mt-0.5 text-[11px] tracking-[-0.32px] text-[#666666]">Provider stock will be linked to {productData.name}.</p>
                                  </div>
                                  {selected && <Check className="size-4 shrink-0 text-[#34A853]" strokeWidth={2.5} />}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      ) : selectedLicense === "manual" ? (
                        <div className="mt-4 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3.5 py-3">
                          <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#181925]">Manual inventory selected</p>
                          <p className="mt-1 text-[11px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                            Upload keys, links, files, or subscriptions for {productData.name} in Licenses. Mont will reserve them when matched orders arrive.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-dashed border-[rgba(145,141,246,0.24)] bg-white px-3.5 py-3 text-[11px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                          Select a source type first, then finish the inventory mapping for {productData.name}.
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={closePanel}
                          className="inline-flex h-9 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] px-3.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)] hover:text-[#181925]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={closePanel}
                          disabled={!selectedLicense || (selectedLicense === "provider" && !selectedProvider)}
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-[#918DF6] px-3.5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8] disabled:opacity-40"
                        >
                          Save license mapping
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}

              {activePanel === "channel" && (
                <div className="flex flex-col gap-2">
                  <p className="mb-2 text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">
                    Select one or more
                  </p>
                  {channelOptions.map((channel) => {
                    const selected = selectedChannels.has(channel.id)
                    const Icon = channel.icon
                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => toggleChannel(channel.id)}
                        className={`rounded-xl border px-4 py-3.5 text-left transition-all ${
                          selected
                            ? "border-[#918DF6] bg-[#918DF6]/[0.05]"
                            : "border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.14)]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="flex size-9 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${channel.color}18`, color: channel.color }}
                          >
                            <Icon className="size-4.5" strokeWidth={1.9} />
                          </span>
                          <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{channel.name}</p>
                          <div className={`ml-auto flex size-6 items-center justify-center rounded-md border-2 ${selected ? "border-[#918DF6] bg-[#918DF6]" : "border-[rgba(0,0,0,0.14)] bg-white"}`}>
                            {selected && <Check className="size-3 text-white" strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                  <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)] hover:text-[#181925]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={closePanel}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[#918DF6] px-4 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7D79E8]"
                    >
                      Done · {selectedChannels.size} selected
                    </button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
