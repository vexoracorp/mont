import { useState, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Copy, Check, ChevronLeft, ChevronRight, ChevronDown,
  RotateCcw, Send, X, Pencil, Loader2, Package, ShoppingCart, Megaphone,
} from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import DashboardLayout from "@/DashboardLayout"
import {
  type Currency,
  StatusBadge, platformBadges, PlatformBadgeIcon,
  deliveryChannels, formatUSD, formatKRW,
  allOrders, formatStepTime,
} from "@/shared"
import type { Locale } from "@/locale"

const translations = {
  en: {
    title: "Orders",
    searchPlaceholder: 'Search orders... Try "status:failed" or "sms:010-1234"',
    allOrdersLoaded: (count: number) => `All ${count} orders loaded`,
    ordersLoaded: "orders loaded",
    of: "of",
    orderID: "Order ID",
    product: "Product",
    customer: "Customer",
    platform: "Platform",
    amount: "Amount",
    status: "Status",
    delivery: "Delivery",
    time: "Time",
    overview: "Overview",
    logs: "Logs",
    source: "Source",
    license: "License",
    channel: "Channel",
    productLabel: "PRODUCT",
    buyer: "BUYER",
    name: "Name",
    phone: "Phone",
    email: "Email",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    deliveryDetails: "DELIVERY DETAILS",
    from: "From",
    to: "To",
    channelTarget: "Channel Target",
    delivered: "Delivered",
    pending: "Pending",
    failed: "Failed",
    resendVia: (ch: string) => `Resend via ${ch}`,
    licenseLabel: "LICENSE",
    reassignLicense: "Reassign License",
    retry: "Retry",
    adminMemo: "ADMIN MEMO",
    addNote: "Add a note...",
    saving: "저장 중...",
    autoSaved: "자동 저장됨",
    autoSave: "자동 저장",
    dangerZone: "DANGER ZONE",
    cancelOrder: "Cancel Order",
    deleteOrder: "Delete Order",
    orderCreated: "Order created",
    licenseAssigned: "License assigned",
    licenseAssignmentFailed: "License assignment failed",
    deliverySent: "Delivery sent",
    deliveryFailed: "Delivery failed",
    deliveryPending: "Delivery pending",
    deliveryConfirmed: "Delivery confirmed",
    totalTime: "총 소요 시간:",
    normalDelivery: "✓ 정상 전달 완료",
    recipient: "받는 사람:",
    showRawData: "Show Raw Data",
    hideRawData: "Hide Raw Data",
    field: "Field",
    value: "Value",
    goToMerchants: "Go to Merchants",
    viewOn: (platform: string) => `View on ${platform}`,
    orderIdLabel: "Order ID",
    customerLabel: "Customer",
    amountLabel: "Amount",
    orderReceived: "Order received",
    licenseDetails: "License Details",
    retryAssignment: "Retry Assignment",
    viewInInventory: "View in Inventory",
    assignedAt: "Assigned at",
    deliveryLabel: "Delivery",
    statusLabel: "Status",
    sentAt: "Sent at",
    confirmedAt: "Confirmed at",
    resend: "재발송하기",
    viewMessage: "보낸 메시지 원문 보기",
    viewRawData: "Raw Data 보기",
    messageTitle: "보낸 메시지 원문",
    noMessage: "No delivery message available.",
    resendConfirmTitle: "재발송하시겠습니까?",
    resendConfirmDesc: "아래 채널로 메시지를 다시 발송합니다.",
    resending: "재발송중...",
    resendingDesc: "채널로 메시지를 발송하고 있습니다...",
    resendingChannel: (ch: string) => `${ch}로 발송중...`,
    resendComplete: "재발송 완료",
    resendCompleteDesc: "메시지가 성공적으로 재발송되었습니다.",
    resendFailedTitle: "재발송 실패",
    resendFailedDesc: "메시지 재발송에 실패했습니다. 다시 시도해주세요.",
    sendComplete: "발송 완료",
    sendFailed: "발송 실패",
    sendCompleteDesc: (target: string) => `${target}으로 재발송되었습니다.`,
    channelError: "채널 연결 오류가 발생했습니다.",
    recipientLabel: "받는 사람",
    targetLabel: "대상",
    productShort: "상품",
    keyLabel: "키",
    cancelBtn: "취소",
    resendBtn: "재발송",
    confirm: "확인",
    retryComplete: "Retry Complete",
    retrying: "Retrying...",
    retryLicenseAssignment: "Retry License Assignment",
    retryCompleteDesc: "The license assignment workflow has been re-executed.",
    retryingDesc: "Re-running the license assignment step...",
    retryDesc: "This will re-execute the license assignment step of the delivery workflow. Only the license assignment will be retried — other steps are not affected.",
    assigningLicense: "Assigning license...",
    licenseAssignedSuccess: "License assigned successfully",
    duration: "Duration",
    done: "Done",
    retryNow: "Retry Now",
    licenseReassigned: "License Reassigned",
    reassignLicenseTitle: "Reassign License",
    reassignedDesc: (count: number) => `${count} license(s) have been assigned to this order.`,
    selectLicenses: (id: string) => `Select available licenses to assign to order #${id}.`,
    reassigned: (count: number) => `${count} license(s) reassigned`,
    availableKeys: (count: number) => `AVAILABLE KEYS (${count})`,
    added: "Added",
    currentKeyWarning: (key: string) => `The current key (${key}) will be released back to inventory.`,
    assign: (count: number) => count > 0 ? `Assign ${count} Key(s)` : "Assign Selected Keys",
    keyPlaceholderWarning: "⚠ Key ends with 0000 — may be a placeholder",
    licenses: (qty: number) => `${qty}개 라이선스`,
  },
  kr: {
    title: "주문",
    searchPlaceholder: '주문 검색... "status:failed" 또는 "sms:010-1234"',
    allOrdersLoaded: (count: number) => `전체 ${count}건 로드 완료`,
    ordersLoaded: "건 로드됨",
    of: "/",
    orderID: "주문 ID",
    product: "상품",
    customer: "고객",
    platform: "플랫폼",
    amount: "금액",
    status: "상태",
    delivery: "배송 방법",
    time: "시간",
    overview: "개요",
    logs: "로그",
    source: "출처",
    license: "라이선스",
    channel: "채널",
    productLabel: "상품",
    buyer: "구매자",
    name: "이름",
    phone: "전화번호",
    email: "이메일",
    edit: "수정",
    cancel: "취소",
    save: "저장",
    deliveryDetails: "배송 상세",
    from: "보내는 곳",
    to: "받는 사람",
    channelTarget: "채널 대상",
    delivered: "배송 완료",
    pending: "대기 중",
    failed: "실패",
    resendVia: (ch: string) => `${ch}로 재발송`,
    licenseLabel: "라이선스",
    reassignLicense: "라이선스 재할당",
    retry: "재시도",
    adminMemo: "관리자 메모",
    addNote: "메모 추가...",
    saving: "저장 중...",
    autoSaved: "자동 저장됨",
    autoSave: "자동 저장",
    dangerZone: "DANGER ZONE",
    cancelOrder: "주문 취소",
    deleteOrder: "주문 삭제",
    orderCreated: "주문 생성",
    licenseAssigned: "라이선스 할당",
    licenseAssignmentFailed: "라이선스 할당 실패",
    deliverySent: "배송 발송",
    deliveryFailed: "배송 실패",
    deliveryPending: "배송 대기 중",
    deliveryConfirmed: "배송 확인",
    totalTime: "총 소요 시간:",
    normalDelivery: "✓ 정상 전달 완료",
    recipient: "받는 사람:",
    showRawData: "Raw Data 보기",
    hideRawData: "Raw Data 숨기기",
    field: "필드",
    value: "값",
    goToMerchants: "머천트로 이동",
    viewOn: (platform: string) => `${platform}에서 보기`,
    orderIdLabel: "주문 ID",
    customerLabel: "고객",
    amountLabel: "금액",
    orderReceived: "주문 접수",
    licenseDetails: "라이선스 상세",
    retryAssignment: "할당 재시도",
    viewInInventory: "재고에서 보기",
    assignedAt: "할당 시간",
    deliveryLabel: "배송",
    statusLabel: "상태",
    sentAt: "발송 시간",
    confirmedAt: "확인 시간",
    resend: "재발송하기",
    viewMessage: "보낸 메시지 원문 보기",
    viewRawData: "Raw Data 보기",
    messageTitle: "보낸 메시지 원문",
    noMessage: "전송된 메시지가 없습니다.",
    resendConfirmTitle: "재발송하시겠습니까?",
    resendConfirmDesc: "아래 채널로 메시지를 다시 발송합니다.",
    resending: "재발송중...",
    resendingDesc: "채널로 메시지를 발송하고 있습니다...",
    resendingChannel: (ch: string) => `${ch}로 발송중...`,
    resendComplete: "재발송 완료",
    resendCompleteDesc: "메시지가 성공적으로 재발송되었습니다.",
    resendFailedTitle: "재발송 실패",
    resendFailedDesc: "메시지 재발송에 실패했습니다. 다시 시도해주세요.",
    sendComplete: "발송 완료",
    sendFailed: "발송 실패",
    sendCompleteDesc: (target: string) => `${target}으로 재발송되었습니다.`,
    channelError: "채널 연결 오류가 발생했습니다.",
    recipientLabel: "받는 사람",
    targetLabel: "대상",
    productShort: "상품",
    keyLabel: "키",
    cancelBtn: "취소",
    resendBtn: "재발송",
    confirm: "확인",
    retryComplete: "재시도 완료",
    retrying: "재시도 중...",
    retryLicenseAssignment: "라이선스 할당 재시도",
    retryCompleteDesc: "라이선스 할당 워크플로우가 재실행되었습니다.",
    retryingDesc: "라이선스 할당 단계를 재실행 중...",
    retryDesc: "배송 워크플로우의 라이선스 할당 단계를 재실행합니다. 라이선스 할당만 재시도되며 다른 단계는 영향을 받지 않습니다.",
    assigningLicense: "라이선스 할당 중...",
    licenseAssignedSuccess: "라이선스 할당 완료",
    duration: "소요 시간",
    done: "완료",
    retryNow: "지금 재시도",
    licenseReassigned: "라이선스 재할당됨",
    reassignLicenseTitle: "라이선스 재할당",
    reassignedDesc: (count: number) => `${count}개 라이선스가 이 주문에 할당되었습니다.`,
    selectLicenses: (id: string) => `주문 #${id}에 할당할 수 있는 라이선스를 선택하세요.`,
    reassigned: (count: number) => `${count}개 라이선스 재할당됨`,
    availableKeys: (count: number) => `사용 가능한 키 (${count})`,
    added: "추가됨",
    currentKeyWarning: (key: string) => `현재 키(${key})는 재고로 반환됩니다.`,
    assign: (count: number) => count > 0 ? `${count}개 키 할당` : "선택한 키 할당",
    keyPlaceholderWarning: "⚠ 키가 0000으로 끝남 — 플레이스홀더일 수 있음",
    licenses: (qty: number) => `${qty}개 라이선스`,
  },
} as const

export default function OrderDetail({ locale = "en" }: { locale?: Locale }) {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const order = allOrders.find((o) => o.id === orderId) ?? null
  const t = translations[locale]

  const [currency, setCurrency] = useState<Currency>("KRW")
  const [copiedItemIdx, setCopiedItemIdx] = useState<number | null>(null)
  const [memoFocused, setMemoFocused] = useState(false)
  const [memoSaveStatus, setMemoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const memoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copiedRawData, setCopiedRawData] = useState(false)
  const [buyerEditing, setBuyerEditing] = useState(false)
  const [statusEditing, setStatusEditing] = useState(false)
  const [channelExpanded, setChannelExpanded] = useState(false)
  const [sourcePopupOpen, setSourcePopupOpen] = useState(false)
  const [licensePopupOpen, setLicensePopupOpen] = useState(false)
  const [copiedLicenseKey, setCopiedLicenseKey] = useState(false)
  const [showRawData, setShowRawData] = useState(false)
  const [channelResendConfirm, setChannelResendConfirm] = useState(false)
  const [resendRunning, setResendRunning] = useState(false)
  const [resendDone, setResendDone] = useState<"success" | "failed" | null>(null)
  const [retryDialogOpen, setRetryDialogOpen] = useState(false)
  const [retryRunning, setRetryRunning] = useState(false)
  const [retryDone, setRetryDone] = useState(false)
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
  const [reassignRunning, setReassignRunning] = useState(false)
  const [reassignDone, setReassignDone] = useState(false)
  const [reassignSelectedKey, setReassignSelectedKey] = useState<string[]>([])
  const [messagePopupOpen, setMessagePopupOpen] = useState(false)
  const [rawDataPopupOpen, setRawDataPopupOpen] = useState(false)
  const [advancedResendOpen, setAdvancedResendOpen] = useState(false)
  const [resendChannel, setResendChannel] = useState<string>("")
  const [resendTarget, setResendTarget] = useState("")
  const [sendMsgOpen, setSendMsgOpen] = useState(false)
  const [sendMsgType, setSendMsgType] = useState<"product" | "confirm" | "announcement" | null>(null)
  const [sendMsgChannel, setSendMsgChannel] = useState<string>("")
  const [sendMsgTarget, setSendMsgTarget] = useState("")
  const [sendMsgContent, setSendMsgContent] = useState("")
  const [sendMsgRunning, setSendMsgRunning] = useState(false)
  const [sendMsgDone, setSendMsgDone] = useState<"success" | "failed" | null>(null)

  const handleMemoChange = useCallback(() => {
    setMemoSaveStatus("saving")
    if (memoSaveTimerRef.current) clearTimeout(memoSaveTimerRef.current)
    memoSaveTimerRef.current = setTimeout(() => {
      setMemoSaveStatus("saved")
      memoSaveTimerRef.current = setTimeout(() => setMemoSaveStatus("idle"), 2000)
    }, 1000)
  }, [])

  const handleCopyKey = (key: string, idx: number) => {
    void navigator.clipboard.writeText(key)
    setCopiedItemIdx(idx)
    setTimeout(() => setCopiedItemIdx(null), 1500)
  }

  const handleCopyRawData = (text: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedRawData(true)
    setTimeout(() => setCopiedRawData(false), 1500)
  }

  if (!order) {
    return (
      <DashboardLayout title={locale === "kr" ? "주문 상세" : "Order Detail"} locale={locale} currency={currency} onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <p className="text-[16px] font-medium tracking-[-0.32px] text-[#666666]">
            {locale === "kr" ? "주문을 찾을 수 없습니다" : "Order not found"}
          </p>
          <button
            onClick={() => navigate(locale === "kr" ? "/kr/dashboard/orders" : "/dashboard/orders")}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} />
            {locale === "kr" ? "주문 목록으로" : "Back to Orders"}
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const pBadge = platformBadges[order.platform]
  const ch = deliveryChannels[order.delivery]
  const items = order.items ?? [{ keyCode: order.keyCode, status: order.status }]
  const qty = order.quantity ?? 1
  const statusDot = order.status === "Delivered" ? "bg-[#34A853]" : order.status === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"
  const rawJson = JSON.stringify(order, null, 2)

  const channels = [
    { id: "SMS", label: locale === "kr" ? "문자" : "SMS", color: "#33C758", icon: deliveryChannels.SMS?.icon },
    { id: "Email", label: locale === "kr" ? "이메일" : "Email", color: "#2C78FC", icon: deliveryChannels.Email?.icon },
    { id: "Telegram", label: "Telegram", color: "#2AABEE", icon: deliveryChannels.Telegram?.icon },
    { id: "WhatsApp", label: "WhatsApp", color: "#25D366", icon: deliveryChannels.WhatsApp?.icon },
  ]

  type WorkflowMsgType = "product" | "confirm" | "announcement"
  type WorkflowMsg = {
    id: string
    type: WorkflowMsgType
    channel: string
    target: string
    time: string
    status: "sent" | "failed" | "pending"
    content?: string
  }

  const msgTypeConfig: Record<WorkflowMsgType, { label: string; labelKr: string; icon: React.ReactNode; color: string; bg: string }> = {
    product: { label: "Product Delivery", labelKr: "제품 발송", icon: <Package className="size-3" strokeWidth={2} />, color: "#918DF6", bg: "rgba(145,141,246,0.12)" },
    confirm: { label: "Confirm Purchase", labelKr: "구매확정 요청", icon: <ShoppingCart className="size-3" strokeWidth={2} />, color: "#1A73E8", bg: "rgba(26,115,232,0.10)" },
    announcement: { label: "Announcement", labelKr: "공지", icon: <Megaphone className="size-3" strokeWidth={2} />, color: "#E37400", bg: "rgba(227,116,0,0.10)" },
  }

  const mockWorkflowMessages: WorkflowMsg[] = [
    { id: "wm1", type: "product", channel: order.delivery, target: order.deliveryTarget || order.email, time: order.time, status: order.status === "Failed" ? "failed" : "sent" },
    ...(order.status === "Delivered" ? [{ id: "wm2", type: "confirm" as WorkflowMsgType, channel: order.delivery, target: order.deliveryTarget || order.email, time: "직후", status: "sent" as const }] : []),
  ]

  const WorkflowMessagesSection = () => (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "발송 메시지" : "Messages"}</p>
        <button
          onClick={() => { setSendMsgType(null); setSendMsgChannel(order.delivery); setSendMsgTarget(order.deliveryTarget || order.email || ""); setSendMsgContent(""); setSendMsgRunning(false); setSendMsgDone(null); setSendMsgOpen(true) }}
          className="flex h-6 items-center gap-1 rounded-md border border-[rgba(0,0,0,0.08)] bg-white px-2 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
        >
          <Send className="size-2.5" strokeWidth={2} />
          {locale === "kr" ? "보내기" : "Send"}
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {mockWorkflowMessages.map((msg) => {
          const cfg = msgTypeConfig[msg.type]
          const msgCh = deliveryChannels[msg.channel]
          return (
            <div key={msg.id} className="flex items-start gap-2.5 rounded-lg border border-[rgba(0,0,0,0.07)] bg-[rgba(0,0,0,0.015)] px-3 py-2.5">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                {cfg.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#181925]">{locale === "kr" ? cfg.labelKr : cfg.label}</p>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-[-0.24px] ${msg.status === "sent" ? "bg-[#34A853]/10 text-[#34A853]" : msg.status === "failed" ? "bg-[#D93025]/10 text-[#D93025]" : "bg-[#E37400]/10 text-[#E37400]"}`}>
                    {msg.status === "sent" ? (locale === "kr" ? "발송됨" : "Sent") : msg.status === "failed" ? (locale === "kr" ? "실패" : "Failed") : (locale === "kr" ? "대기" : "Pending")}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  {msgCh && <span className="shrink-0" style={{ color: msgCh.color }}>{msgCh.icon}</span>}
                  <p className="truncate text-[11px] tracking-[-0.24px] text-[#999999]">{msg.target}</p>
                </div>
                <p className="mt-0.5 text-[11px] tracking-[-0.24px] text-[#bbbbbb]">{msg.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const TimelineContent = () => (
    <div className="relative flex flex-col">
      <div className="absolute left-[7px] top-2.5 bottom-2.5 w-px bg-[rgba(0,0,0,0.10)]" />
      <div className="relative flex items-start gap-3 pb-5">
        <span className="relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] border-[#1A73E8] bg-white" />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{t.orderCreated}</p>
          <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
            {formatStepTime(order.time, order.flowTiming?.orderCreated || "0")} · {order.storeName || order.platform}
          </p>
        </div>
      </div>
      <div className="relative flex items-start gap-3 pb-5">
        <span className={`relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] bg-white ${order.status === "Failed" && order.errorStep?.includes("Key") ? "border-[#D93025]" : "border-[#34A853]"}`} />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
            {order.status === "Failed" && order.errorStep?.includes("Key") ? t.licenseAssignmentFailed : t.licenseAssigned}
          </p>
          <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
            {formatStepTime(order.time, order.flowTiming?.licenseAssigned || "—")}
            {items.length > 0 && ` · ${items[0].keyCode}`}
          </p>
          {order.status === "Failed" && order.errorStep?.includes("Key") && order.errorMessage && (
            <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#D93025]">{order.errorMessage}</p>
          )}
        </div>
      </div>
      <div className="relative flex items-start gap-3 pb-5">
        <span className={`relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] bg-white ${order.status === "Failed" ? "border-[#D93025]" : order.status === "Processing" ? "border-[#E37400]" : "border-[#34A853]"}`} />
        <div>
          <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
            {order.status === "Failed" ? t.deliveryFailed : order.status === "Processing" ? t.deliveryPending : t.deliverySent}
          </p>
          <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
            {formatStepTime(order.time, order.flowTiming?.deliverySent || "—")} · {order.delivery} → {order.deliveryTarget || "—"}
          </p>
          {order.status === "Failed" && order.errorMessage && !order.errorStep?.includes("Key") && (
            <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#D93025]">{order.errorMessage}</p>
          )}
        </div>
      </div>
      {order.status === "Delivered" && order.flowTiming?.deliveryConfirmed && (
        <div className="relative flex items-start gap-3">
          <span className="relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] border-[#34A853] bg-white" />
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{t.deliveryConfirmed}</p>
            <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
              {formatStepTime(order.time, order.flowTiming.deliveryConfirmed)} · {t.totalTime} {order.flowTiming.deliveryConfirmed}
            </p>
            <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">{t.normalDelivery}</p>
          </div>
        </div>
      )}
    </div>
  )

  const RawDataSection = () => (
    <div className="mt-6 border-t border-[rgba(0,0,0,0.08)] pt-4">
      <button
        onClick={() => setShowRawData(!showRawData)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
      >
        <ChevronDown className={`size-3 transition-transform ${showRawData ? "rotate-180" : ""}`} strokeWidth={2} />
        {showRawData ? t.hideRawData : t.showRawData}
      </button>
      {showRawData && (
        <div className="relative mt-3">
          <pre className="max-h-60 overflow-auto rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-4 font-mono text-[11px] leading-relaxed text-[#666666] whitespace-pre-wrap">{rawJson}</pre>
          <button onClick={() => handleCopyRawData(rawJson)} className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-white border border-[rgba(0,0,0,0.08)] transition-colors hover:bg-[rgba(0,0,0,0.04)]">
            {copiedRawData ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <DashboardLayout title={locale === "kr" ? "주문 상세" : "Order Detail"} locale={locale} currency={currency} onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}>
      <div className="flex flex-1 flex-col overflow-hidden px-5 pt-3 pb-3 lg:px-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(locale === "kr" ? "/kr/dashboard/orders" : "/dashboard/orders")} className="flex items-center gap-1.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:text-[#181925]">
              <ChevronLeft className="size-4" strokeWidth={2} />
              {locale === "kr" ? "주문" : "Orders"}
            </button>
            <span className="text-[#E0E0E0]">/</span>
            <h1 className="text-[16px] font-bold tracking-[-0.32px] text-[#181925]">Order #{order.id}</h1>
            <div className="relative flex items-center gap-1.5">
              <StatusBadge status={order.status} locale={locale} />
              <button onClick={() => setStatusEditing(!statusEditing)} className="flex size-5 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]">
                <Pencil className="size-3 text-[#999999]" strokeWidth={2} />
              </button>
              {statusEditing && (
                <div className="absolute top-full left-0 z-50 mt-1.5 flex flex-col rounded-lg border border-[rgba(0,0,0,0.08)] bg-white py-1 shadow-lg">
                  {(["Delivered", "Processing", "Failed"] as const).map((s) => (
                    <button key={s} onClick={() => setStatusEditing(false)} className={`flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium tracking-[-0.32px] transition-colors hover:bg-[rgba(0,0,0,0.04)] ${s === order.status ? "text-[#181925]" : "text-[#666666]"}`}>
                      <span className={`size-1.5 rounded-full ${s === "Delivered" ? "bg-[#34A853]" : s === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"}`} />
                      {s}
                      {s === order.status && <Check className="ml-1 size-3 text-[#181925]" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => { setSendMsgType(null); setSendMsgChannel(order.delivery); setSendMsgTarget(order.deliveryTarget || order.email || ""); setSendMsgContent(""); setSendMsgRunning(false); setSendMsgDone(null); setSendMsgOpen(true) }}
            className="flex h-8 items-center gap-1.5 rounded-full bg-[#181925] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d]"
          >
            <Send className="size-3.5" strokeWidth={2} />
            {locale === "kr" ? "메시지 보내기" : "Send Message"}
          </button>
        </div>

        <div className="flex flex-1 gap-4 overflow-hidden lg:gap-5">
          <div className="flex flex-1 flex-col overflow-y-auto rounded-xl border border-[rgba(0,0,0,0.08)] bg-white" style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}>
            <div className="bg-[rgba(0,0,0,0.02)] px-5 py-4">
              <div className="flex items-stretch gap-0">
                <button onClick={() => setSourcePopupOpen(true)} className="group flex min-w-0 flex-1 flex-col rounded-l-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3.5 text-left transition-all hover:border-[#918DF6]/30 hover:bg-[#918DF6]/[0.02] hover:shadow-sm">
                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.source}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {pBadge && <PlatformBadgeIcon badge={pBadge} size="size-5" />}
                    <span className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.platform}</span>
                  </div>
                  <p className="mt-1 truncate text-[13px] tracking-[-0.32px] text-[#666666]">{order.storeName || order.platform}</p>
                  <p className="mt-1 flex items-center gap-0.5 text-[11px] font-medium tracking-[-0.32px] text-[#918DF6]">{locale === "kr" ? "자세히" : "Details"}<ChevronRight className="size-3" strokeWidth={2.5} /></p>
                </button>
                <button onClick={() => setLicensePopupOpen(true)} className="group flex min-w-0 flex-1 flex-col border-y border-[rgba(0,0,0,0.08)] bg-white px-4 py-3.5 text-left transition-all hover:border-[#918DF6]/30 hover:bg-[#918DF6]/[0.02] hover:shadow-sm">
                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.license}</p>
                  <p className="mt-2 truncate font-mono text-[13px] tracking-[-0.32px] text-[#181925]">{qty > 1 ? t.licenses(qty) : (items[0]?.keyCode || order.keyCode)}</p>
                  <p className="mt-1 truncate text-[12px] tracking-[-0.32px] text-[#666666]">{order.product}</p>
                  <p className="mt-1 flex items-center gap-0.5 text-[11px] font-medium tracking-[-0.32px] text-[#918DF6]">{locale === "kr" ? "자세히" : "Details"}<ChevronRight className="size-3" strokeWidth={2.5} /></p>
                </button>
                <button onClick={() => setChannelExpanded(true)} className={`group flex min-w-0 flex-1 flex-col rounded-r-lg border px-4 py-3.5 text-left transition-all hover:shadow-sm ${order.status === "Failed" ? "border-[#D93025]/30 bg-[#D93025]/[0.03] hover:bg-[#D93025]/[0.06]" : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[#918DF6]/30 hover:bg-[#918DF6]/[0.02]"}`}>
                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.channel}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {ch && <span style={{ color: ch.color }}>{ch.icon}</span>}
                    <span className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.delivery}</span>
                    <span className={`size-2 shrink-0 rounded-full ${statusDot}`} />
                  </div>
                  <p className="mt-1 truncate text-[13px] tracking-[-0.32px] text-[#666666]">{order.deliveryTarget || "—"}</p>
                  {order.status === "Failed" && order.errorMessage && (
                    <div className="mt-2 rounded-md border border-[#D93025]/15 bg-[#D93025]/[0.06] px-2.5 py-2">
                      <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#D93025]">{order.errorStep}</p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">{order.errorMessage}</p>
                    </div>
                  )}
                  <p className="mt-1 flex items-center gap-0.5 text-[11px] font-medium tracking-[-0.32px] text-[#918DF6]">{locale === "kr" ? "자세히" : "Details"}<ChevronRight className="size-3" strokeWidth={2.5} /></p>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-0 divide-y divide-[rgba(0,0,0,0.08)]">
              {/* Product summary */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.productLabel}</p>
                    <p className="mt-1.5 text-[15px] font-medium tracking-[-0.32px] text-[#181925]">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "판매금액" : "Sale"}</p>
                    <p className="text-[15px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{locale === "kr" ? formatKRW(order.amount) : formatUSD(order.amount)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-[12px] tracking-[-0.32px] text-[#666666]">
                  <span>Profit <span className="font-medium text-[#34A853]">{locale === "kr" ? formatKRW(order.amount * 0.3) : formatUSD(order.amount * 0.3)}</span></span>
                  <span className="text-[rgba(0,0,0,0.15)]">|</span>
                  <span>Qty: {qty}</span>
                </div>
              </div>

              {/* Buyer */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.buyer}</p>
                  {!buyerEditing && <button onClick={() => setBuyerEditing(true)} className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6] hover:underline">{t.edit}</button>}
                </div>
                {buyerEditing ? (
                  <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.name}</p><input defaultValue={order.customer} className="mt-0.5 h-7 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none" /></div>
                    <div><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.phone}</p><input defaultValue={order.phone || ""} className="mt-0.5 h-7 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none" /></div>
                    <div className="col-span-2"><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.email}</p><input defaultValue={order.email} className="mt-0.5 h-7 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none" /></div>
                    <div className="col-span-2 flex justify-end gap-2"><button onClick={() => setBuyerEditing(false)} className="h-7 rounded-lg px-2.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">{t.cancel}</button><button onClick={() => setBuyerEditing(false)} className="h-7 rounded-lg bg-[#181925] px-2.5 text-[11px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3a]">{t.save}</button></div>
                  </div>
                ) : (
                  <div className="mt-2.5 grid grid-cols-3 gap-4">
                    <div><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.name}</p><p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.customer}</p></div>
                    <div><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.phone}</p><p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.phone || "—"}</p></div>
                    <div><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.email}</p><p className="mt-0.5 truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.email}</p></div>
                  </div>
                )}
              </div>

              {/* Delivery Details */}
              <div className="p-4">
                <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.deliveryDetails}</p>
                <div className="mt-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)]">
                  <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.06)] px-4 py-3">
                    {ch && <span className="text-lg" style={{ color: ch.color }}>{ch.icon}</span>}
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{order.delivery}</p>
                      <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{order.deliveryTarget || "—"}</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.06)] bg-white px-2.5 py-1">
                      <span className={`size-2 rounded-full ${statusDot}`} />
                      <span className="text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{order.status === "Delivered" ? t.delivered : order.status === "Processing" ? t.pending : t.failed}</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-[13px] tracking-[-0.32px] text-[#666666]"><span className="font-medium text-[#181925]">{order.recipientName || order.customer}</span>{" · "}{order.time}{" · "}{order.storeName || order.platform}</p>
                  </div>
                  {order.status === "Failed" && order.errorMessage && (
                    <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-3">
                      <div className="rounded-md border border-[#D93025]/15 bg-[#D93025]/[0.04] px-3 py-2.5">
                        <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#D93025]">{order.errorStep}</p>
                        <p className="mt-1 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">{order.errorMessage}</p>
                      </div>
                    </div>
                  )}
                  <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-3">
                    <button onClick={() => setChannelResendConfirm(true)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"><RotateCcw className="size-3.5" strokeWidth={2} />{t.resendVia(order.delivery)}</button>
                  </div>
                </div>
              </div>

              {/* License */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.licenseLabel}</p>
                  {qty > 1 && <span className="rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold tabular-nums tracking-[-0.32px] text-[#666666]">{qty}</span>}
                </div>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-3 py-2">
                      <span className={`size-1.5 shrink-0 rounded-full ${item.status === "Delivered" ? "bg-[#34A853]" : item.status === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"}`} />
                      <span className="flex-1 truncate font-mono text-[12px] tracking-[-0.32px] text-[#181925]">{item.keyCode}</span>
                      <button onClick={(event) => { event.stopPropagation(); handleCopyKey(item.keyCode, idx) }} className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]">{copiedItemIdx === idx ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}</button>
                    </div>
                  ))}
                </div>
                {order.keyCode.endsWith("0000") && <p className="mt-2 text-[11px] tracking-[-0.32px] text-[#E37400]">{t.keyPlaceholderWarning}</p>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => { setReassignSelectedKey([]); setReassignRunning(false); setReassignDone(false); setReassignDialogOpen(true) }} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">{t.reassignLicense}</button>
                  <button onClick={() => { setRetryRunning(false); setRetryDone(false); setRetryDialogOpen(true) }} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"><RotateCcw className="size-3.5" strokeWidth={2} />{t.retry}</button>
                </div>
              </div>

              {/* Admin Memo */}
              <div className="p-4">
                <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.adminMemo}</p>
                <textarea defaultValue={order.adminMemo || ""} placeholder={t.addNote} rows={memoFocused || (order.adminMemo && order.adminMemo.length > 0) ? 3 : 1} onFocus={() => setMemoFocused(true)} onBlur={() => setMemoFocused(false)} onChange={handleMemoChange} className="mt-2 w-full resize-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 py-2 text-[12px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none transition-all" />
                <div className="mt-1 flex items-center gap-1.5">
                  {memoSaveStatus === "saving" && <div className="flex items-center gap-1"><Loader2 className="size-3 animate-spin text-[#999999]" strokeWidth={2} /><p className="text-[10px] tracking-[-0.32px] text-[#999999]">{t.saving}</p></div>}
                  {memoSaveStatus === "saved" && <div className="flex items-center gap-1"><Check className="size-3 text-[#34A853]" strokeWidth={2.5} /><p className="text-[10px] tracking-[-0.32px] text-[#34A853]">{t.autoSaved}</p></div>}
                  {memoSaveStatus === "idle" && <p className="text-[10px] tracking-[-0.32px] text-[#999999]">{t.autoSave}</p>}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="p-4">
                <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.dangerZone}</p>
                <div className="mt-3 flex gap-2">
                  <button className="inline-flex h-9 items-center rounded-lg border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/[0.04]">{t.cancelOrder}</button>
                  <button className="inline-flex h-9 items-center rounded-lg bg-[#D93025] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#c12b20]">{t.deleteOrder}</button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex w-[300px] shrink-0 flex-col overflow-y-auto rounded-xl border border-[rgba(0,0,0,0.08)] bg-white" style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}>
            <div className="border-b border-[rgba(0,0,0,0.08)] px-5 py-3.5">
              <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{locale === "kr" ? "활동" : "Activity"}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <WorkflowMessagesSection />
              <div className="mb-5 border-t border-[rgba(0,0,0,0.06)]" />
              <p className="mb-3 text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "타임라인" : "Timeline"}</p>
              <TimelineContent />
              <RawDataSection />
            </div>
          </div>
        </div>

        <div className="mt-4 lg:hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-5" style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}>
          <p className="mb-4 text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{locale === "kr" ? "활동" : "Activity"}</p>
          <WorkflowMessagesSection />
          <div className="mb-5 border-t border-[rgba(0,0,0,0.06)]" />
          <p className="mb-3 text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "타임라인" : "Timeline"}</p>
          <TimelineContent />
          <RawDataSection />
        </div>
      </div>

      <Dialog open={sourcePopupOpen} onOpenChange={(open) => { if (!open) setSourcePopupOpen(false) }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              {pBadge && <PlatformBadgeIcon badge={pBadge} size="size-9" />}
              <div>
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">{order.platform}</DialogTitle>
                <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#999999]">{order.storeName || order.platform}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2.5 rounded-lg bg-[rgba(0,0,0,0.02)] px-4 py-3">
              <div className="flex items-center justify-between"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.orderIdLabel}</span><span className="font-mono text-[13px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">#{order.id}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.customerLabel}</span><span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{order.customer}</span></div>
              <div className="flex items-center justify-between gap-3"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.amountLabel}</span><span className="text-[13px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">{locale === "kr" ? formatKRW(order.amount) : formatUSD(order.amount)}</span></div>
              {order.flowTiming && <div className="flex items-center justify-between gap-3"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.orderReceived}</span><span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{order.flowTiming.orderCreated}</span></div>}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => setSourcePopupOpen(false)} className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]">{t.goToMerchants}</button>
              <button onClick={() => setSourcePopupOpen(false)} className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">{t.viewOn(order.platform)}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={licensePopupOpen} onOpenChange={(open) => { if (!open) { setLicensePopupOpen(false); setCopiedLicenseKey(false) } }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">{t.licenseDetails}</DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#999999]">{order.product}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div key={item.keyCode} className="flex items-center justify-between rounded-lg bg-[rgba(0,0,0,0.02)] px-4 py-3">
                <div className="min-w-0 flex-1">
                  {qty > 1 && <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Key {idx + 1}</p>}
                  <p className="truncate font-mono text-[14px] font-medium tracking-[0.3px] text-[#181925]">{item.keyCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${item.status === "Delivered" ? "bg-[#34A853]" : item.status === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"}`} />
                  <button onClick={() => { void navigator.clipboard.writeText(item.keyCode); setCopiedLicenseKey(true); setTimeout(() => setCopiedLicenseKey(false), 1500) }} className="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]">{copiedLicenseKey ? <Check className="size-4 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-4 text-[#999999]" strokeWidth={2} />}</button>
                </div>
              </div>
            ))}
            {order.flowTiming && <div className="flex flex-col gap-2.5 rounded-lg bg-[rgba(0,0,0,0.02)] px-4 py-3"><div className="flex items-center justify-between"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.assignedAt}</span><span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{order.flowTiming.licenseAssigned}</span></div></div>}
            <div className="flex flex-col gap-2">
              <button onClick={() => { setLicensePopupOpen(false); setRetryDialogOpen(true) }} className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"><RotateCcw className="size-4" strokeWidth={2} />{t.retryAssignment}</button>
              <button onClick={() => { setLicensePopupOpen(false); setReassignDialogOpen(true) }} className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">{t.reassignLicense}</button>
              <button onClick={() => setLicensePopupOpen(false)} className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">{t.viewInInventory}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={channelExpanded} onOpenChange={(open) => { if (!open) setChannelExpanded(false) }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              {ch && <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${ch.color}18`, color: ch.color }}>{ch.icon}</span>}
              <div>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{order.delivery} Delivery</DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">{order.deliveryTarget || "—"}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between rounded-lg bg-[rgba(0,0,0,0.02)] px-3.5 py-2.5"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.statusLabel}</span><StatusBadge status={order.status} locale={locale} /></div>
            {order.flowTiming && <div className="flex flex-col gap-2 rounded-lg bg-[rgba(0,0,0,0.02)] px-3.5 py-2.5"><div className="flex items-center justify-between"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.sentAt}</span><span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{order.flowTiming.deliverySent}</span></div>{order.flowTiming.deliveryConfirmed && <div className="flex items-center justify-between"><span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.confirmedAt}</span><span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#34A853]">{order.flowTiming.deliveryConfirmed}</span></div>}</div>}
            <div className="flex flex-col gap-2">
              <button onClick={() => { setChannelExpanded(false); setChannelResendConfirm(true) }} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-medium tracking-[-0.32px] text-white transition-colors" style={{ backgroundColor: ch?.color || "#181925" }}><Send className="size-3.5" strokeWidth={2} />{t.resend}</button>
              <button onClick={() => { setChannelExpanded(false); setMessagePopupOpen(true) }} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">{t.viewMessage}</button>
              <button onClick={() => { setChannelExpanded(false); setRawDataPopupOpen(true) }} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">{t.viewRawData}</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={messagePopupOpen} onOpenChange={setMessagePopupOpen}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{t.messageTitle}</DialogTitle>
            <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">#{order.id} · {order.delivery}</DialogDescription>
          </DialogHeader>
          <pre className="max-h-60 overflow-auto rounded-lg bg-[rgba(0,0,0,0.03)] p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-[#181925]">{order.deliveryMessage || t.noMessage}</pre>
        </DialogContent>
      </Dialog>

      <Dialog open={rawDataPopupOpen} onOpenChange={setRawDataPopupOpen}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">Raw Data</DialogTitle>
            <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">Order #{order.id}</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="max-h-80 overflow-auto rounded-lg bg-[rgba(0,0,0,0.03)] p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-[#666666]">{rawJson}</pre>
            <button onClick={() => handleCopyRawData(rawJson)} className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md border border-[rgba(0,0,0,0.08)] bg-white transition-colors hover:bg-[rgba(0,0,0,0.04)]">{copiedRawData ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={channelResendConfirm} onOpenChange={(open) => { if (!open) { setChannelResendConfirm(false); setResendRunning(false); setResendDone(null) } }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{resendDone === "success" ? t.resendComplete : resendDone === "failed" ? t.resendFailedTitle : resendRunning ? t.resending : t.resendConfirmTitle}</DialogTitle>
            <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">{resendDone === "success" ? t.resendCompleteDesc : resendDone === "failed" ? t.resendFailedDesc : resendRunning ? t.resendingDesc : t.resendConfirmDesc}</DialogDescription>
          </DialogHeader>
          {resendRunning && !resendDone && <div className="flex flex-col items-center gap-3 py-6"><Loader2 className="size-8 animate-spin" style={{ color: ch?.color || "#918DF6" }} strokeWidth={2} /><p className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.resendingChannel(order.delivery)}</p></div>}
          {resendDone === "success" && <div className="flex flex-col items-center gap-3 py-6"><span className="flex size-12 items-center justify-center rounded-full bg-[rgba(52,168,83,0.1)]"><Check className="size-6 text-[#34A853]" strokeWidth={2} /></span><div className="text-center"><p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{t.sendComplete}</p><p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">{t.sendCompleteDesc(order.deliveryTarget || "")}</p></div></div>}
          {resendDone === "failed" && <div className="flex flex-col items-center gap-3 py-6"><span className="flex size-12 items-center justify-center rounded-full bg-[rgba(217,48,37,0.1)]"><X className="size-6 text-[#D93025]" strokeWidth={2} /></span><div className="text-center"><p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{t.sendFailed}</p><p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">{t.channelError}</p></div></div>}
          {!resendRunning && !resendDone && (
            <>
              <div className="flex flex-col gap-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-4">
                <div className="flex items-center gap-2">{ch && <span style={{ color: ch.color }}>{ch.icon}</span>}<span className="text-[15px] font-medium tracking-[-0.32px] text-[#181925]">{order.delivery}</span><span className={`size-2 rounded-full ${statusDot}`} /></div>
                <div className="flex flex-col gap-2 text-[14px] tracking-[-0.32px] text-[#666666]">
                  <div className="flex justify-between gap-3"><span className="text-[#999999]">{t.recipientLabel}</span><span className="font-medium text-[#181925]">{order.customer}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-[#999999]">{t.targetLabel}</span><span className="font-medium text-[#181925]">{order.deliveryTarget || "—"}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-[#999999]">{t.productShort}</span><span className="max-w-[200px] truncate font-medium text-[#181925]">{order.product}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-[#999999]">{t.keyLabel}</span><span className="font-mono font-medium text-[#181925]">{order.keyCode}</span></div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setChannelResendConfirm(false)} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">{t.cancelBtn}</button>
                <button onClick={() => { setResendRunning(true); setTimeout(() => { setResendRunning(false); setResendDone(Math.random() > 0.2 ? "success" : "failed") }, 2000) }} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors" style={{ backgroundColor: ch?.color || "#181925" }}>{t.resendBtn}</button>
              </div>
            </>
          )}
          {resendDone && <div className="flex justify-end pt-1"><button onClick={() => { setChannelResendConfirm(false); setResendRunning(false); setResendDone(null) }} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors bg-[#918DF6] hover:bg-[#7B77E0]">{t.confirm}</button></div>}
        </DialogContent>
      </Dialog>

      <Dialog open={retryDialogOpen} onOpenChange={(open) => { if (!open) { setRetryDialogOpen(false); setRetryRunning(false); setRetryDone(false) } }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{retryDone ? t.retryComplete : retryRunning ? t.retrying : t.retryLicenseAssignment}</DialogTitle>
            <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#666666]">{retryDone ? t.retryCompleteDesc : retryRunning ? t.retryingDesc : t.retryDesc}</DialogDescription>
          </DialogHeader>
          {retryRunning && !retryDone && <div className="flex flex-col items-center gap-3 py-4"><Loader2 className="size-8 animate-spin text-[#918DF6]" strokeWidth={2} /><p className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.assigningLicense}</p></div>}
          {retryDone && <div className="flex flex-col gap-3"><div className="rounded-lg border border-[#34A853]/15 bg-[#34A853]/[0.04] px-4 py-3"><div className="flex items-center gap-2"><Check className="size-4 text-[#34A853]" strokeWidth={2.5} /><p className="text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">{t.licenseAssignedSuccess}</p></div><div className="mt-2 flex flex-col gap-1 text-[12px] tracking-[-0.32px] text-[#666666]"><div className="flex justify-between gap-3"><span>{t.product}</span><span className="font-medium text-[#181925]">{order.product}</span></div><div className="flex justify-between gap-3"><span>{t.keyLabel}</span><span className="font-mono font-medium text-[#181925]">{order.keyCode}</span></div><div className="flex justify-between gap-3"><span>{t.duration}</span><span className="font-medium text-[#181925]">0.4s</span></div></div></div></div>}
          <div className="flex justify-end gap-2 pt-1">
            {retryDone ? <button onClick={() => { setRetryDialogOpen(false); setRetryRunning(false); setRetryDone(false) }} className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]">{t.done}</button> : retryRunning ? null : (
              <>
                <button onClick={() => setRetryDialogOpen(false)} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">{t.cancel}</button>
                <button onClick={() => { setRetryRunning(true); setTimeout(() => { setRetryRunning(false); setRetryDone(true) }, 2000) }} className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"><span className="flex items-center gap-1.5"><RotateCcw className="size-3" strokeWidth={2} />{t.retryNow}</span></button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={reassignDialogOpen} onOpenChange={(open) => { if (!open) { setReassignDialogOpen(false); setReassignRunning(false); setReassignDone(false); setReassignSelectedKey([]) } }}>
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{reassignDone ? t.licenseReassigned : t.reassignLicenseTitle}</DialogTitle>
            <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#666666]">{reassignDone ? t.reassignedDesc(reassignSelectedKey.length) : t.selectLicenses(order.id)}</DialogDescription>
          </DialogHeader>
          {reassignRunning && !reassignDone && <div className="flex flex-col items-center gap-3 py-4"><Loader2 className="size-8 animate-spin text-[#918DF6]" strokeWidth={2} /><p className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.assigningLicense}</p></div>}
          {reassignDone && <div className="rounded-lg border border-[#34A853]/15 bg-[#34A853]/[0.04] px-4 py-3"><div className="flex items-center gap-2"><Check className="size-4 text-[#34A853]" strokeWidth={2.5} /><p className="text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">{t.reassigned(reassignSelectedKey.length)}</p></div><div className="mt-2 flex flex-col gap-1 text-[12px] tracking-[-0.32px] text-[#666666]">{reassignSelectedKey.map((key) => <div key={key} className="flex justify-between gap-3"><span>{t.keyLabel}</span><span className="font-mono font-medium text-[#181925]">{key}</span></div>)}<div className="flex justify-between gap-3"><span>{t.product}</span><span className="font-medium text-[#181925]">{order.product}</span></div></div></div>}
          {!reassignRunning && !reassignDone && (() => {
            const mockAvailableKeys = [
              { code: `${order.product.slice(0, 4).toUpperCase()}-NEW1-X8K2`, addedDate: "Apr 28, 2026" },
              { code: `${order.product.slice(0, 4).toUpperCase()}-NEW2-M4P7`, addedDate: "Apr 27, 2026" },
              { code: `${order.product.slice(0, 4).toUpperCase()}-NEW3-R9T1`, addedDate: "Apr 26, 2026" },
            ]
            return (
              <div className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">{t.availableKeys(mockAvailableKeys.length)}</p>
                <div className="flex flex-col gap-1.5">
                  {mockAvailableKeys.map((key) => (
                    <button key={key.code} type="button" onClick={() => setReassignSelectedKey((prev) => prev.includes(key.code) ? prev.filter((k) => k !== key.code) : [...prev, key.code])} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${reassignSelectedKey.includes(key.code) ? "border-[#918DF6] bg-[#918DF6]/[0.04]" : "border-[rgba(0,0,0,0.08)] hover:bg-[rgba(0,0,0,0.02)]"}`}>
                      <span className="size-1.5 shrink-0 rounded-full bg-[#34A853]" />
                      <div className="min-w-0 flex-1"><p className="font-mono text-[12px] tracking-[-0.32px] text-[#181925]">{key.code}</p><p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.added} {key.addedDate}</p></div>
                      {reassignSelectedKey.includes(key.code) && <Check className="size-4 shrink-0 text-[#918DF6]" strokeWidth={2.5} />}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg border border-[rgba(227,116,0,0.15)] bg-[rgba(227,116,0,0.04)] px-3 py-2"><p className="text-[11px] tracking-[-0.32px] text-[#E37400]">{t.currentKeyWarning(order.keyCode)}</p></div>
              </div>
            )
          })()}
          <div className="flex justify-end gap-2 pt-1">
            {reassignDone ? <button onClick={() => { setReassignDialogOpen(false); setReassignRunning(false); setReassignDone(false); setReassignSelectedKey([]) }} className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]">{t.done}</button> : reassignRunning ? null : (
              <>
                <button onClick={() => setReassignDialogOpen(false)} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">{t.cancel}</button>
                <button onClick={() => { setReassignRunning(true); setTimeout(() => { setReassignRunning(false); setReassignDone(true) }, 2000) }} className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]" disabled={reassignSelectedKey.length === 0}>{t.assign(reassignSelectedKey.length)}</button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={sendMsgOpen} onOpenChange={(open) => { if (!open) { setSendMsgOpen(false); setSendMsgType(null); setSendMsgRunning(false); setSendMsgDone(null) } }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
              {sendMsgDone === "success"
                ? (locale === "kr" ? "발송 완료" : "Sent")
                : sendMsgDone === "failed"
                ? (locale === "kr" ? "발송 실패" : "Send Failed")
                : sendMsgRunning
                ? (locale === "kr" ? "발송 중..." : "Sending...")
                : (locale === "kr" ? "메시지 보내기" : "Send Message")}
            </DialogTitle>
            <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
              {sendMsgDone === "success"
                ? (locale === "kr" ? "메시지가 성공적으로 발송되었습니다." : "Message sent successfully.")
                : sendMsgDone === "failed"
                ? (locale === "kr" ? "발송에 실패했습니다. 다시 시도해주세요." : "Failed to send. Please try again.")
                : sendMsgRunning
                ? (locale === "kr" ? "메시지를 발송하고 있습니다..." : "Sending message...")
                : (locale === "kr" ? "보낼 메시지 유형을 선택하세요." : "Choose a message type to send.")}
            </DialogDescription>
          </DialogHeader>

          {sendMsgRunning && !sendMsgDone && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="size-8 animate-spin text-[#918DF6]" strokeWidth={2} />
              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                {sendMsgChannel === "SMS" ? (locale === "kr" ? "문자" : "SMS") : sendMsgChannel}{locale === "kr" ? "로 발송 중..." : " sending..."}
              </p>
            </div>
          )}

          {sendMsgDone === "success" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#34A853]/10">
                <Check className="size-6 text-[#34A853]" strokeWidth={2} />
              </span>
              <p className="text-center text-[13px] tracking-[-0.32px] text-[#666666]">
                {sendMsgTarget}{locale === "kr" ? "으로 발송되었습니다." : " was sent successfully."}
              </p>
            </div>
          )}

          {sendMsgDone === "failed" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-[#D93025]/10">
                <X className="size-6 text-[#D93025]" strokeWidth={2} />
              </span>
              <p className="text-center text-[13px] tracking-[-0.32px] text-[#666666]">
                {locale === "kr" ? "채널 연결 오류가 발생했습니다." : "Channel connection error occurred."}
              </p>
            </div>
          )}

          {!sendMsgRunning && !sendMsgDone && (
            <div className="flex flex-col gap-4">
              {/* Step 1: Message type */}
              <div>
                <p className="mb-2 text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "메시지 유형" : "Type"}</p>
                <div className="flex flex-col gap-1.5">
                  {(["product", "confirm", "announcement"] as const).map((type) => {
                    const cfg = {
                      product: { label: locale === "kr" ? "제품 발송" : "Product Delivery", desc: locale === "kr" ? "라이선스 키를 구매자에게 재발송합니다." : "Resend the license key to the buyer.", icon: <Package className="size-4" strokeWidth={2} />, color: "#918DF6", bg: "rgba(145,141,246,0.10)" },
                      confirm: { label: locale === "kr" ? "구매확정 요청" : "Confirm Purchase", desc: locale === "kr" ? "구매자에게 구매 확정을 요청합니다." : "Ask the buyer to confirm the purchase.", icon: <ShoppingCart className="size-4" strokeWidth={2} />, color: "#1A73E8", bg: "rgba(26,115,232,0.08)" },
                      announcement: { label: locale === "kr" ? "공지 발송" : "Announcement", desc: locale === "kr" ? "구매자에게 직접 공지를 발송합니다." : "Send a custom announcement to the buyer.", icon: <Megaphone className="size-4" strokeWidth={2} />, color: "#E37400", bg: "rgba(227,116,0,0.08)" },
                    }[type]
                    const selected = sendMsgType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSendMsgType(type)}
                        className={`flex items-start gap-3 rounded-lg border px-3.5 py-3 text-left transition-all ${selected ? "border-[#918DF6]/40 bg-[#918DF6]/[0.04] ring-1 ring-[#918DF6]/20" : "border-[rgba(0,0,0,0.08)] hover:bg-[rgba(0,0,0,0.02)]"}`}
                      >
                        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.icon}
                        </span>
                        <div>
                          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{cfg.label}</p>
                          <p className="mt-0.5 text-[12px] tracking-[-0.24px] text-[#999999]">{cfg.desc}</p>
                        </div>
                        {selected && <Check className="ml-auto mt-1 size-4 shrink-0 text-[#918DF6]" strokeWidth={2.5} />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {sendMsgType && (
                <>
                  {sendMsgType === "announcement" && (
                    <div>
                      <p className="mb-1.5 text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "공지 내용" : "Message"}</p>
                      <textarea
                        value={sendMsgContent}
                        onChange={(e) => setSendMsgContent(e.target.value)}
                        placeholder={locale === "kr" ? "공지 내용을 입력하세요..." : "Enter your announcement..."}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 py-2.5 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none transition-colors focus:border-[#918DF6]"
                      />
                    </div>
                  )}

                  <div>
                    <p className="mb-1.5 text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "받는 사람" : "Recipient"}</p>
                    <input
                      type="text"
                      value={sendMsgTarget}
                      onChange={(e) => setSendMsgTarget(e.target.value)}
                      className="h-10 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none transition-colors focus:border-[#918DF6]"
                    />
                  </div>

                  <div>
                    <p className="mb-1.5 text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "채널" : "Channel"}</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {channels.map((chItem) => {
                        const selected = sendMsgChannel === chItem.id
                        return (
                          <button
                            key={chItem.id}
                            type="button"
                            onClick={() => setSendMsgChannel(chItem.id)}
                            className={`flex flex-col items-center gap-1 rounded-lg border py-2.5 text-[11px] font-medium tracking-[-0.24px] transition-all ${selected ? "border-[#181925] bg-[#181925] text-white" : "border-[rgba(0,0,0,0.08)] bg-white text-[#666666] hover:bg-[rgba(0,0,0,0.02)]"}`}
                          >
                            <span style={{ color: selected ? "white" : chItem.color }}>{chItem.icon}</span>
                            {chItem.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={() => setSendMsgOpen(false)} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">
                      {locale === "kr" ? "취소" : "Cancel"}
                    </button>
                    <button
                      onClick={() => { setSendMsgRunning(true); setTimeout(() => { setSendMsgRunning(false); setSendMsgDone(Math.random() > 0.15 ? "success" : "failed") }, 2000) }}
                      disabled={!sendMsgChannel || (sendMsgType === "announcement" && !sendMsgContent.trim())}
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-[#181925] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d] disabled:opacity-40"
                    >
                      <Send className="size-3" strokeWidth={2} />
                      {locale === "kr" ? "발송" : "Send"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {sendMsgDone && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => { setSendMsgOpen(false); setSendMsgType(null); setSendMsgRunning(false); setSendMsgDone(null) }}
                className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
              >
                {locale === "kr" ? "확인" : "Done"}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={advancedResendOpen} onOpenChange={(open) => { if (!open) setAdvancedResendOpen(false) }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">{locale === "kr" ? "다시 보내기" : "Resend"}</DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "채널과 받는 사람을 선택하세요" : "Choose channel and recipient"}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">{locale === "kr" ? "보낼 메시지" : "Message"}</p>
              <div className="mt-2 rounded-lg border border-[#E37400]/30 bg-[#E37400]/[0.04] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: deliveryChannels[order.delivery]?.bg, color: deliveryChannels[order.delivery]?.color }}>{deliveryChannels[order.delivery]?.icon}</span>
                  <div><p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{order.product}</p><p className="text-[12px] tracking-[-0.32px] text-[#999999]">{order.delivery}</p></div>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">{locale === "kr" ? "받는 사람" : "Recipient"}</p>
              <input type="text" value={resendTarget} onChange={(e) => setResendTarget(e.target.value)} className="mt-2 h-11 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-4 text-[14px] tracking-[-0.32px] text-[#181925] outline-none transition-colors focus:border-[#918DF6]" />
              <p className="mt-1.5 text-[12px] tracking-[-0.32px] text-[#999999]">{locale === "kr" ? "받는 번호를 바꿔서 보낼 수 있어요." : "You can change the recipient."}</p>
            </div>
            <div>
              <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">{locale === "kr" ? "채널 선택" : "Channel"}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {channels.map((chItem) => (
                  <button key={chItem.id} onClick={() => setResendChannel(chItem.id)} className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-[14px] font-medium tracking-[-0.32px] transition-all ${resendChannel === chItem.id ? "border-[#181925] bg-[#181925] text-white" : "border-[rgba(0,0,0,0.08)] bg-white text-[#181925] hover:bg-[rgba(0,0,0,0.02)]"}`}>
                    <span style={{ color: resendChannel === chItem.id ? "white" : chItem.color }}>{chItem.icon}</span>
                    {chItem.label}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => { setAdvancedResendOpen(false); setChannelResendConfirm(true) }} className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#181925] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d]">
              <Send className="size-4" strokeWidth={2} />
              {locale === "kr" ? `${resendChannel === "SMS" ? "문자" : resendChannel === "Email" ? "이메일" : resendChannel === "Telegram" ? "텔레그램" : resendChannel}로 보내기` : `Send via ${resendChannel}`}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
