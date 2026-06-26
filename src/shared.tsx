import type React from "react"

// ─── Constants ───────────────────────────────────────────────

export const KRW_RATE = 1450

// ─── Types ───────────────────────────────────────────────────

export type OrderStatus = "Delivered" | "Processing" | "Failed" | "ManualRequired"

export type LicenseItemType = "key" | "giftcard" | "file" | "link"

export type OrderItem = {
  type?: LicenseItemType
  keyCode: string
  label?: string
  status: OrderStatus
}

export type FlowTiming = {
  orderCreated: string
  licenseAssigned: string
  deliverySent: string
  deliveryConfirmed?: string
}

export type Order = {
  id: string
  platform: string
  storeName?: string
  amount: number
  quantity?: number
  status: OrderStatus
  time: string
  product: string
  customer: string
  email: string
  phone?: string
  delivery: string
  deliveryTarget?: string
  keyCode: string
  items?: OrderItem[]
  recipientName?: string
  recipientPhone?: string
  customerMemo?: string
  adminMemo?: string
  flowTiming?: FlowTiming
  deliveryMessage?: string
  errorStep?: string
  errorMessage?: string
}

export type Currency = "USD" | "KRW"

// ─── Formatters ──────────────────────────────────────────────

export function formatUSD(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatKRW(n: number) {
  return `₩${Math.round(n * KRW_RATE).toLocaleString("ko-KR")}`
}

// ─── Platform Badges ─────────────────────────────────────────

export const platformBadges: Record<string, { bg: string; label: string; textSize: string }> = {
  "네이버 스토어": { bg: "bg-[#03C75A]", label: "N", textSize: "text-[9px]" },
  "롯데몰": { bg: "bg-[#E40046]", label: "L", textSize: "text-[9px]" },
  "지마켓": { bg: "bg-[#00A650]", label: "G", textSize: "text-[9px]" },
  "쿠팡": { bg: "bg-[#E31837]", label: "C", textSize: "text-[9px]" },
}

export function PlatformBadgeIcon({ badge, size = "size-4" }: { badge: typeof platformBadges[string]; size?: string }) {
  return (
    <span className={`${badge.bg} inline-flex ${size} shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
      {badge.label}
    </span>
  )
}

// ─── Status Badge ────────────────────────────────────────────

const statusLabelsKR: Record<string, string> = {
  Delivered: "발송 완료",
  Processing: "발송 준비중",
  Failed: "발송 실패",
  ManualRequired: "수동 발송 필요",
}

export function StatusBadge({ status, locale = "en" }: { status: OrderStatus; locale?: "en" | "kr" }) {
  const styles = {
    Delivered: "bg-[#34A853] text-white",
    Processing: "bg-[#E37400] text-white",
    Failed: "bg-[#D93025] text-white",
    ManualRequired: "bg-[#1A73E8] text-white",
  }
  const label = locale === "kr" ? statusLabelsKR[status] : (status === "ManualRequired" ? "Manual Required" : status)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${styles[status]}`}>
      {status === "Processing" && (
        <svg className="size-3 animate-spin" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M6 1a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </span>
  )
}

// ─── Delivery Channels ───────────────────────────────────────

export const deliveryChannels: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Telegram: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>,
    color: "#2AABEE",
    bg: "rgba(42,171,238,0.15)",
  },
  Email: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    color: "#2C78FC",
    bg: "rgba(44,120,252,0.15)",
  },
  SMS: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    color: "#33C758",
    bg: "rgba(51,199,88,0.15)",
  },
  WhatsApp: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    color: "#25D366",
    bg: "rgba(37,211,102,0.15)",
  },
  KakaoTalk: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C6.477 3 2 6.477 2 10.5c0 2.667 1.61 5.008 4.07 6.395L5.1 20.5l4.08-2.49c.93.18 1.9.27 2.82.27 5.523 0 10-3.477 10-7.78C22 6.477 17.523 3 12 3z"/></svg>,
    color: "#3A1D1D",
    bg: "rgba(255,224,0,0.25)",
  },
}

const channelLabelsKR: Record<string, string> = {
  Telegram: "텔레그램",
  Email: "이메일",
  SMS: "문자",
  WhatsApp: "왓츠앱",
  KakaoTalk: "카카오톡",
}

export function DeliveryChannel({ channel, locale = "en" }: { channel: string; locale?: "en" | "kr" }) {
  const ch = deliveryChannels[channel]
  if (!ch) return null
  const label = locale === "kr" ? (channelLabelsKR[channel] ?? channel) : channel
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold tracking-[-0.32px]"
      style={{ backgroundColor: ch.bg, color: ch.color }}
    >
      {ch.icon}
      {label}
    </span>
  )
}

// ─── Delivery Channel Plugins ────────────────────────────────

export type DeliveryPluginType = "builtin" | "plugin"

export type DeliveryPlugin = {
  id: string
  name: string
  author: string
  description: string
  pluginType: DeliveryPluginType
  iconBg: string
  iconLabel: string
  endpointLabel: string
  installs: number
  installed: boolean
}

export const deliveryPlugins: DeliveryPlugin[] = [
  {
    id: "email",
    name: "Email",
    author: "Linko",
    description: "Deliver product keys via email",
    pluginType: "builtin",
    iconBg: "#2C78FC",
    iconLabel: "Em",
    endpointLabel: "Email address",
    installs: 0,
    installed: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    author: "Linko",
    description: "Send keys through Telegram bot",
    pluginType: "builtin",
    iconBg: "#2AABEE",
    iconLabel: "Tg",
    endpointLabel: "Bot Token",
    installs: 0,
    installed: true,
  },
  {
    id: "sms",
    name: "SMS",
    author: "Linko",
    description: "Deliver keys via SMS text message",
    pluginType: "builtin",
    iconBg: "#33C758",
    iconLabel: "Sm",
    endpointLabel: "Phone Number",
    installs: 0,
    installed: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    author: "Linko",
    description: "Send keys through WhatsApp messaging",
    pluginType: "builtin",
    iconBg: "#25D366",
    iconLabel: "Wa",
    endpointLabel: "Phone Number",
    installs: 0,
    installed: true,
  },
  {
    id: "webhook",
    name: "Webhook",
    author: "Linko",
    description: "Deliver via custom webhook endpoint",
    pluginType: "builtin",
    iconBg: "#E37400",
    iconLabel: "Wh",
    endpointLabel: "Webhook URL",
    installs: 0,
    installed: true,
  },
  {
    id: "discord",
    name: "Discord",
    author: "@discorddev",
    description: "Deliver keys via Discord DM using a custom bot",
    pluginType: "plugin",
    iconBg: "#5865F2",
    iconLabel: "D",
    endpointLabel: "Discord User ID",
    installs: 1800,
    installed: false,
  },
  {
    id: "kakao",
    name: "KakaoTalk",
    author: "@kakaodev",
    description: "Send product keys through KakaoTalk messaging",
    pluginType: "plugin",
    iconBg: "#FEE500",
    iconLabel: "Kt",
    endpointLabel: "Phone Number",
    installs: 2600,
    installed: true,
  },
  {
    id: "line",
    name: "LINE",
    author: "@linedev",
    description: "Deliver digital products via LINE messenger",
    pluginType: "plugin",
    iconBg: "#06C755",
    iconLabel: "L",
    endpointLabel: "LINE User ID",
    installs: 540,
    installed: false,
  },
  {
    id: "slack",
    name: "Slack",
    author: "@slackint",
    description: "Send delivery notifications to Slack channels",
    pluginType: "plugin",
    iconBg: "#4A154B",
    iconLabel: "Sl",
    endpointLabel: "Slack Webhook URL",
    installs: 320,
    installed: false,
  },
]

// ─── Orders Data ──────────────────────────────────────────────

export const allOrders: Order[] = [
  { id: "4X7PA", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", phone: "010-3821-4756", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CNVA-PRO1-7F3M", recipientName: "이정효", recipientPhone: "010-3821-4756", customerMemo: "leolee12@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "CNVA-PRO1-7F3M", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "3.5s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: 캔바 프로 Canva PRO 12개월\n키: CNVA-PRO1-7F3M\n\n감사합니다!" },
  { id: "9K2BM", platform: "롯데몰", storeName: "롯데몰", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", phone: "010-5534-2198", delivery: "Email", deliveryTarget: "g2g_buyer_8821", keyCode: "STMW-50GC-A2K9", recipientName: "Alex Turner", recipientPhone: "010-5534-2198", customerMemo: "", adminMemo: "", quantity: 2, items: [{ type: "giftcard", keyCode: "STMW-50GC-A2K9", status: "Delivered" }, { type: "giftcard", keyCode: "STMW-50GC-B3R7", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.8s", deliveryConfirmed: "4.2s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Steam Wallet $50 Gift Card\nKey: STMW-50GC-A2K9\n\nThank you!" },
  { id: "3F8QN", platform: "지마켓", storeName: "지마켓", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", phone: "010-7741-9023", delivery: "SMS", deliveryTarget: "010-7741-9023", keyCode: "XGPU-1MON-9D1P", recipientName: "김수현", recipientPhone: "010-7741-9023", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XGPU-1MON-9D1P", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.1s" } },
  { id: "7W1DL", platform: "네이버 스토어", storeName: "몽키디지털", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", phone: "010-2293-6847", delivery: "Email", deliveryTarget: "minji_park@naver.com", keyCode: "W11P-RKEY-QW8E", recipientName: "박민지", recipientPhone: "010-2293-6847", customerMemo: "minji_park@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "W11P-RKEY-QW8E", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.8s" } },
  { id: "6R5VC", platform: "롯데몰", storeName: "롯데몰", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", phone: "010-8812-3374", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "ERNG-DLCX-5TN2", recipientName: "James Kim", recipientPhone: "010-8812-3374", customerMemo: "", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "ERNG-DLCX-5TN2", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.5s", deliveryConfirmed: "3.9s" } },
  { id: "2H9TE", platform: "지마켓", storeName: "지마켓", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", phone: "010-4467-8231", delivery: "WhatsApp", deliveryTarget: "+82 10-4467-8231", keyCode: "FIFA-25UE-0000", recipientName: "최영호", recipientPhone: "010-4467-8231", customerMemo: "", adminMemo: "WhatsApp 전송 실패 — 수신자 연결 불가. 키 미전달 상태.", quantity: 1, items: [{ keyCode: "FIFA-25UE-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "3.2s" }, errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered." },
  { id: "8M3KP", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 34.99, status: "Delivered", time: "1시간 전", product: "Adobe Creative Cloud 1개월", customer: "정하은", email: "haeun_j@naver.com", phone: "010-9923-5512", delivery: "Email", deliveryTarget: "haeun_j@naver.com", keyCode: "ADCC-1MON-R4TZ", recipientName: "정하은", recipientPhone: "010-9923-5512", customerMemo: "haeun_j@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "ADCC-1MON-R4TZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.6s" } },
  { id: "1Q6WJ", platform: "롯데몰", storeName: "롯데몰", amount: 19.99, status: "Delivered", time: "2시간 전", product: "Minecraft Java Edition", customer: "David Park", email: "g2g_buyer_5512", phone: "010-6634-7809", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "MNCR-JAVA-K8PL", recipientName: "David Park", recipientPhone: "010-6634-7809", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "MNCR-JAVA-K8PL", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.1s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Minecraft Java Edition\nKey: MNCR-JAVA-K8PL\n\nThank you!" },
  { id: "5T4NR", platform: "쿠팡", storeName: "쿠팡", amount: 89.99, status: "Delivered", time: "2시간 전", product: "Cyberpunk 2077 Ultimate Bundle", customer: "이서연", email: "seoyeon@gmail.com", phone: "010-1178-4423", delivery: "Email", deliveryTarget: "seoyeon@gmail.com", keyCode: "CP77-ULTB-M3VX", recipientName: "이서연", recipientPhone: "010-1178-4423", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "CP77-ULTB-M3VX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.3s" } },
  { id: "0L8FD", platform: "지마켓", storeName: "지마켓", amount: 15.99, status: "Processing", time: "3시간 전", product: "Netflix Gift Card $25", customer: "Tom Wilson", email: "g2a_user_4421", phone: "010-3356-8814", delivery: "SMS", deliveryTarget: "010-3356-8814", keyCode: "NFLX-25GC-W7HN", recipientName: "Tom Wilson", recipientPhone: "010-3356-8814", customerMemo: "", adminMemo: "", quantity: 1, items: [{ type: "giftcard", keyCode: "NFLX-25GC-W7HN", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.9s" } },
  { id: "4Y2GH", platform: "네이버 스토어", storeName: "디지털라운지", amount: 44.99, status: "Delivered", time: "3시간 전", product: "PS Plus Premium 3개월", customer: "한지민", email: "jimin_han@naver.com", phone: "010-7723-1956", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "PSPP-3MON-B5QA", recipientName: "한지민", recipientPhone: "010-7723-1956", customerMemo: "jimin_han@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "PSPP-3MON-B5QA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.6s", deliveryConfirmed: "4.0s" } },
  { id: "7N9XC", platform: "롯데몰", storeName: "롯데몰", amount: 27.50, status: "Failed", time: "4시간 전", product: "Valorant Points 2050 VP", customer: "Sarah Lee", email: "g2g_buyer_9903", phone: "010-5589-2341", delivery: "Email", deliveryTarget: "g2g_buyer_9903", keyCode: "VLRN-2050-0000", recipientName: "Sarah Lee", recipientPhone: "010-5589-2341", customerMemo: "", adminMemo: "결제 분쟁 발생 — 은행 측 거래 취소 처리됨.", quantity: 1, items: [{ keyCode: "VLRN-2050-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.8s", deliverySent: "2.4s" }, errorStep: "Step 2 — Payment Verification", errorMessage: "Payment disputed by buyer's bank. Transaction reversed." },
  { id: "3K1MZ", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 39.99, status: "Delivered", time: "4시간 전", product: "Spotify Premium 6개월", customer: "오준서", email: "junseo_oh@naver.com", phone: "010-2214-7763", delivery: "KakaoTalk", deliveryTarget: "junseo_oh", keyCode: "SPTF-6MON-J2YD", recipientName: "오준서", recipientPhone: "010-2214-7763", customerMemo: "junseo_oh@naver.com", adminMemo: "", quantity: 1, items: [{ type: "giftcard", keyCode: "SPTF-6MON-J2YD", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.9s" } },
  { id: "6P5BA", platform: "지마켓", storeName: "지마켓", amount: 54.99, status: "Delivered", time: "5시간 전", product: "Hogwarts Legacy Deluxe", customer: "김태현", email: "g2a_user_6678", phone: "010-8845-3127", delivery: "WhatsApp", deliveryTarget: "+82 10-8845-3127", keyCode: "HWLG-DLXE-T9FC", recipientName: "김태현", recipientPhone: "010-8845-3127", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "HWLG-DLXE-T9FC", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.7s", deliveryConfirmed: "3.8s" } },
  { id: "9D7QL", platform: "롯데몰", storeName: "롯데몰", amount: 22.00, status: "Delivered", time: "5시간 전", product: "Roblox Gift Card $25", customer: "Emily Chen", email: "g2g_buyer_3345", phone: "010-4412-6698", delivery: "Email", deliveryTarget: "g2g_buyer_3345", keyCode: "RBLX-25GC-N4WP", recipientName: "Emily Chen", recipientPhone: "010-4412-6698", customerMemo: "", adminMemo: "", quantity: 2, items: [{ type: "giftcard", keyCode: "RBLX-25GC-N4WP", status: "Delivered" }, { type: "giftcard", keyCode: "RBLX-25GC-M5XQ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.0s", deliveryConfirmed: "4.5s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Roblox Gift Card $25\nKey: RBLX-25GC-N4WP\n\nThank you!" },
  { id: "C1FVK", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 89000 / 1450, status: "Delivered", time: "1일 전", product: "포토샵 마스터 클래스 강의 패키지", customer: "김지훈", email: "jihoon_kim@naver.com", phone: "010-9912-3344", delivery: "KakaoTalk", deliveryTarget: "jihoon_kim", keyCode: "https://class.mont.kr/photoshop-master/jihoon_kim", recipientName: "김지훈", recipientPhone: "010-9912-3344", customerMemo: "", adminMemo: "", quantity: 1, items: [{ type: "link", keyCode: "https://class.mont.kr/photoshop-master/jihoon_kim", label: "강의 영상 보기", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.3s", deliveryConfirmed: "5.1s" } },
  { id: "D2GWL", platform: "네이버 스토어", storeName: "몽키디지털", amount: 59000 / 1450, status: "Delivered", time: "2일 전", product: "Final Cut Pro X 공식 설치 파일 (M1/M2)", customer: "이승현", email: "seunghyun_lee@naver.com", phone: "010-5566-7788", delivery: "Email", deliveryTarget: "seunghyun_lee@naver.com", keyCode: "FinalCutPro_10.7.1_mont.dmg", recipientName: "이승현", recipientPhone: "010-5566-7788", customerMemo: "", adminMemo: "", quantity: 1, items: [{ type: "file", keyCode: "FinalCutPro_10.7.1_mont.dmg", label: "FinalCutPro_10.7.1_mont.dmg", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.8s", deliverySent: "2.4s", deliveryConfirmed: "6.0s" } },
  { id: "2V0SE", platform: "쿠팡", storeName: "쿠팡", amount: 69.99, status: "Processing", time: "6시간 전", product: "Baldur's Gate 3 Digital Deluxe", customer: "박성민", email: "sungmin@vexora.team", phone: "010-6671-4489", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "BG3D-DLXE-H6RA", recipientName: "박성민", recipientPhone: "010-6671-4489", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "BG3D-DLXE-H6RA", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.8s" } },
  { id: "8F3TK", platform: "네이버 스토어", storeName: "몽키디지털", amount: 18.99, status: "Delivered", time: "7시간 전", product: "YouTube Premium 3개월", customer: "윤서아", email: "seoa_yoon@naver.com", phone: "010-3398-5521", delivery: "Email", deliveryTarget: "seoa_yoon@naver.com", keyCode: "YTPM-3MON-C1GX", recipientName: "윤서아", recipientPhone: "010-3398-5521", customerMemo: "seoa_yoon@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "YTPM-3MON-C1GX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.7s" } },
  { id: "5J9WN", platform: "롯데몰", storeName: "롯데몰", amount: 32.50, status: "Delivered", time: "8시간 전", product: "Diablo IV Standard Edition", customer: "Michael Cho", email: "g2g_buyer_7721", phone: "010-9967-1234", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "D4SE-STND-P8LZ", recipientName: "Michael Cho", recipientPhone: "010-9967-1234", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "D4SE-STND-P8LZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.4s", deliveryConfirmed: "3.3s" } },
  { id: "1R4HP", platform: "지마켓", storeName: "지마켓", amount: 11.99, status: "Delivered", time: "9시간 전", product: "Discord Nitro 1개월", customer: "강예진", email: "g2a_user_2234", phone: "010-1145-8876", delivery: "SMS", deliveryTarget: "010-1145-8876", keyCode: "DCNT-1MON-V5KB", recipientName: "강예진", recipientPhone: "010-1145-8876", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "DCNT-1MON-V5KB", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.4s" } },
  { id: "0X6CM", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 74.99, status: "Delivered", time: "10시간 전", product: "GTA V Premium + Whale Shark Card", customer: "이동현", email: "donghyun_lee@naver.com", phone: "010-7756-3312", delivery: "Email", deliveryTarget: "donghyun_lee@naver.com", keyCode: "GTAV-PWSC-S3QE", recipientName: "이동현", recipientPhone: "010-7756-3312", customerMemo: "donghyun_lee@naver.com", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "GTAV-PWSC-S3QE", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.5s", deliveryConfirmed: "3.6s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: GTA V Premium + Whale Shark Card\n키: GTAV-PWSC-S3QE\n\n감사합니다!" },
  { id: "2A3RF", platform: "롯데몰", storeName: "롯데몰", amount: 14.99, status: "Delivered", time: "10시간 전", product: "League of Legends 1380 RP", customer: "Chris Yang", email: "g2g_buyer_4410", phone: "010-4423-9981", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "LOL1-380R-P7KM", recipientName: "Chris Yang", recipientPhone: "010-4423-9981", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "LOL1-380R-P7KM", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "3.0s" } },
  { id: "8B7WQ", platform: "네이버 스토어", storeName: "디지털라운지", amount: 59.99, status: "Delivered", time: "11시간 전", product: "Microsoft 365 Family 1년", customer: "김나연", email: "nayeon_k@naver.com", phone: "010-8834-2267", delivery: "Email", deliveryTarget: "nayeon_k@naver.com", keyCode: "M365-FAM1-Y2NB", recipientName: "김나연", recipientPhone: "010-8834-2267", customerMemo: "nayeon_k@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "M365-FAM1-Y2NB", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.2s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: Microsoft 365 Family 1년\n키: M365-FAM1-Y2NB\n\n감사합니다!" },
  { id: "5C4XE", platform: "지마켓", storeName: "지마켓", amount: 39.99, status: "Processing", time: "11시간 전", product: "Starfield Standard Edition", customer: "Daniel Kwon", email: "g2a_user_5589", phone: "010-6612-4453", delivery: "SMS", deliveryTarget: "010-6612-4453", keyCode: "STRF-STND-Q4WC", recipientName: "Daniel Kwon", recipientPhone: "010-6612-4453", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "STRF-STND-Q4WC", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "2.3s" } },
  { id: "3D9LP", platform: "쿠팡", storeName: "쿠팡", amount: 9.99, status: "Delivered", time: "12시간 전", product: "Notion Plus 1개월", customer: "송유진", email: "yujin_song@gmail.com", phone: "010-2278-6634", delivery: "Email", deliveryTarget: "yujin_song@gmail.com", keyCode: "NOTN-PLUS-F8RV", recipientName: "송유진", recipientPhone: "010-2278-6634", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "NOTN-PLUS-F8RV", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.7s", deliveryConfirmed: "2.1s" } },
  { id: "7E2HN", platform: "롯데몰", storeName: "롯데몰", amount: 84.99, status: "Delivered", time: "12시간 전", product: "Call of Duty MW3 Vault Edition", customer: "Ryan Park", email: "g2g_buyer_6632", phone: "010-5541-7723", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CODM-W3VE-L5TA", recipientName: "Ryan Park", recipientPhone: "010-5541-7723", customerMemo: "", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "CODM-W3VE-L5TA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.6s", deliveryConfirmed: "4.1s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Call of Duty MW3 Vault Edition\nKey: CODM-W3VE-L5TA\n\nThank you!" },
  { id: "1F6JT", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 16.99, status: "Failed", time: "13시간 전", product: "ChatGPT Plus 1개월", customer: "임수빈", email: "subin_lim@naver.com", phone: "010-9912-3345", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CGPT-PLUS-0000", recipientName: "임수빈", recipientPhone: "010-9912-3345", customerMemo: "subin_lim@naver.com", adminMemo: "재고 소진으로 키 발급 실패 — 환불 처리 필요.", quantity: 1, items: [{ keyCode: "CGPT-PLUS-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "1.2s", deliverySent: "3.8s" }, errorStep: "Step 1 — Key Generation", errorMessage: "Inventory depleted. No available keys for this product." },
  { id: "4G8KV", platform: "지마켓", storeName: "지마켓", amount: 29.99, status: "Delivered", time: "13시간 전", product: "EA Play Pro 1개월", customer: "Jason Lim", email: "g2a_user_8812", phone: "010-3367-5598", delivery: "Email", deliveryTarget: "g2a_user_8812", keyCode: "EAPL-PRO1-D3MX", recipientName: "Jason Lim", recipientPhone: "010-3367-5598", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "EAPL-PRO1-D3MX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.8s" } },
  { id: "6H1MR", platform: "롯데몰", storeName: "롯데몰", amount: 45.00, status: "Delivered", time: "14시간 전", product: "PlayStation Store $50 Card", customer: "Olivia Kang", email: "g2g_buyer_2278", phone: "010-7789-4412", delivery: "SMS", deliveryTarget: "010-7789-4412", keyCode: "PSN5-0GCR-W9BN", recipientName: "Olivia Kang", recipientPhone: "010-7789-4412", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "PSN5-0GCR-W9BN", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.4s", deliveryConfirmed: "3.4s" } },
  { id: "9J5NW", platform: "네이버 스토어", storeName: "몽키디지털", amount: 21.99, status: "Delivered", time: "14시간 전", product: "Figma Professional 1개월", customer: "조은서", email: "eunseo_cho@naver.com", phone: "010-1156-8823", delivery: "Email", deliveryTarget: "eunseo_cho@naver.com", keyCode: "FGMA-PRO1-K7QZ", recipientName: "조은서", recipientPhone: "010-1156-8823", customerMemo: "eunseo_cho@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "FGMA-PRO1-K7QZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.5s" } },
  { id: "0K3PY", platform: "쿠팡", storeName: "쿠팡", amount: 119.99, status: "Delivered", time: "15시간 전", product: "Adobe Photoshop + Lightroom 1년", customer: "이하준", email: "hajun@vexora.team", phone: "010-4489-7756", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "ADPL-1YAR-G4HS", recipientName: "이하준", recipientPhone: "010-4489-7756", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "ADPL-1YAR-G4HS", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.2s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: Adobe Photoshop + Lightroom 1년\n키: ADPL-1YAR-G4HS\n\n감사합니다!" },
  { id: "2L8QA", platform: "지마켓", storeName: "지마켓", amount: 7.99, status: "Delivered", time: "15시간 전", product: "Spotify Gift Card $10", customer: "Amy Zhang", email: "g2a_user_1156", phone: "010-6623-1187", delivery: "Email", deliveryTarget: "g2a_user_1156", keyCode: "SPTF-10GC-N2VD", recipientName: "Amy Zhang", recipientPhone: "010-6623-1187", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "SPTF-10GC-N2VD", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.0s" } },
  { id: "5M4RB", platform: "롯데몰", storeName: "롯데몰", amount: 37.50, status: "Processing", time: "16시간 전", product: "Apex Legends 4350 Coins", customer: "Kevin Shin", email: "g2g_buyer_7743", phone: "010-8891-2234", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "APEX-4350-C8WF", recipientName: "Kevin Shin", recipientPhone: "010-8891-2234", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "APEX-4350-C8WF", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.2s" } },
  { id: "8N7SC", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 49.99, status: "Delivered", time: "16시간 전", product: "Nintendo eShop $50 Card", customer: "황지우", email: "jiwoo_hwang@naver.com", phone: "010-3345-9967", delivery: "SMS", deliveryTarget: "010-3345-9967", keyCode: "NESH-50GC-J6XP", recipientName: "황지우", recipientPhone: "010-3345-9967", customerMemo: "jiwoo_hwang@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "NESH-50GC-J6XP", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.1s" } },
  { id: "1P2TD", platform: "지마켓", storeName: "지마켓", amount: 64.99, status: "Delivered", time: "17시간 전", product: "Red Dead Redemption 2 Ultimate", customer: "최민호", email: "g2a_user_9945", phone: "010-5578-3312", delivery: "WhatsApp", deliveryTarget: "+82 10-5578-3312", keyCode: "RDR2-ULTE-B1YQ", recipientName: "최민호", recipientPhone: "010-5578-3312", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "RDR2-ULTE-B1YQ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.7s", deliveryConfirmed: "3.9s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Red Dead Redemption 2 Ultimate\nKey: RDR2-ULTE-B1YQ\n\nThank you!" },
  { id: "4Q9UE", platform: "롯데몰", storeName: "롯데몰", amount: 19.50, status: "Failed", time: "17시간 전", product: "Fortnite V-Bucks 2800", customer: "Sophia Yoo", email: "g2g_buyer_5501", phone: "010-2234-6678", delivery: "Email", deliveryTarget: "g2g_buyer_5501", keyCode: "FNVB-2800-0000", recipientName: "Sophia Yoo", recipientPhone: "010-2234-6678", customerMemo: "", adminMemo: "통화 불일치로 결제 실패 — EUR 결제, USD 필요. 환불 진행 중.", quantity: 1, items: [{ keyCode: "FNVB-2800-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.9s", deliverySent: "2.7s" }, errorStep: "Step 2 — Payment Verification", errorMessage: "Currency mismatch: buyer paid in EUR, expected USD. Refund initiated." },
  { id: "7R6VF", platform: "네이버 스토어", storeName: "디지털라운지", amount: 32.99, status: "Delivered", time: "18시간 전", product: "Zoom Pro 1개월", customer: "배수현", email: "suhyun_bae@naver.com", phone: "010-9934-5521", delivery: "Email", deliveryTarget: "suhyun_bae@naver.com", keyCode: "ZOOM-PRO1-A5ZR", recipientName: "배수현", recipientPhone: "010-9934-5521", customerMemo: "suhyun_bae@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "ZOOM-PRO1-A5ZR", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "2.9s" } },
  { id: "3S1WG", platform: "쿠팡", storeName: "쿠팡", amount: 44.99, status: "Delivered", time: "18시간 전", product: "Cursor Pro IDE 1개월", customer: "정우진", email: "woojin@vexora.team", phone: "010-4456-8891", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CRSR-PRO1-M8LS", recipientName: "정우진", recipientPhone: "010-4456-8891", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "CRSR-PRO1-M8LS", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.4s" } },
  { id: "6T5XH", platform: "롯데몰", storeName: "롯데몰", amount: 26.99, status: "Delivered", time: "19시간 전", product: "Overwatch 2 Battle Pass", customer: "Nathan Kim", email: "g2g_buyer_3389", phone: "010-7712-4456", delivery: "SMS", deliveryTarget: "010-7712-4456", keyCode: "OW2B-PASS-E4NT", recipientName: "Nathan Kim", recipientPhone: "010-7712-4456", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "OW2B-PASS-E4NT", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.0s" } },
  { id: "9U8YJ", platform: "지마켓", storeName: "지마켓", amount: 17.99, status: "Delivered", time: "19시간 전", product: "Crunchyroll Premium 3개월", customer: "안서윤", email: "g2a_user_6623", phone: "010-1189-7734", delivery: "Email", deliveryTarget: "g2a_user_6623", keyCode: "CRNC-3MON-H7PU", recipientName: "안서윤", recipientPhone: "010-1189-7734", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "CRNC-3MON-H7PU", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.7s" } },
  { id: "0V2ZK", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 89.99, status: "Delivered", time: "20시간 전", product: "Parallels Desktop Pro 1년", customer: "문재현", email: "jaehyun_moon@naver.com", phone: "010-6645-3378", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "PRLL-PRO1-R3GW", recipientName: "문재현", recipientPhone: "010-6645-3378", customerMemo: "jaehyun_moon@naver.com", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "PRLL-PRO1-R3GW", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.6s", deliveryConfirmed: "4.3s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: Parallels Desktop Pro 1년\n키: PRLL-PRO1-R3GW\n\n감사합니다!" },
  { id: "3W7AL", platform: "롯데몰", storeName: "롯데몰", amount: 55.00, status: "Delivered", time: "20시간 전", product: "Steam Wallet $60 Gift Card", customer: "Grace Choi", email: "g2g_buyer_8854", phone: "010-2267-9945", delivery: "Email", deliveryTarget: "g2g_buyer_8854", keyCode: "STMW-60GC-V9KX", recipientName: "Grace Choi", recipientPhone: "010-2267-9945", customerMemo: "", adminMemo: "", quantity: 2, items: [{ keyCode: "STMW-60GC-V9KX", status: "Delivered" }, { keyCode: "STMW-60GC-W1AZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "1.9s", deliveryConfirmed: "4.4s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Steam Wallet $60 Gift Card\nKey: STMW-60GC-V9KX\n\nThank you!" },
  { id: "6X4BM", platform: "지마켓", storeName: "지마켓", amount: 34.99, status: "Processing", time: "21시간 전", product: "Palworld Early Access", customer: "신예은", email: "g2a_user_4478", phone: "010-8823-6612", delivery: "WhatsApp", deliveryTarget: "+82 10-8823-6612", keyCode: "PLWL-EACC-T2DY", recipientName: "신예은", recipientPhone: "010-8823-6612", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "PLWL-EACC-T2DY", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "2.5s" } },
  { id: "9Y1CN", platform: "쿠팡", storeName: "쿠팡", amount: 149.99, status: "Delivered", time: "21시간 전", product: "JetBrains All Products Pack 1년", customer: "권도윤", email: "doyun@vexora.team", phone: "010-5512-8867", delivery: "Email", deliveryTarget: "doyun@vexora.team", keyCode: "JBAP-1YAR-U6FZ", recipientName: "권도윤", recipientPhone: "010-5512-8867", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "JBAP-1YAR-U6FZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.6s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: JetBrains All Products Pack 1년\n키: JBAP-1YAR-U6FZ\n\n감사합니다!" },
  { id: "2Z6DP", platform: "네이버 스토어", storeName: "몽키디지털", amount: 27.99, status: "Delivered", time: "22시간 전", product: "Midjourney Standard 1개월", customer: "유하린", email: "harin_yu@naver.com", phone: "010-3378-1156", delivery: "SMS", deliveryTarget: "010-3378-1156", keyCode: "MDJR-STD1-I8QA", recipientName: "유하린", recipientPhone: "010-3378-1156", customerMemo: "harin_yu@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "MDJR-STD1-I8QA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.4s", deliveryConfirmed: "3.3s" } },
  { id: "5A9EQ", platform: "롯데몰", storeName: "롯데몰", amount: 41.50, status: "Delivered", time: "23시간 전", product: "Monster Hunter Wilds", customer: "Brandon Lee", email: "g2g_buyer_1167", phone: "010-9901-4423", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "MHWL-STND-W4LB", recipientName: "Brandon Lee", recipientPhone: "010-9901-4423", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "MHWL-STND-W4LB", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.5s", deliveryConfirmed: "3.7s" } },
]

export const TOTAL_ORDERS = 156

export function parseRelativeTime(relTime: string): Date {
  const now = new Date()
  const match = relTime.match(/(\d+)\s*(분|시간)/)
  if (!match) return now
  const value = parseInt(match[1], 10)
  const unit = match[2]
  if (unit === "분") now.setMinutes(now.getMinutes() - value)
  else if (unit === "시간") now.setHours(now.getHours() - value)
  return now
}

export function formatStepTime(orderTime: string, stepSeconds: string): string {
  if (!stepSeconds || stepSeconds === "—") return "—"
  const sec = parseFloat(stepSeconds)
  if (Number.isNaN(sec)) return "—"
  const base = parseRelativeTime(orderTime)
  base.setSeconds(base.getSeconds() + Math.round(sec))
  const h = base.getHours()
  const m = base.getMinutes()
  const period = h < 12 ? "오전" : "오후"
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${period} ${h12}:${String(m).padStart(2, "0")}`
}
