import { useState, useRef, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
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
  Pause,
  Trash2,
  ExternalLink,
  Tag,
  Plus,
  Eye,
  EyeOff,
  Ban,
  Send,
  Link as LinkIcon,
  FileText,
  ImageIcon,
  Download,
  CalendarDays,
  Globe,
  Activity,
} from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { DeliveryChannel, deliveryChannels } from "@/shared"
import type { Currency } from "@/shared"

export type InventoryStatus = "Available" | "Reserved" | "Delivered" | "Expired" | "Held" | "Deactivated"

export type ProductCategory = "Game Key" | "Gift Card" | "Subscription" | "Software"

export type DeliveryMethod = "Email" | "SMS" | "Telegram" | "WhatsApp"

export type KeyType = "key" | "link" | "file" | "image" | "subscription"

export type SubscriptionInfo = {
  subscriptionName: string
  plan: string
  price: string
  startDate: string
  endDate: string
}

export type InventoryItem = {
  id: string
  product: string
  keyCode: string
  keyType: KeyType
  keyFileName?: string
  subscription?: SubscriptionInfo
  deliveryCode: string
  status: InventoryStatus
  addedDate: string
  deliveredTo: string
  category: ProductCategory
  tags: string[]
  held: boolean
  deliveredDate?: string
  deliveryMethod?: DeliveryMethod
  deliveryTarget?: string
  deliveryExpires?: string
  deliveryExpired?: boolean
}

export const statusConfig: Record<InventoryStatus, { color: string; bg: string; icon: typeof Check }> = {
  Available: { color: "#34A853", bg: "rgba(52,168,83,0.08)", icon: Check },
  Reserved: { color: "#E37400", bg: "rgba(227,116,0,0.08)", icon: Clock },
  Delivered: { color: "#1A73E8", bg: "rgba(26,115,232,0.08)", icon: ArrowUpRight },
  Expired: { color: "#D93025", bg: "rgba(217,48,37,0.08)", icon: X },
  Held: { color: "#666666", bg: "rgba(102,102,102,0.08)", icon: Pause },
  Deactivated: { color: "#9CA3AF", bg: "rgba(156,163,175,0.08)", icon: Ban },
}

export const categoryConfig: Record<ProductCategory, { color: string; bg: string; icon: typeof Gamepad2 }> = {
  "Game Key": { color: "#918DF6", bg: "rgba(145,141,246,0.08)", icon: Gamepad2 },
  "Gift Card": { color: "#E37400", bg: "rgba(227,116,0,0.08)", icon: CreditCard },
  "Subscription": { color: "#1A73E8", bg: "rgba(26,115,232,0.08)", icon: RefreshCw },
  "Software": { color: "#34A853", bg: "rgba(52,168,83,0.08)", icon: Monitor },
}

export const initialInventory: InventoryItem[] = [
  { id: "INV001", product: "Steam Wallet $50 Gift Card", keyType: "key", keyCode: "5294-7183-6042-9517", deliveryCode: "STK04HMALNTK", status: "Delivered", addedDate: "Apr 20, 2026", deliveredTo: "Alex Turner", category: "Gift Card", tags: ["VIP", "priority"], held: false, deliveredDate: "2026-04-20T14:32:00Z", deliveryMethod: "Email", deliveryTarget: "alex.turner@gmail.com", deliveryExpires: "2026-05-20T14:32:00Z", deliveryExpired: false },
  { id: "INV002", product: "Steam Wallet $50 Gift Card", keyType: "key", keyCode: "8431-2057-9964-7182", deliveryCode: "", status: "Available", addedDate: "Apr 21, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV003", product: "Xbox Game Pass Ultimate 1M", keyType: "subscription", keyCode: "XGP9L2R7M5QA", subscription: { subscriptionName: "Xbox Game Pass Ultimate", plan: "1 Month", price: "$14.99", startDate: "Apr 18, 2026", endDate: "May 18, 2026" }, deliveryCode: "Q8N4V1K7P3LS", status: "Delivered", addedDate: "Apr 18, 2026", deliveredTo: "김수현", category: "Subscription", tags: ["bulk"], held: false, deliveredDate: "2026-04-18T09:15:00Z", deliveryMethod: "Telegram", deliveryTarget: "@suhyun_kim", deliveryExpires: "2026-05-18T09:15:00Z", deliveryExpired: false },
  { id: "INV004", product: "Xbox Game Pass Ultimate 1M", keyType: "key", keyCode: "XKT4P9Q2M7LD", deliveryCode: "", status: "Reserved", addedDate: "Apr 22, 2026", deliveredTo: "", category: "Subscription", tags: [], held: false },
  { id: "INV005", product: "PlayStation Plus Premium 3M", keyType: "key", keyCode: "PSP4N8V2K7HT", deliveryCode: "M6R2X9Q4L8PA", status: "Delivered", addedDate: "Apr 15, 2026", deliveredTo: "한지민", category: "Subscription", tags: ["promo"], held: false, deliveredDate: "2026-04-15T16:45:00Z", deliveryMethod: "SMS", deliveryTarget: "+82-10-8234-5678", deliveryExpires: "2026-05-15T16:45:00Z", deliveryExpired: false },
  { id: "INV006", product: "PlayStation Plus Premium 3M", keyType: "key", keyCode: "PSY8L3M6Q1RN", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Subscription", tags: [], held: false },
  { id: "INV007", product: "Netflix Gift Card $25", keyType: "key", keyCode: "6729-1438-5502-3461", deliveryCode: "", status: "Expired", addedDate: "Mar 10, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV008", product: "Netflix Gift Card $25", keyType: "key", keyCode: "9184-7762-1305-4890", deliveryCode: "", status: "Expired", addedDate: "Mar 12, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV009", product: "Elden Ring Shadow of the Erdtree", keyType: "key", keyCode: "4HK9N-T2VPL-8RWMX", deliveryCode: "H2K7M9R4V6QZ", status: "Delivered", addedDate: "Apr 19, 2026", deliveredTo: "James Kim", category: "Game Key", tags: ["VIP"], held: false, deliveredDate: "2026-04-19T11:20:00Z", deliveryMethod: "Email", deliveryTarget: "james.kim@outlook.com", deliveryExpires: "2026-05-19T11:20:00Z", deliveryExpired: false },
  { id: "INV010", product: "Elden Ring Shadow of the Erdtree", keyType: "key", keyCode: "J3Q8Z-L7N5C-H2T9P", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Game Key", tags: [], held: false },
  { id: "INV011", product: "Adobe Creative Cloud 1M", keyType: "link", keyCode: "https://redeem.adobe.com/code/F7N2Q9PV8WLX3HDJ", deliveryCode: "R5M8T2Q7L4NB", status: "Delivered", addedDate: "Apr 17, 2026", deliveredTo: "정하은", category: "Software", tags: ["priority"], held: false, deliveredDate: "2026-04-17T08:50:00Z", deliveryMethod: "WhatsApp", deliveryTarget: "+82-10-9123-4567", deliveryExpires: "2026-05-17T08:50:00Z", deliveryExpired: false },
  { id: "INV012", product: "Adobe Creative Cloud 1M", keyType: "link", keyCode: "https://redeem.adobe.com/code/K4M8R2TX7PQN5VLD", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software", tags: [], held: false },
  { id: "INV013", product: "Spotify Premium 6M", keyType: "subscription", keyCode: "SPT6M8KN4WPR", subscription: { subscriptionName: "Spotify Premium", plan: "6 Months", price: "$59.94", startDate: "Apr 16, 2026", endDate: "Oct 16, 2026" }, deliveryCode: "L9Q4V7M2X8HD", status: "Delivered", addedDate: "Apr 16, 2026", deliveredTo: "오준서", category: "Subscription", tags: ["bulk", "promo"], held: false, deliveredDate: "2026-04-16T13:10:00Z", deliveryMethod: "Telegram", deliveryTarget: "@junseo_oh", deliveryExpires: "2026-05-16T13:10:00Z", deliveryExpired: false },
  { id: "INV014", product: "Spotify Premium 6M", keyType: "key", keyCode: "SPT4N7Q2L8VX", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Subscription", tags: [], held: false },
  { id: "INV015", product: "Windows 11 Pro Key", keyType: "key", keyCode: "VK7JG-NPHTM-C97JM-9MPGT-3V66T", deliveryCode: "W3Q8N6M2L9PX", status: "Delivered", addedDate: "Apr 14, 2026", deliveredTo: "박민지", category: "Software", tags: [], held: false, deliveredDate: "2026-04-14T10:05:00Z", deliveryMethod: "Email", deliveryTarget: "minji_park@naver.com", deliveryExpires: "2026-05-14T10:05:00Z", deliveryExpired: false },
  { id: "INV016", product: "Windows 11 Pro Key", keyType: "key", keyCode: "Q9D8F-L2M7V-R4P3X-T6N8K-5W1HJ", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software", tags: [], held: false },
  { id: "INV017", product: "Windows 11 Pro Key", keyType: "key", keyCode: "R4M7K-N8P2V-X5L9Q-T3H6J-1W8DF", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software", tags: [], held: false },
  { id: "INV018", product: "Cyberpunk 2077 Ultimate Bundle", keyType: "key", keyCode: "P9D4A-3N7TX-K6WQ8", deliveryCode: "C8V2M6Q9L4RP", status: "Delivered", addedDate: "Apr 13, 2026", deliveredTo: "이서연", category: "Game Key", tags: ["VIP", "promo"], held: false, deliveredDate: "2026-04-13T15:30:00Z", deliveryMethod: "SMS", deliveryTarget: "+82-10-5567-8901", deliveryExpires: "2026-05-13T15:30:00Z", deliveryExpired: false },
  { id: "INV019", product: "Cyberpunk 2077 Ultimate Bundle", keyType: "key", keyCode: "R7H2M-K5Q9V-N4TLC", deliveryCode: "", status: "Available", addedDate: "Apr 22, 2026", deliveredTo: "", category: "Game Key", tags: [], held: false },
  { id: "INV020", product: "Microsoft 365 Family 1Y", keyType: "link", keyCode: "https://setup.office.com/redeem?code=Q5R8M3N6P2L7K4V", deliveryCode: "J7N4M2Q8L5TX", status: "Delivered", addedDate: "Apr 12, 2026", deliveredTo: "김나연", category: "Software", tags: [], held: false, deliveredDate: "2026-04-12T17:22:00Z", deliveryMethod: "WhatsApp", deliveryTarget: "+82-10-3345-6789", deliveryExpires: "2026-05-12T17:22:00Z", deliveryExpired: false },
  { id: "INV021", product: "Microsoft 365 Family 1Y", keyType: "link", keyCode: "https://setup.office.com/redeem?code=D8P4L9VQ2TH3M7R", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Software", tags: [], held: false },
  { id: "INV022", product: "Roblox Gift Card $25", keyType: "image", keyCode: "/assets/keys/roblox-gc-inv022.png", keyFileName: "roblox-gc-inv022.png", deliveryCode: "N4L8Q2V7M5HD", status: "Delivered", addedDate: "Apr 11, 2026", deliveredTo: "Emily Chen", category: "Gift Card", tags: ["bulk"], held: false, deliveredDate: "2026-04-11T12:40:00Z", deliveryMethod: "Email", deliveryTarget: "emily.chen@yahoo.com", deliveryExpires: "2026-05-11T12:40:00Z", deliveryExpired: false },
  { id: "INV023", product: "Roblox Gift Card $25", keyType: "key", keyCode: "4308-5921-7640-2187", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV024", product: "Roblox Gift Card $25", keyType: "key", keyCode: "6651-2048-9376-5813", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV025", product: "YouTube Premium 3M", keyType: "subscription", keyCode: "YTP8Q6M3R1LD", subscription: { subscriptionName: "YouTube Premium", plan: "3 Months", price: "$35.97", startDate: "Apr 10, 2026", endDate: "Jul 10, 2026" }, deliveryCode: "V2M9Q4L7N8PX", status: "Delivered", addedDate: "Apr 10, 2026", deliveredTo: "윤서아", category: "Subscription", tags: [], held: false, deliveredDate: "2026-04-10T09:55:00Z", deliveryMethod: "Telegram", deliveryTarget: "@seoa_yoon", deliveryExpires: "2026-05-10T09:55:00Z", deliveryExpired: false },
  { id: "INV026", product: "YouTube Premium 3M", keyType: "key", keyCode: "YTP4L8N2Q7MV", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Subscription", tags: [], held: false },
  { id: "INV027", product: "Monster Hunter Wilds", keyType: "file", keyCode: "/assets/keys/mhw-license-inv027.pdf", keyFileName: "mhw-license-inv027.pdf", deliveryCode: "K5M8Q2V7L4NT", status: "Delivered", addedDate: "Apr 9, 2026", deliveredTo: "Brandon Lee", category: "Game Key", tags: [], held: false, deliveredDate: "2026-04-09T14:18:00Z", deliveryMethod: "SMS", deliveryTarget: "+1-213-555-0147", deliveryExpires: "2026-05-09T14:18:00Z", deliveryExpired: false },
  { id: "INV028", product: "Monster Hunter Wilds", keyType: "key", keyCode: "8F3WQ-N6L2P-V9R5K", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Game Key", tags: [], held: false },
  { id: "INV029", product: "Steam Wallet $50 Gift Card", keyType: "image", keyCode: "/assets/keys/steam-gc-inv029.png", keyFileName: "steam-gc-inv029.png", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV030", product: "Steam Wallet $50 Gift Card", keyType: "key", keyCode: "7083-1956-4270-8641", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV031", product: "Xbox Game Pass Ultimate 1M", keyType: "key", keyCode: "XQ4N7L2M8VPA", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Subscription", tags: [], held: false },
  { id: "INV032", product: "Elden Ring Shadow of the Erdtree", keyType: "key", keyCode: "2ZP6C-J8X4M-T7QHN", deliveryCode: "", status: "Expired", addedDate: "Mar 5, 2026", deliveredTo: "", category: "Game Key", tags: [], held: false },
  { id: "INV033", product: "Spotify Premium 6M", keyType: "key", keyCode: "SPT8N2V5Q7LR", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Subscription", tags: [], held: false },
  { id: "INV034", product: "Adobe Creative Cloud 1M", keyType: "file", keyCode: "/assets/keys/adobe-cc-inv034.pdf", keyFileName: "adobe-cc-license-inv034.pdf", deliveryCode: "T6Q9M2R7L5HD", status: "Delivered", addedDate: "Apr 8, 2026", deliveredTo: "송유진", category: "Software", tags: [], held: false, deliveredDate: "2026-04-08T11:35:00Z", deliveryMethod: "Email", deliveryTarget: "yujin_song@gmail.com", deliveryExpires: "2026-05-08T11:35:00Z", deliveryExpired: false },
  { id: "INV035", product: "Windows 11 Pro Key", keyType: "key", keyCode: "H7N2Q-L9M4V-P3X8R-T6K1J-5W9FD", deliveryCode: "", status: "Available", addedDate: "Apr 24, 2026", deliveredTo: "", category: "Software", tags: [], held: false },
  { id: "INV036", product: "PlayStation Plus Premium 3M", keyType: "key", keyCode: "PSP9K4M7Q2VL", deliveryCode: "G8M2Q6L9V4NX", status: "Delivered", addedDate: "Apr 7, 2026", deliveredTo: "David Park", category: "Subscription", tags: [], held: false, deliveredDate: "2026-04-07T16:02:00Z", deliveryMethod: "WhatsApp", deliveryTarget: "+1-415-555-0238", deliveryExpires: "2026-05-07T16:02:00Z", deliveryExpired: false },
  { id: "INV037", product: "Cyberpunk 2077 Ultimate Bundle", keyType: "key", keyCode: "T5Q8M2L7V9PX", deliveryCode: "", status: "Available", addedDate: "Apr 23, 2026", deliveredTo: "", category: "Game Key", tags: [], held: false },
  { id: "INV038", product: "Microsoft 365 Family 1Y", keyType: "link", keyCode: "https://setup.office.com/redeem?code=P8V4M7Q2L9TX", deliveryCode: "", status: "Reserved", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Software", tags: [], held: false },
  { id: "INV039", product: "Netflix Gift Card $25", keyType: "key", keyCode: "1298-4075-6631-2584", deliveryCode: "", status: "Expired", addedDate: "Feb 28, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
  { id: "INV040", product: "Roblox Gift Card $25", keyType: "key", keyCode: "9513-6248-1705-4932", deliveryCode: "", status: "Available", addedDate: "Apr 25, 2026", deliveredTo: "", category: "Gift Card", tags: [], held: false },
]

export type AccessLogEntry = {
  timestamp: string
  event: "Viewed" | "Redeemed" | "Expired Access"
  ip: string
  location: string
  userAgent: string
  userAgentShort: string
  isFirstAccess?: boolean
}

export const accessLogs: Record<string, AccessLogEntry[]> = {
  STK04HMALNTK: [
    { timestamp: "2026-04-20T14:35:00Z", event: "Viewed", ip: "103.22.148.67", location: "Seoul, South Korea", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / macOS", isFirstAccess: true },
    { timestamp: "2026-04-20T14:36:00Z", event: "Redeemed", ip: "103.22.148.67", location: "Seoul, South Korea", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / macOS" },
    { timestamp: "2026-04-21T09:12:00Z", event: "Viewed", ip: "103.22.148.67", location: "Seoul, South Korea", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1", userAgentShort: "Safari 17.4 / iOS" },
  ],
  Q8N4V1K7P3LS: [
    { timestamp: "2026-04-18T09:20:00Z", event: "Viewed", ip: "211.234.97.12", location: "Busan, South Korea", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / Windows", isFirstAccess: true },
    { timestamp: "2026-04-18T09:21:00Z", event: "Redeemed", ip: "211.234.97.12", location: "Busan, South Korea", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / Windows" },
    { timestamp: "2026-04-19T15:44:00Z", event: "Viewed", ip: "211.234.97.12", location: "Busan, South Korea", userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36", userAgentShort: "Chrome 124 / Android" },
    { timestamp: "2026-04-22T03:18:00Z", event: "Expired Access", ip: "45.89.174.201", location: "Moscow, Russia", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0", userAgentShort: "Firefox 125 / Windows" },
  ],
  M6R2X9Q4L8PA: [
    { timestamp: "2026-04-15T16:50:00Z", event: "Viewed", ip: "175.196.43.88", location: "Seoul, South Korea", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1", userAgentShort: "Safari 17.4 / iOS", isFirstAccess: true },
    { timestamp: "2026-04-15T16:52:00Z", event: "Redeemed", ip: "175.196.43.88", location: "Seoul, South Korea", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1", userAgentShort: "Safari 17.4 / iOS" },
    { timestamp: "2026-04-16T11:30:00Z", event: "Viewed", ip: "175.196.43.88", location: "Seoul, South Korea", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / macOS" },
  ],
  H2K7M9R4V6QZ: [
    { timestamp: "2026-04-19T11:25:00Z", event: "Viewed", ip: "68.142.201.34", location: "Los Angeles, USA", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / macOS", isFirstAccess: true },
    { timestamp: "2026-04-19T11:27:00Z", event: "Redeemed", ip: "68.142.201.34", location: "Los Angeles, USA", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / macOS" },
    { timestamp: "2026-04-20T08:15:00Z", event: "Viewed", ip: "68.142.201.34", location: "Los Angeles, USA", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / Windows" },
    { timestamp: "2026-04-23T19:42:00Z", event: "Expired Access", ip: "91.207.55.18", location: "Kyiv, Ukraine", userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36", userAgentShort: "Chrome 123 / Linux" },
  ],
  R5M8T2Q7L4NB: [
    { timestamp: "2026-04-17T08:55:00Z", event: "Viewed", ip: "121.167.82.45", location: "Incheon, South Korea", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / Windows", isFirstAccess: true },
    { timestamp: "2026-04-17T08:58:00Z", event: "Viewed", ip: "121.167.82.45", location: "Incheon, South Korea", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / Windows" },
    { timestamp: "2026-04-17T09:01:00Z", event: "Redeemed", ip: "121.167.82.45", location: "Incheon, South Korea", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", userAgentShort: "Chrome 124 / Windows" },
  ],
}

export function maskKey(key: string): string {
  if (key.length <= 8) return key
  return `${key.slice(0, 4)}••••${key.slice(-4)}`
}

export function getRelativeTime(dateStr: string): string {
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

export function getExpirationInfo(expiresStr?: string, isExpired?: boolean): { label: string; isActive: boolean; daysLeft: number } {
  if (isExpired) return { label: "Expired", isActive: false, daysLeft: 0 }
  if (!expiresStr) return { label: "No expiration", isActive: true, daysLeft: 0 }
  const now = new Date("2026-04-26T12:00:00Z")
  const expires = new Date(expiresStr)
  const diffMs = expires.getTime() - now.getTime()
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (daysLeft <= 0) return { label: "Expired", isActive: false, daysLeft: 0 }
  return { label: `Expires in ${daysLeft}d`, isActive: true, daysLeft }
}

export function formatDeliveryDate(isoStr?: string): string {
  if (!isoStr) return "—"
  const d = new Date(isoStr)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function getAvailableByProduct(items: InventoryItem[]): { product: string; available: number; total: number }[] {
  const map = new Map<string, { available: number; total: number }>()
  for (const item of items) {
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

  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ type: "delete" | "hold" | "unhold" | "deactivate" | "reactivate" | "deliveryExpired"; item: InventoryItem } | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [showKeyCode, setShowKeyCode] = useState(false)
const [inventoryDetailTab, setInventoryDetailTab] = useState<"details" | "activity">("details")

  const uniqueProducts = Array.from(new Set(inventory.map((i) => i.product))).sort()
  const lowStockProducts = getAvailableByProduct(inventory)

  const handleCopyKey = (id: string, key: string) => {
    void navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleDelete = (item: InventoryItem) => {
    setInventory((prev) => prev.filter((i) => i.id !== item.id))
    if (selectedItem?.id === item.id) setSelectedItem(null)
    setConfirmAction(null)
  }

  const handleToggleHold = (item: InventoryItem) => {
    const isHeld = item.status === "Held"
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: isHeld ? "Available" as InventoryStatus : "Held" as InventoryStatus, held: !isHeld }
          : i,
      ),
    )
    if (selectedItem?.id === item.id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, status: isHeld ? "Available" : "Held", held: !isHeld } : null,
      )
    }
    setConfirmAction(null)
  }

  const handleToggleDeactivate = (item: InventoryItem) => {
    const isDeactivated = item.status === "Deactivated"
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: (isDeactivated ? "Available" : "Deactivated") as InventoryStatus }
          : i,
      ),
    )
    if (selectedItem?.id === item.id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, status: isDeactivated ? "Available" : "Deactivated" } : null,
      )
    }
    setConfirmAction(null)
  }

  const handleExpireDelivery = (item: InventoryItem) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, deliveryExpired: true, deliveryCode: "" }
          : i,
      ),
    )
    if (selectedItem?.id === item.id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, deliveryExpired: true, deliveryCode: "" } : null,
      )
    }
    setConfirmAction(null)
  }

  const handleAddTag = (itemId: string, tag: string) => {
    const trimmed = tag.trim()
    if (!trimmed) return
    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId && !i.tags.includes(trimmed)
          ? { ...i, tags: [...i.tags, trimmed] }
          : i,
      ),
    )
    if (selectedItem?.id === itemId) {
      setSelectedItem((prev) =>
        prev && !prev.tags.includes(trimmed) ? { ...prev, tags: [...prev.tags, trimmed] } : prev,
      )
    }
    setTagInput("")
  }

  const handleRemoveTag = (itemId: string, tag: string) => {
    setInventory((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, tags: i.tags.filter((t) => t !== tag) } : i,
      ),
    )
    if (selectedItem?.id === itemId) {
      setSelectedItem((prev) =>
        prev ? { ...prev, tags: prev.tags.filter((t) => t !== tag) } : prev,
      )
    }
  }

  const filtered = inventory.filter((item) => {
    if (statusFilter !== "All" && item.status !== statusFilter) return false
    if (productFilter !== "All" && item.product !== productFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        item.id.toLowerCase().includes(q) ||
        item.product.toLowerCase().includes(q) ||
        item.keyCode.toLowerCase().includes(q) ||
        item.deliveredTo.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
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
    total: inventory.length,
    available: inventory.filter((i) => i.status === "Available").length,
    reserved: inventory.filter((i) => i.status === "Reserved").length,
    delivered: inventory.filter((i) => i.status === "Delivered").length,
    expired: inventory.filter((i) => i.status === "Expired").length,
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
                <option>Held</option>
                <option>Deactivated</option>
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
                placeholder="Search by ID, product, key, customer, tag..."
                className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-[#FAFAFA]">
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th className="px-5 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Product</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Key / Asset</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Status</th>
                  <th className="px-3 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Added</th>
                  <th className="min-w-[220px] px-5 py-2.5 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Delivered to</th>
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
                      className="group cursor-pointer border-b border-[rgba(0,0,0,0.05)] transition-colors hover:bg-[rgba(145,141,246,0.04)]"
                      style={{
                        backgroundColor: idx % 2 === 1 ? "rgba(0,0,0,0.015)" : undefined,
                      }}
                      onClick={() => setSelectedItem(item)}
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
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-[11px] font-medium tracking-[-0.32px]"
                                style={{ color: cc.color }}
                              >
                                {item.category}
                              </span>
                              {item.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {item.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center rounded-full bg-[rgba(145,141,246,0.08)] px-1.5 py-0.5 text-[10px] font-medium tracking-[-0.32px] text-[#918DF6]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {item.tags.length > 2 && (
                                    <span className="text-[10px] font-medium text-[#999999]">
                                      +{item.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          {item.keyType === "key" && (
                            <>
                              <span className="font-mono text-[13px] tracking-[0.5px] text-[#666666]">
                                {maskKey(item.keyCode)}
                              </span>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleCopyKey(item.id, item.keyCode) }}
                                className="flex size-6 shrink-0 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 hover:bg-[rgba(0,0,0,0.06)]"
                                title="Copy full key"
                              >
                                {isCopied ? (
                                  <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                                ) : (
                                  <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                                )}
                              </button>
                            </>
                          )}
                          {item.keyType === "link" && (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1A73E8]">
                              <LinkIcon className="size-3.5" strokeWidth={2} />
                              Redemption Link
                            </span>
                          )}
                          {item.keyType === "file" && (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#666666]">
                              <FileText className="size-3.5" strokeWidth={2} />
                              {item.keyFileName || "File"}
                            </span>
                          )}
                          {item.keyType === "image" && (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#666666]">
                              <ImageIcon className="size-3.5" strokeWidth={2} />
                              {item.keyFileName || "Image"}
                            </span>
                          )}
                          {item.keyType === "subscription" && (
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1A73E8]">
                              <RefreshCw className="size-3.5" strokeWidth={2} />
                              {item.subscription?.plan || "Subscription"}
                            </span>
                          )}
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
                          <div className="flex items-center gap-2.5">
                            <span
                              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                              style={{ backgroundColor: sc.color }}
                            >
                              {item.deliveredTo.charAt(0)}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                                  {item.deliveredTo}
                                </span>
                                {item.deliveryMethod && (
                                  <span
                                    className="inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium tracking-[-0.32px]"
                                    style={{
                                      backgroundColor: deliveryChannels[item.deliveryMethod]?.bg,
                                      color: deliveryChannels[item.deliveryMethod]?.color,
                                    }}
                                  >
                                    <Send className="size-2.5" strokeWidth={2.5} />
                                    {item.deliveryMethod}
                                  </span>
                                )}
                              </div>
                              {item.deliveredDate && (
                                <span className="text-[11px] tracking-[-0.32px] text-[#999999]">
                                  {getRelativeTime(item.deliveredDate)}
                                </span>
                              )}
                            </div>
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

      {/* Detail Modal */}
      <Dialog open={selectedItem !== null && confirmAction === null} onOpenChange={(open: boolean) => { if (!open) { setSelectedItem(null); setTagInput(""); setShowKeyCode(false); setInventoryDetailTab("details") } }}>
        {selectedItem && (
          <DialogContent className="sm:max-w-lg" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                {selectedItem.product}
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                {selectedItem.id} · {selectedItem.category}
              </DialogDescription>
            </DialogHeader>

            {selectedItem.status === "Delivered" && selectedItem.deliveryCode && accessLogs[selectedItem.deliveryCode] && (
              <div className="flex items-center gap-1 border-b border-[rgba(0,0,0,0.08)] pb-0">
                {([{ value: "details", label: "Details" }, { value: "activity", label: "Activity" }] as const).map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setInventoryDetailTab(tab.value)}
                    className={`relative px-3 py-2 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                      inventoryDetailTab === tab.value
                        ? "text-[#918DF6]"
                        : "text-[#999999] hover:text-[#666666]"
                    }`}
                  >
                    {tab.label}
                    {inventoryDetailTab === tab.value && (
                      <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[#918DF6]" />
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {inventoryDetailTab === "details" && (<>
              {/* Status & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Status</p>
                  <div className="mt-1">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                      style={{ backgroundColor: statusConfig[selectedItem.status].bg, color: statusConfig[selectedItem.status].color }}
                    >
                      {(() => { const SI = statusConfig[selectedItem.status].icon; return <SI className="size-3" strokeWidth={2.5} /> })()}
                      {selectedItem.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Added</p>
                  <p className="mt-1 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedItem.addedDate}</p>
                </div>
              </div>

              <div className="h-px bg-[rgba(0,0,0,0.08)]" />

              {/* Key & Delivery */}
              <div>
                <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Key Details</p>
                <div className="mt-2 grid grid-cols-1 gap-y-2.5">
                  <div>
                    {selectedItem.keyType === "key" && (
                      <>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Key Code</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="font-mono text-[13px] font-semibold tracking-[0.5px] text-[#181925]">
                            {showKeyCode ? selectedItem.keyCode : maskKey(selectedItem.keyCode)}
                          </p>
                          <button
                            onClick={() => setShowKeyCode((v) => !v)}
                            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                            title={showKeyCode ? "Hide key" : "Reveal key"}
                          >
                            {showKeyCode ? (
                              <EyeOff className="size-3.5 text-[#999999]" strokeWidth={2} />
                            ) : (
                              <Eye className="size-3.5 text-[#999999]" strokeWidth={2} />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopyKey(selectedItem.id, selectedItem.keyCode)}
                            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                            title="Copy full key"
                          >
                            {copiedId === selectedItem.id ? (
                              <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                            ) : (
                              <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                    {selectedItem.keyType === "link" && (
                      <>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Redemption Link</p>
                        <div className="mt-1 flex items-center gap-2">
                          <a
                            href={selectedItem.keyCode}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(26,115,232,0.2)] bg-[rgba(26,115,232,0.04)] px-3 py-1.5 text-[12px] font-medium text-[#1A73E8] transition-colors hover:bg-[rgba(26,115,232,0.08)]"
                          >
                            <ExternalLink className="size-3.5" strokeWidth={2} />
                            Open Link
                          </a>
                          <button
                            onClick={() => handleCopyKey(selectedItem.id, selectedItem.keyCode)}
                            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                            title="Copy link"
                          >
                            {copiedId === selectedItem.id ? (
                              <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                            ) : (
                              <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                        <p className="mt-1 truncate text-[11px] tracking-[-0.32px] text-[#999999]">{selectedItem.keyCode}</p>
                      </>
                    )}
                    {selectedItem.keyType === "file" && (
                      <>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">License File</p>
                        <div className="mt-1 flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-3 py-2">
                          <FileText className="size-4 shrink-0 text-[#666666]" strokeWidth={2} />
                          <span className="min-w-0 truncate text-[12px] font-medium tracking-[-0.32px] text-[#181925]">
                            {selectedItem.keyFileName || "license-file"}
                          </span>
                          <button
                            onClick={() => handleCopyKey(selectedItem.id, selectedItem.keyCode)}
                            className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                            title="Copy file path"
                          >
                            {copiedId === selectedItem.id ? (
                              <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                            ) : (
                              <Download className="size-3.5 text-[#999999]" strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </>
                    )}
                    {selectedItem.keyType === "image" && (
                      <>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Key Image</p>
                        <div className="mt-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-2">
                          <div className="flex aspect-[16/9] items-center justify-center rounded-md bg-[rgba(0,0,0,0.04)]">
                            <div className="flex flex-col items-center gap-1.5 text-[#999999]">
                              <ImageIcon className="size-6" strokeWidth={1.5} />
                              <span className="text-[11px] font-medium">{selectedItem.keyFileName || "key-image"}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{selectedItem.keyFileName}</span>
                            <button
                              onClick={() => handleCopyKey(selectedItem.id, selectedItem.keyCode)}
                              className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                              title="Copy image path"
                            >
                              {copiedId === selectedItem.id ? (
                                <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                              ) : (
                                <Download className="size-3.5 text-[#999999]" strokeWidth={2} />
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                    {selectedItem.keyType === "subscription" && selectedItem.subscription && (
                      <>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Subscription</p>
                        <div className="mt-1 rounded-lg border border-[rgba(26,115,232,0.15)] bg-[rgba(26,115,232,0.03)] p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{selectedItem.subscription.subscriptionName}</p>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
                            <div>
                              <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Plan</p>
                              <p className="mt-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{selectedItem.subscription.plan}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Price</p>
                              <p className="mt-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{selectedItem.subscription.price}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Start</p>
                              <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium tracking-[-0.32px] text-[#181925]">
                                <CalendarDays className="size-3 text-[#999999]" strokeWidth={2} />
                                {selectedItem.subscription.startDate}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">End</p>
                              <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium tracking-[-0.32px] text-[#181925]">
                                <CalendarDays className="size-3 text-[#999999]" strokeWidth={2} />
                                {selectedItem.subscription.endDate}
                              </p>
                            </div>
                          </div>
                          {selectedItem.deliveryCode && (
                            <div className="mt-2.5 border-t border-[rgba(0,0,0,0.06)] pt-2">
                              <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Delivery Link Code</p>
                              <p className="mt-0.5 font-mono text-[11px] tracking-[0.3px] text-[#1A73E8]">{selectedItem.deliveryCode}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {selectedItem.deliveredTo && (
                    <div>
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Delivered to</p>
                      <div className="group/customer relative mt-0.5 inline-block">
                        <Link
                          to="/dashboard/customers"
                          className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] hover:underline"
                          onClick={() => { setSelectedItem(null); setTagInput(""); setShowKeyCode(false) }}
                        >
                          <span
                            className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#918DF6] text-[9px] font-bold text-white"
                          >
                            {selectedItem.deliveredTo.charAt(0)}
                          </span>
                          {selectedItem.deliveredTo}
                        </Link>
                        {(() => {
                          const customerItems = inventory.filter((i) => i.deliveredTo === selectedItem.deliveredTo)
                          const deliveredCount = customerItems.filter((i) => i.status === "Delivered").length
                          const products = Array.from(new Set(customerItems.map((i) => i.product)))
                          const lastDelivered = customerItems.find((i) => i.deliveryMethod && i.deliveryTarget)
                          return (
                            <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-[260px] rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5 opacity-0 shadow-lg transition-opacity group-hover/customer:pointer-events-auto group-hover/customer:opacity-100">
                              <div className="flex items-center gap-2.5">
                                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#918DF6] text-[11px] font-bold text-white">
                                  {selectedItem.deliveredTo.charAt(0)}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{selectedItem.deliveredTo}</p>
                                  <p className="text-[11px] tracking-[-0.32px] text-[#999999]">Customer</p>
                                </div>
                              </div>
                              {lastDelivered?.deliveryMethod && (
                                <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-[rgba(0,0,0,0.02)] px-2.5 py-2">
                                  <DeliveryChannel channel={lastDelivered.deliveryMethod} />
                                  <span className="truncate text-[11px] font-medium tracking-[-0.32px] text-[#555555]">
                                    {lastDelivered.deliveryTarget}
                                  </span>
                                </div>
                              )}
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <div className="rounded-lg bg-[rgba(0,0,0,0.02)] px-2.5 py-1.5">
                                  <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Deliveries</p>
                                  <p className="text-[15px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{deliveredCount}</p>
                                </div>
                                <div className="rounded-lg bg-[rgba(0,0,0,0.02)] px-2.5 py-1.5">
                                  <p className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">Products</p>
                                  <p className="text-[15px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{products.length}</p>
                                </div>
                              </div>
                              {products.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {products.slice(0, 3).map((p) => (
                                    <span key={p} className="truncate rounded-md bg-[rgba(145,141,246,0.08)] px-1.5 py-0.5 text-[10px] font-medium tracking-[-0.32px] text-[#918DF6]">
                                      {p}
                                    </span>
                                  ))}
                                  {products.length > 3 && (
                                    <span className="text-[10px] font-medium text-[#999999]">+{products.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info Card */}
              {selectedItem.status === "Delivered" && selectedItem.deliveredTo && (() => {
                const expInfo = getExpirationInfo(selectedItem.deliveryExpires, selectedItem.deliveryExpired)
                return (
                  <div
                    className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)] p-4"
                    style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
                  >
                    <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Delivery Info</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Recipient</p>
                        <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedItem.deliveredTo}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Channel</p>
                        <div className="mt-0.5">
                          {selectedItem.deliveryMethod ? (
                            <div className="group/channel relative inline-block">
                              <DeliveryChannel channel={selectedItem.deliveryMethod} />
                              {selectedItem.deliveryTarget && (
                                <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 whitespace-nowrap rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover/channel:pointer-events-auto group-hover/channel:opacity-100">
                                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Sent to</p>
                                  <p className="mt-0.5 text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{selectedItem.deliveryTarget}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-[13px] tracking-[-0.32px] text-[#999999]">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Delivered</p>
                        <p className="mt-0.5 text-[13px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">
                          {formatDeliveryDate(selectedItem.deliveredDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">URL Expiration</p>
                        <div className="mt-0.5">
                          {expInfo.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(227,116,0,0.08)] px-2 py-0.5 text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#E37400]">
                              <Clock className="size-3" strokeWidth={2.5} />
                              {expInfo.label}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(217,48,37,0.08)] px-2 py-0.5 text-[12px] font-semibold tracking-[-0.32px] text-[#D93025]">
                              <Ban className="size-3" strokeWidth={2.5} />
                              Expired
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Delivery URL */}
                    <div className="mt-3 border-t border-[rgba(0,0,0,0.06)] pt-3">
                      <p className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">Delivery URL</p>
                      {selectedItem.deliveryExpired ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[13px] font-medium tracking-[-0.32px] text-[#999999] line-through">
                            delivery.mont.io/{selectedItem.deliveryCode || "••••••••"}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-[rgba(217,48,37,0.08)] px-2 py-0.5 text-[10px] font-semibold tracking-[-0.32px] text-[#D93025]">
                            Expired
                          </span>
                        </div>
                      ) : selectedItem.deliveryCode ? (
                        <div className="mt-1 flex items-center justify-between">
                          <a
                            href={`https://delivery.mont.io/${selectedItem.deliveryCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] hover:underline"
                          >
                            delivery.mont.io/{selectedItem.deliveryCode}
                            <ExternalLink className="size-3" strokeWidth={2} />
                          </a>
                          <button
                            onClick={() => setConfirmAction({ type: "deliveryExpired", item: selectedItem })}
                            className="inline-flex items-center gap-1 rounded-full border border-[#D93025]/20 px-2.5 py-1 text-[11px] font-semibold tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/[0.04]"
                          >
                            <LinkIcon className="size-3" strokeWidth={2} />
                            Expire URL
                          </button>
                        </div>
                      ) : (
                        <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#999999]">No delivery URL</p>
                      )}
                    </div>
                  </div>
                )
              })()}

              {selectedItem.status !== "Delivered" && (
                <div
                  className="flex items-center gap-3 rounded-xl border border-dashed border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-4 py-3.5"
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: statusConfig[selectedItem.status].bg }}
                  >
                    {(() => { const SI = statusConfig[selectedItem.status].icon; return <SI className="size-4" style={{ color: statusConfig[selectedItem.status].color }} strokeWidth={2} /> })()}
                  </span>
                  <div>
                    <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                      Not delivered
                    </p>
                    <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                      {selectedItem.status === "Available" ? "This key is available and waiting to be assigned"
                        : selectedItem.status === "Reserved" ? "This key is reserved for an upcoming order"
                        : selectedItem.status === "Expired" ? "This key has expired and can no longer be delivered"
                        : selectedItem.status === "Held" ? "This key is on hold and excluded from auto-delivery"
                        : selectedItem.status === "Deactivated" ? "This key has been deactivated"
                        : "No delivery information available"}
                    </p>
                  </div>
                </div>
              )}

              <div className="h-px bg-[rgba(0,0,0,0.08)]" />

              {/* Tags */}
              <div>
                <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">Tags</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-[rgba(145,141,246,0.08)] px-2 py-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]"
                    >
                      <Tag className="size-3" strokeWidth={2} />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(selectedItem.id, tag)}
                        className="ml-0.5 flex size-3.5 items-center justify-center rounded-full transition-colors hover:bg-[rgba(145,141,246,0.15)]"
                      >
                        <X className="size-2.5" strokeWidth={2.5} />
                      </button>
                    </span>
                  ))}
                  {selectedItem.tags.length === 0 && (
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
                        handleAddTag(selectedItem.id, tagInput)
                      }
                    }}
                    placeholder="Add tag..."
                    className="h-7 flex-1 rounded-md border border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.015)] px-2 text-[12px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none focus:border-[#918DF6]/40 focus:bg-white"
                  />
                  <button
                    onClick={() => handleAddTag(selectedItem.id, tagInput)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[rgba(0,0,0,0.12)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                  >
                    <Plus className="size-3.5 text-[#666666]" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="h-px bg-[rgba(0,0,0,0.08)]" />

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmAction({ type: selectedItem.status === "Held" ? "unhold" : "hold", item: selectedItem })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.12)] px-3.5 py-1.5 text-[12px] font-semibold tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                >
                  <Pause className="size-3.5" strokeWidth={2} />
                  {selectedItem.status === "Held" ? "Release Hold" : "Hold"}
                </button>
                <button
                  onClick={() => setConfirmAction({ type: selectedItem.status === "Deactivated" ? "reactivate" : "deactivate", item: selectedItem })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.12)] px-3.5 py-1.5 text-[12px] font-semibold tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                >
                  <Ban className="size-3.5" strokeWidth={2} />
                  {selectedItem.status === "Deactivated" ? "Reactivate" : "Deactivate"}
                </button>
                <button
                  onClick={() => setConfirmAction({ type: "delete", item: selectedItem })}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D93025]/20 px-3.5 py-1.5 text-[12px] font-semibold tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/[0.04]"
                >
                  <Trash2 className="size-3.5" strokeWidth={2} />
                  Delete
                </button>
              </div>
              </>)}

              {inventoryDetailTab === "activity" && selectedItem.status === "Delivered" && selectedItem.deliveryCode && (() => {
                const logs = accessLogs[selectedItem.deliveryCode]
                if (!logs || logs.length === 0) return (
                  <div className="flex flex-col items-center justify-center py-10">
                    <Activity className="size-6 text-[#CCCCCC]" strokeWidth={1.5} />
                    <p className="mt-3 text-[13px] font-medium tracking-[-0.32px] text-[#999999]">No activity yet</p>
                    <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#CCCCCC]">Access events will appear here once the delivery link is visited</p>
                  </div>
                )
                return (
                  <div className="divide-y divide-[rgba(0,0,0,0.06)]">
                    {logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="flex shrink-0 flex-col items-end pt-0.5" style={{ minWidth: "110px" }}>
                          <p className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">
                            {new Date(log.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p className="text-[11px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                            {new Date(log.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[-0.32px] ${
                              log.event === "Viewed" ? "bg-[rgba(26,115,232,0.08)] text-[#1A73E8]"
                              : log.event === "Redeemed" ? "bg-[rgba(52,168,83,0.08)] text-[#34A853]"
                              : "bg-[rgba(217,48,37,0.08)] text-[#D93025]"
                            }`}>
                              {log.event}
                            </span>
                            {log.isFirstAccess && (
                              <span className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">· First access</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1 text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                              <Globe className="size-3" strokeWidth={2} />
                              {log.ip}
                            </span>
                            <span className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                              {log.location}
                            </span>
                          </div>
                          <div className="group/ua relative inline-flex items-center gap-1 self-start">
                            <Monitor className="size-3 text-[#999999]" strokeWidth={2} />
                            <span className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{log.userAgentShort}</span>
                            <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 max-w-xs whitespace-normal rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2 opacity-0 shadow-lg transition-opacity group-hover/ua:pointer-events-auto group-hover/ua:opacity-100">
                              <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Full User Agent</p>
                              <p className="mt-0.5 break-all text-[11px] font-medium tracking-[-0.32px] text-[#181925]">{log.userAgent}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmAction !== null} onOpenChange={(open: boolean) => { if (!open) setConfirmAction(null) }}>
        {confirmAction && (
          <DialogContent className="sm:max-w-sm" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                {confirmAction.type === "delete" ? "Delete Item"
                  : confirmAction.type === "hold" ? "Hold Item"
                  : confirmAction.type === "unhold" ? "Release Hold"
                  : confirmAction.type === "deactivate" ? "Deactivate Item"
                  : confirmAction.type === "deliveryExpired" ? "Expire Delivery URL"
                  : "Reactivate Item"}
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                {confirmAction.type === "delete"
                  ? `Are you sure you want to delete "${confirmAction.item.product}" (${confirmAction.item.id})? This action cannot be undone.`
                  : confirmAction.type === "hold"
                    ? `Are you sure you want to hold "${confirmAction.item.product}" (${confirmAction.item.id})?`
                    : confirmAction.type === "unhold"
                      ? `Are you sure you want to release the hold on "${confirmAction.item.product}" (${confirmAction.item.id})?`
                      : confirmAction.type === "deactivate"
                        ? `Are you sure you want to deactivate "${confirmAction.item.product}" (${confirmAction.item.id})? The key will no longer be available for delivery.`
                        : confirmAction.type === "deliveryExpired"
                          ? `Are you sure you want to expire the delivery URL for "${confirmAction.item.product}" (${confirmAction.item.id})? The recipient will no longer be able to access the delivery link.`
                          : `Are you sure you want to reactivate "${confirmAction.item.product}" (${confirmAction.item.id})?`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === "delete") handleDelete(confirmAction.item)
                  else if (confirmAction.type === "deliveryExpired") handleExpireDelivery(confirmAction.item)
                  else if (confirmAction.type === "deactivate" || confirmAction.type === "reactivate") handleToggleDeactivate(confirmAction.item)
                  else handleToggleHold(confirmAction.item)
                }}
                className={`rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors ${
                  confirmAction.type === "delete" || confirmAction.type === "deliveryExpired"
                    ? "bg-[#D93025] hover:bg-[#C12B20]"
                    : "bg-[#918DF6] hover:bg-[#7B77E0]"
                }`}
              >
                {confirmAction.type === "delete" ? "Delete" : confirmAction.type === "deliveryExpired" ? "Expire URL" : "Confirm"}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  )
}
