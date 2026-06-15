# Mont — Changelog

> 세션별 작업 이력. 최신순 정렬.

---

## 2026-04-29 (현재 세션)

### Inventory — Customer Hover Card 채널 정보
- Customer hover 시 `deliveryMethod` + `deliveryTarget` 표시 추가
- `DeliveryChannel` 컴포넌트 활용

### Inventory — 다양한 키 타입 지원
- `KeyType` 추가: `"key" | "link" | "file" | "image" | "subscription"`
- `InventoryItem`에 `keyType`, `keyFileName`, `subscription` 필드 추가
- `SubscriptionInfo` 타입: subscriptionName, plan, price, startDate, endDate
- 테이블 셀: 키 타입별 아이콘+라벨 표시
- 상세 패널: 키 타입별 전용 UI (마스킹 키, 링크 버튼, 파일 다운로드, 이미지 프리뷰, 구독 카드)
- 샘플 데이터에 link(INV011/012/020/021/038), file(INV027/034), image(INV022/029), subscription(INV003/013/025) 추가

### Products — 4탭 상세 다이얼로그
- 기존 단일 뷰 → 4탭 구조: Overview, Order Logs, License Stock, Merchants
- Overview: 기존 정보 유지
- Order Logs: 7개 mock 주문 목록
- License Stock: 재고 현황 카드, 소스별 분류, 키 목록, "Add Keys" 버튼
- Merchants: 4개 플랫폼 카드 (연결 상태, auto-sync, 리스팅 URL)
- 다이얼로그 `sm:max-w-2xl`로 확장

### Products — Order Detail Popup + Merchant Settings
- Order Logs 항목 클릭 시 주문 상세 팝업 (nested dialog)
- `ProductOrder` 타입에 delivery, deliveryTarget, keyCode 추가
- Merchant 카드에 Settings 확장 패널: Product ID/SKU, Price Override, Auto-Delivery, Stock Sync, Webhook URL (복사 기능)
- `MerchantConnection` 타입에 externalProductId, priceOverride, autoDelivery, stockSync, webhookUrl 추가

### Licenses — 라이선스 충전 페이지 (신규)
- `/dashboard/licenses` 경로 추가
- 좌측: 상품 선택 → 키 타입 선택 → 입력 → 소스 태그 → "Add Keys"
- 우측: 오늘/이번주 통계 + 최근 충전 이력 10건
- 사이드바에 "Licenses" 메뉴 추가 (KeyRound 아이콘)

### Providers — 외부 공급자 페이지 (신규)
- `/dashboard/providers` 경로 추가
- 4개 mock provider: Kinguin API, G2A Goldmine, KeyWholesale Pro, DirectKeys API
- 카드: 상태, API URL, 인증 타입, 통계
- Configure 확장: 연결 설정, 상품 매핑 테이블, 이행 규칙, 활동 로그
- 2열 그리드 레이아웃 (xl:grid-cols-2)
- 사이드바에 "Providers" 메뉴 추가 (Unplug 아이콘)

### Orders — Channel 팝업 버그 수정
- 채널 클릭 시 팝업이 1초 뜨고 닫히는 버그 수정
- 원인: 메인 다이얼로그 `open` 조건에 `!channelExpanded` 포함 → 서브 다이얼로그 열리면 메인이 언마운트 → 서브도 같이 사라짐
- 수정: 메인 다이얼로그는 `selectedOrder !== null`일 때 항상 열려있게 변경

### 기타
- Customers.tsx: 미사용 `profileTab`/`setProfileTab` 변수 prefix underscore 처리

---

## 2026-04-29 (이전 세션들)

### Orders — 주문 상세 모달 고도화
- 재발송 확인 다이얼로그 추가 (채널 정보 표시 + confirm)
- 타임라인 각 단계에 상세 정보 추가 (플랫폼, 상품, 금액, 고객, 배송 대상)
- Status dropdown + Update 버튼 제거

### Channels — 채널 설정 페이지 고도화
- 각 채널별 API 키/토큰 설정 UI
- 채널별 배송 로그 표시
- 플러그인 스토어에서 채널 추가 가능하도록 변경

### Customers — 프로필 UI 개선
- Tags/Memo 섹션을 Purchase History 아래로 이동

---

## 2026-04-28

### Inventory — 상세 모달 구현
- 인벤토리 행 클릭 → 상세 모달 (모든 값 표시)
- Delivery URL 표시 (Delivered 상태에서만)
- 라이선스 삭제/보류 기능 (확인 다이얼로그)
- 태그 시스템 (추가/삭제, 검색 가능)
- Delivery URL 만료 기능 + 만료 상태 표시

### Inventory — UI 개선
- "Delivered to" 컬럼 → 수신자 + 배송 채널 + 시간 표시
- 배송 섹션 리디자인 (타임라인, URL 만료, Expire URL 버튼)
- `deliveredDate`, `deliveryMethod`, `deliveryExpires` 필드 추가

### Merchants — 플러그인 스토어 + 플랫폼 설정
- Plugin Store UI 구현 (Merchant, Provider, Delivery 카테고리)
- 플랫폼별 설정 UI (API 키, 연동 상태, 동기화)

### Workflow — 워크플로우 페이지 (신규)
- `/dashboard/workflow` 경로 추가
- React Flow (@xyflow/react) 기반 워크플로우 빌더
- 마켓플레이스 → Mont → 배송 채널 파이프라인 시각화

### Analytics — UI 개선
- Delivery Performance 카드: 무의미한 바 차트 → deviation indicator 그리드로 변경

### Dashboard — 날짜 선택기 제거

### Orders — 주문 상세 모달 구현
- 주문 클릭 → 상세 모달 (Overview/Logs 탭)
- 플랫폼/라이선스/채널 3단 카드
- 타임라인 뷰
- 채널 상세 팝업
- 메시지 원문 보기
- Raw Data 보기
- 구매자 정보 편집
- 관리자 메모

---

*마지막 업데이트: 2026-04-29*
