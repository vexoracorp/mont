import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Loader2, X } from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import {
  type Order,
  type Currency,
  StatusBadge,
  DeliveryChannel,
  platformBadges,
  deliveryChannels,
  formatUSD,
  formatKRW,
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
    dangerZone: "위험 구역",
    cancelOrder: "주문 취소",
    deleteOrder: "주문 삭제",
    orderCreated: "주문 생성",
    licenseAssigned: "라이선스 할당",
    licenseAssignmentFailed: "라이선스 할당 실패",
    deliverySent: "배송 발송",
    deliveryFailed: "배송 실패",
    deliveryPending: "배송 대기",
    deliveryConfirmed: "배송 확인",
    totalTime: "총 소요 시간:",
    normalDelivery: "✓ 정상 전달 완료",
    recipient: "받는 사람:",
    showRawData: "Raw Data 보기",
    hideRawData: "Raw Data 숨기기",
    field: "필드",
    value: "값",
    goToMerchants: "판매처 이동",
    viewOn: (platform: string) => `${platform}에서 보기`,
    orderIdLabel: "주문 ID",
    customerLabel: "고객",
    amountLabel: "금액",
    orderReceived: "주문 접수",
    licenseDetails: "라이선스 상세",
    retryAssignment: "재할당 시도",
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
    noMessage: "배송 메시지가 없습니다.",
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
    retryLicenseAssignment: "라이선스 재할당 시도",
    retryCompleteDesc: "라이선스 할당 워크플로우가 다시 실행되었습니다.",
    retryingDesc: "라이선스 할당 단계를 재실행 중...",
    retryDesc: "배송 워크플로우의 라이선스 할당 단계만 재실행합니다. 다른 단계에는 영향이 없습니다.",
    assigningLicense: "라이선스 할당 중...",
    licenseAssignedSuccess: "라이선스 할당 완료",
    duration: "소요 시간",
    done: "완료",
    retryNow: "지금 재시도",
    licenseReassigned: "라이선스 재할당 완료",
    reassignLicenseTitle: "라이선스 재할당",
    reassignedDesc: (count: number) => `${count}개 라이선스가 이 주문에 할당되었습니다.`,
    selectLicenses: (id: string) => `주문 #${id}에 할당할 라이선스를 선택하세요.`,
    reassigned: (count: number) => `${count}개 라이선스 재할당됨`,
    availableKeys: (count: number) => `사용 가능한 키 (${count})`,
    added: "추가일",
    currentKeyWarning: (key: string) => `현재 키 (${key})는 재고로 반환됩니다.`,
    assign: (count: number) => count > 0 ? `${count}개 키 할당` : "선택한 키 할당",
    keyPlaceholderWarning: "⚠ 키가 0000으로 끝남 — 임시 키일 수 있음",
    licenses: (qty: number) => `${qty}개 라이선스`,
  },
} as const

type SearchOperator = ">" | "<" | ">=" | "<="

type SearchFilter = {
  field: string
  value: string
  operator?: SearchOperator
}

type SearchFieldConfig = {
  key: string
  label: string
  description: string
  example: string
  values?: string[]
}

type SearchSuggestion = {
  id: string
  kind: "field" | "value"
  label: string
  description: string
  example: string
  replacement: string
  fieldKey: string
  value?: string
}

const searchFields: SearchFieldConfig[] = [
  { key: "id", label: "Order ID", description: "Search by order ID", example: "id:4X7PA" },
  { key: "product", label: "Product", description: "Search by product name", example: 'product:"Steam Wallet"' },
  { key: "customer", label: "Customer", description: "Search by customer name", example: "customer:이정효" },
  { key: "email", label: "Email", description: "Search by email address", example: "email:leolee12@naver.com" },
  { key: "phone", label: "Phone", description: "Search by phone number", example: "phone:010-3821" },
  { key: "sms", label: "SMS", description: "Search by SMS delivery target", example: "sms:010-3821" },
  {
    key: "platform",
    label: "Platform",
    description: "Filter by platform",
    example: "platform:naver",
    values: ["네이버 스토어", "롯데몰", "지마켓", "쿠팡"],
  },
  {
    key: "status",
    label: "Status",
    description: "Filter by order status",
    example: "status:failed",
    values: ["Delivered", "Processing", "Failed", "ManualRequired"],
  },
  {
    key: "channel",
    label: "Channel",
    description: "Filter by delivery channel",
    example: "channel:telegram",
    values: ["Telegram", "Email", "SMS", "WhatsApp"],
  },
  { key: "to", label: "Delivery Target", description: "Search by delivery target", example: "to:@mont_delivery_bot" },
  { key: "key", label: "Key Code", description: "Search by license key", example: "key:CNVA-PRO1" },
  { key: "store", label: "Store", description: "Search by store name", example: "store:몽키디지털" },
  { key: "memo", label: "Admin Memo", description: "Search in admin memos", example: "memo:VIP" },
  { key: "from", label: "From", description: "Search by source platform/store", example: "from:naver" },
  { key: "amount", label: "Amount", description: "Filter by amount (supports >, <)", example: "amount:>50" },
  { key: "qty", label: "Quantity", description: "Filter by quantity", example: "qty:2" },
]

const searchFieldMap = new Map(searchFields.map((field) => [field.key, field]))

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function tokenizeSearchQuery(query: string) {
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

function stripWrappingQuotes(value: string) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }
  return value
}

function quoteIfNeeded(value: string) {
  return /\s/.test(value) ? `"${value}"` : value
}

function parseSearchQuery(query: string): SearchFilter[] {
  return tokenizeSearchQuery(query).map((token) => {
    const separatorIndex = token.indexOf(":")
    if (separatorIndex <= 0) {
      return { field: "_text", value: stripWrappingQuotes(token) }
    }

    const rawField = token.slice(0, separatorIndex).toLowerCase()
    const rawValue = stripWrappingQuotes(token.slice(separatorIndex + 1).trim())

    if (!searchFieldMap.has(rawField) || !rawValue) {
      return { field: "_text", value: stripWrappingQuotes(token) }
    }

    if (rawField === "amount") {
      const operatorMatch = rawValue.match(/^(>=|<=|>|<)(.+)$/)
      if (operatorMatch) {
        return {
          field: rawField,
          operator: operatorMatch[1] as SearchOperator,
          value: operatorMatch[2].trim(),
        }
      }
    }

    return { field: rawField, value: rawValue }
  })
}

function includesNormalized(value: string | undefined, query: string) {
  if (!value) return false
  return normalizeSearchValue(value).includes(normalizeSearchValue(query))
}

function matchesNumericFilter(actual: number | undefined, filter: SearchFilter) {
  if (actual === undefined) return false

  const numericValue = Number(filter.value)
  if (Number.isNaN(numericValue)) return false

  switch (filter.operator) {
    case ">":
      return actual > numericValue
    case "<":
      return actual < numericValue
    case ">=":
      return actual >= numericValue
    case "<=":
      return actual <= numericValue
    default:
      return actual === numericValue
  }
}

function matchesFilter(order: Order, filter: SearchFilter) {
  const value = filter.value.trim()
  if (!value) return true

  switch (filter.field) {
    case "_text":
      return [order.id, order.product, order.customer].some((entry) => includesNormalized(entry, value))
    case "id":
      return includesNormalized(order.id, value)
    case "product":
      return includesNormalized(order.product, value)
    case "customer":
      return includesNormalized(order.customer, value)
    case "email":
      return includesNormalized(order.email, value)
    case "phone":
      return includesNormalized(order.phone, value)
    case "sms":
      return includesNormalized(order.phone, value) || (order.delivery === "SMS" && includesNormalized(order.deliveryTarget, value))
    case "platform":
      return includesNormalized(order.platform, value)
    case "status":
      return includesNormalized(order.status, value)
    case "channel":
      return includesNormalized(order.delivery, value)
    case "to":
      return includesNormalized(order.deliveryTarget, value)
    case "key":
      return includesNormalized(order.keyCode, value) || (order.items?.some((item) => includesNormalized(item.keyCode, value)) ?? false)
    case "store":
      return includesNormalized(order.storeName, value)
    case "memo":
      return includesNormalized(order.adminMemo, value)
    case "from":
      return includesNormalized(order.platform, value) || includesNormalized(order.storeName, value)
    case "amount":
      return matchesNumericFilter(order.amount, filter)
    case "qty":
      return matchesNumericFilter(order.quantity ?? 1, filter)
    default:
      return [order.id, order.product, order.customer].some((entry) => includesNormalized(entry, value))
  }
}

function formatFilterToken(filter: SearchFilter) {
  if (filter.field === "_text") return quoteIfNeeded(filter.value)
  const formattedValue = `${filter.operator ?? ""}${filter.value}`
  return `${filter.field}:${quoteIfNeeded(formattedValue)}`
}

function rebuildSearchQuery(filters: SearchFilter[]) {
  return filters.map(formatFilterToken).join(" ")
}

function getActiveTokenBounds(query: string) {
  const end = query.length
  let start = end

  while (start > 0 && !/\s/.test(query[start - 1])) {
    start -= 1
  }

  return {
    start,
    end,
    token: query.slice(start, end),
  }
}

function replaceActiveToken(query: string, replacement: string) {
  const { start, end } = getActiveTokenBounds(query)
  const prefix = query.slice(0, start)
  const suffix = query.slice(end)
  return `${prefix}${replacement}${suffix}`
}

function getSearchSuggestions(query: string): SearchSuggestion[] {
  const { token } = getActiveTokenBounds(query)
  const tokenValue = token.trim()

  if (!tokenValue) {
    return searchFields.map((field) => ({
      id: `field-${field.key}`,
      kind: "field",
      label: `${field.key}:`,
      description: field.description,
      example: field.example,
      replacement: `${field.key}:`,
      fieldKey: field.key,
    }))
  }

  const separatorIndex = tokenValue.indexOf(":")
  if (separatorIndex >= 0) {
    const fieldKey = tokenValue.slice(0, separatorIndex).toLowerCase()
    const currentValue = stripWrappingQuotes(tokenValue.slice(separatorIndex + 1))
    const field = searchFieldMap.get(fieldKey)

    if (!field?.values) return []

    return field.values
      .filter((value) => includesNormalized(value, currentValue))
      .map((value) => ({
        id: `value-${field.key}-${value}`,
        kind: "value",
        label: `${field.key}: ${value}`,
        description: field.description,
        example: field.example,
        replacement: `${field.key}:${quoteIfNeeded(value)} `,
        fieldKey: field.key,
        value,
      }))
  }

  return searchFields
    .filter((field) => field.key.includes(tokenValue.toLowerCase()) || field.label.toLowerCase().includes(tokenValue.toLowerCase()))
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

function getChipClasses(filter: SearchFilter) {
  if (filter.field === "status") {
    const value = normalizeSearchValue(filter.value)
    if (value.includes("delivered")) return "border-[#34A853]/20 bg-[#34A853]/10 text-[#34A853]"
    if (value.includes("processing")) return "border-[#E37400]/20 bg-[#E37400]/10 text-[#E37400]"
    if (value.includes("failed")) return "border-[#D93025]/20 bg-[#D93025]/10 text-[#D93025]"
  }

  if (filter.field === "channel") {
    const hasChannelMatch = Object.keys(deliveryChannels).some(
      (name) => normalizeSearchValue(name) === normalizeSearchValue(filter.value),
    )
    if (hasChannelMatch) return "border-transparent"
  }

  return "border-[#918DF6]/15 bg-[#918DF6]/10 text-[#6E69E8]"
}

const allOrders: Order[] = [
  { id: "4X7PA", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", phone: "010-3821-4756", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CNVA-PRO1-7F3M", recipientName: "이정효", recipientPhone: "010-3821-4756", customerMemo: "leolee12@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "CNVA-PRO1-7F3M", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "3.5s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: 캔바 프로 Canva PRO 12개월\n키: CNVA-PRO1-7F3M\n\n감사합니다!" },
  { id: "9K2BM", platform: "롯데몰", storeName: "롯데몰", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", phone: "010-5534-2198", delivery: "Email", deliveryTarget: "g2g_buyer_8821", keyCode: "STMW-50GC-A2K9", recipientName: "Alex Turner", recipientPhone: "010-5534-2198", customerMemo: "", adminMemo: "", quantity: 2, items: [{ keyCode: "STMW-50GC-A2K9", status: "Delivered" }, { keyCode: "STMW-50GC-B3R7", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.8s", deliveryConfirmed: "4.2s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Steam Wallet $50 Gift Card\nKey: STMW-50GC-A2K9\n\nThank you!" },
  { id: "3F8QN", platform: "지마켓", storeName: "지마켓", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", phone: "010-7741-9023", delivery: "SMS", deliveryTarget: "010-7741-9023", keyCode: "XGPU-1MON-9D1P", recipientName: "김수현", recipientPhone: "010-7741-9023", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XGPU-1MON-9D1P", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.1s" } },
  { id: "7W1DL", platform: "네이버 스토어", storeName: "몽키디지털", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", phone: "010-2293-6847", delivery: "Email", deliveryTarget: "minji_park@naver.com", keyCode: "W11P-RKEY-QW8E", recipientName: "박민지", recipientPhone: "010-2293-6847", customerMemo: "minji_park@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "W11P-RKEY-QW8E", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.8s" } },
  { id: "6R5VC", platform: "롯데몰", storeName: "롯데몰", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", phone: "010-8812-3374", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "ERNG-DLCX-5TN2", recipientName: "James Kim", recipientPhone: "010-8812-3374", customerMemo: "", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "ERNG-DLCX-5TN2", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.5s", deliveryConfirmed: "3.9s" } },
  { id: "2H9TE", platform: "지마켓", storeName: "지마켓", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", phone: "010-4467-8231", delivery: "WhatsApp", deliveryTarget: "+82 10-4467-8231", keyCode: "FIFA-25UE-0000", recipientName: "최영호", recipientPhone: "010-4467-8231", customerMemo: "", adminMemo: "WhatsApp 전송 실패 — 수신자 연결 불가. 키 미전달 상태.", quantity: 1, items: [{ keyCode: "FIFA-25UE-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "3.2s" }, errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered." },
  { id: "8M3KP", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 34.99, status: "Delivered", time: "1시간 전", product: "Adobe Creative Cloud 1개월", customer: "정하은", email: "haeun_j@naver.com", phone: "010-9923-5512", delivery: "Email", deliveryTarget: "haeun_j@naver.com", keyCode: "ADCC-1MON-R4TZ", recipientName: "정하은", recipientPhone: "010-9923-5512", customerMemo: "haeun_j@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "ADCC-1MON-R4TZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.6s" } },
  { id: "1Q6WJ", platform: "롯데몰", storeName: "롯데몰", amount: 19.99, status: "Delivered", time: "2시간 전", product: "Minecraft Java Edition", customer: "David Park", email: "g2g_buyer_5512", phone: "010-6634-7809", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "MNCR-JAVA-K8PL", recipientName: "David Park", recipientPhone: "010-6634-7809", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "MNCR-JAVA-K8PL", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.1s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Minecraft Java Edition\nKey: MNCR-JAVA-K8PL\n\nThank you!" },
  { id: "5T4NR", platform: "쿠팡", storeName: "쿠팡", amount: 89.99, status: "Delivered", time: "2시간 전", product: "Cyberpunk 2077 Ultimate Bundle", customer: "이서연", email: "seoyeon@gmail.com", phone: "010-1178-4423", delivery: "Email", deliveryTarget: "seoyeon@gmail.com", keyCode: "CP77-ULTB-M3VX", recipientName: "이서연", recipientPhone: "010-1178-4423", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "CP77-ULTB-M3VX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.3s" } },
  { id: "0L8FD", platform: "지마켓", storeName: "지마켓", amount: 15.99, status: "Processing", time: "3시간 전", product: "Netflix Gift Card $25", customer: "Tom Wilson", email: "g2a_user_4421", phone: "010-3356-8814", delivery: "SMS", deliveryTarget: "010-3356-8814", keyCode: "NFLX-25GC-W7HN", recipientName: "Tom Wilson", recipientPhone: "010-3356-8814", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "NFLX-25GC-W7HN", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.9s" } },
  { id: "4Y2GH", platform: "네이버 스토어", storeName: "디지털라운지", amount: 44.99, status: "Delivered", time: "3시간 전", product: "PS Plus Premium 3개월", customer: "한지민", email: "jimin_han@naver.com", phone: "010-7723-1956", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "PSPP-3MON-B5QA", recipientName: "한지민", recipientPhone: "010-7723-1956", customerMemo: "jimin_han@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "PSPP-3MON-B5QA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.6s", deliveryConfirmed: "4.0s" } },
  { id: "7N9XC", platform: "롯데몰", storeName: "롯데몰", amount: 27.50, status: "Failed", time: "4시간 전", product: "Valorant Points 2050 VP", customer: "Sarah Lee", email: "g2g_buyer_9903", phone: "010-5589-2341", delivery: "Email", deliveryTarget: "g2g_buyer_9903", keyCode: "VLRN-2050-0000", recipientName: "Sarah Lee", recipientPhone: "010-5589-2341", customerMemo: "", adminMemo: "결제 분쟁 발생 — 은행 측 거래 취소 처리됨.", quantity: 1, items: [{ keyCode: "VLRN-2050-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.8s", deliverySent: "2.4s" }, errorStep: "Step 2 — Payment Verification", errorMessage: "Payment disputed by buyer's bank. Transaction reversed." },
  { id: "3K1MZ", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 39.99, status: "Delivered", time: "4시간 전", product: "Spotify Premium 6개월", customer: "오준서", email: "junseo_oh@naver.com", phone: "010-2214-7763", delivery: "SMS", deliveryTarget: "010-2214-7763", keyCode: "SPTF-6MON-J2YD", recipientName: "오준서", recipientPhone: "010-2214-7763", customerMemo: "junseo_oh@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "SPTF-6MON-J2YD", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.9s" } },
  { id: "6P5BA", platform: "지마켓", storeName: "지마켓", amount: 54.99, status: "Delivered", time: "5시간 전", product: "Hogwarts Legacy Deluxe", customer: "김태현", email: "g2a_user_6678", phone: "010-8845-3127", delivery: "WhatsApp", deliveryTarget: "+82 10-8845-3127", keyCode: "HWLG-DLXE-T9FC", recipientName: "김태현", recipientPhone: "010-8845-3127", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "HWLG-DLXE-T9FC", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.7s", deliveryConfirmed: "3.8s" } },
  { id: "9D7QL", platform: "롯데몰", storeName: "롯데몰", amount: 22.00, status: "Delivered", time: "5시간 전", product: "Roblox Gift Card $25", customer: "Emily Chen", email: "g2g_buyer_3345", phone: "010-4412-6698", delivery: "Email", deliveryTarget: "g2g_buyer_3345", keyCode: "RBLX-25GC-N4WP", recipientName: "Emily Chen", recipientPhone: "010-4412-6698", customerMemo: "", adminMemo: "", quantity: 2, items: [{ keyCode: "RBLX-25GC-N4WP", status: "Delivered" }, { keyCode: "RBLX-25GC-M5XQ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.0s", deliveryConfirmed: "4.5s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Roblox Gift Card $25\nKey: RBLX-25GC-N4WP\n\nThank you!" },
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

const TOTAL_ORDERS = 156


export default function Orders({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale]
  const navigate = useNavigate()
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const PAGE_SIZE = 10
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filters = parseSearchQuery(searchQuery)
  const structuredFilters = filters.filter((filter) => filter.field !== "_text")
  const suggestions = searchFocused && searchQuery.trim() ? getSearchSuggestions(searchQuery) : []
  const showSuggestions = suggestions.length > 0
  const filtered = allOrders.filter((o) => filters.every((filter) => matchesFilter(o, filter)))

  const applySuggestion = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery((current) => replaceActiveToken(current, suggestion.replacement))
    setSearchFocused(true)
    setSuggestionIndex(0)
    requestAnimationFrame(() => {
      const input = searchInputRef.current
      if (!input) return
      input.focus()
      const nextValue = replaceActiveToken(input.value, suggestion.replacement)
      input.setSelectionRange(nextValue.length, nextValue.length)
    })
  }, [])

  const removeFilterChip = useCallback((filterToRemove: SearchFilter) => {
    const nextFilters = [...filters]
    const index = nextFilters.findIndex(
      (filter) =>
        filter.field === filterToRemove.field &&
        filter.value === filterToRemove.value &&
        filter.operator === filterToRemove.operator,
    )

    if (index === -1) return

    nextFilters.splice(index, 1)
    setSearchQuery(rebuildSearchQuery(nextFilters))
  }, [filters])

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [searchQuery])

  useEffect(() => {
    if (!showSuggestions) {
      setSuggestionIndex(0)
      return
    }

    setSuggestionIndex((current) => Math.min(current, suggestions.length - 1))
  }, [showSuggestions, suggestions])

  const visibleOrders = filtered.slice(0, displayCount)
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

  return (
    <DashboardLayout
      title={t.title}
      locale={locale}
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4 pb-4 lg:px-8">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
        >
          {/* Filters */}
          <div className="shrink-0 border-b border-[rgba(0,0,0,0.08)] px-5 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSuggestionIndex(0)
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setSearchFocused(false), 120)
                }}
                onKeyDown={(e) => {
                  if (!showSuggestions) {
                    if (e.key === "Escape") setSearchFocused(false)
                    return
                  }

                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setSuggestionIndex((current) => (current + 1) % suggestions.length)
                    return
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setSuggestionIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
                    return
                  }

                  if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault()
                    const suggestion = suggestions[suggestionIndex]
                    if (suggestion) applySuggestion(suggestion)
                    return
                  }

                  if (e.key === "Escape") {
                    e.preventDefault()
                    setSearchFocused(false)
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
              />

              {showSuggestions && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_12px_40px_rgba(24,25,37,0.12)]">
                  <div className="max-h-80 overflow-y-auto py-1.5">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applySuggestion(suggestion)}
                        className={`flex w-full items-start justify-between gap-4 px-3 py-2.5 text-left transition-colors ${
                          index === suggestionIndex ? "bg-[#918DF6]/10" : "hover:bg-[rgba(0,0,0,0.03)]"
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                              {suggestion.label}
                            </span>
                            <span className="rounded-full bg-[rgba(0,0,0,0.05)] px-2 py-0.5 text-[11px] font-medium tracking-[-0.24px] text-[#666666]">
                              {suggestion.kind === "field" ? t.field : t.value}
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
            </div>

            {structuredFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {structuredFilters.map((filter, index) => {
                  const chipClassName = getChipClasses(filter)
                  const channelStyle = filter.field === "channel"
                    ? Object.entries(deliveryChannels).find(([name]) => normalizeSearchValue(name) === normalizeSearchValue(filter.value))?.[1]
                    : undefined

                  return (
                    <button
                      key={`${filter.field}-${filter.value}-${filter.operator ?? "eq"}-${index}`}
                      type="button"
                      onClick={() => removeFilterChip(filter)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium tracking-[-0.24px] transition-colors hover:opacity-80 ${chipClassName}`}
                      style={channelStyle ? { backgroundColor: channelStyle.bg, color: channelStyle.color } : undefined}
                    >
                      <span>
                        {filter.field}: {`${filter.operator ?? ""}${filter.value}`}
                      </span>
                      <X className="size-3" strokeWidth={2.4} />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th className="px-5 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.orderID}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.product}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.customer}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.platform}</th>
                  <th className="px-3 py-2.5 text-right text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.amount}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.status}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.delivery}</th>
                  <th className="px-5 py-2.5 text-right text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.time}</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => {
                  const badge = platformBadges[order.platform]
                  return (
                    <tr
                      key={order.id}
                      onClick={() => navigate(locale === "kr" ? `/kr/dashboard/orders/${order.id}` : `/dashboard/orders/${order.id}`)}
                      className={`cursor-pointer border-b border-[rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50/60 ${
                        order.status === "Failed" ? "bg-[#D93025]/[0.06] border-l-2 border-l-[#D93025]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        #{order.id}
                      </td>
                      <td className="max-w-[240px] px-3 py-3">
                        <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                          {order.product}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-[14px] tracking-[-0.32px] text-[#181925]">
                        {order.customer}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {badge && (
                            <span className={`${badge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-[14px] tracking-[-0.32px] text-[#666666]">{order.platform}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {locale === "kr" ? formatKRW(order.amount) : formatUSD(order.amount)}
                        </span>
                        {locale === "en" && currency === "KRW" && (
                          <p className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                            {formatKRW(order.amount)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={order.status} locale={locale} />
                      </td>
                      <td className="px-3 py-3">
                        <DeliveryChannel channel={order.delivery} locale={locale} />
                      </td>
                      <td className="px-5 py-3 text-right text-[13px] tracking-[-0.32px] text-[#999999]">
                        {order.time}
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
                {t.allOrdersLoaded(filtered.length)}
              </p>
            ) : (
              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                <span className="font-medium tabular-nums text-[#181925]">{visibleOrders.length}</span> {t.of}{" "}
                <span className="font-medium tabular-nums text-[#181925]">{TOTAL_ORDERS}</span> {t.ordersLoaded}
              </p>
            )}
          </div>
        </div>
      </div>

    </DashboardLayout>
  )
}