import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Plus,
  Settings,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Package,
  FileText,
  Globe,
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Search,
  Send,
  ChevronRight,
  ChevronDown,
  Trash2,
  Code2,
  GitBranch,
  Type,
  GripVertical,
  X,
} from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

type ProviderStatus = "Active" | "Inactive" | "Error"
type AuthType = "API Key" | "OAuth2" | "Bearer Token"

type ProductMapping = {
  productName: string
  externalSku: string
  priority: number
  autoFetch: boolean
  fallback: "Next Provider" | "Manual" | "Hold Order"
}

type RecentActivity = {
  timestamp: string
  product: string
  status: "Success" | "Failed" | "Pending"
  keyType: string
  responseTime: string
}

type Provider = {
  id: string
  name: string
  badge: string
  color: string
  enabled: boolean
  status: ProviderStatus
  apiUrl: string
  authType: AuthType
  apiKey: string
  totalFetched: number
  successRate: string
  avgResponse: string
  productsMapped: number
  maxRetries: number
  retryDelay: string
  rateLimit: number
  webhookUrl: string
  errorMessage?: string
  productMappings: ProductMapping[]
  recentActivity: RecentActivity[]
}

type WizardMode = "paste" | "url" | "auto"

type ManualApiAuthType = "none" | "apikey" | "bearer" | "basic"

type ManualApiHeader = {
  id: string
  key: string
  value: string
}

type ManualApiMapping = {
  jsonPath: string
  targetField: string
  type: "path" | "fixed"
  fixedValue: string
}

type JsonNode = {
  key: string
  path: string
  value: unknown
  type: "string" | "number" | "boolean" | "null" | "object" | "array"
  children?: JsonNode[]
}

const MODEL_FIELDS = [
  "productName",
  "keyCode",
  "price",
  "currency",
  "status",
  "sku",
  "quantity",
  "expiresAt",
] as const

type ModelField = (typeof MODEL_FIELDS)[number]

const AUTO_DETECT_PROVIDERS = [
  { id: "naver-store", name: "Naver Store", color: "#03C75A", badge: "N", apiUrl: "https://api.commerce.naver.com/v1", authType: "API Key" as AuthType },
  { id: "g2g", name: "G2G", color: "#E87A2A", badge: "G2G", apiUrl: "https://api.g2g.com/v2", authType: "API Key" as AuthType },
  { id: "g2a", name: "G2A", color: "#F05A23", badge: "G2A", apiUrl: "https://api.g2a.com/v2", authType: "OAuth2" as AuthType },
  { id: "eneba", name: "Eneba", color: "#FF6B35", badge: "E", apiUrl: "https://api.eneba.com/v2", authType: "API Key" as AuthType },
  { id: "kinguin", name: "Kinguin", color: "#1A73E8", badge: "K", apiUrl: "https://gateway.kinguin.net/esa/api/v2", authType: "API Key" as AuthType },
  { id: "keysforge", name: "KeysForge", color: "#34A853", badge: "KF", apiUrl: "https://api.keysforge.com/v1", authType: "Bearer Token" as AuthType },
] as const

const MOCK_API_RESPONSE = {
  status: "success",
  meta: { total: 3, page: 1, perPage: 25, requestId: "req_8f2a4c1e" },
  data: {
    products: [
      {
        id: "prod_001",
        name: "Windows 11 Pro Key",
        sku: "KG-W11P-GLB",
        keys: [
          { code: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX", status: "available", expiresAt: "2027-06-15T00:00:00Z" },
          { code: "YYYYY-YYYYY-YYYYY-YYYYY-YYYYY", status: "available", expiresAt: "2027-06-15T00:00:00Z" },
        ],
        pricing: { amount: 24.99, currency: "USD", discount: 0.15 },
        inventory: { available: 142, reserved: 8, total: 150 },
      },
      {
        id: "prod_002",
        name: "Steam Wallet $50 Gift Card",
        sku: "KG-STEAM50-US",
        keys: [
          { code: "STEAM-ABCD-EFGH-IJKL", status: "available", expiresAt: "2026-12-31T00:00:00Z" },
        ],
        pricing: { amount: 47.50, currency: "USD", discount: 0.05 },
        inventory: { available: 89, reserved: 3, total: 92 },
      },
      {
        id: "prod_003",
        name: "Xbox Game Pass Ultimate 1M",
        sku: "KG-XGPU-1M",
        keys: [
          { code: "XGPU-9K2M-4R7N-1P8Q", status: "reserved", expiresAt: "2026-08-01T00:00:00Z" },
        ],
        pricing: { amount: 12.99, currency: "USD", discount: 0 },
        inventory: { available: 56, reserved: 12, total: 68 },
      },
    ],
  },
}

function buildJsonTree(obj: unknown, parentPath: string = ""): JsonNode[] {
  if (obj === null || obj === undefined) return []
  if (typeof obj !== "object") return []

  const entries = Array.isArray(obj)
    ? obj.map((item, index) => [String(index), item] as const)
    : Object.entries(obj as Record<string, unknown>)

  return entries.map(([key, value]) => {
    const path = parentPath ? (Array.isArray(obj) ? `${parentPath}[${key}]` : `${parentPath}.${key}`) : key
    let type: JsonNode["type"] = "null"
    if (value === null) type = "null"
    else if (Array.isArray(value)) type = "array"
    else if (typeof value === "object") type = "object"
    else if (typeof value === "string") type = "string"
    else if (typeof value === "number") type = "number"
    else if (typeof value === "boolean") type = "boolean"

    const children = (type === "object" || type === "array") ? buildJsonTree(value, path) : undefined

    return { key, path, value, type, children }
  })
}

function renderJsonSyntax(obj: unknown, indent: number = 0): React.ReactNode[] {
  const pad = "  ".repeat(indent)
  const nodes: React.ReactNode[] = []

  if (obj === null) {
    nodes.push(<span key="null" style={{ color: "#999999" }}>null</span>)
    return nodes
  }

  if (typeof obj === "string") {
    nodes.push(<span key="str" style={{ color: "#34A853" }}>"{obj}"</span>)
    return nodes
  }

  if (typeof obj === "number") {
    nodes.push(<span key="num" style={{ color: "#1A73E8" }}>{obj}</span>)
    return nodes
  }

  if (typeof obj === "boolean") {
    nodes.push(<span key="bool" style={{ color: "#E37400" }}>{String(obj)}</span>)
    return nodes
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      nodes.push(<span key="empty-arr">{"[]"}</span>)
      return nodes
    }
    nodes.push(<span key="arr-open">{"[\n"}</span>)
    obj.forEach((item, i) => {
      nodes.push(<span key={`pad-${i}`}>{pad}{"  "}</span>)
      nodes.push(...renderJsonSyntax(item, indent + 1))
      if (i < obj.length - 1) nodes.push(<span key={`comma-${i}`}>,</span>)
      nodes.push(<span key={`nl-${i}`}>{"\n"}</span>)
    })
    nodes.push(<span key="arr-close">{pad}{"]"}</span>)
    return nodes
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) {
      nodes.push(<span key="empty-obj">{"{}"}</span>)
      return nodes
    }
    nodes.push(<span key="obj-open">{"{\n"}</span>)
    entries.forEach(([key, value], i) => {
      nodes.push(<span key={`pad-${key}`}>{pad}{"  "}</span>)
      nodes.push(<span key={`key-${key}`} style={{ color: "#918DF6" }}>"{key}"</span>)
      nodes.push(<span key={`colon-${key}`}>: </span>)
      nodes.push(...renderJsonSyntax(value, indent + 1))
      if (i < entries.length - 1) nodes.push(<span key={`comma-${key}`}>,</span>)
      nodes.push(<span key={`nl-${key}`}>{"\n"}</span>)
    })
    nodes.push(<span key="obj-close">{pad}{"}"}</span>)
    return nodes
  }

  return nodes
}

type WizardMapping = {
  id: string
  productName: string
  externalSku: string
  priority: 1 | 2 | 3
  selected: boolean
}

type WizardConfig = {
  name: string
  apiUrl: string
  authType: AuthType
  apiKey: string
  rateLimit: string
  maxRetries: string
}

const authBadgeStyles: Record<AuthType, { bg: string; text: string }> = {
  "API Key": { bg: "rgba(26,115,232,0.08)", text: "#1A73E8" },
  OAuth2: { bg: "rgba(145,141,246,0.08)", text: "#918DF6" },
  "Bearer Token": { bg: "rgba(52,168,83,0.08)", text: "#34A853" },
}

const fetchStatusColors: Record<string, string> = {
  Success: "#34A853",
  Failed: "#D93025",
  Pending: "#E37400",
}

const fallbackStyles: Record<ProductMapping["fallback"], { bg: string; text: string }> = {
  "Next Provider": { bg: "rgba(145,141,246,0.1)", text: "#918DF6" },
  Manual: { bg: "rgba(227,116,0,0.1)", text: "#E37400" },
  "Hold Order": { bg: "rgba(217,48,37,0.1)", text: "#D93025" },
}

const statusStyles: Record<ProviderStatus, { dot: string; text: string; bg: string }> = {
  Active: { dot: "#34A853", text: "#34A853", bg: "rgba(52,168,83,0.08)" },
  Inactive: { dot: "#999999", text: "#666666", bg: "rgba(0,0,0,0.05)" },
  Error: { dot: "#D93025", text: "#D93025", bg: "rgba(217,48,37,0.08)" },
}

const wizardAnalysisSteps = [
  { label: "Parsing documentation...", duration: 800 },
  { label: "Detecting authentication method...", duration: 1200 },
  { label: "Identifying API endpoints...", duration: 1000 },
  { label: "Mapping product catalog...", duration: 900 },
  { label: "Generating configuration...", duration: 700 },
] as const

const wizardProducts = [
  "Steam Wallet $50 Gift Card",
  "Xbox Game Pass Ultimate 1M",
  "Windows 11 Pro Key",
  "Elden Ring Shadow of the Erdtree",
  "Spotify Premium 6M",
  "Adobe Creative Cloud 1M",
] as const

const defaultWizardConfig = (): WizardConfig => ({
  name: "Eneba Marketplace",
  apiUrl: "https://api.eneba.com/v2",
  authType: "API Key",
  apiKey: "enb_live_sk_7Q2K8D9M4R1P6X",
  rateLimit: "60/min",
  maxRetries: "3",
})

const defaultWizardMappings = (): WizardMapping[] => [
  { id: "steam-wallet-50", productName: "Steam Wallet $50 Gift Card", externalSku: "ENB-STEAM50-GLB", priority: 1, selected: true },
  { id: "xbox-game-pass-ultimate-1m", productName: "Xbox Game Pass Ultimate 1M", externalSku: "ENB-XGPU-1M", priority: 2, selected: true },
  { id: "windows-11-pro-key", productName: "Windows 11 Pro Key", externalSku: "ENB-WIN11-PRO", priority: 1, selected: true },
  { id: "elden-ring-shadow", productName: "Elden Ring Shadow of the Erdtree", externalSku: "ENB-ER-SOTE", priority: 3, selected: false },
  { id: "spotify-premium-6m", productName: "Spotify Premium 6M", externalSku: "ENB-SPOT-6M", priority: 2, selected: true },
  { id: "adobe-creative-cloud-1m", productName: "Adobe Creative Cloud 1M", externalSku: "ENB-ACC-1M", priority: 3, selected: false },
]

const initialProviders: Provider[] = [
  {
    id: "kinguin",
    name: "Kinguin API",
    badge: "K",
    color: "#1A73E8",
    enabled: true,
    status: "Active",
    apiUrl: "https://gateway.kinguin.net/esa/api/v2",
    authType: "API Key",
    apiKey: "kg_live_7FK2Q9L1N8P4R6T3X5",
    totalFetched: 1842,
    successRate: "98.7%",
    avgResponse: "420ms",
    productsMapped: 6,
    maxRetries: 3,
    retryDelay: "15s",
    rateLimit: 120,
    webhookUrl: "https://mont.vexora.team/webhooks/providers/kinguin",
    productMappings: [
      { productName: "Windows 11 Pro Key", externalSku: "KG-W11P-GLB", priority: 1, autoFetch: true, fallback: "Next Provider" },
      { productName: "Steam Wallet $50", externalSku: "KG-STEAM50-US", priority: 1, autoFetch: true, fallback: "Manual" },
      { productName: "Xbox Game Pass 1M", externalSku: "KG-XGPU-1M", priority: 2, autoFetch: true, fallback: "Next Provider" },
      { productName: "Elden Ring DLC", externalSku: "KG-ERDLC-PC", priority: 1, autoFetch: false, fallback: "Manual" },
      { productName: "Microsoft 365 Family", externalSku: "KG-M365-FAM", priority: 2, autoFetch: true, fallback: "Next Provider" },
      { productName: "Spotify Premium 6M", externalSku: "KG-SPOT-6M", priority: 3, autoFetch: true, fallback: "Hold Order" },
    ],
    recentActivity: [
      { timestamp: "2026-04-29 14:21", product: "Windows 11 Pro Key", status: "Success", keyType: "Retail", responseTime: "392ms" },
      { timestamp: "2026-04-29 14:10", product: "Steam Wallet $50", status: "Success", keyType: "Gift Card", responseTime: "448ms" },
      { timestamp: "2026-04-29 13:58", product: "Xbox Game Pass 1M", status: "Pending", keyType: "Subscription", responseTime: "1.1s" },
      { timestamp: "2026-04-29 13:41", product: "Microsoft 365 Family", status: "Success", keyType: "License", responseTime: "401ms" },
      { timestamp: "2026-04-29 13:22", product: "Spotify Premium 6M", status: "Failed", keyType: "Voucher", responseTime: "2.6s" },
    ],
  },
  {
    id: "g2a",
    name: "G2A Marketplace",
    badge: "G2A",
    color: "#F05A23",
    enabled: true,
    status: "Active",
    apiUrl: "https://api.g2a.com/v2",
    authType: "OAuth2",
    apiKey: "g2a_oauth_prod_4mP9xC8vL2aR7nQ",
    totalFetched: 1264,
    successRate: "97.2%",
    avgResponse: "610ms",
    productsMapped: 4,
    maxRetries: 2,
    retryDelay: "20s",
    rateLimit: 90,
    webhookUrl: "https://mont.vexora.team/webhooks/providers/g2a",
    productMappings: [
      { productName: "Steam Wallet $100", externalSku: "G2A-STM-100", priority: 1, autoFetch: true, fallback: "Next Provider" },
      { productName: "Discord Nitro 1M", externalSku: "G2A-NITRO-1M", priority: 2, autoFetch: true, fallback: "Hold Order" },
      { productName: "EA Play Pro 1M", externalSku: "G2A-EAPRO-1M", priority: 1, autoFetch: false, fallback: "Manual" },
      { productName: "PlayStation Store $50", externalSku: "G2A-PSN-50-US", priority: 2, autoFetch: true, fallback: "Next Provider" },
    ],
    recentActivity: [
      { timestamp: "2026-04-29 14:18", product: "Steam Wallet $100", status: "Success", keyType: "Gift Card", responseTime: "575ms" },
      { timestamp: "2026-04-29 14:02", product: "Discord Nitro 1M", status: "Success", keyType: "Subscription", responseTime: "642ms" },
      { timestamp: "2026-04-29 13:46", product: "PlayStation Store $50", status: "Pending", keyType: "Voucher", responseTime: "1.3s" },
      { timestamp: "2026-04-29 13:31", product: "EA Play Pro 1M", status: "Failed", keyType: "Account", responseTime: "2.1s" },
      { timestamp: "2026-04-29 13:08", product: "Steam Wallet $100", status: "Success", keyType: "Gift Card", responseTime: "598ms" },
    ],
  },
  {
    id: "keysforge",
    name: "KeysForge",
    badge: "KF",
    color: "#34A853",
    enabled: false,
    status: "Error",
    apiUrl: "https://api.keysforge.com/v1",
    authType: "Bearer Token",
    apiKey: "kf_bearer_live_q8R2w4Y6u1N3m7P5",
    totalFetched: 482,
    successRate: "89.4%",
    avgResponse: "1.8s",
    productsMapped: 3,
    maxRetries: 5,
    retryDelay: "45s",
    rateLimit: 40,
    webhookUrl: "https://mont.vexora.team/webhooks/providers/keysforge",
    errorMessage: "Connection timeout — last successful sync 2h ago",
    productMappings: [
      { productName: "Office 2021 Professional", externalSku: "KF-OFF21-PRO", priority: 1, autoFetch: true, fallback: "Manual" },
      { productName: "NordVPN 1Y", externalSku: "KF-NORD-12M", priority: 2, autoFetch: false, fallback: "Hold Order" },
      { productName: "Canva Pro 12M", externalSku: "KF-CANVA-12M", priority: 1, autoFetch: true, fallback: "Next Provider" },
    ],
    recentActivity: [
      { timestamp: "2026-04-29 12:14", product: "Office 2021 Professional", status: "Failed", keyType: "License", responseTime: "4.8s" },
      { timestamp: "2026-04-29 11:57", product: "Canva Pro 12M", status: "Pending", keyType: "Account", responseTime: "3.7s" },
      { timestamp: "2026-04-29 11:36", product: "NordVPN 1Y", status: "Failed", keyType: "Voucher", responseTime: "5.2s" },
      { timestamp: "2026-04-29 11:12", product: "Canva Pro 12M", status: "Success", keyType: "Account", responseTime: "1.6s" },
      { timestamp: "2026-04-29 10:49", product: "Office 2021 Professional", status: "Success", keyType: "License", responseTime: "1.4s" },
    ],
  },
]

function ToggleSwitch({
  on,
  onToggle,
  size = "md",
}: {
  on: boolean
  onToggle: () => void
  size?: "sm" | "md"
}) {
  const dimensions = size === "sm"
    ? { track: "h-5 w-9", thumb: "size-4", active: "translateX(18px)", idle: "translateX(2px)" }
    : { track: "h-[22px] w-[40px]", thumb: "size-[18px]", active: "translateX(20px)", idle: "translateX(2px)" }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex ${dimensions.track} shrink-0 items-center rounded-full transition-colors duration-200`}
      style={{ backgroundColor: on ? "#918DF6" : "#D1D5DB" }}
    >
      <span
        className={`pointer-events-none inline-block ${dimensions.thumb} rounded-full bg-white shadow-sm transition-transform duration-200`}
        style={{ transform: on ? dimensions.active : dimensions.idle }}
      />
    </button>
  )
}

function maskSecret(secret: string) {
  if (secret.length <= 8) return "•".repeat(secret.length)
  return `${secret.slice(0, 4)}${"•".repeat(Math.max(secret.length - 8, 10))}${secret.slice(-4)}`
}

export default function Providers() {
  const [currency, setCurrency] = useState<Currency>("USD")
  const [providers, setProviders] = useState<Provider[]>(initialProviders)
  const [configProvider, setConfigProvider] = useState<string | null>(null)
  const [showSecretFor, setShowSecretFor] = useState<string | null>(null)
  const [copiedValue, setCopiedValue] = useState<string | null>(null)
  const [testingProvider, setTestingProvider] = useState<string | null>(null)
  const [addProviderOpen, setAddProviderOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [wizardMode, setWizardMode] = useState<WizardMode>("paste")
  const [wizardDocsInput, setWizardDocsInput] = useState("")
  const [wizardUrlInput, setWizardUrlInput] = useState("")
  const [wizardConfig, setWizardConfig] = useState<WizardConfig>(defaultWizardConfig)
  const [wizardShowSecret, setWizardShowSecret] = useState(false)
  const [analysisCompletedSteps, setAnalysisCompletedSteps] = useState(0)
  const [connectionTestComplete, setConnectionTestComplete] = useState(false)
  const [wizardMappings, setWizardMappings] = useState<WizardMapping[]>(defaultWizardMappings)
  const wizardTimeoutsRef = useRef<number[]>([])

  const [manualApiOpen, setManualApiOpen] = useState(false)
  const [manualApiStep, setManualApiStep] = useState<1 | 2 | 3>(1)
  const [manualApiMethod, setManualApiMethod] = useState<"GET" | "POST" | "PUT">("GET")
  const [manualApiUrl, setManualApiUrl] = useState("")
  const [manualApiHeaders, setManualApiHeaders] = useState<ManualApiHeader[]>([
    { id: "h1", key: "Content-Type", value: "application/json" },
  ])
  const [manualApiAuthType, setManualApiAuthType] = useState<ManualApiAuthType>("none")
  const [manualApiAuthValue, setManualApiAuthValue] = useState("")
  const [manualApiAuthUser, setManualApiAuthUser] = useState("")
  const [manualApiBody, setManualApiBody] = useState("")
  const [manualApiTesting, setManualApiTesting] = useState(false)
  const [manualApiMappings, setManualApiMappings] = useState<ManualApiMapping[]>([])
  const [manualApiExpandedNodes, setManualApiExpandedNodes] = useState<Set<string>>(new Set(["data", "data.products", "data.products[0]", "data.products[0].pricing", "data.products[0].keys", "data.products[0].keys[0]", "data.products[0].inventory", "meta"]))
  const [manualApiSelectedPath, setManualApiSelectedPath] = useState<string | null>(null)
  const manualApiHeaderIdRef = useRef(2)
  const [dragOverField, setDragOverField] = useState<string | null>(null)
  const [fieldModes, setFieldModes] = useState<Record<string, "path" | "fixed">>({})
  const [fixedValues, setFixedValues] = useState<Record<string, string>>({})

  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.id === configProvider) ?? null,
    [configProvider, providers],
  )

  const jsonTree = useMemo(() => buildJsonTree(MOCK_API_RESPONSE), [])

  useEffect(() => {
    if (!copiedValue) return
    const timeout = window.setTimeout(() => setCopiedValue(null), 1400)
    return () => window.clearTimeout(timeout)
  }, [copiedValue])

  useEffect(() => {
    const clearWizardTimeouts = () => {
      wizardTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
      wizardTimeoutsRef.current = []
    }

    clearWizardTimeouts()

    if (!addProviderOpen || wizardStep !== 2) {
      return clearWizardTimeouts
    }

    setAnalysisCompletedSteps(0)

    let elapsed = 0

    wizardAnalysisSteps.forEach((step, index) => {
      elapsed += step.duration
      const timeout = window.setTimeout(() => {
        setAnalysisCompletedSteps(index + 1)
      }, elapsed)
      wizardTimeoutsRef.current.push(timeout)
    })

    const advanceTimeout = window.setTimeout(() => {
      setWizardStep(3)
    }, elapsed + 500)
    wizardTimeoutsRef.current.push(advanceTimeout)

    return clearWizardTimeouts
  }, [addProviderOpen, wizardStep])

  useEffect(() => {
    const clearWizardTimeouts = () => {
      wizardTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
      wizardTimeoutsRef.current = []
    }

    if (!addProviderOpen || wizardStep !== 4) {
      return undefined
    }

    setConnectionTestComplete(false)
    clearWizardTimeouts()

    const timeout = window.setTimeout(() => {
      setConnectionTestComplete(true)
    }, 1500)

    wizardTimeoutsRef.current.push(timeout)

    return clearWizardTimeouts
  }, [addProviderOpen, wizardStep])

  useEffect(() => {
    return () => {
      wizardTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
    }
  }, [])

  const resetAddProviderWizard = () => {
    wizardTimeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout))
    wizardTimeoutsRef.current = []
    setAddProviderOpen(false)
    setWizardStep(1)
    setWizardMode("paste")
    setWizardDocsInput("")
    setWizardUrlInput("")
    setWizardConfig(defaultWizardConfig())
    setWizardShowSecret(false)
    setAnalysisCompletedSteps(0)
    setConnectionTestComplete(false)
    setWizardMappings(defaultWizardMappings())
  }

  const resetManualApiDialog = () => {
    setManualApiOpen(false)
    setManualApiStep(1)
    setManualApiMethod("GET")
    setManualApiUrl("")
    setManualApiHeaders([{ id: "h1", key: "Content-Type", value: "application/json" }])
    setManualApiAuthType("none")
    setManualApiAuthValue("")
    setManualApiAuthUser("")
    setManualApiBody("")
    setManualApiTesting(false)
    setManualApiMappings([])
    setManualApiExpandedNodes(new Set(["data", "data.products", "data.products[0]", "data.products[0].pricing", "data.products[0].keys", "data.products[0].keys[0]", "data.products[0].inventory", "meta"]))
    setManualApiSelectedPath(null)
    manualApiHeaderIdRef.current = 2
    setDragOverField(null)
    setFieldModes({})
    setFixedValues({})
  }

  const handleManualApiTest = () => {
    if (!manualApiUrl.trim()) return
    setManualApiTesting(true)
    window.setTimeout(() => {
      setManualApiTesting(false)
      setManualApiStep(2)
    }, 1400)
  }

  const handleAddManualHeader = () => {
    manualApiHeaderIdRef.current += 1
    setManualApiHeaders((current) => [...current, { id: `h${manualApiHeaderIdRef.current}`, key: "", value: "" }])
  }

  const handleRemoveManualHeader = (id: string) => {
    setManualApiHeaders((current) => current.filter((header) => header.id !== id))
  }

  const handleUpdateManualHeader = (id: string, field: "key" | "value", val: string) => {
    setManualApiHeaders((current) =>
      current.map((header) => (header.id === id ? { ...header, [field]: val } : header)),
    )
  }

  const handleToggleJsonNode = (path: string) => {
    setManualApiExpandedNodes((current) => {
      const next = new Set(current)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const handleSelectJsonPath = (path: string) => {
    setManualApiSelectedPath(path)
  }

  const handleAddMapping = (targetField: ModelField) => {
    if (!manualApiSelectedPath) return
    const alreadyMapped = manualApiMappings.some((m) => m.targetField === targetField)
    if (alreadyMapped) {
      setManualApiMappings((current) =>
        current.map((m) => (m.targetField === targetField ? { ...m, jsonPath: manualApiSelectedPath, type: "path", fixedValue: "" } : m)),
      )
    } else {
      setManualApiMappings((current) => [...current, { jsonPath: manualApiSelectedPath, targetField, type: "path", fixedValue: "" }])
    }
    setManualApiSelectedPath(null)
    setFieldModes((prev) => ({ ...prev, [targetField]: "path" }))
  }

  const handleDropMapping = useCallback((targetField: ModelField, jsonPath: string) => {
    const alreadyMapped = manualApiMappings.some((m) => m.targetField === targetField)
    if (alreadyMapped) {
      setManualApiMappings((current) =>
        current.map((m) => (m.targetField === targetField ? { ...m, jsonPath, type: "path", fixedValue: "" } : m)),
      )
    } else {
      setManualApiMappings((current) => [...current, { jsonPath, targetField, type: "path", fixedValue: "" }])
    }
    setFieldModes((prev) => ({ ...prev, [targetField]: "path" }))
    setDragOverField(null)
  }, [manualApiMappings])

  const handleAddFixedValue = useCallback((targetField: ModelField, value: string) => {
    const alreadyMapped = manualApiMappings.some((m) => m.targetField === targetField)
    if (alreadyMapped) {
      setManualApiMappings((current) =>
        current.map((m) => (m.targetField === targetField ? { ...m, jsonPath: "", type: "fixed", fixedValue: value } : m)),
      )
    } else {
      setManualApiMappings((current) => [...current, { jsonPath: "", targetField, type: "fixed", fixedValue: value }])
    }
  }, [manualApiMappings])

  const handleRemoveMapping = (targetField: string) => {
    setManualApiMappings((current) => current.filter((m) => m.targetField !== targetField))
  }

  const handleSaveManualProvider = () => {
    const providerId = `manual-api-${Date.now()}`
    const newProvider: Provider = {
      id: providerId,
      name: `Custom API (${new URL(manualApiUrl).hostname})`,
      badge: "API",
      color: "#918DF6",
      enabled: true,
      status: "Active",
      apiUrl: manualApiUrl,
      authType: manualApiAuthType === "bearer" ? "Bearer Token" : manualApiAuthType === "apikey" ? "API Key" : "API Key",
      apiKey: manualApiAuthValue || "manual-config",
      totalFetched: 0,
      successRate: "100%",
      avgResponse: "—",
      productsMapped: manualApiMappings.length,
      maxRetries: 3,
      retryDelay: "15s",
      rateLimit: 60,
      webhookUrl: `https://mont.vexora.team/webhooks/providers/${providerId}`,
      productMappings: manualApiMappings.map((m) => ({
        productName: m.targetField,
        externalSku: m.type === "fixed" ? `[fixed] ${m.fixedValue}` : m.jsonPath,
        priority: 1,
        autoFetch: true,
        fallback: "Next Provider",
      })),
      recentActivity: [{
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        product: "Manual API configured",
        status: "Success",
        keyType: "API",
        responseTime: "—",
      }],
    }
    setProviders((current) => [newProvider, ...current])
    resetManualApiDialog()
  }

  const handleAutoDetectSelect = (providerId: string) => {
    const provider = AUTO_DETECT_PROVIDERS.find((p) => p.id === providerId)
    if (!provider) return
    setWizardConfig({
      name: provider.name,
      apiUrl: provider.apiUrl,
      authType: provider.authType,
      apiKey: "",
      rateLimit: "60/min",
      maxRetries: "3",
    })
    setWizardMappings(defaultWizardMappings())
    setWizardStep(3)
  }

  const wizardHasInput = (wizardMode === "paste" ? wizardDocsInput : wizardUrlInput).trim().length > 0

  const handleProviderToggle = (providerId: string) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              enabled: !provider.enabled,
              status: provider.status === "Error" ? provider.status : !provider.enabled ? "Active" : "Inactive",
            }
          : provider,
      ),
    )
  }

  const handleMappingToggle = (providerId: string, sku: string) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              productMappings: provider.productMappings.map((mapping) =>
                mapping.externalSku === sku ? { ...mapping, autoFetch: !mapping.autoFetch } : mapping,
              ),
            }
          : provider,
      ),
    )
  }

  const handleMappingUpdate = (providerId: string, sku: string, field: keyof ProductMapping, value: string | number) => {
    setProviders((current) =>
      current.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              productMappings: provider.productMappings.map((mapping) =>
                mapping.externalSku === sku ? { ...mapping, [field]: value } : mapping,
              ),
            }
          : provider,
      ),
    )
  }

  const handleCopy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedValue(key)
  }

  const handleTestConnection = (providerId: string) => {
    setTestingProvider(providerId)
    window.setTimeout(() => setTestingProvider((current) => (current === providerId ? null : current)), 1200)
  }

  const handleAnalyzeProvider = () => {
    if (!wizardHasInput) return
    setWizardConfig(defaultWizardConfig())
    setWizardMappings(defaultWizardMappings())
    setWizardShowSecret(false)
    setWizardStep(2)
  }

  const handleSaveProvider = () => {
    const selectedMappings = wizardMappings.filter((mapping) => mapping.selected)
    const providerId = `${wizardConfig.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`

    const newProvider: Provider = {
      id: providerId,
      name: wizardConfig.name,
      badge: wizardConfig.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
        .slice(0, 3),
      color: "#918DF6",
      enabled: true,
      status: "Active",
      apiUrl: wizardConfig.apiUrl,
      authType: wizardConfig.authType,
      apiKey: wizardConfig.apiKey,
      totalFetched: 0,
      successRate: "100%",
      avgResponse: "340ms",
      productsMapped: selectedMappings.length,
      maxRetries: Number(wizardConfig.maxRetries) || 3,
      retryDelay: "15s",
      rateLimit: Number.parseInt(wizardConfig.rateLimit, 10) || 60,
      webhookUrl: `https://mont.vexora.team/webhooks/providers/${providerId}`,
      productMappings: selectedMappings.map((mapping) => ({
        productName: mapping.productName,
        externalSku: mapping.externalSku,
        priority: mapping.priority,
        autoFetch: true,
        fallback: "Next Provider",
      })),
      recentActivity: [
        {
          timestamp: "2026-04-29 14:32",
          product: "Initial provider setup",
          status: "Success",
          keyType: wizardConfig.authType,
          responseTime: "340ms",
        },
      ],
    }

    setProviders((current) => [newProvider, ...current])
    resetAddProviderWizard()
  }

  return (
    <DashboardLayout
      title="Providers"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Procurement network</p>
              <h1 className="mt-1 text-[20px] font-semibold tracking-[-0.32px] text-[#181925]">External Providers</h1>
              <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#666666]">
                External key suppliers for automatic fulfillment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setManualApiOpen(true)}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.03)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.05)] hover:text-[#181925]"
              >
                <Code2 className="size-3.5" strokeWidth={2.2} />
                Manual API
              </button>
              <button
                type="button"
                onClick={() => setAddProviderOpen(true)}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7f7ae6]"
              >
                <Plus className="size-3.5" strokeWidth={2.2} />
                Add Provider
              </button>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => {
              const statusStyle = statusStyles[provider.status]
              const authStyle = authBadgeStyles[provider.authType]

              return (
                <div
                  key={provider.id}
                  className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-4"
                  style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold tracking-[-0.32px] text-white"
                        style={{ backgroundColor: provider.color }}
                      >
                        {provider.badge}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                          {provider.name}
                        </h2>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="size-1.5 rounded-full"
                            style={{ backgroundColor: statusStyle.dot }}
                          />
                          <span className="text-[11px] font-medium tracking-[-0.32px]" style={{ color: statusStyle.text }}>
                            {provider.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ToggleSwitch on={provider.enabled} onToggle={() => handleProviderToggle(provider.id)} />
                  </div>

                  <div className="mt-3 rounded-lg border border-[rgba(0,0,0,0.06)] bg-[#FAFAFA] px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">API Base URL</p>
                        <p className="mt-0.5 truncate text-[12px] tracking-[-0.32px] text-[#181925]">{provider.apiUrl}</p>
                      </div>
                      <span
                        className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[-0.32px]"
                        style={{ backgroundColor: authStyle.bg, color: authStyle.text }}
                      >
                        {provider.authType}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5 border-y border-[rgba(0,0,0,0.06)] py-3">
                    {[
                      { label: "Total Fetched", value: provider.totalFetched.toLocaleString(), icon: Package },
                      { label: "Success Rate", value: provider.successRate, icon: Shield },
                      { label: "Avg Response", value: provider.avgResponse, icon: Clock },
                      { label: "Products Mapped", value: provider.productsMapped.toString(), icon: Zap },
                    ].map((stat) => {
                      const Icon = stat.icon
                      return (
                        <div key={stat.label} className="min-w-0">
                          <div className="flex items-center gap-1 text-[#999999]">
                            <Icon className="size-3" strokeWidth={2} />
                            <span className="text-[10px] font-medium tracking-[-0.32px]">{stat.label}</span>
                          </div>
                          <p className="mt-0.5 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                            {stat.value}
                          </p>
                        </div>
                      )
                    })}
                  </div>

                  {provider.status === "Error" && provider.errorMessage ? (
                    <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-[rgba(217,48,37,0.12)] bg-[rgba(217,48,37,0.05)] px-2.5 py-2">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-[#D93025]" strokeWidth={2.2} />
                      <p className="text-[11px] tracking-[-0.32px] text-[#D93025]">{provider.errorMessage}</p>
                    </div>
                  ) : null}

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setConfigProvider(provider.id)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.03)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.05)] hover:text-[#181925]"
                    >
                      <Settings className="size-3.5" strokeWidth={2.1} />
                      Configure
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Dialog open={configProvider !== null} onOpenChange={(open) => {
        if (!open) {
          setConfigProvider(null)
          setShowSecretFor(null)
        }
      }}>
        {selectedProvider ? (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-0">
            <DialogHeader className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4">
              <div className="flex items-center gap-3 pr-10">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold tracking-[-0.32px] text-white"
                  style={{ backgroundColor: selectedProvider.color }}
                >
                  {selectedProvider.badge}
                </div>
                <div>
                  <DialogTitle className="text-[16px] font-medium tracking-[-0.32px] text-[#181925]">
                    {selectedProvider.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                    Connection settings, product mappings, and fulfillment rules
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="px-5 py-4">
              <div className="flex flex-col gap-5">
                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className="size-3.5 text-[#918DF6]" strokeWidth={2.1} />
                    <h3 className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">Connection</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        API Base URL
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedProvider.apiUrl}
                        className="h-8 w-full rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#FAFAFA] px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        Auth Type
                      </label>
                      <div className="flex h-8 items-center">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-[-0.32px]"
                          style={{
                            backgroundColor: authBadgeStyles[selectedProvider.authType].bg,
                            color: authBadgeStyles[selectedProvider.authType].text,
                          }}
                        >
                          {selectedProvider.authType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end">
                    <div className="flex-1">
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        {selectedProvider.authType === "OAuth2" ? "Access Token" : "API Key / Token"}
                      </label>
                      <div className="flex h-8 items-center rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5">
                        <input
                          type="text"
                          readOnly
                          value={showSecretFor === selectedProvider.id ? selectedProvider.apiKey : maskSecret(selectedProvider.apiKey)}
                          className="w-full bg-transparent text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSecretFor((current) => current === selectedProvider.id ? null : selectedProvider.id)}
                          className="ml-3 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                          aria-label={showSecretFor === selectedProvider.id ? "Hide secret" : "Show secret"}
                        >
                          {showSecretFor === selectedProvider.id ? (
                            <EyeOff className="size-3.5" strokeWidth={2} />
                          ) : (
                            <Eye className="size-3.5" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTestConnection(selectedProvider.id)}
                      className="inline-flex h-8 items-center justify-center gap-2 rounded-full bg-[#918DF6] px-3.5 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7f7ae6]"
                    >
                      <RefreshCw
                        className={`size-3.5 ${testingProvider === selectedProvider.id ? "animate-spin" : ""}`}
                        strokeWidth={2.1}
                      />
                      Test Connection
                    </button>
                  </div>
                </section>

                <div className="h-px bg-[rgba(0,0,0,0.06)]" />

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Package className="size-3.5 text-[#918DF6]" strokeWidth={2.1} />
                    <h3 className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">Product Mappings</h3>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-[rgba(0,0,0,0.08)]">
                    <table className="min-w-[640px] w-full">
                      <thead className="bg-[#FAFAFA]">
                        <tr className="border-b border-[rgba(0,0,0,0.08)]">
                          {[
                            "Product",
                            "External SKU",
                            "Priority",
                            "Auto-fetch",
                            "Fallback",
                          ].map((label) => (
                            <th
                              key={label}
                              className="px-3 py-2 text-left text-[11px] font-medium tracking-[-0.32px] text-[#999999]"
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProvider.productMappings.map((mapping) => (
                          <tr key={mapping.externalSku} className="border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={mapping.productName}
                                onChange={(e) => handleMappingUpdate(selectedProvider.id, mapping.externalSku, "productName", e.target.value)}
                                className="h-7 w-full rounded-md border border-transparent bg-transparent px-1.5 text-[12px] font-medium tracking-[-0.32px] text-[#181925] outline-none transition-colors hover:border-[rgba(0,0,0,0.1)] focus:border-[#918DF6] focus:bg-white"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={mapping.externalSku}
                                onChange={(e) => handleMappingUpdate(selectedProvider.id, mapping.externalSku, "externalSku", e.target.value)}
                                className="h-7 w-full rounded-md border border-transparent bg-transparent px-1.5 text-[12px] tabular-nums tracking-[-0.32px] text-[#666666] outline-none transition-colors hover:border-[rgba(0,0,0,0.1)] focus:border-[#918DF6] focus:bg-white focus:text-[#181925]"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={mapping.priority}
                                onChange={(e) => handleMappingUpdate(selectedProvider.id, mapping.externalSku, "priority", Number(e.target.value))}
                                className="h-7 w-16 appearance-none rounded-md border border-transparent bg-transparent px-1.5 text-[12px] tabular-nums tracking-[-0.32px] text-[#181925] outline-none transition-colors hover:border-[rgba(0,0,0,0.1)] focus:border-[#918DF6] focus:bg-white"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <ToggleSwitch
                                size="sm"
                                on={mapping.autoFetch}
                                onToggle={() => handleMappingToggle(selectedProvider.id, mapping.externalSku)}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <select
                                value={mapping.fallback}
                                onChange={(e) => handleMappingUpdate(selectedProvider.id, mapping.externalSku, "fallback", e.target.value)}
                                className="h-7 appearance-none rounded-full border border-transparent px-2 py-0.5 text-[10px] font-medium tracking-[-0.32px] outline-none transition-colors hover:border-[rgba(0,0,0,0.1)] focus:border-[#918DF6]"
                                style={{
                                  backgroundColor: fallbackStyles[mapping.fallback].bg,
                                  color: fallbackStyles[mapping.fallback].text,
                                }}
                              >
                                <option value="Next Provider">Next Provider</option>
                                <option value="Manual">Manual</option>
                                <option value="Hold Order">Hold Order</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="h-px bg-[rgba(0,0,0,0.06)]" />

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Zap className="size-3.5 text-[#918DF6]" strokeWidth={2.1} />
                    <h3 className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">Fulfillment Rules</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-3 py-2.5">
                      <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Max Retries</p>
                      <p className="mt-1 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {selectedProvider.maxRetries}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-3 py-2.5">
                      <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Retry Delay</p>
                      <p className="mt-1 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {selectedProvider.retryDelay}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-3 py-2.5">
                      <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Rate Limit</p>
                      <p className="mt-1 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {selectedProvider.rateLimit}/min
                      </p>
                    </div>
                    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] px-3 py-2.5">
                      <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Webhook URL</p>
                      <div className="mt-1 flex items-start gap-2">
                        <p className="min-w-0 flex-1 truncate text-[11px] tracking-[-0.32px] text-[#181925]">
                          {selectedProvider.webhookUrl}
                        </p>
                        <button
                          type="button"
                          onClick={() => void handleCopy(selectedProvider.webhookUrl, `${selectedProvider.id}-webhook`)}
                          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                          aria-label="Copy webhook URL"
                        >
                          {copiedValue === `${selectedProvider.id}-webhook` ? (
                            <Check className="size-3 text-[#34A853]" strokeWidth={2.2} />
                          ) : (
                            <Copy className="size-3" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-[rgba(0,0,0,0.06)]" />

                <section>
                  <div className="mb-3 flex items-center gap-2">
                    <Clock className="size-3.5 text-[#918DF6]" strokeWidth={2.1} />
                    <h3 className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">Recent Activity</h3>
                  </div>
                  <div className="overflow-x-auto rounded-lg border border-[rgba(0,0,0,0.08)]">
                    <table className="min-w-[600px] w-full">
                      <thead className="bg-[#FAFAFA]">
                        <tr className="border-b border-[rgba(0,0,0,0.08)]">
                          {[
                            "Timestamp",
                            "Product",
                            "Status",
                            "Key Type",
                            "Response time",
                          ].map((label) => (
                            <th
                              key={label}
                              className="px-3 py-2 text-left text-[11px] font-medium tracking-[-0.32px] text-[#999999]"
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProvider.recentActivity.map((activity, index) => (
                          <tr
                            key={`${activity.timestamp}-${index}`}
                            className="border-b border-[rgba(0,0,0,0.06)] last:border-b-0"
                          >
                            <td className="px-3 py-2 text-[12px] tabular-nums tracking-[-0.32px] text-[#666666]">
                              {activity.timestamp}
                            </td>
                            <td className="px-3 py-2 text-[12px] font-medium tracking-[-0.32px] text-[#181925]">
                              {activity.product}
                            </td>
                            <td className="px-3 py-2">
                              <span className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[-0.32px] text-[#181925]">
                                <span
                                  className="size-2 rounded-full"
                                  style={{ backgroundColor: fetchStatusColors[activity.status] }}
                                  aria-hidden="true"
                                />
                                {activity.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-[12px] tracking-[-0.32px] text-[#666666]">
                              {activity.keyType}
                            </td>
                            <td className="px-3 py-2 text-[12px] tabular-nums tracking-[-0.32px] text-[#181925]">
                              {activity.responseTime}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={addProviderOpen} onOpenChange={(open) => {
        if (!open) {
          resetAddProviderWizard()
        }
      }}>
        <DialogContent
          className={`${wizardStep === 5 ? "sm:max-w-[640px]" : "sm:max-w-[560px]"} max-h-[85vh] overflow-y-auto rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-0`}
        >
          <DialogHeader className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4">
            <DialogTitle className="text-[16px] font-medium tracking-[-0.32px] text-[#181925]">
              Add Provider
            </DialogTitle>
            <DialogDescription className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
              Let AI analyze supplier documentation and prepare your provider configuration.
            </DialogDescription>

            <div className="mt-4 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((stepNumber, index) => {
                const isActive = wizardStep === stepNumber
                const isComplete = wizardStep > stepNumber

                return (
                  <div key={stepNumber} className="flex flex-1 items-center gap-2 last:flex-initial">
                    <div
                      className="flex size-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold tracking-[-0.32px] transition-colors"
                      style={{
                        borderColor: isActive || isComplete ? "#918DF6" : "rgba(0,0,0,0.08)",
                        backgroundColor: isActive || isComplete ? "#918DF6" : "white",
                        color: isActive || isComplete ? "white" : "#999999",
                      }}
                    >
                      {stepNumber}
                    </div>
                    {index < 4 ? (
                      <div
                        className="h-px flex-1 transition-colors"
                        style={{ backgroundColor: wizardStep > stepNumber ? "#918DF6" : "rgba(0,0,0,0.08)" }}
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          </DialogHeader>

          <div className="px-5 py-4">
            <div className="min-h-[420px] transition-all duration-300 ease-out">
              {wizardStep === 1 ? (
                <div className="flex flex-col gap-4">
                  <div className="inline-flex w-fit rounded-full bg-[rgba(145,141,246,0.08)] p-1">
                    <button
                      type="button"
                      onClick={() => setWizardMode("paste")}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-medium tracking-[-0.32px] transition-colors"
                      style={{
                        backgroundColor: wizardMode === "paste" ? "#918DF6" : "transparent",
                        color: wizardMode === "paste" ? "#FFFFFF" : "#666666",
                      }}
                    >
                      <FileText className="size-3.5" strokeWidth={2} />
                      Paste docs
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardMode("url")}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-medium tracking-[-0.32px] transition-colors"
                      style={{
                        backgroundColor: wizardMode === "url" ? "#918DF6" : "transparent",
                        color: wizardMode === "url" ? "#FFFFFF" : "#666666",
                      }}
                    >
                      <Globe className="size-3.5" strokeWidth={2} />
                      Enter URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardMode("auto")}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 text-[12px] font-medium tracking-[-0.32px] transition-colors"
                      style={{
                        backgroundColor: wizardMode === "auto" ? "#918DF6" : "transparent",
                        color: wizardMode === "auto" ? "#FFFFFF" : "#666666",
                      }}
                    >
                      <Search className="size-3.5" strokeWidth={2} />
                      Auto-detect
                    </button>
                  </div>

                  {wizardMode === "paste" ? (
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        API documentation
                      </label>
                      <div className="rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-3 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
                        <textarea
                          value={wizardDocsInput}
                          onChange={(event) => setWizardDocsInput(event.target.value)}
                          placeholder="Paste your supplier's API documentation here..."
                          className="h-64 w-full resize-none bg-transparent text-[13px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] tracking-[-0.32px] text-[#999999]">
                        <Upload className="size-3.5" strokeWidth={2} />
                        Raw text, JSON, or OpenAPI spec supported.
                      </div>
                    </div>
                  ) : wizardMode === "url" ? (
                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        Documentation URL
                      </label>
                      <div className="flex h-10 items-center rounded-xl border border-[rgba(0,0,0,0.1)] bg-white px-3 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
                        <LinkIcon className="mr-2 size-3.5 shrink-0 text-[#999999]" strokeWidth={2} />
                        <input
                          type="url"
                          value={wizardUrlInput}
                          onChange={(event) => setWizardUrlInput(event.target.value)}
                          placeholder="https://supplier.example.com/docs"
                          className="w-full bg-transparent text-[13px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                        />
                      </div>
                      <p className="mt-2 text-[11px] tracking-[-0.32px] text-[#999999]">
                        Paste a public documentation link and AI will inspect the provider setup.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-3 text-[12px] tracking-[-0.32px] text-[#666666]">
                        Select a known provider to auto-fill configuration and skip to review.
                      </p>
                      <div className="grid grid-cols-3 gap-2.5">
                        {AUTO_DETECT_PROVIDERS.map((ap) => (
                          <button
                            key={ap.id}
                            type="button"
                            onClick={() => handleAutoDetectSelect(ap.id)}
                            className="group flex flex-col items-center gap-2.5 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3 py-4 transition-all hover:border-[rgba(0,0,0,0.14)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                          >
                            <div
                              className="flex size-10 items-center justify-center rounded-xl text-[12px] font-bold tracking-[-0.32px] text-white"
                              style={{ backgroundColor: ap.color }}
                            >
                              {ap.badge}
                            </div>
                            <div className="text-center">
                              <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{ap.name}</p>
                              <p className="mt-0.5 text-[10px] tracking-[-0.32px] text-[#999999]">{ap.authType}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {wizardMode !== "auto" ? (
                    <div className="mt-auto flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleAnalyzeProvider}
                        disabled={!wizardHasInput}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-all"
                        style={{
                          backgroundColor: wizardHasInput ? "#918DF6" : "rgba(145,141,246,0.45)",
                          opacity: wizardHasInput ? 1 : 0.75,
                        }}
                      >
                        Analyze
                        <ArrowRight className="size-3.5" strokeWidth={2.1} />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {wizardStep === 2 ? (
                <div className="flex h-full flex-col gap-5">
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">AI Analysis</p>
                    <h3 className="mt-1 text-[20px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Building your provider configuration
                    </h3>
                    <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#666666]">
                      Simulating documentation parsing, endpoint discovery, and auth inference.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[rgba(145,141,246,0.12)] bg-[rgba(145,141,246,0.04)] p-4">
                    <div className="space-y-3">
                      {wizardAnalysisSteps.map((step, index) => {
                        const isDone = analysisCompletedSteps > index
                        const isCurrent = analysisCompletedSteps === index

                        return (
                          <div
                            key={step.label}
                            className="flex items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.05)] bg-white px-3 py-3 transition-all duration-300"
                          >
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[rgba(145,141,246,0.08)]">
                              {isDone ? (
                                <CheckCircle2 className="size-4 text-[#34A853]" strokeWidth={2.2} />
                              ) : (
                                <Loader2
                                  className={`size-4 text-[#918DF6] ${isCurrent ? "animate-spin" : "opacity-50"}`}
                                  strokeWidth={2.2}
                                />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{step.label}</p>
                            </div>
                            <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                              {isDone ? "Done" : isCurrent ? "Running" : "Queued"}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              {wizardStep === 3 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">Review Configuration</p>
                      <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                        AI-generated provider setup
                      </h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[rgba(52,168,83,0.1)] px-2.5 py-1 text-[11px] font-medium tracking-[-0.32px] text-[#34A853]">
                      High confidence
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        Provider Name
                      </label>
                      <input
                        type="text"
                        value={wizardConfig.name}
                        onChange={(event) => setWizardConfig((current) => ({ ...current, name: event.target.value }))}
                        className="h-8 w-full rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        API Base URL
                      </label>
                      <input
                        type="text"
                        value={wizardConfig.apiUrl}
                        onChange={(event) => setWizardConfig((current) => ({ ...current, apiUrl: event.target.value }))}
                        className="h-8 w-full rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        Auth Type
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(["API Key", "OAuth2", "Bearer Token"] as const).map((authType) => (
                          <button
                            key={authType}
                            type="button"
                            onClick={() => setWizardConfig((current) => ({ ...current, authType }))}
                            className="inline-flex h-8 items-center justify-center rounded-full px-3 text-[12px] font-medium tracking-[-0.32px] transition-colors"
                            style={{
                              backgroundColor: wizardConfig.authType === authType ? "#918DF6" : "rgba(0,0,0,0.04)",
                              color: wizardConfig.authType === authType ? "#FFFFFF" : "#666666",
                            }}
                          >
                            {authType}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        {wizardConfig.authType === "OAuth2" ? "API Key / Token" : "API Key / Token"}
                      </label>
                      <div className="flex h-8 items-center rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5">
                        <input
                          type={wizardShowSecret ? "text" : "password"}
                          value={wizardConfig.apiKey}
                          onChange={(event) => setWizardConfig((current) => ({ ...current, apiKey: event.target.value }))}
                          className="w-full bg-transparent text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setWizardShowSecret((current) => !current)}
                          className="ml-3 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                          aria-label={wizardShowSecret ? "Hide secret" : "Show secret"}
                        >
                          {wizardShowSecret ? (
                            <EyeOff className="size-3.5" strokeWidth={2} />
                          ) : (
                            <Eye className="size-3.5" strokeWidth={2} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        Rate Limit
                      </label>
                      <input
                        type="text"
                        value={wizardConfig.rateLimit}
                        onChange={(event) => setWizardConfig((current) => ({ ...current, rateLimit: event.target.value }))}
                        className="h-8 w-full rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                        Max Retries
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={wizardConfig.maxRetries}
                        onChange={(event) => setWizardConfig((current) => ({ ...current, maxRetries: event.target.value }))}
                        className="h-8 w-full rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(1)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.04)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.06)] hover:text-[#181925]"
                    >
                      <ArrowLeft className="size-3.5" strokeWidth={2.1} />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7f7ae6]"
                    >
                      Test Connection
                      <ArrowRight className="size-3.5" strokeWidth={2.1} />
                    </button>
                  </div>
                </div>
              ) : null}

              {wizardStep === 4 ? (
                <div className="flex h-full flex-col gap-4">
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">Test Connection</p>
                    <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Validating the generated provider config
                    </h3>
                  </div>

                  {!connectionTestComplete ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-[rgba(145,141,246,0.12)] bg-[rgba(145,141,246,0.04)] px-6 py-10 text-center">
                      <Loader2 className="size-8 animate-spin text-[#918DF6]" strokeWidth={2.2} />
                      <p className="mt-4 text-[15px] font-medium tracking-[-0.32px] text-[#181925]">Testing provider connection...</p>
                      <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                        Checking auth, base URL reachability, and endpoint compatibility.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[rgba(52,168,83,0.14)] bg-[rgba(52,168,83,0.05)] p-4">
                      <div className="flex items-center gap-2 text-[#34A853]">
                        <CheckCircle2 className="size-4" strokeWidth={2.2} />
                        <p className="text-[14px] font-semibold tracking-[-0.32px]">Connected successfully</p>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        {[
                          { label: "Response time", value: "340ms" },
                          { label: "API version", value: "v2.1" },
                          { label: "Available endpoints", value: "12" },
                        ].map((item) => (
                          <div key={item.label} className="rounded-xl border border-[rgba(0,0,0,0.06)] bg-white px-3 py-3">
                            <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{item.label}</p>
                            <p className="mt-1 text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(3)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.04)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.06)] hover:text-[#181925]"
                    >
                      <ArrowLeft className="size-3.5" strokeWidth={2.1} />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setWizardStep(5)}
                      disabled={!connectionTestComplete}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-all"
                      style={{
                        backgroundColor: connectionTestComplete ? "#918DF6" : "rgba(145,141,246,0.45)",
                        opacity: connectionTestComplete ? 1 : 0.75,
                      }}
                    >
                      Continue
                      <ArrowRight className="size-3.5" strokeWidth={2.1} />
                    </button>
                  </div>
                </div>
              ) : null}

              {wizardStep === 5 ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">Product Mapping</p>
                    <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                      Choose which products this provider should fulfill
                    </h3>
                    <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                      AI pre-mapped {wizardMappings.filter((mapping) => mapping.selected).length} of {wizardProducts.length} products.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-[rgba(0,0,0,0.08)]">
                    <div className="grid grid-cols-[44px_minmax(0,1.4fr)_minmax(0,1fr)_140px] gap-3 border-b border-[rgba(0,0,0,0.06)] bg-[#FAFAFA] px-3 py-2">
                      <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Map</span>
                      <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Product</span>
                      <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">External SKU</span>
                      <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Priority</span>
                    </div>

                    <div className="max-h-[320px] overflow-y-auto">
                      {wizardMappings.map((mapping) => (
                        <div
                          key={mapping.id}
                          className="grid grid-cols-[44px_minmax(0,1.4fr)_minmax(0,1fr)_140px] gap-3 border-b border-[rgba(0,0,0,0.06)] px-3 py-3 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => setWizardMappings((current) =>
                                current.map((item) => item.id === mapping.id ? { ...item, selected: !item.selected } : item),
                              )}
                              className="flex size-4 items-center justify-center rounded-[4px] border transition-colors"
                              style={{
                                borderColor: mapping.selected ? "#918DF6" : "rgba(0,0,0,0.12)",
                                backgroundColor: mapping.selected ? "#918DF6" : "transparent",
                              }}
                              aria-label={`Toggle ${mapping.productName}`}
                            >
                              {mapping.selected ? <Check className="size-3 text-white" strokeWidth={2.4} /> : null}
                            </button>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{mapping.productName}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[12px] tracking-[-0.32px] text-[#666666]">{mapping.externalSku}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map((priority) => (
                              <button
                                key={priority}
                                type="button"
                                onClick={() => setWizardMappings((current) =>
                                  current.map((item) =>
                                    item.id === mapping.id ? { ...item, priority: priority as 1 | 2 | 3 } : item,
                                  ),
                                )}
                                className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-medium tracking-[-0.32px] transition-colors"
                                style={{
                                  backgroundColor: mapping.priority === priority ? "#918DF6" : "rgba(0,0,0,0.04)",
                                  color: mapping.priority === priority ? "#FFFFFF" : "#666666",
                                }}
                              >
                                {priority}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setWizardStep(4)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.04)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.06)] hover:text-[#181925]"
                    >
                      <ArrowLeft className="size-3.5" strokeWidth={2.1} />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProvider}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7f7ae6]"
                    >
                      Save Provider
                      <ArrowRight className="size-3.5" strokeWidth={2.1} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={manualApiOpen} onOpenChange={(open) => {
        if (!open) resetManualApiDialog()
      }}>
        <DialogContent
          className={`${manualApiStep === 3 ? "sm:max-w-4xl" : "sm:max-w-[600px]"} max-h-[85vh] overflow-y-auto rounded-2xl border border-[rgba(0,0,0,0.08)] bg-white p-0`}
        >
          <DialogHeader className="border-b border-[rgba(0,0,0,0.08)] px-5 py-4">
            <DialogTitle className="text-[16px] font-medium tracking-[-0.32px] text-[#181925]">
              Manual API Integration
            </DialogTitle>
            <DialogDescription className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
              Configure a custom API endpoint and map response fields to your internal model.
            </DialogDescription>

            <div className="mt-4 flex items-center gap-2">
              {[1, 2, 3].map((stepNumber, index) => {
                const labels = ["API Config", "Response", "Mapping"]
                const isActive = manualApiStep === stepNumber
                const isComplete = manualApiStep > stepNumber

                return (
                  <div key={stepNumber} className="flex flex-1 items-center gap-2 last:flex-initial">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold tracking-[-0.32px] transition-colors"
                        style={{
                          borderColor: isActive || isComplete ? "#918DF6" : "rgba(0,0,0,0.08)",
                          backgroundColor: isActive || isComplete ? "#918DF6" : "white",
                          color: isActive || isComplete ? "white" : "#999999",
                        }}
                      >
                        {stepNumber}
                      </div>
                      <span
                        className="text-[11px] font-medium tracking-[-0.32px]"
                        style={{ color: isActive ? "#181925" : "#999999" }}
                      >
                        {labels[index]}
                      </span>
                    </div>
                    {index < 2 ? (
                      <div
                        className="h-px flex-1 transition-colors"
                        style={{ backgroundColor: manualApiStep > stepNumber ? "#918DF6" : "rgba(0,0,0,0.08)" }}
                      />
                    ) : null}
                  </div>
                )
              })}
            </div>
          </DialogHeader>

          <div className="px-5 py-4">
            {manualApiStep === 1 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-[rgba(0,0,0,0.08)] overflow-hidden">
                    {(["GET", "POST", "PUT"] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setManualApiMethod(method)}
                        className="h-8 px-3 text-[12px] font-semibold tracking-[-0.32px] transition-colors"
                        style={{
                          backgroundColor: manualApiMethod === method ? "#918DF6" : "transparent",
                          color: manualApiMethod === method ? "#FFFFFF" : "#666666",
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                  <div className="flex h-8 flex-1 items-center rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5">
                    <input
                      type="url"
                      value={manualApiUrl}
                      onChange={(e) => setManualApiUrl(e.target.value)}
                      placeholder="https://api.provider.com/v2/products"
                      className="w-full bg-transparent text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[12px] font-medium tracking-[-0.32px] text-[#666666]">Headers</label>
                    <button
                      type="button"
                      onClick={handleAddManualHeader}
                      className="inline-flex h-6 items-center gap-1 rounded-full bg-[rgba(0,0,0,0.03)] px-2 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.05)]"
                    >
                      <Plus className="size-3" strokeWidth={2.2} />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {manualApiHeaders.map((header) => (
                      <div key={header.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={header.key}
                          onChange={(e) => handleUpdateManualHeader(header.id, "key", e.target.value)}
                          placeholder="Key"
                          className="h-8 w-[140px] shrink-0 rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                        />
                        <input
                          type="text"
                          value={header.value}
                          onChange={(e) => handleUpdateManualHeader(header.id, "value", e.target.value)}
                          placeholder="Value"
                          className="h-8 flex-1 rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveManualHeader(header.id)}
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#999999] transition-colors hover:bg-[rgba(217,48,37,0.06)] hover:text-[#D93025]"
                          aria-label="Remove header"
                        >
                          <Trash2 className="size-3.5" strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    Authentication
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {([
                      { value: "none", label: "None" },
                      { value: "apikey", label: "API Key" },
                      { value: "bearer", label: "Bearer Token" },
                      { value: "basic", label: "Basic Auth" },
                    ] as const).map((auth) => (
                      <button
                        key={auth.value}
                        type="button"
                        onClick={() => setManualApiAuthType(auth.value)}
                        className="inline-flex h-7 items-center justify-center rounded-full px-3 text-[11px] font-medium tracking-[-0.32px] transition-colors"
                        style={{
                          backgroundColor: manualApiAuthType === auth.value ? "#918DF6" : "rgba(0,0,0,0.04)",
                          color: manualApiAuthType === auth.value ? "#FFFFFF" : "#666666",
                        }}
                      >
                        {auth.label}
                      </button>
                    ))}
                  </div>
                  {manualApiAuthType === "apikey" || manualApiAuthType === "bearer" ? (
                    <input
                      type="text"
                      value={manualApiAuthValue}
                      onChange={(e) => setManualApiAuthValue(e.target.value)}
                      placeholder={manualApiAuthType === "apikey" ? "Enter API key..." : "Enter bearer token..."}
                      className="mt-2 h-8 w-full rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                    />
                  ) : null}
                  {manualApiAuthType === "basic" ? (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={manualApiAuthUser}
                        onChange={(e) => setManualApiAuthUser(e.target.value)}
                        placeholder="Username"
                        className="h-8 flex-1 rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                      />
                      <input
                        type="password"
                        value={manualApiAuthValue}
                        onChange={(e) => setManualApiAuthValue(e.target.value)}
                        placeholder="Password"
                        className="h-8 flex-1 rounded-lg border border-[rgba(0,0,0,0.1)] bg-white px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                      />
                    </div>
                  ) : null}
                </div>

                {manualApiMethod !== "GET" ? (
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      Request Body
                    </label>
                    <textarea
                      value={manualApiBody}
                      onChange={(e) => setManualApiBody(e.target.value)}
                      placeholder='{"query": "product_keys", "limit": 25}'
                      className="h-24 w-full resize-none rounded-xl border border-[rgba(0,0,0,0.1)] bg-white p-3 font-mono text-[12px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
                    />
                  </div>
                ) : null}

                <div className="mt-auto flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleManualApiTest}
                    disabled={!manualApiUrl.trim() || manualApiTesting}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-all"
                    style={{
                      backgroundColor: manualApiUrl.trim() && !manualApiTesting ? "#918DF6" : "rgba(145,141,246,0.45)",
                      opacity: manualApiUrl.trim() && !manualApiTesting ? 1 : 0.75,
                    }}
                  >
                    {manualApiTesting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" strokeWidth={2.1} />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Send className="size-3.5" strokeWidth={2.1} />
                        Send Test Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : null}

            {manualApiStep === 2 ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">Response Preview</p>
                    <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                      API response received
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full bg-[rgba(52,168,83,0.1)] px-2.5 py-1 text-[11px] font-semibold tracking-[-0.32px] text-[#34A853]">
                    200 OK
                  </span>
                  <span className="text-[11px] tracking-[-0.32px] text-[#999999]">342ms</span>
                  <span className="text-[11px] tracking-[-0.32px] text-[#999999]">application/json</span>
                </div>

                <div className="max-h-[340px] overflow-auto rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#1E1E2E] p-4">
                  <pre className="text-[11px] leading-[1.6] text-[#CDD6F4]" style={{ fontFamily: "'Geist Mono', ui-monospace, Consolas, monospace" }}>
                    {renderJsonSyntax(MOCK_API_RESPONSE)}
                  </pre>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setManualApiStep(1)}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.04)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.06)] hover:text-[#181925]"
                  >
                    <ArrowLeft className="size-3.5" strokeWidth={2.1} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualApiStep(3)}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7f7ae6]"
                  >
                    Continue to Mapping
                    <ArrowRight className="size-3.5" strokeWidth={2.1} />
                  </button>
                </div>
              </div>
            ) : null}

            {manualApiStep === 3 ? (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#918DF6]">Step 3</p>
                  <h3 className="mt-1.5 text-[20px] font-semibold tracking-[-0.4px] text-[#181925]">
                    Response Mapping
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed tracking-[-0.2px] text-[#888888]">
                    Drag fields from the JSON tree onto model fields, or click to select and map. You can also set fixed string values.
                  </p>
                </div>

                <div className="grid grid-cols-[1fr_1fr] gap-5" style={{ minHeight: 420 }}>
                  <div className="flex flex-col rounded-xl border border-[rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] bg-gradient-to-b from-[#FAFAFA] to-[#F6F6F7] px-4 py-2.5">
                      <Code2 className="size-3.5 text-[#918DF6]" strokeWidth={2} />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-[#777777]">JSON Response</p>
                    </div>
                    <div className="flex-1 overflow-auto px-1 py-2" style={{ fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace" }}>
                      {(function renderTree(nodes: JsonNode[], depth: number): React.ReactNode {
                        return nodes.map((node) => {
                          const hasChildren = node.children && node.children.length > 0
                          const isExpanded = manualApiExpandedNodes.has(node.path)
                          const isSelected = manualApiSelectedPath === node.path
                          const isLeaf = !hasChildren

                          const typeColor = node.type === "string" ? "#34A853"
                            : node.type === "number" ? "#1A73E8"
                            : node.type === "boolean" ? "#E37400"
                            : node.type === "null" ? "#999999"
                            : "#918DF6"

                          const isMappedLeaf = isLeaf && manualApiMappings.some((m) => m.type === "path" && m.jsonPath === node.path)

                          return (
                            <div key={node.path} className="relative">
                              {depth > 0 ? (
                                <div
                                  className="absolute top-0 bottom-0 border-l border-[rgba(0,0,0,0.06)]"
                                  style={{ left: `${depth * 18 + 10}px` }}
                                />
                              ) : null}
                              <button
                                type="button"
                                draggable={isLeaf}
                                onDragStart={isLeaf ? (e) => {
                                  e.dataTransfer.setData("text/plain", node.path)
                                  e.dataTransfer.effectAllowed = "link"
                                  const target = e.currentTarget
                                  target.style.opacity = "0.5"
                                  const cleanup = () => { target.style.opacity = "1" }
                                  target.addEventListener("dragend", cleanup, { once: true })
                                } : undefined}
                                onClick={() => {
                                  if (hasChildren) handleToggleJsonNode(node.path)
                                  if (isLeaf) handleSelectJsonPath(node.path)
                                }}
                                className="group flex w-full items-center gap-1.5 rounded-lg px-2 py-[5px] text-left transition-all"
                                style={{
                                  paddingLeft: `${depth * 18 + 8}px`,
                                  backgroundColor: isSelected ? "rgba(145,141,246,0.1)" : undefined,
                                  cursor: isLeaf ? "grab" : "pointer",
                                }}
                              >
                                {hasChildren ? (
                                  isExpanded ? (
                                    <ChevronDown className="size-3 shrink-0 text-[#AAAAAA] transition-transform" strokeWidth={2} />
                                  ) : (
                                    <ChevronRight className="size-3 shrink-0 text-[#AAAAAA] transition-transform" strokeWidth={2} />
                                  )
                                ) : (
                                  <GripVertical className="size-3 shrink-0 text-[#CCCCCC] opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={2} />
                                )}

                                <span className="text-[11px] font-semibold tracking-[-0.2px] text-[#444444]">{node.key}</span>

                                {!hasChildren ? (
                                  <span className="mx-1 text-[10px] text-[#CCCCCC]">:</span>
                                ) : null}

                                {isLeaf ? (
                                  <span className="truncate text-[10px] font-medium tracking-[-0.2px]" style={{ color: typeColor }}>
                                    {node.type === "string" ? `"${String(node.value).slice(0, 28)}"` : String(node.value)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium tracking-[-0.2px] text-[#BBBBBB]">
                                    {node.type === "array" ? `[ ${node.children?.length ?? 0} ]` : `{ ${node.children?.length ?? 0} }`}
                                  </span>
                                )}

                                {isLeaf ? (
                                  <span
                                    className="ml-auto shrink-0 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-[0.5px]"
                                    style={{
                                      backgroundColor: isMappedLeaf ? "rgba(52,168,83,0.1)" : `${typeColor}11`,
                                      color: isMappedLeaf ? "#34A853" : typeColor,
                                    }}
                                  >
                                    {isMappedLeaf ? "mapped" : node.type}
                                  </span>
                                ) : null}
                              </button>
                              {hasChildren && isExpanded ? renderTree(node.children ?? [], depth + 1) : null}
                            </div>
                          )
                        })
                      })(jsonTree, 0)}
                    </div>
                  </div>

                  <div className="flex flex-col rounded-xl border border-[rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 border-b border-[rgba(0,0,0,0.06)] bg-gradient-to-b from-[#FAFAFA] to-[#F6F6F7] px-4 py-2.5">
                      <Package className="size-3.5 text-[#918DF6]" strokeWidth={2} />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.4px] text-[#777777]">Model Fields</p>
                      <span className="ml-auto rounded-full bg-[rgba(145,141,246,0.1)] px-2 py-0.5 text-[10px] font-semibold text-[#918DF6]">
                        {manualApiMappings.length}/{MODEL_FIELDS.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-auto p-3">
                      {manualApiSelectedPath ? (
                        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[rgba(145,141,246,0.2)] bg-[rgba(145,141,246,0.04)] px-3 py-2">
                          <GitBranch className="size-3 shrink-0 text-[#918DF6]" strokeWidth={2.2} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.4px] text-[#918DF6]">Selected path</p>
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {manualApiSelectedPath.split(/\.(?![^[]*\])/).map((segment, i) => (
                                <span
                                  key={`${segment}-${i}`}
                                  className="inline-flex items-center rounded bg-[rgba(145,141,246,0.12)] px-1.5 py-0.5 text-[10px] font-semibold tracking-[-0.2px] text-[#918DF6]"
                                  style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
                                >
                                  {segment}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setManualApiSelectedPath(null)}
                            className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[#918DF6] transition-colors hover:bg-[rgba(145,141,246,0.1)]"
                            aria-label="Clear selection"
                          >
                            <X className="size-3" strokeWidth={2.2} />
                          </button>
                        </div>
                      ) : null}

                      <div className="flex flex-col gap-2">
                        {MODEL_FIELDS.map((field) => {
                          const mapping = manualApiMappings.find((m) => m.targetField === field)
                          const isMapped = !!mapping && mapping.type === "path"
                          const isFixed = !!mapping && mapping.type === "fixed"
                          const isDragOver = dragOverField === field
                          const mode = fieldModes[field] ?? "path"

                          return (
                            <div
                              key={field}
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.dataTransfer.dropEffect = "link"
                                setDragOverField(field)
                              }}
                              onDragLeave={() => setDragOverField(null)}
                              onDrop={(e) => {
                                e.preventDefault()
                                const jsonPath = e.dataTransfer.getData("text/plain")
                                if (jsonPath) handleDropMapping(field, jsonPath)
                              }}
                              className="rounded-xl border-2 p-3 transition-all"
                              style={{
                                borderColor: isDragOver ? "#918DF6"
                                  : isMapped ? "rgba(52,168,83,0.25)"
                                  : isFixed ? "rgba(99,102,241,0.25)"
                                  : "rgba(0,0,0,0.06)",
                                backgroundColor: isDragOver ? "rgba(145,141,246,0.06)"
                                  : isMapped ? "rgba(52,168,83,0.03)"
                                  : isFixed ? "rgba(99,102,241,0.03)"
                                  : "transparent",
                                borderStyle: isDragOver ? "dashed" : "solid",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                                  style={{
                                    backgroundColor: isMapped ? "rgba(52,168,83,0.1)"
                                      : isFixed ? "rgba(99,102,241,0.1)"
                                      : "rgba(0,0,0,0.04)",
                                    color: isMapped ? "#34A853"
                                      : isFixed ? "#6366F1"
                                      : "#999999",
                                  }}
                                >
                                  {isMapped ? <CheckCircle2 className="size-3.5" strokeWidth={2.2} />
                                    : isFixed ? <Type className="size-3.5" strokeWidth={2.2} />
                                    : <span className="size-1.5 rounded-full bg-[#CCCCCC]" />}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-[12px] font-semibold tracking-[-0.3px] text-[#181925]">{field}</p>
                                </div>

                                {!isMapped && !isFixed ? (
                                  <div className="flex shrink-0 items-center rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-0.5">
                                    <button
                                      type="button"
                                      onClick={() => setFieldModes((prev) => ({ ...prev, [field]: "path" }))}
                                      className="rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-[-0.2px] transition-all"
                                      style={{
                                        backgroundColor: mode === "path" ? "white" : "transparent",
                                        color: mode === "path" ? "#918DF6" : "#999999",
                                        boxShadow: mode === "path" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                                      }}
                                    >
                                      Map
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setFieldModes((prev) => ({ ...prev, [field]: "fixed" }))}
                                      className="rounded-md px-2 py-0.5 text-[9px] font-semibold tracking-[-0.2px] transition-all"
                                      style={{
                                        backgroundColor: mode === "fixed" ? "white" : "transparent",
                                        color: mode === "fixed" ? "#6366F1" : "#999999",
                                        boxShadow: mode === "fixed" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                                      }}
                                    >
                                      Fixed
                                    </button>
                                  </div>
                                ) : null}

                                {isMapped || isFixed ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleRemoveMapping(field)
                                      setFieldModes((prev) => { const next = { ...prev }; delete next[field]; return next })
                                      setFixedValues((prev) => { const next = { ...prev }; delete next[field]; return next })
                                    }}
                                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-[#BBBBBB] transition-colors hover:bg-[rgba(217,48,37,0.06)] hover:text-[#D93025]"
                                    aria-label={`Remove ${field} mapping`}
                                  >
                                    <Trash2 className="size-3" strokeWidth={2} />
                                  </button>
                                ) : null}
                              </div>

                              {isMapped && mapping ? (
                                <div className="mt-2 flex items-center gap-1.5 pl-9">
                                  <GitBranch className="size-2.5 shrink-0 text-[#34A853]" strokeWidth={2.2} />
                                  <div className="flex flex-wrap gap-0.5">
                                    {mapping.jsonPath.split(/\.(?![^[]*\])/).map((seg, i) => (
                                      <span
                                        key={`${seg}-${i}`}
                                        className="inline-flex items-center rounded bg-[rgba(52,168,83,0.1)] px-1.5 py-0.5 text-[9px] font-semibold tracking-[-0.2px] text-[#34A853]"
                                        style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
                                      >
                                        {seg}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : null}

                              {isFixed && mapping ? (
                                <div className="mt-2 flex items-center gap-1.5 pl-9">
                                  <Type className="size-2.5 shrink-0 text-[#6366F1]" strokeWidth={2.2} />
                                  <span
                                    className="inline-flex items-center rounded bg-[rgba(99,102,241,0.1)] px-1.5 py-0.5 text-[9px] font-semibold tracking-[-0.2px] text-[#6366F1]"
                                    style={{ fontFamily: "'SF Mono', 'Fira Code', monospace" }}
                                  >
                                    &quot;{mapping.fixedValue}&quot;
                                  </span>
                                </div>
                              ) : null}

                              {!isMapped && !isFixed && mode === "path" ? (
                                <div className="mt-2 pl-9">
                                  {manualApiSelectedPath ? (
                                    <button
                                      type="button"
                                      onClick={() => handleAddMapping(field)}
                                      className="inline-flex h-6 items-center gap-1.5 rounded-full bg-[rgba(145,141,246,0.1)] px-2.5 text-[10px] font-semibold tracking-[-0.2px] text-[#918DF6] transition-colors hover:bg-[rgba(145,141,246,0.18)]"
                                    >
                                      <GitBranch className="size-2.5" strokeWidth={2.2} />
                                      Map selected path
                                    </button>
                                  ) : (
                                    <p className="text-[10px] tracking-[-0.2px] text-[#BBBBBB]">
                                      Select or drag a JSON field here
                                    </p>
                                  )}
                                </div>
                              ) : null}

                              {!isMapped && !isFixed && mode === "fixed" ? (
                                <div className="mt-2 flex items-center gap-2 pl-9">
                                  <input
                                    type="text"
                                    value={fixedValues[field] ?? ""}
                                    onChange={(e) => setFixedValues((prev) => ({ ...prev, [field]: e.target.value }))}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        const val = fixedValues[field]?.trim()
                                        if (val) handleAddFixedValue(field, val)
                                      }
                                    }}
                                    placeholder="Enter fixed value..."
                                    className="h-7 flex-1 rounded-lg border border-[rgba(99,102,241,0.2)] bg-[rgba(99,102,241,0.03)] px-2.5 text-[11px] tracking-[-0.2px] text-[#181925] outline-none transition-colors placeholder:text-[#BBBBBB] focus:border-[rgba(99,102,241,0.4)] focus:ring-1 focus:ring-[rgba(99,102,241,0.15)]"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const val = fixedValues[field]?.trim()
                                      if (val) handleAddFixedValue(field, val)
                                    }}
                                    disabled={!fixedValues[field]?.trim()}
                                    className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[10px] font-semibold tracking-[-0.2px] transition-colors"
                                    style={{
                                      backgroundColor: fixedValues[field]?.trim() ? "rgba(99,102,241,0.1)" : "rgba(0,0,0,0.03)",
                                      color: fixedValues[field]?.trim() ? "#6366F1" : "#BBBBBB",
                                    }}
                                  >
                                    <Check className="size-2.5" strokeWidth={2.5} />
                                    Set
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setManualApiStep(2)}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-[rgba(0,0,0,0.04)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.06)] hover:text-[#181925]"
                  >
                    <ArrowLeft className="size-3.5" strokeWidth={2.1} />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveManualProvider}
                    disabled={manualApiMappings.length === 0}
                    className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-all"
                    style={{
                      backgroundColor: manualApiMappings.length > 0 ? "#918DF6" : "rgba(145,141,246,0.45)",
                      opacity: manualApiMappings.length > 0 ? 1 : 0.75,
                    }}
                  >
                    Save Provider
                    <ArrowRight className="size-3.5" strokeWidth={2.1} />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
