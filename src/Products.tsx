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
  PlatformBadgeIcon,
  formatUSD,
  formatKRW,
  StatusBadge,
  deliveryChannels,
} from "@/shared"
import type { Locale } from "@/locale"

const translations = {
  en: {
    title: "Products",
    searchPlaceholder: "Search products...",
    addProduct: "Add Product",
    all: "All",
    active: "Active",
    draft: "Draft",
    outOfStock: "Out of Stock",
    noProducts: "No products found",
    noProductsDesc: "Try adjusting your search or filters",
    price: "Price",
    status: "Status",
    description: "Description",
    platforms: "Platforms",
    inventorySales: "Inventory & Sales",
    inStock: "In Stock",
    totalSold: "Total Sold",
    revenue: "Revenue",
    recentOrders: "Recent Orders",
    orders: "orders",
    licenseInventory: "License Inventory",
    addKeys: "Add Keys",
    available: "Available",
    delivered: "Delivered",
    expired: "Expired",
    sources: "Sources",
    merchantPlatforms: "Merchant Platforms",
    syncAll: "Sync All",
    connected: "Connected",
    disconnected: "Disconnected",
    connect: "Connect",
    lastSync: "Last Sync",
    listing: "Listing",
    viewListing: "View Listing",
    autoSync: "Auto-Sync",
    enabled: "Enabled",
    disabled: "Disabled",
    integration: "Integration",
    integrationDesc: (platform: string) => `Integration settings for this product on ${platform}.`,
    productIdSku: "Product ID / SKU",
    priceOverride: "Price Override",
    priceOverridePlaceholder: "Leave empty to use default price",
    autoDelivery: "Auto-Delivery",
    stockSync: "Stock Sync",
    webhookUrl: "Webhook URL",
    webhookNote: "Auto-generated. Cannot be edited.",
    cancel: "Cancel",
    saveSettings: "Save Settings",
    saved: "Saved!",
    product: "PRODUCT",
    buyer: "BUYER",
    name: "Name",
    platform: "Platform",
    deliveryDetails: "DELIVERY DETAILS",
    from: "From",
    to: "To",
    time: "Time",
    channelTarget: "Channel Target",
    pending: "Pending",
    failed: "Failed",
    resendVia: (ch: string) => `Resend via ${ch}`,
    licenseLabel: "LICENSE",
    reassignLicense: "Reassign License",
    retry: "Retry",
    dangerZone: "DANGER ZONE",
    cancelOrder: "Cancel Order",
    deleteOrder: "Delete Order",
    viewInOrders: "View in Orders",
    overview: "Overview",
    orderLogs: "Order Logs",
    licenseStock: "License Stock",
    merchants: "Merchants",
    processing: "Processing",
    orderTitle: (id: string) => `Order #${id}`,
    source: "Source",
    license: "License",
    channel: "Channel",
    never: "Never",
    placeholderKeyWarning: "Key ends with 0000 — may be a placeholder",
    integrationSettings: "Integration settings",
    autoSyncOn: "Auto-sync on",
    autoSyncOff: "Auto-sync off",
    copyWebhook: "Copy webhook URL",
    manualUpload: "Manual Upload",
    apiFetch: "API Fetch",
    bulkImport: "Bulk Import",
    keyType: "Key",
    linkType: "Link",
    fileType: "File",
    imageType: "Image",
    subscriptionType: "Sub",
  },
  kr: {
    title: "상품",
    searchPlaceholder: "상품 검색...",
    addProduct: "상품 추가",
    all: "전체",
    active: "활성",
    draft: "초안",
    outOfStock: "품절",
    noProducts: "상품을 찾을 수 없습니다",
    noProductsDesc: "검색어나 필터를 조정해 보세요",
    price: "가격",
    status: "상태",
    description: "설명",
    platforms: "플랫폼",
    inventorySales: "재고 & 판매",
    inStock: "재고",
    totalSold: "총 판매",
    revenue: "매출",
    recentOrders: "최근 주문",
    orders: "건",
    licenseInventory: "라이선스 재고",
    addKeys: "키 추가",
    available: "사용 가능",
    delivered: "배송됨",
    expired: "만료됨",
    sources: "소스",
    merchantPlatforms: "판매 플랫폼",
    syncAll: "전체 동기화",
    connected: "연결됨",
    disconnected: "연결 해제",
    connect: "연결",
    lastSync: "마지막 동기화",
    listing: "리스팅",
    viewListing: "리스팅 보기",
    autoSync: "자동 동기화",
    enabled: "활성",
    disabled: "비활성",
    integration: "연동",
    integrationDesc: (platform: string) => `${platform} 상품 연동 설정입니다.`,
    productIdSku: "상품 ID / SKU",
    priceOverride: "가격 재설정",
    priceOverridePlaceholder: "기본 가격 사용시 비워두세요",
    autoDelivery: "자동 배송",
    stockSync: "재고 동기화",
    webhookUrl: "웹훅 URL",
    webhookNote: "자동 생성됨. 수정 불가.",
    cancel: "취소",
    saveSettings: "설정 저장",
    saved: "저장됨!",
    product: "상품",
    buyer: "구매자",
    name: "이름",
    platform: "플랫폼",
    deliveryDetails: "배송 상세",
    from: "보내는 곳",
    to: "받는 사람",
    time: "시간",
    channelTarget: "채널 대상",
    pending: "대기 중",
    failed: "실패",
    resendVia: (ch: string) => `${ch}로 재발송`,
    licenseLabel: "라이선스",
    reassignLicense: "라이선스 재할당",
    retry: "재시도",
    dangerZone: "위험 구역",
    cancelOrder: "주문 취소",
    deleteOrder: "주문 삭제",
    viewInOrders: "주문에서 보기",
    overview: "개요",
    orderLogs: "주문 로그",
    licenseStock: "라이선스 재고",
    merchants: "판매처",
    processing: "처리 중",
    orderTitle: (id: string) => `주문 #${id}`,
    source: "소스",
    license: "라이선스",
    channel: "채널",
    never: "없음",
    placeholderKeyWarning: "키가 0000으로 끝남 — 플레이스홀더일 수 있음",
    integrationSettings: "연동 설정",
    autoSyncOn: "자동 동기화 켜짐",
    autoSyncOff: "자동 동기화 꺼짐",
    copyWebhook: "웹훅 URL 복사",
    manualUpload: "수동 업로드",
    apiFetch: "API 가져오기",
    bulkImport: "일괄 가져오기",
    keyType: "키",
    linkType: "링크",
    fileType: "파일",
    imageType: "이미지",
    subscriptionType: "구독",
  },
} as const

type ProductStatus = "Active" | "Draft" | "Out of Stock"
type ProductCategory = "Game Key" | "Gift Card" | "Subscription" | "Software License"

const categoryLabels: Record<Locale, Record<ProductCategory, string>> = {
  en: {
    "Game Key": "Game Key",
    "Gift Card": "Gift Card",
    Subscription: "Subscription",
    "Software License": "Software License",
  },
  kr: {
    "Game Key": "게임 키",
    "Gift Card": "기프트 카드",
    Subscription: "구독",
    "Software License": "소프트웨어 라이선스",
  },
}

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
  { id: "P001", name: "Steam Wallet $50 Gift Card", price: 42.99, description: "Digital gift card for Steam platform. Redeemable for games, DLC, and in-game items. Region: Global.", platforms: ["롯데몰", "지마켓", "네이버 스토어"], stock: 234, totalSold: 1847, status: "Active", category: "Gift Card", color: "#1B2838" },
  { id: "P002", name: "Xbox Game Pass Ultimate 1M", price: 12.99, description: "1 month of Xbox Game Pass Ultimate. Includes Xbox Live Gold, EA Play, and access to 400+ games on console, PC, and cloud.", platforms: ["지마켓", "네이버 스토어"], stock: 89, totalSold: 923, status: "Active", category: "Subscription", color: "#107C10" },
  { id: "P003", name: "PlayStation Plus Premium 3M", price: 44.99, description: "3 months of PS Plus Premium. Access to game catalog, classic games, cloud streaming, and online multiplayer.", platforms: ["네이버 스토어", "쿠팡"], stock: 56, totalSold: 412, status: "Active", category: "Subscription", color: "#003087" },
  { id: "P004", name: "Netflix Gift Card $25", price: 22.99, description: "Netflix digital gift card worth $25. Can be applied to any Netflix subscription plan.", platforms: ["롯데몰", "지마켓", "네이버 스토어"], stock: 0, totalSold: 2103, status: "Out of Stock", category: "Gift Card", color: "#E50914" },
  { id: "P005", name: "Elden Ring Shadow of the Erdtree", price: 39.99, description: "DLC expansion for Elden Ring. Explore the Land of Shadow in this massive expansion to the award-winning action RPG.", platforms: ["롯데몰", "지마켓"], stock: 145, totalSold: 678, status: "Active", category: "Game Key", color: "#C4A44A" },
  { id: "P006", name: "Adobe Creative Cloud 1M", price: 54.99, description: "1 month subscription to Adobe Creative Cloud. Includes Photoshop, Illustrator, Premiere Pro, and 20+ creative apps.", platforms: ["네이버 스토어", "쿠팡"], stock: 34, totalSold: 567, status: "Active", category: "Software License", color: "#FF0000" },
  { id: "P007", name: "Spotify Premium 6M", price: 39.99, description: "6 months of Spotify Premium. Ad-free music, offline downloads, and high-quality audio streaming.", platforms: ["네이버 스토어", "지마켓"], stock: 178, totalSold: 1456, status: "Active", category: "Subscription", color: "#1DB954" },
  { id: "P008", name: "Windows 11 Pro Key", price: 24.99, description: "Genuine Windows 11 Professional license key. Includes BitLocker, Remote Desktop, Hyper-V, and enterprise features.", platforms: ["롯데몰", "지마켓", "네이버 스토어", "쿠팡"], stock: 312, totalSold: 3201, status: "Active", category: "Software License", color: "#0078D4" },
  { id: "P009", name: "Cyberpunk 2077 Ultimate Bundle", price: 59.99, description: "Cyberpunk 2077 base game + Phantom Liberty expansion. Experience Night City in this open-world RPG.", platforms: ["롯데몰", "쿠팡"], stock: 67, totalSold: 234, status: "Active", category: "Game Key", color: "#FCE300" },
  { id: "P010", name: "Nintendo eShop $50 Card", price: 46.99, description: "Digital gift card for Nintendo eShop. Purchase games, DLC, and subscriptions on Nintendo Switch.", platforms: ["네이버 스토어", "지마켓"], stock: 0, totalSold: 891, status: "Out of Stock", category: "Gift Card", color: "#E60012" },
  { id: "P011", name: "Microsoft 365 Family 1Y", price: 89.99, description: "1 year of Microsoft 365 Family. Up to 6 users, 1TB OneDrive each, Word, Excel, PowerPoint, and more.", platforms: ["네이버 스토어", "쿠팡"], stock: 23, totalSold: 445, status: "Active", category: "Software License", color: "#D83B01" },
  { id: "P012", name: "Baldur's Gate 3 Digital Deluxe", price: 69.99, description: "Digital Deluxe edition of Baldur's Gate 3. Includes base game, digital artbook, soundtrack, and exclusive dice skin.", platforms: ["롯데몰"], stock: 12, totalSold: 156, status: "Draft", category: "Game Key", color: "#8B0000" },
  { id: "P013", name: "YouTube Premium 3M", price: 29.99, description: "3 months of YouTube Premium. Ad-free videos, background play, YouTube Music Premium included.", platforms: ["네이버 스토어"], stock: 201, totalSold: 1023, status: "Active", category: "Subscription", color: "#FF0000" },
  { id: "P014", name: "JetBrains All Products 1Y", price: 149.99, description: "1 year license for all JetBrains IDEs. IntelliJ IDEA, WebStorm, PyCharm, and more for professional development.", platforms: ["쿠팡"], stock: 8, totalSold: 89, status: "Draft", category: "Software License", color: "#000000" },
  { id: "P015", name: "Roblox Gift Card $25", price: 22.00, description: "Roblox digital gift card. Redeem for Robux or a Roblox Premium subscription.", platforms: ["롯데몰", "네이버 스토어"], stock: 456, totalSold: 2890, status: "Active", category: "Gift Card", color: "#E2231A" },
  { id: "P016", name: "Monster Hunter Wilds", price: 59.99, description: "Standard edition of Monster Hunter Wilds. Hunt massive monsters in a vast open world with up to 4 players.", platforms: ["롯데몰", "지마켓", "네이버 스토어"], stock: 98, totalSold: 345, status: "Active", category: "Game Key", color: "#2D5016" },
]

const productLocalized: Record<string, { name: string; description: string }> = {
  P001: { name: "스팀 월렛 $50 기프트 카드", description: "스팀 플랫폼용 디지털 기프트 카드입니다. 게임, DLC, 인게임 아이템 구매에 사용할 수 있습니다. 지역: 글로벌." },
  P002: { name: "엑스박스 게임 패스 얼티밋 1개월", description: "엑스박스 게임 패스 얼티밋 1개월 이용권. Xbox Live Gold, EA Play, 콘솔·PC·클라우드 400+ 게임 이용 가능." },
  P003: { name: "플레이스테이션 플러스 프리미엄 3개월", description: "PS Plus 프리미엄 3개월 이용권. 게임 카탈로그, 클래식 게임, 클라우드 스트리밍, 온라인 멀티플레이 포함." },
  P004: { name: "넷플릭스 기프트 카드 $25", description: "$25 넷플릭스 디지털 기프트 카드. 모든 넷플릭스 구독 요금제에 적용 가능합니다." },
  P005: { name: "엘든 링 황금 나무의 그림자", description: "엘든 링 DLC 확장팩. 수상 작품 액션 RPG의 거대한 확장 콘텐츠, 그림자의 땅을 탐험하세요." },
  P006: { name: "어도비 크리에이티브 클라우드 1개월", description: "Adobe Creative Cloud 1개월 구독. Photoshop, Illustrator, Premiere Pro 등 20+ 크리에이티브 앱 포함." },
  P007: { name: "스포티파이 프리미엄 6개월", description: "Spotify Premium 6개월 이용권. 광고 없는 음악, 오프라인 다운로드, 고음질 스트리밍." },
  P008: { name: "윈도우 11 프로 키", description: "정품 Windows 11 Professional 라이선스 키. BitLocker, 원격 데스크톱, Hyper-V 등 기업 기능 포함." },
  P009: { name: "사이버펑크 2077 얼티밋 번들", description: "사이버펑크 2077 본편 + 팬텀 리버티 확장팩. 오픈월드 RPG 나이트 시티를 경험하세요." },
  P010: { name: "닌텐도 e숍 $50 카드", description: "닌텐도 e숍 디지털 기프트 카드. Nintendo Switch에서 게임, DLC, 구독 구매에 사용." },
  P011: { name: "마이크로소프트 365 패밀리 1년", description: "Microsoft 365 Family 1년 이용권. 최대 6명, 1TB OneDrive, Word, Excel, PowerPoint 등 포함." },
  P012: { name: "발더스 게이트 3 디지털 디럭스", description: "발더스 게이트 3 디지털 디럭스 에디션. 본편, 디지털 아트북, 사운드트랙, 전용 주사위 스킨 포함." },
  P013: { name: "유튜브 프리미엄 3개월", description: "YouTube Premium 3개월 이용권. 광고 없는 영상, 백그라운드 재생, YouTube Music Premium 포함." },
  P014: { name: "젯브레인즈 전체 제품 1년", description: "JetBrains 전체 IDE 1년 라이선스. IntelliJ IDEA, WebStorm, PyCharm 등 프로 개발 도구." },
  P015: { name: "로블록스 기프트 카드 $25", description: "Roblox 디지털 기프트 카드. Robux 또는 Roblox Premium 구독으로 교환 가능." },
  P016: { name: "몬스터 헌터 와일즈", description: "몬스터 헌터 와일즈 스탠다드 에디션. 광활한 오픈월드에서 최대 4인 협동 사냥." },
}

function getProductDisplay(product: Product, locale: Locale) {
  if (locale === "kr" && productLocalized[product.id]) {
    return productLocalized[product.id]
  }
  return { name: product.name, description: product.description }
}

function getProductStatusLabel(status: ProductStatus, t: (typeof translations)[Locale]) {
  if (status === "Active") return t.active
  if (status === "Draft") return t.draft
  return t.outOfStock
}

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

function getOrderStatusLabel(status: ProductOrder["status"], t: (typeof translations)[Locale]) {
  if (status === "Delivered") return t.delivered
  if (status === "Processing") return t.processing
  return t.failed
}

function getLicenseStatusLabel(status: LicenseKey["status"], t: (typeof translations)[Locale]) {
  if (status === "Available") return t.available
  if (status === "Delivered") return t.delivered
  return t.expired
}

function getSourceLabel(source: string, t: (typeof translations)[Locale]) {
  if (source === "Manual Upload") return t.manualUpload
  if (source === "API Fetch") return t.apiFetch
  if (source === "Bulk Import") return t.bulkImport
  return source
}

function getLicenseTypeLabel(type: LicenseKey["type"], t: (typeof translations)[Locale]) {
  if (type === "key") return t.keyType
  if (type === "link") return t.linkType
  if (type === "file") return t.fileType
  if (type === "image") return t.imageType
  return t.subscriptionType
}

function getMockOrders(productId: string): ProductOrder[] {
  return [
    { orderId: `${productId}-ORD-4821`, customer: "김민수", amount: 42.99, status: "Delivered", date: "2026-04-28 14:32", platform: "네이버 스토어", delivery: "Email", deliveryTarget: "minsu.kim@gmail.com", keyCode: "XXXX-ABCD-1234-EFGH" },
    { orderId: `${productId}-ORD-4819`, customer: "Alex Turner", amount: 42.99, status: "Delivered", date: "2026-04-28 11:05", platform: "지마켓", delivery: "Email", deliveryTarget: "alex.turner@outlook.com", keyCode: "XXXX-IJKL-5678-MNOP" },
    { orderId: `${productId}-ORD-4815`, customer: "이지은", amount: 42.99, status: "Processing", date: "2026-04-27 22:18", platform: "롯데몰", delivery: "Telegram", deliveryTarget: "@jieun_lee", keyCode: "XXXX-QRST-9012-UVWX" },
    { orderId: `${productId}-ORD-4810`, customer: "Sarah Chen", amount: 42.99, status: "Delivered", date: "2026-04-27 09:44", platform: "지마켓", delivery: "WhatsApp", deliveryTarget: "+1-555-0142", keyCode: "XXXX-YZAB-3456-CDEF" },
    { orderId: `${productId}-ORD-4802`, customer: "박준혁", amount: 42.99, status: "Failed", date: "2026-04-26 16:51", platform: "네이버 스토어", delivery: "SMS", deliveryTarget: "+82-10-9876-5432", keyCode: "XXXX-GHIJ-7890-KLMN" },
    { orderId: `${productId}-ORD-4798`, customer: "James Wilson", amount: 42.99, status: "Delivered", date: "2026-04-26 08:12", platform: "쿠팡", delivery: "Email", deliveryTarget: "j.wilson@proton.me", keyCode: "XXXX-OPQR-2345-STUV" },
    { orderId: `${productId}-ORD-4791`, customer: "최유진", amount: 42.99, status: "Delivered", date: "2026-04-25 19:30", platform: "네이버 스토어", delivery: "Telegram", deliveryTarget: "@yujin_choi", keyCode: "XXXX-WXYZ-6789-ABCD" },
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
    "롯데몰": { platform: "롯데몰", connected: true, lastSync: "2026-04-28 14:00", listingUrl: "https://g2g.com/offer/steam-wallet-50", autoSync: true, externalProductId: `G2G-SKU-${productId.replace("P", "")}91`, priceOverride: null, autoDelivery: true, stockSync: true, webhookUrl: `https://api.mont.shop/webhooks/g2g/${productId}` },
    "지마켓": { platform: "지마켓", connected: true, lastSync: "2026-04-28 13:45", listingUrl: "https://g2a.com/steam-wallet-50-usd", autoSync: true, externalProductId: `G2A-PROD-${productId.replace("P", "")}47`, priceOverride: 44.99, autoDelivery: true, stockSync: false, webhookUrl: `https://api.mont.shop/webhooks/g2a/${productId}` },
    "네이버 스토어": { platform: "네이버 스토어", connected: true, lastSync: "2026-04-28 12:30", listingUrl: "https://smartstore.naver.com/mont/products/123", autoSync: false, externalProductId: `naver-prod-${productId.replace("P", "")}345`, priceOverride: 45.99, autoDelivery: false, stockSync: true, webhookUrl: `https://api.mont.shop/webhooks/naver/${productId}` },
    "쿠팡": { platform: "쿠팡", connected: true, lastSync: null, listingUrl: "https://mont.shop/p/steam-wallet-50", autoSync: false, externalProductId: productId, priceOverride: null, autoDelivery: true, stockSync: false, webhookUrl: `https://api.mont.shop/webhooks/direct/${productId}` },
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

export default function Products({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale]
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
      const display = getProductDisplay(p, locale)
      return (
        display.name.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        categoryLabels[locale][p.category].toLowerCase().includes(q) ||
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
      title={t.title}
      locale={locale}
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
              placeholder={t.searchPlaceholder}
              className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
            />
          </div>
          <button className="flex h-9 items-center gap-2 rounded-lg bg-[#918DF6] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#7D79E8]">
            <Plus className="size-4" strokeWidth={2} />
            {t.addProduct}
          </button>
        </div>

        <div className="mb-4 flex gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-1" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          {tabs.map((tab) => {
            const tabLabel = tab.value === "All" ? t.all : tab.value === "Active" ? t.active : tab.value === "Draft" ? t.draft : t.outOfStock
            return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                activeTab === tab.value
                  ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                  : "text-[#666666] hover:text-[#181925]"
              }`}
            >
              {tabLabel}
              <span className={`text-[11px] tabular-nums ${activeTab === tab.value ? "text-[#918DF6]" : "text-[#999999]"}`}>
                {tabCounts[tab.value]}
              </span>
            </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => {
              const display = getProductDisplay(product, locale)
              return (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5 text-left transition-all hover:border-[#918DF6]/40 hover:bg-[#918DF6]/[0.02] hover:shadow-md active:scale-[0.98]"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold text-white"
                  style={{ backgroundColor: product.color }}
                >
                  {display.name.charAt(0)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {display.name}
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusStyles[product.status]}`}>
                      {getProductStatusLabel(product.status, t)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[12px] tracking-[-0.32px] text-[#999999]">{categoryLabels[locale][product.category]}</span>
                    <span className="text-[#CCCCCC]">·</span>
                    <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                      {locale === "kr" ? formatKRW(product.price) : formatUSD(product.price)}
                    </span>
                    {locale === "en" && currency === "KRW" && (
                      <span className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                        {formatKRW(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {product.platforms.map((platform) => {
                        const badge = platformBadges[platform]
                        if (!badge) return null
                        return (
                          <PlatformBadgeIcon key={platform} badge={badge} size="size-3.5" />
                        )
                      })}
                    </div>
                    <span className="text-[11px] text-[#CCCCCC]">·</span>
                    <div className="flex items-center gap-0.5">
                      <Package className="size-3 text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">
                        {product.stock}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#CCCCCC]">·</span>
                    <div className="flex items-center gap-0.5">
                      <TrendingUp className="size-3 text-[#999999]" strokeWidth={1.8} />
                      <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">
                        {product.totalSold.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Package className="size-10 text-[#999999]" strokeWidth={1.2} />
              <p className="mt-3 text-[14px] font-medium tracking-[-0.32px] text-[#666666]">{t.noProducts}</p>
              <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#999999]">{t.noProductsDesc}</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={selectedProduct !== null && selectedMerchantSettings === null} onOpenChange={(open) => { if (!open) { setSelectedProduct(null); setDetailTab("overview"); setSelectedOrderId(null); setSelectedMerchantSettings(null); setCopiedOrderKey(false) } }}>
        {selectedProduct && (() => {
          const selectedDisplay = getProductDisplay(selectedProduct, locale)
          return (
          <DialogContent className="sm:max-w-2xl" showCloseButton>
            <DialogHeader>
              <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
                {selectedDisplay.name}
              </DialogTitle>
              <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
                {categoryLabels[locale][selectedProduct.category]} · {selectedProduct.id}
              </DialogDescription>
            </DialogHeader>

            <div className="flex gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-1" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              {detailTabs.map((tab) => {
                const Icon = tab.icon
                const tabLabel = tab.value === "overview" ? t.overview : tab.value === "orders" ? t.orderLogs : tab.value === "licenses" ? t.licenseStock : t.merchants
                return (
                  <button
                    key={tab.value}
                    onClick={() => setDetailTab(tab.value)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[14px] font-medium tracking-[-0.32px] transition-colors ${
                      detailTab === tab.value
                        ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                        : "text-[#666666] hover:text-[#181925]"
                    }`}
                  >
                    <Icon className="size-3.5" strokeWidth={2} />
                    {tabLabel}
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
                      {selectedDisplay.name.charAt(0)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[14px] font-medium tracking-[-0.32px] text-[#999999]">{t.price}</p>
                      <p className="mt-1 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {locale === "kr" ? formatKRW(selectedProduct.price) : formatUSD(selectedProduct.price)}
                      </p>
                      {locale === "en" && (
                        <p className="text-[14px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                          {formatKRW(selectedProduct.price)}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.status}</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-[14px] font-semibold ${statusStyles[selectedProduct.status]}`}>
                          {getProductStatusLabel(selectedProduct.status, t)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                  <div>
                    <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.description}</p>
                    <p className="mt-1 text-[14px] leading-relaxed tracking-[-0.32px] text-[#181925]">
                      {selectedDisplay.description}
                    </p>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                  <div>
                    <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.platforms}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {selectedProduct.platforms.map((platform) => {
                        const badge = platformBadges[platform]
                        if (!badge) return null
                        return (
                          <span
                            key={platform}
                            className="inline-flex items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] px-2 py-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]"
                          >
                            <PlatformBadgeIcon badge={badge} size="size-3" />
                            {platform}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                  <div>
                      <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.inventorySales}</p>
                    <div className="mt-2 grid grid-cols-3 gap-x-4">
                      <div>
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.inStock}</p>
                        <p className="mt-0.5 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {selectedProduct.stock}
                        </p>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.totalSold}</p>
                        <p className="mt-0.5 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#34A853]">
                          {selectedProduct.totalSold.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.revenue}</p>
                        <p className="mt-0.5 text-[16px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {locale === "kr" ? formatKRW(selectedProduct.price * selectedProduct.totalSold) : formatUSD(selectedProduct.price * selectedProduct.totalSold)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailTab === "orders" && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.recentOrders}</p>
                    <span className="text-[13px] tabular-nums tracking-[-0.32px] text-[#999999]">{getMockOrders(selectedProduct.id).length} {t.orders}</span>
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
                              <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{order.orderId}</span>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold ${orderStatusStyles[order.status]}`}>
                                {getOrderStatusLabel(order.status, t)}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{order.customer}</span>
                              <span className="text-[#CCCCCC]">·</span>
                              <span className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{locale === "kr" ? formatKRW(order.amount) : formatUSD(order.amount)}</span>
                              <span className="text-[#CCCCCC]">·</span>
                              {pBadge && (
                                <PlatformBadgeIcon badge={pBadge} size="size-4" />
                              )}
                            </div>
                          </div>
                          <span className="shrink-0 text-[13px] tabular-nums tracking-[-0.32px] text-[#999999]">{order.date}</span>
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
                                    {t.orderTitle(order.orderId)}
                                  </DialogTitle>
                                  <StatusBadge status={order.status} locale={locale} />
                                </div>
                                <DialogDescription className="text-[15px] font-medium tracking-[-0.32px] text-[#666666]">
                                  {selectedDisplay.name}
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
                                  <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{t.source}</p>
                                  <div className="flex items-center gap-1.5">
                                    {pBadge && <PlatformBadgeIcon badge={pBadge} size="size-4" />}
                                    <span className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.platform}</span>
                                  </div>
                                  <p className="max-w-full truncate text-[13px] tracking-[-0.32px] text-[#666666]">{order.platform}</p>
                                </div>

                                <div className="flex shrink-0 flex-col items-center gap-0.5">
                                  <span className="text-[12px] font-mono tabular-nums tracking-[-0.32px] text-[#999999] bg-[rgba(0,0,0,0.04)] rounded px-1.5 py-0.5">{"\u2014"}</span>
                                  <span className="text-[#999999]">&rarr;</span>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                                  <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{t.license}</p>
                                  <p className="max-w-full truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedDisplay.name}</p>
                                  <p className="max-w-full truncate font-mono text-[13px] tracking-[-0.32px] text-[#666666]">{order.keyCode}</p>
                                </div>

                                <div className="flex shrink-0 flex-col items-center gap-0.5">
                                  <span className="text-[12px] font-mono tabular-nums tracking-[-0.32px] text-[#999999] bg-[rgba(0,0,0,0.04)] rounded px-1.5 py-0.5">{"\u2014"}</span>
                                  <span className="text-[#999999]">&rarr;</span>
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3">
                                  <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{t.channel}</p>
                                  <div className="flex items-center gap-1.5">
                                    {ch && <span style={{ color: ch.color }}>{ch.icon}</span>}
                                    <span className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.delivery}</span>
                                    <span className={`size-1.5 rounded-full ${statusDot}`} />
                                  </div>
                                  <p className="max-w-full truncate text-[13px] tracking-[-0.32px] text-[#666666]">{order.deliveryTarget || ""}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-0 divide-x divide-[rgba(0,0,0,0.08)]">
                              <div className="flex flex-col gap-5 p-6">
                                <div>
                                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.product}</p>
                                  <p className="mt-2.5 text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedDisplay.name}</p>
                                   <p className="mt-1 text-[13px] tabular-nums tracking-[-0.32px] text-[#666666]">
                                    {locale === "kr" ? formatKRW(order.amount) : `${formatKRW(order.amount)} (${formatUSD(order.amount)})`}
                                   </p>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <div>
                                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.buyer}</p>
                                  <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div>
                                      <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{t.name}</p>
                                      <p className="mt-0.5 text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.customer}</p>
                                    </div>
                                    <div>
                                      <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{t.platform}</p>
                                      <div className="mt-0.5 flex items-center gap-1.5">
                                        {pBadge && <PlatformBadgeIcon badge={pBadge} size="size-3.5" />}
                                        <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.platform}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <div>
                                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.deliveryDetails}</p>
                                  <div className="mt-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)]">
                                    <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.06)] px-3.5 py-3">
                                      {ch && <span className="text-base" style={{ color: ch.color }}>{ch.icon}</span>}
                                      <div className="flex-1">
                                        <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{order.delivery}</p>
                                        <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{order.deliveryTarget || "\u2014"}</p>
                                      </div>
                                      <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.06)] bg-white px-2 py-0.5">
                                        <span className={`size-1.5 rounded-full ${statusDot}`} />
                                        <span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                                          {order.status === "Delivered" ? t.delivered : order.status === "Processing" ? t.pending : t.failed}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-3.5 py-3 text-[13px] tracking-[-0.32px]">
                                      <div>
                                        <p className="text-[#999999]">{t.from}</p>
                                        <p className="mt-0.5 font-medium text-[#181925]">{order.platform}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#999999]">{t.to}</p>
                                        <p className="mt-0.5 font-medium text-[#181925]">{order.customer}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#999999]">{t.time}</p>
                                        <p className="mt-0.5 font-medium text-[#181925]">{order.date}</p>
                                      </div>
                                      <div>
                                        <p className="text-[#999999]">{t.channelTarget}</p>
                                        <p className="mt-0.5 truncate font-mono font-medium text-[#181925]">{order.deliveryTarget || "\u2014"}</p>
                                      </div>
                                    </div>
                                    <div className="border-t border-[rgba(0,0,0,0.06)] px-3.5 py-2.5">
                                      <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                                        <RotateCcw className="size-3" strokeWidth={2} />
                                        {t.resendVia(order.delivery)}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col gap-5 p-6">
                                <div>
                                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.licenseLabel}</p>
                                  <div className="mt-2.5 flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-3 py-2">
                                      <span className={`size-1.5 shrink-0 rounded-full ${statusDot}`} />
                                      <span className="flex-1 truncate font-mono text-[13px] tracking-[-0.32px] text-[#181925]">{order.keyCode}</span>
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
                                    <p className="mt-2 text-[13px] tracking-[-0.32px] text-[#E37400]">{"\u26A0"} {t.placeholderKeyWarning}</p>
                                  )}
                                  <div className="mt-2.5 flex gap-2">
                                    <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                                      {t.reassignLicense}
                                    </button>
                                    <button className="inline-flex h-7 items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                                      <RotateCcw className="size-3" strokeWidth={2} />
                                      {t.retry}
                                    </button>
                                  </div>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <div>
                                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.dangerZone}</p>
                                  <div className="mt-2.5 flex gap-2">
                                    <button className="inline-flex h-8 items-center rounded-lg border border-[rgba(0,0,0,0.08)] px-3 text-[13px] font-medium tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/[0.04]">
                                      {t.cancelOrder}
                                    </button>
                                    <button className="inline-flex h-8 items-center rounded-lg bg-[#D93025] px-3 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#c12b20]">
                                      {t.deleteOrder}
                                    </button>
                                  </div>
                                </div>

                                <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                                <Link
                                  to={locale === "kr" ? "/kr/dashboard/orders" : "/dashboard/orders"}
                                  className="flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:bg-[#918DF6]/[0.06]"
                                >
                                  <ExternalLink className="size-3.5" strokeWidth={2} />
                                  {t.viewInOrders}
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
                      <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.licenseInventory}</p>
                      <Link to={locale === "kr" ? "/kr/dashboard/licenses" : "/dashboard/licenses"} className="flex items-center gap-1.5 rounded-lg bg-[#918DF6] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#7D79E8]">
                        <Upload className="size-3" strokeWidth={2} />
                        {t.addKeys}
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5">
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.available}</p>
                        <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#34A853]">{available}</p>
                      </div>
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5">
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.delivered}</p>
                        <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#2C78FC]">{delivered}</p>
                      </div>
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5">
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.expired}</p>
                        <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.32px] text-[#D93025]">{expired}</p>
                      </div>
                    </div>

                    <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                    <div>
                      <p className="mb-2 text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.sources}</p>
                      <div className="flex gap-2">
                        {["Manual Upload", "API Fetch", "Bulk Import"].map((src) => {
                          const count = licenses.filter((l) => l.source === src).length
                          return (
                            <span key={src} className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 py-1 text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
                              {getSourceLabel(src, t)}
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
                            <code className="text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{maskCode(lic.code)}</code>
                            <span className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${licenseStatusStyles[lic.status]}`}>
                              {getLicenseStatusLabel(lic.status, t)}
                            </span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="rounded bg-[rgba(0,0,0,0.04)] px-1.5 py-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                              {getLicenseTypeLabel(lic.type, t)}
                            </span>
                            <span className="text-[#CCCCCC]">·</span>
                            <span className="text-[13px] tracking-[-0.32px] text-[#999999]">{getSourceLabel(lic.source, t)}</span>
                            <span className="text-[#CCCCCC]">·</span>
                            <span className="text-[13px] tabular-nums tracking-[-0.32px] text-[#999999]">{lic.addedDate}</span>
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
                    <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.merchantPlatforms}</p>
                    <button className="flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:text-[#181925]">
                      <RefreshCw className="size-3" strokeWidth={2} />
                      {t.syncAll}
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
                                <PlatformBadgeIcon badge={badge} size="size-5" />
                              )}
                              <div>
                                <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{merchant.platform}</p>
                                <div className="flex items-center gap-1">
                                  <Circle
                                    className={`size-2 ${merchant.connected ? "fill-[#34A853] text-[#34A853]" : "fill-[#D93025] text-[#D93025]"}`}
                                    strokeWidth={0}
                                  />
                                  <span className={`text-[13px] font-medium tracking-[-0.32px] ${merchant.connected ? "text-[#34A853]" : "text-[#D93025]"}`}>
                                    {merchant.connected ? t.connected : t.disconnected}
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
                                    title={t.integrationSettings}
                                  >
                                    <Settings className="size-3.5" strokeWidth={2} />
                                  </button>
                                  <button
                                    className={`flex h-6 w-10 items-center rounded-full p-0.5 transition-colors ${merchant.autoSync ? "bg-[#918DF6]" : "bg-[rgba(0,0,0,0.12)]"}`}
                                    title={merchant.autoSync ? t.autoSyncOn : t.autoSyncOff}
                                  >
                                    <span className={`size-5 rounded-full bg-white shadow-sm transition-transform ${merchant.autoSync ? "translate-x-4" : "translate-x-0"}`} />
                                  </button>
                                </>
                              )}
                              {!merchant.connected && (
                                <button className="rounded-lg bg-[#918DF6] px-3 py-1 text-[13px] font-medium text-white transition-colors hover:bg-[#7D79E8]">
                                  {t.connect}
                                </button>
                              )}
                            </div>
                          </div>

                          {merchant.connected && (
                            <div className="mt-2.5 flex flex-col gap-1.5 rounded-md bg-[rgba(0,0,0,0.02)] p-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.lastSync}</span>
                                <span className="text-[13px] tabular-nums tracking-[-0.32px] text-[#666666]">
                                  {merchant.lastSync ?? t.never}
                                </span>
                              </div>
                              {merchant.listingUrl && (
                                <div className="flex items-center justify-between">
                                  <span className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.listing}</span>
                                  <span className="flex items-center gap-1 text-[13px] tracking-[-0.32px] text-[#918DF6]">
                                    <ExternalLink className="size-3" strokeWidth={2} />
                                    {t.viewListing}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.autoSync}</span>
                                <span className="flex items-center gap-1 text-[13px] tracking-[-0.32px] text-[#666666]">
                                  {merchant.autoSync ? <Eye className="size-3" strokeWidth={2} /> : <EyeOff className="size-3" strokeWidth={2} />}
                                  {merchant.autoSync ? t.enabled : t.disabled}
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
          )
        })()}
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
                    <PlatformBadgeIcon badge={badge} size="size-6" />
                  )}
                  <div>
                    <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {merchant.platform} {t.integration}
                    </DialogTitle>
                    <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                      {t.integrationDesc(merchant.platform)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{t.productIdSku}</label>
                  <input
                    type="text"
                    value={merchantEditValues.externalProductId}
                    onChange={(e) => setMerchantEditValues({ ...merchantEditValues, externalProductId: e.target.value })}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{t.priceOverride}</label>
                  <input
                    type="text"
                    value={merchantEditValues.priceOverride}
                    onChange={(e) => setMerchantEditValues({ ...merchantEditValues, priceOverride: e.target.value })}
                    placeholder={t.priceOverridePlaceholder}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setMerchantEditValues({ ...merchantEditValues, autoDelivery: !merchantEditValues.autoDelivery })}
                  className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] px-3 py-2.5"
                >
                  <span className="text-[13px] tracking-[-0.32px] text-[#181925]">{t.autoDelivery}</span>
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
                  <span className="text-[13px] tracking-[-0.32px] text-[#181925]">{t.stockSync}</span>
                  <div
                    className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${merchantEditValues.stockSync ? "bg-[#918DF6]" : "bg-[rgba(0,0,0,0.12)]"}`}
                  >
                    <span className={`size-4 rounded-full bg-white shadow-sm transition-transform ${merchantEditValues.stockSync ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </button>

                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{t.webhookUrl}</label>
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
                      title={t.copyWebhook}
                    >
                      {copiedWebhook === merchant.platform ? (
                        <Check className="size-3.5 text-[#34A853]" strokeWidth={2} />
                      ) : (
                        <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] tracking-[-0.32px] text-[#999999]">{t.webhookNote}</p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => { setSelectedMerchantSettings(null); setMerchantEditValues(null); setMerchantSettingsSaved(false) }}
                    className="flex h-8 items-center rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                  >
                    {t.cancel}
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
                        {t.saved}
                      </span>
                    ) : (
                      t.saveSettings
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
