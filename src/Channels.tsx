import { useState } from "react"
import { Mail, MessageCircle, Smartphone, Phone, Globe, Plus, Trash2, Send, Check, Download, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Settings, FileText, Eye, EyeOff, Copy, MoreHorizontal, Zap } from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import type { Currency, DeliveryPlugin } from "@/shared"
import { deliveryPlugins } from "@/shared"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ChannelType = "Email" | "Telegram" | "SMS" | "WhatsApp" | "KakaoTalk" | "Webhook" | "Discord" | "LINE" | "Slack"

type Channel = {
  id: string
  name: string
  type: ChannelType
  endpoint: string
  active: boolean
  pluginId: string
}

type SheetTab = "settings" | "logs"

type ConfigField = {
  key: string
  label: string
  type: "text" | "password" | "number" | "select"
  placeholder: string
  value: string
  options?: string[]
}

type DeliveryLog = {
  id: string
  timestamp: string
  recipient: string
  product: string
  status: "delivered" | "failed" | "pending"
  deliveryTime: string
  request: Record<string, unknown>
  response: Record<string, unknown> | null
  headers: Record<string, string>
  statusCode: number | null
  errorMessage: string | null
}

const channelConfigs: Record<string, ConfigField[]> = {
  Email: [
    { key: "smtp_host", label: "SMTP Host", type: "text", placeholder: "smtp.gmail.com", value: "smtp.gmail.com" },
    { key: "smtp_port", label: "SMTP Port", type: "number", placeholder: "587", value: "587" },
    { key: "smtp_user", label: "Username", type: "text", placeholder: "user@example.com", value: "yuchan@vexora.team" },
    { key: "smtp_pass", label: "Password", type: "password", placeholder: "App password", value: "vxr-app-xxxx-xxxx" },
    { key: "from_addr", label: "From Address", type: "text", placeholder: "noreply@example.com", value: "delivery@vexora.team" },
  ],
  Telegram: [
    { key: "bot_token", label: "Bot Token", type: "password", placeholder: "123456:ABC-DEF...", value: "7284619:AAF-vexora_bot_token_xxxx" },
    { key: "chat_id", label: "Chat ID", type: "text", placeholder: "-1001234567890", value: "-1001847293650" },
    { key: "parse_mode", label: "Parse Mode", type: "select", placeholder: "HTML", value: "HTML", options: ["HTML", "Markdown", "MarkdownV2"] },
  ],
  SMS: [
    { key: "api_key", label: "API Key", type: "password", placeholder: "Your API key", value: "sk_sms_live_xxxxxxxxxxxx" },
    { key: "api_secret", label: "API Secret", type: "password", placeholder: "Your API secret", value: "ss_xxxxxxxxxxxxxxxxxxxx" },
    { key: "sender", label: "Sender Number", type: "text", placeholder: "+821012345678", value: "+821087654321" },
  ],
  WhatsApp: [
    { key: "api_key", label: "API Key", type: "password", placeholder: "WhatsApp API key", value: "whsk_live_xxxxxxxxxxxx" },
    { key: "phone_id", label: "Phone Number ID", type: "text", placeholder: "1234567890", value: "109284756301" },
    { key: "business_id", label: "Business Account ID", type: "text", placeholder: "Business account ID", value: "ba_vexora_28471" },
  ],
  KakaoTalk: [
    { key: "app_key", label: "App Key", type: "password", placeholder: "KakaoTalk app key", value: "kk_app_xxxxxxxxxxxx" },
    { key: "template_id", label: "Template ID", type: "text", placeholder: "Template ID", value: "TPL_delivery_v2" },
    { key: "sender_key", label: "Sender Key", type: "password", placeholder: "Sender key", value: "sk_kakao_xxxxxxxxxxxx" },
  ],
  Webhook: [
    { key: "url", label: "Webhook URL", type: "text", placeholder: "https://example.com/webhook", value: "https://hooks.slack.com/services/T0XXXXX/B0XXXXX" },
    { key: "secret", label: "Secret", type: "password", placeholder: "Signing secret", value: "whsec_xxxxxxxxxxxxxxxxxxxx" },
    { key: "method", label: "HTTP Method", type: "select", placeholder: "POST", value: "POST", options: ["POST", "PUT", "PATCH"] },
    { key: "headers", label: "Custom Headers", type: "text", placeholder: '{"Authorization": "Bearer ..."}', value: '{"Content-Type": "application/json"}' },
  ],
}

function generateMockLogs(channelName: string, channelType: string): DeliveryLog[] {
  const products = ["Windows 11 Pro Key", "Office 365 License", "Steam Gift Card $50", "Xbox Game Pass 1M", "PS Plus 12M"]
  const statuses: DeliveryLog["status"][] = ["delivered", "delivered", "delivered", "failed", "pending"]
  const recipients: Record<string, string[]> = {
    Email: ["j***@gmail.com", "user***@naver.com", "k***@yahoo.com", "m***@outlook.com", "s***@daum.net"],
    Telegram: ["@us***42", "@ki***dev", "@ma***kr", "@jo***88", "@te***01"],
    SMS: ["010-****-3847", "010-****-9182", "010-****-5520", "010-****-7734", "010-****-1156"],
    WhatsApp: ["+82-10-****-3847", "+82-10-****-9182", "+1-***-***-5520", "+82-10-****-7734", "+44-***-***-1156"],
    KakaoTalk: ["010-****-3847", "010-****-9182", "010-****-5520", "010-****-7734", "010-****-1156"],
    Webhook: ["hook/evt_3847", "hook/evt_9182", "hook/evt_5520", "hook/evt_7734", "hook/evt_1156"],
  }
  const channelRecipients = recipients[channelType] ?? recipients["Email"]
  const times = ["0.8s", "1.2s", "0.5s", "—", "..."]
  const baseDate = new Date(2026, 3, 29, 14, 30, 0)

  const requestTemplates: Record<string, (product: string, recipient: string) => Record<string, unknown>> = {
    Email: (product, recipient) => ({ method: "POST", url: "smtp://smtp.gmail.com:587", to: recipient, from: "delivery@vexora.team", subject: `Your order: ${product}`, body: `Hi! Your product key for ${product} is attached.`, content_type: "text/html" }),
    Telegram: (product, recipient) => ({ method: "POST", url: "https://api.telegram.org/bot7284619:AAF-.../sendMessage", chat_id: recipient, text: `✅ Order delivered: ${product}`, parse_mode: "HTML" }),
    SMS: (product, recipient) => ({ method: "POST", url: "https://api.sms-provider.com/v1/send", to: recipient, body: `[Vexora] Your ${product} key has been sent. Check your email.`, sender: "+821087654321" }),
    WhatsApp: (product, recipient) => ({ method: "POST", url: "https://graph.facebook.com/v18.0/109284756301/messages", to: recipient, type: "template", template: { name: "delivery_notification", parameters: [product] } }),
    KakaoTalk: (product, recipient) => ({ method: "POST", url: "https://kapi.kakao.com/v2/api/talk/memo/send", to: recipient, template_id: "TPL_delivery_v2", template_args: { product, order_url: "https://vexora.team/orders/..." } }),
    Webhook: (product, recipient) => ({ method: "POST", url: "https://hooks.slack.com/services/T0XXXXX/B0XXXXX", payload: { text: `New delivery: ${product} → ${recipient}`, channel: "#deliveries" } }),
  }

  const responseTemplates: Record<string, (status: DeliveryLog["status"]) => { response: Record<string, unknown> | null; statusCode: number | null; errorMessage: string | null }> = {
    Email: (s) => s === "delivered" ? { response: { message_id: `<${Date.now()}@vexora.team>`, accepted: true }, statusCode: 250, errorMessage: null } : s === "failed" ? { response: { error: "SMTP connection refused", code: "ECONNREFUSED" }, statusCode: 550, errorMessage: "Recipient mailbox unavailable" } : { response: null, statusCode: null, errorMessage: null },
    Telegram: (s) => s === "delivered" ? { response: { ok: true, result: { message_id: Math.floor(Math.random() * 9000) + 1000, chat: { id: -1001847293650 } } }, statusCode: 200, errorMessage: null } : s === "failed" ? { response: { ok: false, error_code: 403, description: "Forbidden: bot was blocked by the user" }, statusCode: 403, errorMessage: "Bot was blocked by the user" } : { response: null, statusCode: null, errorMessage: null },
    SMS: (s) => s === "delivered" ? { response: { sid: `SM${Math.random().toString(36).slice(2, 10)}`, status: "sent", segments: 1 }, statusCode: 201, errorMessage: null } : s === "failed" ? { response: { code: 21211, message: "Invalid phone number" }, statusCode: 400, errorMessage: "Invalid phone number format" } : { response: null, statusCode: null, errorMessage: null },
    WhatsApp: (s) => s === "delivered" ? { response: { messages: [{ id: `wamid.${Math.random().toString(36).slice(2, 14)}` }] }, statusCode: 200, errorMessage: null } : s === "failed" ? { response: { error: { message: "Rate limit exceeded", type: "OAuthException", code: 80007 } }, statusCode: 429, errorMessage: "Rate limit exceeded" } : { response: null, statusCode: null, errorMessage: null },
    KakaoTalk: (s) => s === "delivered" ? { response: { result_code: 0, result_message: "success" }, statusCode: 200, errorMessage: null } : s === "failed" ? { response: { result_code: -401, result_message: "not registered user" }, statusCode: 401, errorMessage: "User not registered for KakaoTalk notifications" } : { response: null, statusCode: null, errorMessage: null },
    Webhook: (s) => s === "delivered" ? { response: { ok: true }, statusCode: 200, errorMessage: null } : s === "failed" ? { response: { error: "channel_not_found" }, statusCode: 404, errorMessage: "Slack channel not found" } : { response: null, statusCode: null, errorMessage: null },
  }

  const headerTemplates: Record<string, Record<string, string>> = {
    Email: { "Content-Type": "text/html; charset=utf-8", "X-Mailer": "Vexora/1.0", "MIME-Version": "1.0" },
    Telegram: { "Content-Type": "application/json", "Authorization": "Bearer 7284619:AAF-..." },
    SMS: { "Content-Type": "application/json", "Authorization": "Basic c2tfc21zX2xpdmU6..." },
    WhatsApp: { "Content-Type": "application/json", "Authorization": "Bearer EAAx..." },
    KakaoTalk: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer kk_app_..." },
    Webhook: { "Content-Type": "application/json", "X-Webhook-Signature": "sha256=..." },
  }

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(baseDate.getTime() - i * 3600000 * (i + 1))
    const status = statuses[i] ?? "pending"
    const product = products[i] ?? "Unknown Product"
    const recipient = channelRecipients[i] ?? "unknown"
    const reqFn = requestTemplates[channelType] ?? requestTemplates["Email"]
    const resFn = responseTemplates[channelType] ?? responseTemplates["Email"]
    const resData = resFn(status)
    return {
      id: `${channelName}-log-${i}`,
      timestamp: date.toISOString(),
      recipient,
      product,
      status,
      deliveryTime: times[i] ?? "—",
      request: reqFn(product, recipient),
      response: resData.response,
      headers: headerTemplates[channelType] ?? headerTemplates["Email"],
      statusCode: resData.statusCode,
      errorMessage: resData.errorMessage,
    }
  })
}

const channelMeta: Record<string, { icon: typeof Mail; color: string }> = {
  Email: { icon: Mail, color: "#2C78FC" },
  Telegram: { icon: MessageCircle, color: "#2AABEE" },
  SMS: { icon: Smartphone, color: "#33C758" },
  WhatsApp: { icon: Phone, color: "#25D366" },
  KakaoTalk: { icon: Phone, color: "#FEE500" },
  Webhook: { icon: Globe, color: "#E37400" },
  Discord: { icon: MessageCircle, color: "#5865F2" },
  LINE: { icon: MessageCircle, color: "#06C755" },
  Slack: { icon: Globe, color: "#4A154B" },
}

const initialChannels: Channel[] = [
  { id: "1", name: "Primary Email", type: "Email", endpoint: "yuchan@vexora.team", active: true, pluginId: "email" },
  { id: "2", name: "Vexora Bot", type: "Telegram", endpoint: "Bot: vexora_bot", active: true, pluginId: "telegram" },
  { id: "3", name: "Slack Integration", type: "Webhook", endpoint: "https://hooks.slack.com/services/T0...", active: true, pluginId: "webhook" },
  { id: "4", name: "KakaoTalk Alert", type: "KakaoTalk", endpoint: "010-****-1234", active: false, pluginId: "kakao" },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
      style={{ backgroundColor: checked ? "#918DF6" : "rgba(0,0,0,0.15)" }}
    >
      <span
        className="pointer-events-none inline-block size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  )
}

function TypeBadge({ type, color }: { type: string; color: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-[-0.32px]"
      style={{ backgroundColor: `${color}14`, color }}
    >
      {type}
    </span>
  )
}

const channelMockStats: Record<string, { lastDelivery: string; deliveryCount: number; successRate: number }> = {
  "1": { lastDelivery: "2m ago", deliveryCount: 142, successRate: 98.2 },
  "2": { lastDelivery: "18m ago", deliveryCount: 87, successRate: 95.4 },
  "3": { lastDelivery: "1h ago", deliveryCount: 231, successRate: 99.1 },
  "4": { lastDelivery: "3d ago", deliveryCount: 12, successRate: 83.3 },
}

function getChannelStats(id: string) {
  return channelMockStats[id] ?? { lastDelivery: "—", deliveryCount: 0, successRate: 0 }
}

function SuccessRateBar({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-8 overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${rate}%`, backgroundColor: rate >= 95 ? "#34A853" : rate >= 80 ? "#E37400" : "#D93025" }}
        />
      </div>
      <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#666666]">{rate}%</span>
    </div>
  )
}

function OverflowMenu({ onDelete, onSettings }: { onDelete: () => void; onSettings: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="flex size-7 items-center justify-center rounded-md text-[#999999] transition-colors hover:bg-[rgba(0,0,0,0.04)] hover:text-[#666666]"
      >
        <MoreHorizontal className="size-3.5" strokeWidth={2} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false) }} onKeyDown={() => {}} role="presentation" />
          <div
            className="absolute right-0 z-50 mt-1 w-[160px] rounded-lg border border-[rgba(0,0,0,0.08)] bg-white py-1"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onSettings(); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] tracking-[-0.32px] text-[#181925] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
            >
              <Settings className="size-3.5 text-[#666666]" strokeWidth={2} />
              Settings
            </button>
            <div className="mx-2 my-1 h-px bg-[rgba(0,0,0,0.06)]" />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); setOpen(false) }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[rgba(217,48,37,0.04)]"
            >
              <Trash2 className="size-3.5" strokeWidth={2} />
              Delete Channel
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function PluginCard({
  plugin,
  selected,
  onSelect,
  onInstall,
}: {
  plugin: DeliveryPlugin
  selected: boolean
  onSelect: () => void
  onInstall: () => void
}) {
  return (
    <button
      type="button"
      onClick={plugin.installed ? onSelect : undefined}
      className={`flex flex-col rounded-xl border p-3 text-left transition-colors ${
        selected
          ? "border-[#918DF6] bg-[#918DF6]/[0.04]"
          : plugin.installed
            ? "border-[rgba(0,0,0,0.08)] bg-white hover:bg-[rgba(0,0,0,0.01)]"
            : "border-dashed border-[rgba(0,0,0,0.12)] bg-[rgba(0,0,0,0.01)] opacity-60"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: plugin.iconBg }}
        >
          <span className={`font-bold leading-none ${plugin.iconLabel.length > 1 ? "text-[8px]" : "text-[12px]"}`}>
            {plugin.iconLabel}
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{plugin.name}</p>
          <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{plugin.author}</p>
        </div>
        {selected && (
          <span className="flex size-5 items-center justify-center rounded-full bg-[#918DF6]">
            <Check className="size-3 text-white" strokeWidth={2.5} />
          </span>
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug tracking-[-0.32px] text-[#666666]">
        {plugin.description}
      </p>
      {!plugin.installed && (
        <div className="mt-2">
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onInstall() }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); onInstall() } }}
            className="inline-flex h-6 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.08)] px-2 text-[11px] font-medium tracking-[-0.32px] text-[#666666] hover:bg-[rgba(0,0,0,0.02)]"
          >
            <Download className="size-3" strokeWidth={2} />
            Install from Plugin Store
          </span>
        </div>
      )}
      {plugin.installed && plugin.pluginType === "plugin" && (
        <div className="mt-2 flex items-center gap-1">
          <Check className="size-3 text-[#34A853]" strokeWidth={2.5} />
          <span className="text-[11px] font-medium tracking-[-0.32px] text-[#34A853]">Installed</span>
        </div>
      )}
    </button>
  )
}

function formatTimestamp(iso: string) {
  const d = new Date(iso)
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${month}/${day} ${hours}:${minutes}`
}

function JsonBlock({ label, data }: { label: string; data: unknown }) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(data, null, 2)
  const handleCopy = () => {
    navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] tracking-[-0.32px] text-[#918DF6] hover:text-[#7B77E0]">
          <Copy className="size-3" strokeWidth={2} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-[220px] overflow-auto rounded-md bg-[#1a1a2e] p-3 text-[11px] leading-relaxed text-[#e0e0e0]">
        <code>{json}</code>
      </pre>
    </div>
  )
}

function LogRow({ log, isLast, onSelect }: { log: DeliveryLog; isLast: boolean; onSelect: () => void }) {
  return (
    <div className={!isLast ? "border-b border-[rgba(0,0,0,0.06)]" : ""}>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full flex-col gap-1.5 py-3 text-left transition-colors hover:bg-[rgba(0,0,0,0.015)]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-3 text-[#999999]" strokeWidth={2} />
            <span className="text-[12px] tabular-nums tracking-[-0.32px] text-[#999999]">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
          <StatusDot status={log.status} />
        </div>
        <div className="flex items-center justify-between pl-5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
              {log.product}
            </p>
            <p className="truncate text-[12px] tracking-[-0.32px] text-[#999999]">
              To: {log.recipient}
            </p>
          </div>
          <span className="shrink-0 text-[12px] tabular-nums tracking-[-0.32px] text-[#666666]">
            {log.deliveryTime}
          </span>
        </div>
      </button>
    </div>
  )
}

function ConfigInput({ field, onValueChange }: { field: ConfigField; onValueChange: (key: string, value: string) => void }) {
  const [visible, setVisible] = useState(false)
  const isPassword = field.type === "password"

  if (field.type === "select") {
    return (
      <div>
        <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
          {field.label}
        </label>
        <select
          value={field.value}
          onChange={(e) => onValueChange(field.key, e.target.value)}
          className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
        >
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
        {field.label}
      </label>
      <div className="relative">
        <input
          type={isPassword && !visible ? "password" : "text"}
          value={field.value}
          onChange={(e) => onValueChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-9 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute top-1/2 right-2.5 flex size-5 -translate-y-1/2 items-center justify-center text-[#999999] hover:text-[#666666]"
          >
            {visible ? <EyeOff className="size-3.5" strokeWidth={2} /> : <Eye className="size-3.5" strokeWidth={2} />}
          </button>
        )}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: DeliveryLog["status"] }) {
  const config = {
    delivered: { color: "#34A853", bg: "rgba(52,168,83,0.1)", label: "Delivered", icon: CheckCircle2 },
    failed: { color: "#D93025", bg: "rgba(217,48,37,0.1)", label: "Failed", icon: XCircle },
    pending: { color: "#E37400", bg: "rgba(227,116,0,0.1)", label: "Pending", icon: AlertCircle },
  }
  const c = config[status]
  const Icon = c.icon
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[-0.32px]"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {c.label}
    </span>
  )
}

function ChannelDetailSheet({
  channel,
  open,
  onOpenChange,
  plugins,
}: {
  channel: Channel | null
  open: boolean
  onOpenChange: (open: boolean) => void
  plugins: DeliveryPlugin[]
}) {
  const [activeTab, setActiveTab] = useState<SheetTab>("settings")
  const [configValues, setConfigValues] = useState<Record<string, string>>({})
  const [selectedLog, setSelectedLog] = useState<DeliveryLog | null>(null)

  if (!channel) return null

  const plugin = plugins.find((p) => p.id === channel.pluginId)
  const meta = channelMeta[channel.type]
  const Icon = meta?.icon ?? Send
  const color = plugin?.iconBg ?? meta?.color ?? "#918DF6"

  const fields = (channelConfigs[channel.type] ?? []).map((f) => ({
    ...f,
    value: configValues[f.key] ?? f.value,
  }))

  const logs = generateMockLogs(channel.name, channel.type)

  const handleFieldChange = (key: string, value: string) => {
    setConfigValues((prev) => ({ ...prev, [key]: value }))
  }

  const tabs: { key: SheetTab; label: string; icon: typeof Settings }[] = [
    { key: "settings", label: "Settings", icon: Settings },
    { key: "logs", label: "Logs", icon: FileText },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden" showCloseButton>
        <DialogHeader className="px-5 pt-5 pb-0">
          <div className="flex items-center gap-3">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}14`, color }}
            >
              <Icon className="size-4" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                {channel.name}
              </DialogTitle>
              <DialogDescription className="text-[12px] tracking-[-0.32px] text-[#999999]">
                {channel.type} &middot; {channel.endpoint}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex gap-0 border-b border-[rgba(0,0,0,0.08)] px-5 mt-3">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex items-center gap-1.5 px-3 pb-2.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                  isActive ? "text-[#918DF6]" : "text-[#999999] hover:text-[#666666]"
                }`}
              >
                <TabIcon className="size-3.5" strokeWidth={2} />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#918DF6]" />
                )}
              </button>
            )
          })}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === "settings" ? (
            <div className="flex flex-col gap-4 px-5 py-4">
              <div className="flex items-center gap-2">
                <Settings className="size-4 text-[#666666]" strokeWidth={2} />
                <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                  {channel.type} Configuration
                </p>
              </div>
              {fields.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {fields.map((field) => (
                    <ConfigInput key={field.key} field={field} onValueChange={handleFieldChange} />
                  ))}
                </div>
              ) : (
                <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  No configuration available for this channel type.
                </p>
              )}
              <div className="pt-2">
                <button className="flex h-9 items-center rounded-full bg-[#918DF6] px-5 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]">
                  Save Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col px-5 py-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="size-4 text-[#666666]" strokeWidth={2} />
                <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                  Delivery History
                </p>
                <span className="ml-auto text-[11px] tracking-[-0.32px] text-[#999999]">
                  Last 5 deliveries
                </span>
              </div>
              <div className="flex flex-col gap-0">
                {logs.map((log, idx) => (
                  <LogRow key={log.id} log={log} isLast={idx === logs.length - 1} onSelect={() => setSelectedLog(log)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <Dialog open={selectedLog !== null} onOpenChange={(o) => { if (!o) setSelectedLog(null) }}>
        {selectedLog && (
          <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-[760px]">
            <DialogHeader>
              <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                {selectedLog.product}
              </DialogTitle>
              <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                To: {selectedLog.recipient} &middot; {new Date(selectedLog.timestamp).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="flex max-h-[calc(85vh-96px)] flex-col gap-4 overflow-y-auto pr-1">
              <div className="flex items-center gap-4">
                <StatusDot status={selectedLog.status} />
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[11px] tracking-[-0.32px] text-[#999999]">Status Code</span>
                    <p className={`text-[13px] font-semibold tabular-nums tracking-[-0.32px] ${
                      selectedLog.statusCode && selectedLog.statusCode < 300 ? "text-[#34A853]" : selectedLog.statusCode && selectedLog.statusCode >= 400 ? "text-[#D93025]" : "text-[#999999]"
                    }`}>
                      {selectedLog.statusCode ?? "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[-0.32px] text-[#999999]">Latency</span>
                    <p className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">{selectedLog.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div className="rounded-md bg-[rgba(217,48,37,0.06)] px-3 py-2">
                  <p className="text-[12px] font-medium tracking-[-0.32px] text-[#D93025]">{selectedLog.errorMessage}</p>
                </div>
              )}

              <JsonBlock label="Request" data={selectedLog.request} />
              <JsonBlock label="Headers" data={selectedLog.headers} />
              {selectedLog.response && <JsonBlock label="Response" data={selectedLog.response} />}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Dialog>
  )
}

type DialogStep = "select" | "configure"

export default function Channels() {
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [plugins, setPlugins] = useState<DeliveryPlugin[]>(deliveryPlugins)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStep, setDialogStep] = useState<DialogStep>("select")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)

  const [selectedPlugin, setSelectedPlugin] = useState<DeliveryPlugin | null>(null)
  const [newName, setNewName] = useState("")
  const [newEndpoint, setNewEndpoint] = useState("")

  const handleToggle = (id: string) => {
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, active: !ch.active } : ch))
    )
  }

  const handleOpenChannel = (channel: Channel) => {
    setSelectedChannel(channel)
    setSheetOpen(true)
  }

  const handleDelete = (id: string) => {
    setChannels((prev) => prev.filter((ch) => ch.id !== id))
  }

  const handleInstallPlugin = (pluginId: string) => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === pluginId ? { ...p, installed: true, installs: p.installs + 1 } : p
      )
    )
  }

  const handleSelectPlugin = (plugin: DeliveryPlugin) => {
    setSelectedPlugin(plugin)
    setDialogStep("configure")
  }

  const handleAdd = () => {
    if (!selectedPlugin || !newName.trim() || !newEndpoint.trim()) return
    const channel: Channel = {
      id: Date.now().toString(),
      name: newName.trim(),
      type: selectedPlugin.name as ChannelType,
      endpoint: newEndpoint.trim(),
      active: true,
      pluginId: selectedPlugin.id,
    }
    setChannels((prev) => [...prev, channel])
    resetDialog()
  }

  const resetDialog = () => {
    setNewName("")
    setNewEndpoint("")
    setSelectedPlugin(null)
    setDialogStep("select")
    setDialogOpen(false)
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      resetDialog()
    } else {
      setDialogOpen(true)
    }
  }

  const builtinPlugins = plugins.filter((p) => p.pluginType === "builtin")
  const storePlugins = plugins.filter((p) => p.pluginType === "plugin")

  return (
    <DashboardLayout
      title="Channels"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
          <div
            className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
            style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "rgba(145,141,246,0.08)" }}
                >
                  <Send className="size-4" style={{ color: "#918DF6" }} strokeWidth={2} />
                </span>
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                    Delivery Channels
                  </h2>
                  <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                    Manage how orders are delivered to customers
                  </p>
                </div>
              </div>
              <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger
                  render={
                    <button className="flex h-8 items-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]" />
                  }
                >
                  <Plus className="size-3.5" strokeWidth={2.5} />
                  Add Channel
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px]">
                  {dialogStep === "select" ? (
                    <>
                      <DialogHeader>
                        <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                          Add Channel
                        </DialogTitle>
                        <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                          Select a delivery channel type. Install plugins from the Plugin Store to unlock more options.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-1">
                        <div>
                          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.5px] text-[#999999]">
                            Built-in
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {builtinPlugins.map((p) => (
                              <PluginCard
                                key={p.id}
                                plugin={p}
                                selected={selectedPlugin?.id === p.id}
                                onSelect={() => handleSelectPlugin(p)}
                                onInstall={() => handleInstallPlugin(p.id)}
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.5px] text-[#999999]">
                            Plugin Store
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {storePlugins.map((p) => (
                              <PluginCard
                                key={p.id}
                                plugin={p}
                                selected={selectedPlugin?.id === p.id}
                                onSelect={() => handleSelectPlugin(p)}
                                onInstall={() => handleInstallPlugin(p.id)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <DialogHeader>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setDialogStep("select"); setSelectedPlugin(null) }}
                            className="flex size-7 items-center justify-center rounded-md text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                          >
                            <ArrowLeft className="size-4" strokeWidth={2} />
                          </button>
                          {selectedPlugin && (
                            <div className="flex items-center gap-2.5">
                              <span
                                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white"
                                style={{ backgroundColor: selectedPlugin.iconBg }}
                              >
                                <span className={`font-bold leading-none ${selectedPlugin.iconLabel.length > 1 ? "text-[8px]" : "text-[12px]"}`}>
                                  {selectedPlugin.iconLabel}
                                </span>
                              </span>
                              <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                                {selectedPlugin.name} Channel
                              </DialogTitle>
                            </div>
                          )}
                        </div>
                        <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                          Configure your new {selectedPlugin?.name} delivery channel.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-2">
                        <div>
                          <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                            Channel Name
                          </label>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={`e.g. Primary ${selectedPlugin?.name}`}
                            className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                            {selectedPlugin?.endpointLabel}
                          </label>
                          <input
                            type="text"
                            value={newEndpoint}
                            onChange={(e) => setNewEndpoint(e.target.value)}
                            placeholder={selectedPlugin?.endpointLabel}
                            className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                          Cancel
                        </DialogClose>
                        <button
                          onClick={handleAdd}
                          className="flex h-9 items-center rounded-lg bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                        >
                          Save Channel
                        </button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="h-px bg-[rgba(0,0,0,0.08)]" />

            {channels.length > 0 && (
              <div className="flex items-center gap-4 px-5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">{channels.length}</span>
                  <span className="text-[12px] tracking-[-0.32px] text-[#999999]">channels</span>
                </div>
                <div className="h-3 w-px bg-[rgba(0,0,0,0.08)]" />
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#34A853]" />
                  <span className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">{channels.filter((c) => c.active).length}</span>
                  <span className="text-[12px] tracking-[-0.32px] text-[#999999]">active</span>
                </div>
                <div className="h-3 w-px bg-[rgba(0,0,0,0.08)]" />
                <div className="flex items-center gap-1.5">
                  <Zap className="size-3 text-[#E37400]" strokeWidth={2} />
                  <span className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">472</span>
                  <span className="text-[12px] tracking-[-0.32px] text-[#999999]">today</span>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[...new Set(channels.map((c) => c.type))].map((type) => {
                    const m = channelMeta[type]
                    return (
                      <span
                        key={type}
                        className="size-2 rounded-full"
                        style={{ backgroundColor: m?.color ?? "#918DF6" }}
                        title={type}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {channels.length > 0 && <div className="h-px bg-[rgba(0,0,0,0.06)]" />}

            <div className="px-5 py-2">
              {channels.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Send className="size-8 text-[#CCCCCC]" strokeWidth={1.5} />
                  <p className="mt-3 text-[14px] font-medium tracking-[-0.32px] text-[#999999]">
                    No channels registered
                  </p>
                  <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#CCCCCC]">
                    Add a channel to start delivering orders
                  </p>
                </div>
              ) : (
                channels.map((ch, idx) => {
                  const plugin = plugins.find((p) => p.id === ch.pluginId)
                  const meta = channelMeta[ch.type]
                  const Icon = meta?.icon ?? Send
                  const color = plugin?.iconBg ?? meta?.color ?? "#918DF6"
                  const stats = getChannelStats(ch.id)
                  return (
                    <div
                      key={ch.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenChannel(ch)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleOpenChannel(ch) }}
                      className={`group flex cursor-pointer items-center gap-3 rounded-lg px-1.5 py-2.5 transition-all hover:bg-[rgba(0,0,0,0.02)] ${
                        idx < channels.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""
                      } ${!ch.active ? "opacity-60" : ""}`}
                      style={{ borderLeft: "2px solid transparent" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderLeftColor = color }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderLeftColor = "transparent" }}
                    >
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${color}14`, color }}
                      >
                        <Icon className="size-4" strokeWidth={2} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                            {ch.name}
                          </p>
                          <TypeBadge type={ch.type} color={color} />
                          <span
                            className="size-1.5 shrink-0 rounded-full"
                            style={{ backgroundColor: ch.active ? "#34A853" : "#CCCCCC" }}
                            title={ch.active ? "Active" : "Inactive"}
                          />
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] tracking-[-0.32px] text-[#999999]">
                          <span className="max-w-[140px] truncate">{ch.endpoint}</span>
                          <span className="text-[rgba(0,0,0,0.15)]">·</span>
                          <span className="flex shrink-0 items-center gap-0.5">
                            <Clock className="size-2.5" strokeWidth={2} />
                            {stats.lastDelivery}
                          </span>
                          <span className="text-[rgba(0,0,0,0.15)]">·</span>
                          <span className="shrink-0 tabular-nums">{stats.deliveryCount} sent</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2.5">
                        <SuccessRateBar rate={stats.successRate} />
                        <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                          <Toggle
                            checked={ch.active}
                            onChange={() => handleToggle(ch.id)}
                          />
                        </span>
                        <span onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                          <OverflowMenu
                            onSettings={() => handleOpenChannel(ch)}
                            onDelete={() => handleDelete(ch.id)}
                          />
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <ChannelDetailSheet
        channel={selectedChannel}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        plugins={plugins}
      />
    </DashboardLayout>
  )
}
