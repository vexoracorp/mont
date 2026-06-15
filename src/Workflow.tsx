import { useState, useCallback, useMemo, memo } from "react"
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type NodeProps,
  type Node,
  type Edge,
} from "@xyflow/react"
import { Globe, RotateCcw } from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"

// ─── Types ───────────────────────────────────────────────────

type MerchantNodeData = {
  label: string
  iconBg: string
  iconLabel: string
  connected: boolean
  orderCount: number
  storeName?: string
}

type EngineNodeData = {
  label: string
  processingCount: number
  deliveredToday: number
  failedCount: number
}

type DeliveryNodeData = {
  label: string
  color: string
  deliveredCount: number
  status: "active" | "idle"
}

type ProviderNodeData = {
  label: string
  iconBg: string
  iconLabel: string
  keysAvailable: number
  status: "active" | "idle"
}

// ─── Custom Nodes ────────────────────────────────────────────

const MerchantNode = memo(({ data }: NodeProps<Node<MerchantNodeData>>) => {
  return (
    <div
      className="w-[200px] rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: data.iconBg }}
        >
          {data.iconLabel === "globe" ? (
            <Globe className="size-4" strokeWidth={2} />
          ) : (
            <span className={`font-bold leading-none ${data.iconLabel.length > 1 ? "text-[9px]" : "text-[14px]"}`}>
              {data.iconLabel}
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{data.label}</p>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block size-1.5 rounded-full ${data.connected ? "bg-[#34A853]" : "bg-[#CCCCCC]"}`} />
            <span className={`text-[11px] tracking-[-0.32px] ${data.connected ? "text-[#34A853]" : "text-[#999999]"}`}>
              {data.connected ? data.storeName ?? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">
        {data.orderCount.toLocaleString("en-US")} orders
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2.5 !rounded-full !border-2 !border-white !bg-[#918DF6]"
      />
    </div>
  )
})
MerchantNode.displayName = "MerchantNode"

const EngineNode = memo(({ data }: NodeProps<Node<EngineNodeData>>) => {
  return (
    <div
      className="w-[220px] rounded-xl border-2 border-[#918DF6]/30 bg-white p-4"
      style={{ boxShadow: "0 1px 3px rgba(145,141,246,0.12), 0 0 0 1px rgba(145,141,246,0.08)" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2.5 !rounded-full !border-2 !border-white !bg-[#918DF6]"
      />
      <div className="flex items-center gap-3">
        <div className="relative flex size-10 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
          <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-white" />
        </div>
        <div>
          <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{data.label}</p>
          <p className="text-[11px] tracking-[-0.32px] text-[#918DF6]">Processing Engine</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-[11px] tabular-nums tracking-[-0.32px]">
        <div className="flex items-center gap-1">
          <span className="inline-block size-1.5 rounded-full bg-[#E37400]" />
          <span className="text-[#666666]">{data.processingCount} queued</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block size-1.5 rounded-full bg-[#34A853]" />
          <span className="text-[#666666]">{data.deliveredToday.toLocaleString("en-US")} today</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block size-1.5 rounded-full bg-[#D93025]" />
          <span className="text-[#666666]">{data.failedCount} failed</span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2.5 !rounded-full !border-2 !border-white !bg-[#918DF6]"
      />
    </div>
  )
})
EngineNode.displayName = "EngineNode"

const DeliveryNode = memo(({ data }: NodeProps<Node<DeliveryNodeData>>) => {
  return (
    <div
      className="w-[180px] rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2.5 !rounded-full !border-2 !border-white !bg-[#918DF6]"
      />
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
          style={{ backgroundColor: data.color }}
        >
          {data.label.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{data.label}</p>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block size-1.5 rounded-full ${data.status === "active" ? "bg-[#34A853]" : "bg-[#CCCCCC]"}`} />
            <span className={`text-[11px] tracking-[-0.32px] ${data.status === "active" ? "text-[#34A853]" : "text-[#999999]"}`}>
              {data.status === "active" ? "Active" : "Idle"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">
        {data.deliveredCount.toLocaleString("en-US")} delivered
      </div>
    </div>
  )
})
DeliveryNode.displayName = "DeliveryNode"

const ProviderNode = memo(({ data }: NodeProps<Node<ProviderNodeData>>) => {
  return (
    <div
      className="w-[190px] rounded-xl border border-dashed border-[rgba(0,0,0,0.12)] bg-white p-3.5"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: data.iconBg }}
        >
          <span className={`font-bold leading-none ${data.iconLabel.length > 1 ? "text-[8px]" : "text-[12px]"}`}>
            {data.iconLabel}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{data.label}</p>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block size-1.5 rounded-full ${data.status === "active" ? "bg-[#34A853]" : "bg-[#CCCCCC]"}`} />
            <span className={`text-[11px] tracking-[-0.32px] ${data.status === "active" ? "text-[#34A853]" : "text-[#999999]"}`}>
              {data.status === "active" ? "Active" : "Idle"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">
        {data.keysAvailable.toLocaleString("en-US")} keys available
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2.5 !rounded-full !border-2 !border-white !bg-[#918DF6]"
      />
    </div>
  )
})
ProviderNode.displayName = "ProviderNode"

// ─── Initial Data ────────────────────────────────────────────

const initialNodes: Node[] = [
  // Merchant sources (left column — centered around engine Y)
  {
    id: "merchant-naver",
    type: "merchant",
    position: { x: 50, y: 30 },
    data: { label: "Naver Store", iconBg: "#03C75A", iconLabel: "N", connected: true, orderCount: 1247, storeName: "Vexora 디지털스토어" },
  },
  {
    id: "merchant-g2g",
    type: "merchant",
    position: { x: 50, y: 155 },
    data: { label: "G2G", iconBg: "#E87A2A", iconLabel: "G2G", connected: true, orderCount: 892, storeName: "VexoraDigital" },
  },
  {
    id: "merchant-g2a",
    type: "merchant",
    position: { x: 50, y: 280 },
    data: { label: "G2A", iconBg: "#F05A23", iconLabel: "G2A", connected: false, orderCount: 0 },
  },
  {
    id: "merchant-direct",
    type: "merchant",
    position: { x: 50, y: 405 },
    data: { label: "Direct / Website", iconBg: "#918DF6", iconLabel: "globe", connected: false, orderCount: 0 },
  },

  // Key providers (above-left of engine, feeding in via right→left edges)
  {
    id: "provider-kinguin",
    type: "provider",
    position: { x: 320, y: 40 },
    data: { label: "Kinguin", iconBg: "#0EA5E9", iconLabel: "K", keysAvailable: 4820, status: "active" },
  },
  {
    id: "provider-keygen",
    type: "provider",
    position: { x: 320, y: 144 },
    data: { label: "Key Generator", iconBg: "#918DF6", iconLabel: "Kg", keysAvailable: 12500, status: "active" },
  },

  // Mont engine (center)
  {
    id: "engine",
    type: "engine",
    position: { x: 480, y: 210 },
    data: { label: "Mont", processingCount: 12, deliveredToday: 847, failedCount: 3 },
  },

  // Delivery outputs (right column — centered around engine Y)
  {
    id: "delivery-telegram",
    type: "delivery",
    position: { x: 860, y: 50 },
    data: { label: "Telegram", color: "#2AABEE", deliveredCount: 1423, status: "active" },
  },
  {
    id: "delivery-email",
    type: "delivery",
    position: { x: 860, y: 165 },
    data: { label: "Email", color: "#2C78FC", deliveredCount: 2891, status: "active" },
  },
  {
    id: "delivery-sms",
    type: "delivery",
    position: { x: 860, y: 280 },
    data: { label: "SMS", color: "#33C758", deliveredCount: 567, status: "active" },
  },
  {
    id: "delivery-kakao",
    type: "delivery",
    position: { x: 860, y: 395 },
    data: { label: "KakaoTalk", color: "#FEE500", deliveredCount: 1204, status: "active" },
  },
]

const initialEdges: Edge[] = [
  // Merchants → Engine
  { id: "e-naver-engine", source: "merchant-naver", target: "engine", animated: true, style: { stroke: "#03C75A", strokeWidth: 2 } },
  { id: "e-g2g-engine", source: "merchant-g2g", target: "engine", animated: true, style: { stroke: "#E87A2A", strokeWidth: 2 } },
  { id: "e-g2a-engine", source: "merchant-g2a", target: "engine", animated: false, style: { stroke: "#CCCCCC", strokeWidth: 1.5, strokeDasharray: "6 4" } },
  { id: "e-direct-engine", source: "merchant-direct", target: "engine", animated: false, style: { stroke: "#CCCCCC", strokeWidth: 1.5, strokeDasharray: "6 4" } },

  // Providers → Engine
  { id: "e-kinguin-engine", source: "provider-kinguin", target: "engine", animated: true, style: { stroke: "#0EA5E9", strokeWidth: 1.5 } },
  { id: "e-keygen-engine", source: "provider-keygen", target: "engine", animated: true, style: { stroke: "#918DF6", strokeWidth: 1.5 } },

  // Engine → Delivery
  { id: "e-engine-telegram", source: "engine", target: "delivery-telegram", animated: true, style: { stroke: "#2AABEE", strokeWidth: 2 } },
  { id: "e-engine-email", source: "engine", target: "delivery-email", animated: true, style: { stroke: "#2C78FC", strokeWidth: 2 } },
  { id: "e-engine-sms", source: "engine", target: "delivery-sms", animated: true, style: { stroke: "#33C758", strokeWidth: 2 } },
  { id: "e-engine-kakao", source: "engine", target: "delivery-kakao", animated: true, style: { stroke: "#FEE500", strokeWidth: 2 } },
]

// ─── Page Component ──────────────────────────────────────────

export default function WorkflowPage() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const nodeTypes = useMemo(() => ({
    merchant: MerchantNode,
    engine: EngineNode,
    delivery: DeliveryNode,
    provider: ProviderNode,
  }), [])

  const handleReset = useCallback(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [setNodes, setEdges])

  const totalOrders = 2139
  const activeChannels = 4
  const activeMerchants = 2

  return (
    <DashboardLayout
      title="Workflow"
      currency={currency}
      onCurrencyToggle={() => setCurrency((c) => (c === "USD" ? "KRW" : "USD"))}
    >
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Stats bar */}
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.08)] px-6 py-3 lg:px-8">
          <div className="flex items-center gap-6 text-[13px] tracking-[-0.32px]">
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[#34A853]" />
              <span className="text-[#666666]">
                <span className="tabular-nums font-medium text-[#181925]">{activeMerchants}</span> merchants active
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[#1A73E8]" />
              <span className="text-[#666666]">
                <span className="tabular-nums font-medium text-[#181925]">{totalOrders.toLocaleString("en-US")}</span> total orders
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block size-1.5 rounded-full bg-[#918DF6]" />
              <span className="text-[#666666]">
                <span className="tabular-nums font-medium text-[#181925]">{activeChannels}</span> delivery channels
              </span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex h-7 items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.02)]"
          >
            <RotateCcw className="size-3" strokeWidth={2} />
            Reset layout
          </button>
        </div>

        {/* React Flow canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.3}
            maxZoom={1.5}
            defaultEdgeOptions={{ type: "smoothstep" }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(0,0,0,0.06)" />
            <Controls
              showInteractive={false}
              className="!rounded-xl !border !border-[rgba(0,0,0,0.08)] !bg-white !shadow-none"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            />
          </ReactFlow>
        </div>
      </div>
    </DashboardLayout>
  )
}
