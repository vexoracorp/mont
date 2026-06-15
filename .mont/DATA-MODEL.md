# Mont — Data Model

> 핵심 타입과 인터페이스 정리. 파일별 정의 위치 포함.

---

## shared.tsx — 공유 타입

```typescript
type Currency = "USD" | "KRW"

type OrderItem = {
  keyCode: string
  status: "Delivered" | "Processing" | "Failed"
}

type FlowTiming = {
  orderCreated: string
  licenseAssigned: string
  deliverySent: string
  deliveryConfirmed?: string
}

type Order = {
  id: string
  platform: string
  storeName?: string
  amount: number
  quantity?: number
  status: "Delivered" | "Processing" | "Failed"
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

type DeliveryPluginType = "email" | "sms" | "telegram" | "whatsapp" | "webhook" | "discord" | "kakaotalk" | "line" | "slack"

type DeliveryPlugin = {
  id: string
  name: string
  author: string
  description: string
  type: DeliveryPluginType
  icon: React.ReactNode
  endpoint: string
  installs: string
  installed: boolean
}
```

### 공유 유틸리티
- `formatUSD(n: number)` → `$42.99`
- `formatKRW(n: number)` → `₩62,336` (KRW_RATE = 1450)
- `StatusBadge({ status })` — Delivered/Processing/Failed 배지
- `DeliveryChannel({ channel })` — 채널 아이콘+라벨 배지
- `platformBadges` — Naver Store, G2G, G2A, Direct 배지 설정
- `deliveryChannels` — Telegram, Email, SMS, WhatsApp 아이콘/색상

---

## Inventory.tsx — 재고 타입

```typescript
type InventoryStatus = "Available" | "Reserved" | "Delivered" | "Expired" | "Held" | "Deactivated"

type ProductCategory = "Game Key" | "Gift Card" | "Subscription" | "Software"

type DeliveryMethod = "Email" | "SMS" | "Telegram" | "WhatsApp"

type KeyType = "key" | "link" | "file" | "image" | "subscription"

type SubscriptionInfo = {
  subscriptionName: string
  plan: string
  price: string
  startDate: string
  endDate: string
}

type InventoryItem = {
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
```

---

## Products.tsx — 상품 타입

```typescript
type ProductStatus = "Active" | "Draft" | "Out of Stock"
type ProductCategory = "Game Key" | "Gift Card" | "Subscription" | "Software License"

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

type ProductOrder = {
  orderId: string
  customer: string
  amount: number
  status: "Delivered" | "Processing" | "Failed"
  date: string
  platform: string
  delivery: string
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
```

---

## Providers.tsx — 공급자 타입

```typescript
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
  status: "Success" | "Failed" | "Timeout"
  keyType: string
  responseTime: string
}

type Provider = {
  id: string
  name: string
  status: ProviderStatus
  enabled: boolean
  color: string
  apiUrl: string
  authType: AuthType
  apiKey: string
  totalFetched: number
  successRate: number
  avgResponseMs: number
  errorMessage?: string
  productMappings: ProductMapping[]
  maxRetries: number
  retryDelay: string
  rateLimit: number
  webhookUrl: string
  recentActivity: RecentActivity[]
}
```

---

## Customers.tsx — 고객 타입

```typescript
type Customer = {
  id: string
  name: string
  email: string
  platform: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
  firstOrderDate: string
  status: "Active" | "Inactive"
  tags: string[]
  memo: string
  orders: CustomerOrder[]
}

type CustomerOrder = {
  orderId: string
  product: string
  amount: number
  status: "Delivered" | "Processing" | "Failed"
  date: string
  delivery: string
}
```

---

## 데이터 흐름 요약

```
Provider (외부 API)
  ↓ 자동 fetch
Product (상품 카탈로그)
  ↓ 키 할당
Inventory (키 재고)
  ↓ 주문 발생 시
Order (주문)
  ↓ 배송 채널 통해
Customer (구매자)
  ↓ delivery URL
Delivery (공개 배송 페이지)
```

### 키 라이프사이클
```
Available → Reserved → Delivered → (Expired)
    ↓           ↓
   Held    Deactivated
```

### 주문 라이프사이클
```
Processing → Delivered
     ↓
   Failed
```

---

*마지막 업데이트: 2026-04-29*
