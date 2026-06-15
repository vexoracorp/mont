import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  Database,
  Package,
  Search,
  ShoppingCart,
  Users,
  X,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type SearchCategory = "Orders" | "Products" | "Inventory" | "Customers"

type SearchItem = {
  id: string
  category: SearchCategory
  title: string
  subtitle: string
  status: string
  href: string
  keywords: string[]
  platform?: string
  customer?: string
  product?: string
}

type QuickLink = {
  label: string
  description: string
  href: string
}

type GroupedResults = {
  category: SearchCategory
  items: SearchItem[]
}

type GlobalSearchFilter = {
  field: string
  value: string
}

type GlobalSearchFieldConfig = {
  key: string
  label: string
  description: string
  example: string
  values?: string[]
}

type GlobalSearchSuggestion = {
  id: string
  kind: "field" | "value"
  label: string
  description: string
  example: string
  replacement: string
  fieldKey: string
  value?: string
}

const globalSearchFields: GlobalSearchFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    description: "Filter by item status",
    example: "status:delivered",
    values: ["Delivered", "Pending", "Flagged", "Refunded", "Active", "Draft", "Paused", "Archived", "Assigned", "In Stock", "Reserved", "Low Stock", "VIP", "Repeat"],
  },
  {
    key: "platform",
    label: "Platform",
    description: "Filter by sales platform",
    example: "platform:naver",
    values: ["Naver Store", "G2G", "G2A", "Website"],
  },
  {
    key: "customer",
    label: "Customer",
    description: "Search by customer name",
    example: "customer:Mina",
  },
  {
    key: "product",
    label: "Product",
    description: "Search by product name",
    example: "product:steam",
  },
  {
    key: "id",
    label: "ID",
    description: "Search by item ID",
    example: "id:ORD-1024",
  },
  {
    key: "category",
    label: "Category",
    description: "Filter by category",
    example: "category:orders",
    values: ["Orders", "Products", "Inventory", "Customers"],
  },
]

const globalSearchFieldMap = new Map(globalSearchFields.map((f) => [f.key, f]))

function gsNormalize(value: string) {
  return value.trim().toLowerCase()
}

function gsTokenize(query: string) {
  const tokens: string[] = []
  let current = ""
  let inQuotes = false

  for (const char of query) {
    if (char === '"') {
      inQuotes = !inQuotes
      current += char
      continue
    }
    if (/\s/.test(char) && !inQuotes) {
      if (current) {
        tokens.push(current)
        current = ""
      }
      continue
    }
    current += char
  }
  if (current) tokens.push(current)
  return tokens
}

function gsStripQuotes(value: string) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }
  return value
}

function gsQuoteIfNeeded(value: string) {
  return /\s/.test(value) ? `"${value}"` : value
}

function gsParseQuery(query: string): GlobalSearchFilter[] {
  return gsTokenize(query).map((token) => {
    const sepIdx = token.indexOf(":")
    if (sepIdx <= 0) return { field: "_text", value: gsStripQuotes(token) }

    const rawField = token.slice(0, sepIdx).toLowerCase()
    const rawValue = gsStripQuotes(token.slice(sepIdx + 1).trim())

    if (!globalSearchFieldMap.has(rawField) || !rawValue) {
      return { field: "_text", value: gsStripQuotes(token) }
    }
    return { field: rawField, value: rawValue }
  })
}

function gsFormatToken(filter: GlobalSearchFilter) {
  if (filter.field === "_text") return gsQuoteIfNeeded(filter.value)
  return `${filter.field}:${gsQuoteIfNeeded(filter.value)}`
}

function gsRebuildQuery(filters: GlobalSearchFilter[]) {
  return filters.map(gsFormatToken).join(" ")
}

function gsGetActiveTokenBounds(query: string) {
  const end = query.length
  let start = end
  while (start > 0 && !/\s/.test(query[start - 1])) {
    start -= 1
  }
  return { start, end, token: query.slice(start, end) }
}

function gsReplaceActiveToken(query: string, replacement: string) {
  const { start, end } = gsGetActiveTokenBounds(query)
  return `${query.slice(0, start)}${replacement}${query.slice(end)}`
}

function gsGetSuggestions(query: string): GlobalSearchSuggestion[] {
  const { token } = gsGetActiveTokenBounds(query)
  const tokenValue = token.trim()

  if (!tokenValue) {
    return globalSearchFields.map((field) => ({
      id: `field-${field.key}`,
      kind: "field",
      label: `${field.key}:`,
      description: field.description,
      example: field.example,
      replacement: `${field.key}:`,
      fieldKey: field.key,
    }))
  }

  const sepIdx = tokenValue.indexOf(":")
  if (sepIdx >= 0) {
    const fieldKey = tokenValue.slice(0, sepIdx).toLowerCase()
    const currentValue = gsStripQuotes(tokenValue.slice(sepIdx + 1))
    const field = globalSearchFieldMap.get(fieldKey)
    if (!field?.values) return []

    return field.values
      .filter((v) => gsNormalize(v).includes(gsNormalize(currentValue)))
      .map((v) => ({
        id: `value-${field.key}-${v}`,
        kind: "value",
        label: `${field.key}: ${v}`,
        description: field.description,
        example: field.example,
        replacement: `${field.key}:${gsQuoteIfNeeded(v)} `,
        fieldKey: field.key,
        value: v,
      }))
  }

  return globalSearchFields
    .filter((f) => f.key.includes(tokenValue.toLowerCase()) || f.label.toLowerCase().includes(tokenValue.toLowerCase()))
    .map((field) => ({
      id: `field-${field.key}`,
      kind: "field",
      label: `${field.key}:`,
      description: field.description,
      example: field.example,
      replacement: `${field.key}:`,
      fieldKey: field.key,
    }))
}

function gsIncludesNormalized(value: string | undefined, query: string) {
  if (!value) return false
  return gsNormalize(value).includes(gsNormalize(query))
}

function gsMatchesFilter(item: SearchItem, filter: GlobalSearchFilter) {
  const value = filter.value.trim()
  if (!value) return true

  switch (filter.field) {
    case "_text":
      return item.keywords.some((kw) => kw.toLowerCase().includes(gsNormalize(value)))
    case "status":
      return gsIncludesNormalized(item.status, value)
    case "platform":
      return gsIncludesNormalized(item.platform, value) || gsIncludesNormalized(item.subtitle, value)
    case "customer":
      return gsIncludesNormalized(item.customer, value) || gsIncludesNormalized(item.title, value) || gsIncludesNormalized(item.subtitle, value)
    case "product":
      return gsIncludesNormalized(item.product, value) || gsIncludesNormalized(item.title, value)
    case "id":
      return gsIncludesNormalized(item.id, value)
    case "category":
      return gsIncludesNormalized(item.category, value)
    default:
      return item.keywords.some((kw) => kw.toLowerCase().includes(gsNormalize(value)))
  }
}

function gsGetChipClasses(filter: GlobalSearchFilter) {
  if (filter.field === "status") {
    const v = gsNormalize(filter.value)
    if (["delivered", "active", "vip", "assigned"].some((s) => v.includes(s)))
      return "border-[#918DF6]/20 bg-[#918DF6]/10 text-[#6E69E8]"
    if (["flagged", "low stock", "paused"].some((s) => v.includes(s)))
      return "border-[#E37400]/20 bg-[#E37400]/10 text-[#E37400]"
    if (["refunded", "archived"].some((s) => v.includes(s)))
      return "border-[#D93025]/20 bg-[#D93025]/10 text-[#D93025]"
  }
  if (filter.field === "category") return "border-[#181925]/10 bg-[#181925]/5 text-[#181925]"
  return "border-[#918DF6]/15 bg-[#918DF6]/10 text-[#6E69E8]"
}

const searchItems: SearchItem[] = [
  { id: "ORD-1024", category: "Orders", title: "Windows 11 Pro Key", subtitle: "ORD-1024 \u00b7 Mina Kim \u00b7 Naver Store", status: "Delivered", href: "/dashboard/orders", keywords: ["ord-1024", "windows 11 pro key", "mina kim", "naver store", "delivered"], platform: "Naver Store", customer: "Mina Kim", product: "Windows 11 Pro Key" },
  { id: "ORD-1025", category: "Orders", title: "Steam Wallet 50,000 KRW", subtitle: "ORD-1025 \u00b7 Daniel Park \u00b7 G2G", status: "Pending", href: "/dashboard/orders", keywords: ["ord-1025", "steam wallet", "daniel park", "g2g", "pending"], platform: "G2G", customer: "Daniel Park", product: "Steam Wallet 50,000 KRW" },
  { id: "ORD-1026", category: "Orders", title: "Minecraft Java Edition", subtitle: "ORD-1026 \u00b7 Olivia Lee \u00b7 Website", status: "Refunded", href: "/dashboard/orders", keywords: ["ord-1026", "minecraft java edition", "olivia lee", "website", "refunded"], platform: "Website", customer: "Olivia Lee", product: "Minecraft Java Edition" },
  { id: "ORD-1027", category: "Orders", title: "Canva Pro 1 Year", subtitle: "ORD-1027 \u00b7 Ethan Choi \u00b7 G2A", status: "Delivered", href: "/dashboard/orders", keywords: ["ord-1027", "canva pro 1 year", "ethan choi", "g2a", "delivered"], platform: "G2A", customer: "Ethan Choi", product: "Canva Pro 1 Year" },
  { id: "ORD-1028", category: "Orders", title: "Adobe Creative Cloud", subtitle: "ORD-1028 \u00b7 Sophia Jung \u00b7 Naver Store", status: "Flagged", href: "/dashboard/orders", keywords: ["ord-1028", "adobe creative cloud", "sophia jung", "naver store", "flagged"], platform: "Naver Store", customer: "Sophia Jung", product: "Adobe Creative Cloud" },
  { id: "ORD-1029", category: "Orders", title: "ChatGPT Plus Voucher", subtitle: "ORD-1029 \u00b7 Lucas Han \u00b7 Website", status: "Delivered", href: "/dashboard/orders", keywords: ["ord-1029", "chatgpt plus voucher", "lucas han", "website", "delivered"], platform: "Website", customer: "Lucas Han", product: "ChatGPT Plus Voucher" },
  { id: "ORD-1030", category: "Orders", title: "PlayStation Plus Deluxe", subtitle: "ORD-1030 \u00b7 Grace Yoon \u00b7 G2G", status: "Pending", href: "/dashboard/orders", keywords: ["ord-1030", "playstation plus deluxe", "grace yoon", "g2g", "pending"], platform: "G2G", customer: "Grace Yoon", product: "PlayStation Plus Deluxe" },
  { id: "ORD-1031", category: "Orders", title: "Notion AI Annual", subtitle: "ORD-1031 \u00b7 Noah Seo \u00b7 Website", status: "Delivered", href: "/dashboard/orders", keywords: ["ord-1031", "notion ai annual", "noah seo", "website", "delivered"], platform: "Website", customer: "Noah Seo", product: "Notion AI Annual" },
  { id: "PRD-204", category: "Products", title: "Windows 11 Pro Key", subtitle: "PRD-204 \u00b7 Software \u00b7 \u20a939,000", status: "Active", href: "/dashboard/products", keywords: ["prd-204", "windows 11 pro key", "software", "39000", "active"], product: "Windows 11 Pro Key" },
  { id: "PRD-205", category: "Products", title: "Steam Wallet 50,000 KRW", subtitle: "PRD-205 \u00b7 Gift Card \u00b7 \u20a952,000", status: "Active", href: "/dashboard/products", keywords: ["prd-205", "steam wallet 50000 krw", "gift card", "52000", "active"], product: "Steam Wallet 50,000 KRW" },
  { id: "PRD-206", category: "Products", title: "Minecraft Java Edition", subtitle: "PRD-206 \u00b7 Game Key \u00b7 \u20a931,500", status: "Draft", href: "/dashboard/products", keywords: ["prd-206", "minecraft java edition", "game key", "31500", "draft"], product: "Minecraft Java Edition" },
  { id: "PRD-207", category: "Products", title: "Canva Pro 1 Year", subtitle: "PRD-207 \u00b7 Subscription \u00b7 \u20a968,000", status: "Active", href: "/dashboard/products", keywords: ["prd-207", "canva pro 1 year", "subscription", "68000", "active"], product: "Canva Pro 1 Year" },
  { id: "PRD-208", category: "Products", title: "Adobe Creative Cloud", subtitle: "PRD-208 \u00b7 Subscription \u00b7 \u20a989,000", status: "Paused", href: "/dashboard/products", keywords: ["prd-208", "adobe creative cloud", "subscription", "89000", "paused"], product: "Adobe Creative Cloud" },
  { id: "PRD-209", category: "Products", title: "ChatGPT Plus Voucher", subtitle: "PRD-209 \u00b7 AI Tool \u00b7 \u20a933,000", status: "Active", href: "/dashboard/products", keywords: ["prd-209", "chatgpt plus voucher", "ai tool", "33000", "active"], product: "ChatGPT Plus Voucher" },
  { id: "PRD-210", category: "Products", title: "PlayStation Plus Deluxe", subtitle: "PRD-210 \u00b7 Membership \u00b7 \u20a9108,000", status: "Archived", href: "/dashboard/products", keywords: ["prd-210", "playstation plus deluxe", "membership", "108000", "archived"], product: "PlayStation Plus Deluxe" },
  { id: "PRD-211", category: "Products", title: "Notion AI Annual", subtitle: "PRD-211 \u00b7 Productivity \u00b7 \u20a9120,000", status: "Active", href: "/dashboard/products", keywords: ["prd-211", "notion ai annual", "productivity", "120000", "active"], product: "Notion AI Annual" },
  { id: "INV-701", category: "Inventory", title: "Windows 11 Pro Key", subtitle: "INV-701 \u00b7 KC-W11-4P9X \u00b7 Delivered to Mina Kim", status: "Assigned", href: "/dashboard/inventory", keywords: ["inv-701", "windows 11 pro key", "kc-w11-4p9x", "assigned", "mina kim"], customer: "Mina Kim", product: "Windows 11 Pro Key" },
  { id: "INV-702", category: "Inventory", title: "Steam Wallet 50,000 KRW", subtitle: "INV-702 \u00b7 GC-ST-8L2M \u00b7 Undelivered", status: "In Stock", href: "/dashboard/inventory", keywords: ["inv-702", "steam wallet 50000 krw", "gc-st-8l2m", "in stock", "undelivered"], product: "Steam Wallet 50,000 KRW" },
  { id: "INV-703", category: "Inventory", title: "Minecraft Java Edition", subtitle: "INV-703 \u00b7 MC-JA-2Q7R \u00b7 Delivered to Olivia Lee", status: "Assigned", href: "/dashboard/inventory", keywords: ["inv-703", "minecraft java edition", "mc-ja-2q7r", "assigned", "olivia lee"], customer: "Olivia Lee", product: "Minecraft Java Edition" },
  { id: "INV-704", category: "Inventory", title: "Canva Pro 1 Year", subtitle: "INV-704 \u00b7 CV-PR-1K4T \u00b7 Reserved", status: "Reserved", href: "/dashboard/inventory", keywords: ["inv-704", "canva pro 1 year", "cv-pr-1k4t", "reserved"], product: "Canva Pro 1 Year" },
  { id: "INV-705", category: "Inventory", title: "Adobe Creative Cloud", subtitle: "INV-705 \u00b7 AD-CC-6N8P \u00b7 Delivered to Sophia Jung", status: "Assigned", href: "/dashboard/inventory", keywords: ["inv-705", "adobe creative cloud", "ad-cc-6n8p", "assigned", "sophia jung"], customer: "Sophia Jung", product: "Adobe Creative Cloud" },
  { id: "INV-706", category: "Inventory", title: "ChatGPT Plus Voucher", subtitle: "INV-706 \u00b7 GP-PL-3D6F \u00b7 Low stock", status: "Low Stock", href: "/dashboard/inventory", keywords: ["inv-706", "chatgpt plus voucher", "gp-pl-3d6f", "low stock"], product: "ChatGPT Plus Voucher" },
  { id: "INV-707", category: "Inventory", title: "PlayStation Plus Deluxe", subtitle: "INV-707 \u00b7 PS-DX-9A1B \u00b7 Delivered to Grace Yoon", status: "Assigned", href: "/dashboard/inventory", keywords: ["inv-707", "playstation plus deluxe", "ps-dx-9a1b", "assigned", "grace yoon"], customer: "Grace Yoon", product: "PlayStation Plus Deluxe" },
  { id: "INV-708", category: "Inventory", title: "Notion AI Annual", subtitle: "INV-708 \u00b7 NT-AI-5V3C \u00b7 In stock", status: "In Stock", href: "/dashboard/inventory", keywords: ["inv-708", "notion ai annual", "nt-ai-5v3c", "in stock"], product: "Notion AI Annual" },
  { id: "CUS-330", category: "Customers", title: "Mina Kim", subtitle: "mina@naver.com \u00b7 Naver Store \u00b7 14 orders", status: "VIP", href: "/dashboard/customers", keywords: ["cus-330", "mina kim", "mina@naver.com", "naver store", "14 orders", "vip"], platform: "Naver Store", customer: "Mina Kim" },
  { id: "CUS-331", category: "Customers", title: "Daniel Park", subtitle: "daniel@g2gmail.com \u00b7 G2G \u00b7 6 orders", status: "Active", href: "/dashboard/customers", keywords: ["cus-331", "daniel park", "daniel@g2gmail.com", "g2g", "6 orders", "active"], platform: "G2G", customer: "Daniel Park" },
  { id: "CUS-332", category: "Customers", title: "Olivia Lee", subtitle: "olivia@pixelmail.io \u00b7 Website \u00b7 9 orders", status: "Repeat", href: "/dashboard/customers", keywords: ["cus-332", "olivia lee", "olivia@pixelmail.io", "website", "9 orders", "repeat"], platform: "Website", customer: "Olivia Lee" },
  { id: "CUS-333", category: "Customers", title: "Ethan Choi", subtitle: "ethan@g2auser.com \u00b7 G2A \u00b7 3 orders", status: "Active", href: "/dashboard/customers", keywords: ["cus-333", "ethan choi", "ethan@g2auser.com", "g2a", "3 orders", "active"], platform: "G2A", customer: "Ethan Choi" },
  { id: "CUS-334", category: "Customers", title: "Sophia Jung", subtitle: "sophia@naver.com \u00b7 Naver Store \u00b7 12 orders", status: "VIP", href: "/dashboard/customers", keywords: ["cus-334", "sophia jung", "sophia@naver.com", "naver store", "12 orders", "vip"], platform: "Naver Store", customer: "Sophia Jung" },
  { id: "CUS-335", category: "Customers", title: "Lucas Han", subtitle: "lucas@devmail.app \u00b7 Website \u00b7 5 orders", status: "Active", href: "/dashboard/customers", keywords: ["cus-335", "lucas han", "lucas@devmail.app", "website", "5 orders", "active"], platform: "Website", customer: "Lucas Han" },
  { id: "CUS-336", category: "Customers", title: "Grace Yoon", subtitle: "grace@g2gmail.com \u00b7 G2G \u00b7 8 orders", status: "Repeat", href: "/dashboard/customers", keywords: ["cus-336", "grace yoon", "grace@g2gmail.com", "g2g", "8 orders", "repeat"], platform: "G2G", customer: "Grace Yoon" },
  { id: "CUS-337", category: "Customers", title: "Noah Seo", subtitle: "noah@creatorhub.io \u00b7 Website \u00b7 11 orders", status: "VIP", href: "/dashboard/customers", keywords: ["cus-337", "noah seo", "noah@creatorhub.io", "website", "11 orders", "vip"], platform: "Website", customer: "Noah Seo" },
]

const quickLinks: QuickLink[] = [
  { label: "Orders", description: "Review recent purchases and fulfillment", href: "/dashboard/orders" },
  { label: "Products", description: "Browse active listings and pricing", href: "/dashboard/products" },
  { label: "Inventory", description: "Track keys, stock, and assignments", href: "/dashboard/inventory" },
  { label: "Customers", description: "Open customer list and order history", href: "/dashboard/customers" },
]

const recentItems: SearchItem[] = [searchItems[0], searchItems[8], searchItems[16], searchItems[24]]

const categoryOrder: SearchCategory[] = ["Orders", "Products", "Inventory", "Customers"]

function getCategoryIcon(category: SearchCategory) {
  switch (category) {
    case "Orders":
      return ShoppingCart
    case "Products":
      return Package
    case "Inventory":
      return Database
    case "Customers":
      return Users
  }
}

function getStatusClasses(status: string) {
  if (status === "Delivered" || status === "Active" || status === "VIP" || status === "Assigned") {
    return "bg-[#918DF6]/10 text-[#918DF6]"
  }

  if (status === "Pending" || status === "Reserved" || status === "Repeat" || status === "In Stock") {
    return "bg-[rgba(0,0,0,0.04)] text-[#666666]"
  }

  if (status === "Flagged" || status === "Low Stock" || status === "Paused") {
    return "bg-[rgba(227,116,0,0.10)] text-[#E37400]"
  }

  return "bg-[rgba(0,0,0,0.04)] text-[#666666]"
}

export default function GlobalSearch() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [suggestionMode, setSuggestionMode] = useState(false)

  const filters = useMemo(() => gsParseQuery(query), [query])
  const structuredFilters = useMemo(() => filters.filter((f) => f.field !== "_text"), [filters])
  const hasStructuredFilters = structuredFilters.length > 0
  const hasQuery = query.trim().length > 0

  const suggestions = useMemo(() => {
    if (!suggestionMode || !query.trim()) return []
    return gsGetSuggestions(query)
  }, [suggestionMode, query])
  const showSuggestions = suggestions.length > 0

  const groupedResults = useMemo<GroupedResults[]>(() => {
    if (!hasQuery) return []

    return categoryOrder
      .map((category) => {
        const items = searchItems
          .filter((item) => item.category === category)
          .filter((item) => filters.every((f) => gsMatchesFilter(item, f)))
          .slice(0, 5)
        return { category, items }
      })
      .filter((group) => group.items.length > 0)
  }, [hasQuery, filters])

  const flatResults = useMemo(() => groupedResults.flatMap((group) => group.items), [groupedResults])

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setQuery("")
      setActiveIndex(0)
      setSuggestionIndex(0)
      setSuggestionMode(false)
    }
  }, [])

  const handleSelect = useCallback(
    (item: SearchItem) => {
      if (item.category === "Orders") {
        navigate(`/dashboard/orders?order=${item.id.replace("ORD-", "")}`)
      } else {
        navigate(item.href)
      }
      handleOpenChange(false)
    },
    [handleOpenChange, navigate]
  )

  const applySuggestion = useCallback((suggestion: GlobalSearchSuggestion) => {
    setQuery((current) => gsReplaceActiveToken(current, suggestion.replacement))
    setSuggestionMode(true)
    setSuggestionIndex(0)
    requestAnimationFrame(() => {
      inputRef.current?.focus()
    })
  }, [])

  const removeFilterChip = useCallback((filterToRemove: GlobalSearchFilter) => {
    const nextFilters = [...filters]
    const idx = nextFilters.findIndex(
      (f) => f.field === filterToRemove.field && f.value === filterToRemove.value,
    )
    if (idx === -1) return
    nextFilters.splice(idx, 1)
    setQuery(gsRebuildQuery(nextFilters))
  }, [filters])

  const handleInputKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape") {
        if (showSuggestions) {
          event.preventDefault()
          setSuggestionMode(false)
          return
        }
        event.preventDefault()
        handleOpenChange(false)
        return
      }

      if (showSuggestions) {
        if (event.key === "ArrowDown") {
          event.preventDefault()
          setSuggestionIndex((c) => (c + 1) % suggestions.length)
          return
        }
        if (event.key === "ArrowUp") {
          event.preventDefault()
          setSuggestionIndex((c) => (c - 1 + suggestions.length) % suggestions.length)
          return
        }
        if (event.key === "Enter" || event.key === "Tab") {
          event.preventDefault()
          const suggestion = suggestions[suggestionIndex]
          if (suggestion) applySuggestion(suggestion)
          return
        }
      }

      if (!flatResults.length) return

      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActiveIndex((c) => (c + 1) % flatResults.length)
        return
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setActiveIndex((c) => (c - 1 + flatResults.length) % flatResults.length)
        return
      }
      if (event.key === "Enter") {
        event.preventDefault()
        const activeItem = flatResults[activeIndex]
        if (activeItem) handleSelect(activeItem)
      }
    },
    [activeIndex, applySuggestion, flatResults, handleOpenChange, handleSelect, showSuggestions, suggestionIndex, suggestions]
  )

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((currentOpen) => {
          if (currentOpen) {
            setQuery("")
            setActiveIndex(0)
            setSuggestionIndex(0)
            setSuggestionMode(false)
          }
          return !currentOpen
        })
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  useEffect(() => {
    if (!open) return
    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    if (!showSuggestions) {
      setSuggestionIndex(0)
      return
    }
    setSuggestionIndex((c) => Math.min(c, suggestions.length - 1))
  }, [showSuggestions, suggestions])

  return (
    <>
      <button
        type="button"
        onClick={() => handleOpenChange(true)}
        className="flex h-9 min-w-[220px] items-center justify-between gap-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 py-1.5 text-left transition-colors hover:bg-[rgba(0,0,0,0.02)]"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Search className="size-4 text-[#999999]" strokeWidth={2} />
          <span className="truncate text-[14px] tracking-[-0.32px] text-[#666666]">Search...</span>
        </span>
        <kbd className="inline-flex h-6 items-center rounded-md border border-[rgba(0,0,0,0.08)] bg-[#F7F7F8] px-2 text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden border border-[rgba(0,0,0,0.08)] bg-white p-0 sm:max-w-[520px]"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Global Search</DialogTitle>
            <DialogDescription>Search orders, products, inventory, and customers.</DialogDescription>
          </DialogHeader>

          <div className="border-b border-[rgba(0,0,0,0.08)] px-4">
            <div className="flex items-center gap-3 py-3">
              <Search className="size-4 shrink-0 text-[#999999]" strokeWidth={2} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setSuggestionMode(true)
                  setSuggestionIndex(0)
                }}
                onFocus={() => setSuggestionMode(true)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search... Try status:delivered or platform:naver"
                className="h-11 w-full bg-transparent text-[16px] tracking-[-0.32px] text-[#181925] outline-none placeholder:text-[#999999]"
              />
            </div>

            {showSuggestions && (
              <div className="-mx-4 border-t border-[rgba(0,0,0,0.06)]">
                <div className="max-h-64 overflow-y-auto py-1.5">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySuggestion(suggestion)}
                      className={`flex w-full items-start justify-between gap-4 px-5 py-2.5 text-left transition-colors ${
                        index === suggestionIndex ? "bg-[#918DF6]/10" : "hover:bg-[rgba(0,0,0,0.03)]"
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                            {suggestion.label}
                          </span>
                          <span className="rounded-full bg-[rgba(0,0,0,0.05)] px-2 py-0.5 text-[11px] font-medium tracking-[-0.24px] text-[#666666]">
                            {suggestion.kind === "field" ? "Field" : "Value"}
                          </span>
                        </div>
                        <p className="text-[12px] tracking-[-0.24px] text-[#666666]">{suggestion.description}</p>
                      </div>
                      <span className="shrink-0 text-[12px] tracking-[-0.24px] text-[#999999]">{suggestion.example}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasStructuredFilters && (
              <div className="flex flex-wrap gap-1.5 pb-3">
                {structuredFilters.map((filter, index) => (
                  <button
                    key={`${filter.field}-${filter.value}-${index}`}
                    type="button"
                    onClick={() => removeFilterChip(filter)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium tracking-[-0.24px] transition-colors hover:opacity-80 ${gsGetChipClasses(filter)}`}
                  >
                    <span>{filter.field}: {filter.value}</span>
                    <X className="size-3" strokeWidth={2.4} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="max-h-[440px] overflow-y-auto px-2 py-2">
            {hasQuery ? (
              groupedResults.length > 0 ? (
                <div className="space-y-3">
                  {groupedResults.map((group) => (
                    <div key={group.category} className="space-y-1">
                      <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[-0.32px] text-[#999999]">
                        {group.category}
                      </p>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const itemIndex = flatResults.findIndex((result) => result.id === item.id)
                          const Icon = getCategoryIcon(item.category)
                          const isActive = itemIndex === activeIndex && !showSuggestions

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setActiveIndex(itemIndex)}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                                isActive
                                  ? "bg-[rgba(145,141,246,0.08)]"
                                  : "hover:bg-[rgba(0,0,0,0.03)]"
                              }`}
                            >
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,0,0,0.03)] text-[#666666]">
                                <Icon className="size-4" strokeWidth={2} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                                    {item.title}
                                  </p>
                                  <span
                                    className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[-0.32px] ${getStatusClasses(item.status)}`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                                <p className="truncate text-[12px] tracking-[-0.32px] text-[#666666]">
                                  {item.subtitle}
                                </p>
                              </div>
                              <ArrowRight className="size-4 shrink-0 text-[#999999]" strokeWidth={1.8} />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[240px] flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-[rgba(0,0,0,0.03)] text-[#999999]">
                    <Search className="size-5" strokeWidth={2} />
                  </div>
                  <p className="mt-4 text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                    No results found
                  </p>
                  <p className="mt-1 max-w-[260px] text-[13px] tracking-[-0.32px] text-[#666666]">
                    Try searching by order ID, product name, customer email, or key code.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-4 px-1 py-1">
                <div className="space-y-1">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[-0.32px] text-[#999999]">
                    Quick Links
                  </p>
                  <div className="space-y-1">
                    {quickLinks.map((link) => (
                      <button
                        key={link.href}
                        type="button"
                        onClick={() => {
                          setQuery(link.label)
                          setSuggestionMode(false)
                          inputRef.current?.focus()
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,0,0,0.03)] text-[#666666]">
                          <Search className="size-4" strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{link.label}</p>
                          <p className="truncate text-[12px] tracking-[-0.32px] text-[#666666]">{link.description}</p>
                        </div>
                        <ArrowRight className="size-4 shrink-0 text-[#999999]" strokeWidth={1.8} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[-0.32px] text-[#999999]">
                    Recent
                  </p>
                  <div className="space-y-1">
                    {recentItems.map((item) => {
                      const Icon = getCategoryIcon(item.category)

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,0,0,0.03)] text-[#666666]">
                            <Icon className="size-4" strokeWidth={2} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                                {item.title}
                              </p>
                              <span
                                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[-0.32px] ${getStatusClasses(item.status)}`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="truncate text-[12px] tracking-[-0.32px] text-[#666666]">{item.subtitle}</p>
                          </div>
                          <ArrowRight className="size-4 shrink-0 text-[#999999]" strokeWidth={1.8} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
