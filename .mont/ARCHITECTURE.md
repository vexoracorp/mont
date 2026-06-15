# Mont — Architecture

> 파일 구조, 라우팅, 컴포넌트 관계, UI 패턴 정리.

---

## 라우팅

```
/                          → App.tsx (랜딩)
/login                     → Login.tsx
/signup                    → Signup.tsx
/dashboard                 → Dashboard.tsx (오버뷰)
/dashboard/orders          → Orders.tsx
/dashboard/products        → Products.tsx
/dashboard/inventory       → Inventory.tsx
/dashboard/licenses        → Licenses.tsx
/dashboard/providers       → Providers.tsx
/dashboard/customers       → Customers.tsx
/dashboard/merchants       → Merchants.tsx
/dashboard/analytics       → Analytics.tsx
/dashboard/channels        → Channels.tsx
/dashboard/workflow         → Workflow.tsx
/dashboard/settings        → Settings.tsx
/dashboard/workspace        → Workspace.tsx
/dashboard/onboarding       → Onboarding.tsx
/dashboard/create-workspace → CreateWorkspace.tsx
/delivery/:code            → Delivery.tsx (공개)
*                          → NotFound.tsx
```

라우팅은 `main.tsx`에서 `react-router-dom`의 `<BrowserRouter>` + `<Routes>` 사용.

---

## 사이드바 네비게이션

`DashboardLayout.tsx`의 `navItems` 배열 기준:

**Main Nav** (상단, slice 0-6):
1. Overview → /dashboard
2. Orders → /dashboard/orders
3. Products → /dashboard/products
4. Inventory → /dashboard/inventory
5. Licenses → /dashboard/licenses
6. Providers → /dashboard/providers

**Secondary Nav** (하단, slice 7+):
7. Customers → /dashboard/customers
8. Merchants → /dashboard/merchants
9. Analytics → /dashboard/analytics
10. Channels → /dashboard/channels
11. Workspace → /dashboard/workspace
12. Settings → /dashboard/settings

---

## 파일 맵

### 인프라

| 파일 | 역할 | 라인 |
|------|------|------|
| main.tsx | 엔트리포인트, 라우팅 정의 | ~53 |
| shared.tsx | 공유 타입, 유틸, 상수, 컴포넌트 | ~248 |
| DashboardLayout.tsx | 대시보드 레이아웃 (사이드바, 헤더, 워크스페이스) | ~460 |
| GlobalSearch.tsx | 글로벌 검색 컴포넌트 | - |
| index.css | Tailwind + 글로벌 스타일 | - |
| lib/utils.ts | cn() 유틸리티 | - |

### 대시보드 페이지

| 파일 | 역할 | 핵심 상태 |
|------|------|-----------|
| Dashboard.tsx | 오버뷰 (KPI, 최근 주문, 플랫폼 분포) | selectedOrder, currency |
| Orders.tsx | 주문 관리 (필터, 검색, 상세 모달) | selectedOrder, filters, activeTab, channelExpanded |
| Products.tsx | 상품 카탈로그 (4탭 상세: Overview/Orders/Licenses/Merchants) | selectedProduct, detailTab, selectedOrderId, expandedMerchant |
| Inventory.tsx | 키 재고 관리 (상태별 필터, 상세 모달) | selectedItem, showKeyCode, inventory, tagInput |
| Licenses.tsx | 수동 키 충전 (키타입별 입력, 충전 이력) | selectedProduct, keyType, inputValue, source |
| Providers.tsx | 외부 공급자 관리 (설정, 매핑, 활동 로그) | expandedProvider, showApiKey, copiedWebhook |
| Customers.tsx | 고객 관리 (프로필, 주문 이력, 태그) | selectedCustomer, tagInput |
| Merchants.tsx | 플러그인 스토어 + 플랫폼 연동 | activeTab, selectedPlugin |
| Analytics.tsx | 매출/배송/성과 분석 | currency, period |
| Channels.tsx | 배송 채널 설정 (API 키, 로그) | selectedChannel, expandedSettings |
| Workflow.tsx | React Flow 워크플로우 빌더 | nodes, edges |
| Settings.tsx | 계정/워크스페이스 설정 | activeTab |
| Workspace.tsx | 워크스페이스 관리 | - |
| Onboarding.tsx | 온보딩 플로우 | step |

### 공개 페이지

| 파일 | 역할 |
|------|------|
| App.tsx | 랜딩 페이지 (히어로, 기능 소개, 비교표, CTA) |
| Login.tsx | 로그인 |
| Signup.tsx | 회원가입 |
| Delivery.tsx | 공개 배송 페이지 (/delivery/:code) |
| NotFound.tsx | 404 |

### shadcn/ui 컴포넌트 (src/components/ui/)

button, card, dialog, sheet, badge, avatar, separator, tooltip, table, chart

---

## 임포트 관계

```
main.tsx
  └── 모든 페이지 컴포넌트 import

DashboardLayout.tsx
  ├── GlobalSearch.tsx
  └── @/components/ui/dialog, sheet, button

모든 대시보드 페이지
  ├── DashboardLayout.tsx (레이아웃 래퍼)
  ├── shared.tsx (타입, 유틸, 배지, 채널)
  ├── @/components/ui/dialog (모달)
  └── lucide-react (아이콘)

App.tsx
  └── WorkflowVisualization.tsx

Workflow.tsx
  └── @xyflow/react (React Flow)
```

---

## UI 패턴

### 모달/다이얼로그 패턴
- `selectedItem !== null`로 open 제어
- 서브 다이얼로그는 메인 다이얼로그 위에 겹쳐서 표시 (메인 닫지 않음)
- `onOpenChange`에서 모든 관련 상태 초기화

### 테이블 패턴
- 행 클릭 → 상세 모달 (Dialog)
- 필터 탭 + 검색 입력
- 무한 스크롤 또는 페이지네이션

### 카드 패턴
- 둥근 모서리 (rounded-xl)
- 미묘한 그림자 + 0.5px 보더
- hover 시 border 진해짐 + shadow 추가

### 상태 관리
- 모든 상태는 `useState` 로컬 관리
- 글로벌 상태 라이브러리 없음
- currency는 각 페이지에서 독립적으로 관리

### 키 타입별 UI
| 타입 | 테이블 표시 | 상세 패널 |
|------|------------|-----------|
| key | 마스킹된 코드 + 복사 | reveal/hide 토글 + 복사 |
| link | LinkIcon + "Redemption Link" | Open Link 버튼 + URL + 복사 |
| file | FileText + 파일명 | 파일명 + 다운로드 |
| image | ImageIcon + 파일명 | 이미지 프리뷰 + 다운로드 |
| subscription | RefreshCw + 플랜명 | 구독 카드 (이름/플랜/가격/기간) |

---

*마지막 업데이트: 2026-04-29*
