# Mont — Project Context

> AI 에이전트가 프로젝트 맥락을 빠르게 파악하기 위한 참조 문서.
> 세션이 바뀌어도 이 파일을 읽으면 프로젝트 전체 맥락을 복원할 수 있다.
> 상세 문서: ARCHITECTURE.md, DATA-MODEL.md, CHANGELOG.md

---

## 제품 개요

**Mont**는 디지털 상품 자동배송 올인원 SaaS 플랫폼이다.

네이버 스토어, G2G, G2A, 개인 웹사이트 등 어디서 팔든 — 주문을 실시간으로 추적하고, 디지털 상품을 자동으로 배송하고, 모든 채널을 한 곳에서 관리한다.

## 핵심 가치

- **자동배송**: 주문 → 재고에서 키 꺼내기 → 구매자에게 즉시 전달
- **멀티 플랫폼 통합**: 네이버, G2G, G2A, 개인사이트 등 모든 판매 채널을 하나로
- **외부 Provider 연동**: Kinguin, G2A Goldmine 등 외부 API로 자동 키 조달
- **다양한 키 형식**: 키코드, 링크, 파일, 이미지, 구독 — 모든 디지털 상품 지원

## 취급 상품

- 게임 키 / 계정 (Steam, PlayStation, Xbox 등)
- 소프트웨어 라이선스 (Windows, Office, Adobe 등)
- 기프트카드 / 포인트 (구글플레이, 아이튠즈, 문화상품권 등)
- 구독 서비스 (Spotify, YouTube Premium, Xbox Game Pass 등)
- 디지털 콘텐츠 전반 — 종류 불문

## 타겟 유저

| 세그먼트 | 설명 |
|---------|------|
| 개인 셀러 | 네이버 스토어, 개인 사이트에서 소규모로 파는 사람 |
| 전문 리셀러 | G2G, G2A 같은 마켓플레이스에서 대량 판매하는 사람 |
| 기업/팀 | 디지털 상품 유통 회사, 팀 단위 운영 |

## 기술 스택

| 항목 | 기술 |
|------|------|
| Runtime | Bun |
| Framework | Vite + React 19 |
| Language | TypeScript 6 (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (base-nova style) |
| Font | Plus Jakarta Sans Variable |
| Icons | Lucide React |
| Charts | Recharts |
| Animation | Framer Motion (motion/react) |
| Workflow | @xyflow/react (React Flow) |
| Path alias | `@/*` → `./src/*` |
| Package manager | **bun only** (npm/npx 사용 금지) |

## 프로젝트 구조

```
mont/
├── .agents/skills/          # 프로젝트 로컬 AI 스킬
│   ├── design-shotgun/      # 디자인 변형 생성 스킬
│   ├── design-review/       # 디자인 QA 스킬
│   └── nestjs-best-practices/
├── .mont/
│   ├── PROJECT.md           # 이 파일 (프로젝트 컨텍스트)
│   ├── ARCHITECTURE.md      # 아키텍처 상세 (파일 맵, 라우팅, 컴포넌트)
│   ├── DATA-MODEL.md        # 핵심 타입/인터페이스 정리
│   └── CHANGELOG.md         # 세션별 작업 이력
├── designsystem/
│   └── DESIGN.md            # 디자인 시스템 문서
├── src/
│   ├── main.tsx             # 엔트리포인트 + 라우팅
│   ├── shared.tsx           # 공유 타입, 유틸, 컴포넌트
│   ├── DashboardLayout.tsx  # 대시보드 레이아웃 (사이드바, 헤더)
│   ├── GlobalSearch.tsx     # 글로벌 검색
│   ├── App.tsx              # 랜딩 페이지
│   ├── Login.tsx / Signup.tsx
│   ├── Dashboard.tsx        # 대시보드 오버뷰
│   ├── Orders.tsx           # 주문 관리
│   ├── Products.tsx         # 상품 관리
│   ├── Inventory.tsx        # 재고 (라이선스 키) 관리
│   ├── Licenses.tsx         # 라이선스 수동 충전
│   ├── Providers.tsx        # 외부 키 공급자 관리
│   ├── Customers.tsx        # 고객 관리
│   ├── Merchants.tsx        # 마켓플레이스 연동 + 플러그인 스토어
│   ├── Analytics.tsx        # 분석/리포트
│   ├── Channels.tsx         # 배송 채널 설정
│   ├── Workflow.tsx         # 워크플로우 자동화 (React Flow)
│   ├── Settings.tsx         # 설정
│   ├── Workspace.tsx        # 워크스페이스 관리
│   ├── Onboarding.tsx       # 온보딩 플로우
│   ├── Delivery.tsx         # 공개 배송 페이지 (/delivery/:code)
│   ├── NotFound.tsx         # 404
│   ├── components/ui/       # shadcn/ui 컴포넌트 (10개)
│   ├── lib/utils.ts         # 유틸리티
│   └── index.css            # 글로벌 스타일 + Tailwind
├── AGENTS.md                # AI 에이전트 규칙
├── .mcp.json                # MCP 서버 설정
└── components.json          # shadcn/ui 설정
```

## 주요 페이지 요약

| 페이지 | 경로 | 핵심 기능 |
|--------|------|-----------|
| Dashboard | /dashboard | KPI 메트릭, 최근 주문, 플랫폼 분포, 재고 현황 |
| Orders | /dashboard/orders | 주문 목록/필터/검색, 주문 상세 모달 (타임라인, 채널, 재발송) |
| Products | /dashboard/products | 상품 카탈로그, 상세 (Overview/Order Logs/License Stock/Merchants 탭) |
| Inventory | /dashboard/inventory | 키 재고 테이블, 상세 모달 (키 타입별 UI, 배송 정보, 태그) |
| Licenses | /dashboard/licenses | 수동 키 충전 (키/링크/파일/이미지/구독), 충전 이력 |
| Providers | /dashboard/providers | 외부 API 공급자 관리, 상품 매핑, 이행 규칙, 활동 로그 |
| Customers | /dashboard/customers | 고객 목록, 프로필 (주문 이력, 태그, 메모) |
| Merchants | /dashboard/merchants | 플러그인 스토어, 플랫폼 연동 설정 |
| Analytics | /dashboard/analytics | 매출/배송/성과 분석 차트 |
| Channels | /dashboard/channels | 배송 채널 설정 (Telegram, Email, SMS, WhatsApp 등) |
| Workflow | /dashboard/workflow | React Flow 기반 자동화 워크플로우 빌더 |
| Delivery | /delivery/:code | 공개 배송 페이지 (구매자가 키 확인) |

## 코드 규칙

- `as any`, `@ts-ignore`, `@ts-expect-error` 금지
- 빈 catch 블록 금지
- 외부 이미지 URL 금지 — 로컬 에셋 또는 SVG 인라인
- CSS/Tailwind 클래스 우선 (인라인 스타일 최소화)
- 액션 버튼에 인라인 expand/collapse 금지 — 항상 Dialog/popup 사용
- 패키지 매니저: **bun only**

## 디자인 토큰

| 토큰 | 값 |
|------|-----|
| Primary | #918DF6 |
| Text | #181925 |
| Muted | #999999 |
| Secondary text | #666666 |
| Border | rgba(0,0,0,0.08) |
| Card shadow | 0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06) |
| Tracking | -0.32px (전역) |
| Font sizes | 10px labels, 11px captions, 12px secondary, 13px body, 14px emphasis, 16-18px headings |

---

*마지막 업데이트: 2026-04-29*
