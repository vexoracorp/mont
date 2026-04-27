import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "motion/react"
import {
  Check,
  Copy,
  AlertCircle,
  Clock,
  ExternalLink,
  Store,
  Download,
  Link as LinkIcon,
  FileText,
  Key,
  ClipboardList,
  Send,
  CheckCircle,
} from "lucide-react"

// --- Types ---

type DeliveryBase = {
  deliveryCode: string
  product: string
  storeName: string
  category: string
  orderId: string
  platform: string
  deliveryMethod: string
  deliveredDate: string
  customer: string
}

type KeyDelivery = DeliveryBase & {
  deliveryType: "key"
  keyCode: string
}

type KeysDelivery = DeliveryBase & {
  deliveryType: "keys"
  keys: string[]
}

type FileDelivery = DeliveryBase & {
  deliveryType: "file"
  fileName: string
  fileSize: string
  downloadUrl: string
}

type LinkDelivery = DeliveryBase & {
  deliveryType: "link"
  activationUrl: string
}

type FormDelivery = DeliveryBase & {
  deliveryType: "form"
  formLabel: string
  formPlaceholder: string
}

type DeliveryItem = KeyDelivery | KeysDelivery | FileDelivery | LinkDelivery | FormDelivery

// --- Mock Data ---

const deliveries: Record<string, DeliveryItem> = {
  STK04HMALNTK: {
    deliveryCode: "STK04HMALNTK",
    deliveryType: "key",
    product: "Steam Wallet $50 Gift Card",
    storeName: "BVE Market",
    keyCode: "5294-7183-6042-9517",
    category: "Gift Card",
    orderId: "9K2BM",
    platform: "G2G",
    deliveryMethod: "Email",
    deliveredDate: "Apr 20, 2026",
    customer: "Alex Turner",
  },
  Q8N4V1K7P3LS: {
    deliveryCode: "Q8N4V1K7P3LS",
    deliveryType: "keys",
    product: "Xbox Game Pass Ultimate 3-Month Bundle",
    storeName: "GameKey Pro",
    keys: ["XGP9-L2R7-M5QA-8VNK", "XGP4-T8WN-3KPL-6RMJ", "XGP7-Q5DF-9HXC-2YBT"],
    category: "Subscription",
    orderId: "3F8QN",
    platform: "G2A",
    deliveryMethod: "SMS",
    deliveredDate: "Apr 18, 2026",
    customer: "김수현",
  },
  H2K7M9R4V6QZ: {
    deliveryCode: "H2K7M9R4V6QZ",
    deliveryType: "file",
    product: "Elden Ring: Shadow of the Erdtree DLC Pack",
    storeName: "BVE Market",
    fileName: "EldenRing_DLC_ShadowErdtree.zip",
    fileSize: "2.4 GB",
    downloadUrl: "https://cdn.bvemarket.com/files/EldenRing_DLC_ShadowErdtree.zip",
    category: "Game DLC",
    orderId: "6R5VC",
    platform: "G2G",
    deliveryMethod: "Telegram",
    deliveredDate: "Apr 19, 2026",
    customer: "James Kim",
  },
  R5M8T2Q7L4NB: {
    deliveryCode: "R5M8T2Q7L4NB",
    deliveryType: "link",
    product: "Adobe Creative Cloud 1-Month License",
    storeName: "SoftwareHub",
    activationUrl: "https://activate.adobe.com/redeem?code=F7N2Q9PV8WLX3HDJ",
    category: "Software",
    orderId: "8M3KP",
    platform: "Naver Store",
    deliveryMethod: "Email",
    deliveredDate: "Apr 17, 2026",
    customer: "정하은",
  },
  C8V2M6Q9L4RP: {
    deliveryCode: "C8V2M6Q9L4RP",
    deliveryType: "form",
    product: "Spotify Premium 6-Month Activation",
    storeName: "SubsWorld",
    formLabel: "Enter your account email to receive Spotify Premium activation",
    formPlaceholder: "your@email.com",
    category: "Subscription",
    orderId: "5T4NR",
    platform: "Direct",
    deliveryMethod: "Email",
    deliveredDate: "Apr 13, 2026",
    customer: "이서연",
  },
  K5M8Q2V7L4NT: {
    deliveryCode: "K5M8Q2V7L4NT",
    deliveryType: "key",
    product: "Windows 11 Pro License Key",
    storeName: "BVE Market",
    keyCode: "6VMR2-X8KQH-4PZ7L-9WNBT-3YCFK",
    category: "Software",
    orderId: "5A9EQ",
    platform: "G2G",
    deliveryMethod: "Telegram",
    deliveredDate: "Apr 9, 2026",
    customer: "Brandon Lee",
  },
}

// --- Helpers ---

function getExpirationDate(deliveredDate: string): string {
  const date = new Date(deliveredDate)
  date.setDate(date.getDate() + 30)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getRedemptionSteps(item: DeliveryItem): string[] {
  switch (item.deliveryType) {
    case "key":
      return [
        "Copy your product key using the button above",
        "Open the relevant platform or launcher",
        "Find 'Redeem Code' and paste your key",
      ]
    case "keys":
      return [
        "Copy each key individually or use 'Copy all'",
        "Open the relevant platform for each key",
        "Redeem each key one at a time",
      ]
    case "file":
      return [
        "Click the download button to save the file",
        "Extract the archive if needed",
        "Follow the included instructions to install",
      ]
    case "link":
      return [
        "Click 'Activate Now' to open the activation page",
        "Sign in or create an account if prompted",
        "Your product will be activated automatically",
      ]
    case "form":
      return [
        "Enter your account details in the form above",
        "Click 'Submit' to send your request",
        "You'll receive your product within a few minutes",
      ]
  }
}

function truncateUrl(url: string, maxLen = 42): string {
  if (url.length <= maxLen) return url
  const noProtocol = url.replace(/^https?:\/\//, "")
  if (noProtocol.length <= maxLen) return noProtocol
  return noProtocol.slice(0, maxLen - 3) + "..."
}

const ease = [0.22, 1, 0.36, 1] as const
const shadowSubtle = "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)"

// --- Sub-components ---

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.03)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.06)]"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
          <span className="text-[#34A853]">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5" strokeWidth={2} />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

function KeyBlock({ item }: { item: KeyDelivery }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]"
      style={{ boxShadow: shadowSubtle }}
    >
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
            <Key className="size-3" strokeWidth={2} />
            Your key
          </p>
          <p className="mt-1.5 truncate font-mono text-[18px] font-medium tracking-[0.5px] text-[#181925] sm:text-[20px]">
            {item.keyCode}
          </p>
        </div>
        <CopyButton text={item.keyCode} />
      </div>
    </div>
  )
}

function KeysBlock({ item }: { item: KeysDelivery }) {
  const allKeys = item.keys.join("\n")
  return (
    <div
      className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]"
      style={{ boxShadow: shadowSubtle }}
    >
      <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.06)] px-5 py-3">
        <p className="flex items-center gap-1.5 text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
          <Key className="size-3" strokeWidth={2} />
          {item.keys.length} keys included
        </p>
        <CopyButton text={allKeys} label="Copy all" />
      </div>
      <div className="divide-y divide-[rgba(0,0,0,0.05)]">
        {item.keys.map((key, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Key {i + 1}</p>
              <p className="mt-0.5 truncate font-mono text-[16px] font-medium tracking-[0.5px] text-[#181925]">
                {key}
              </p>
            </div>
            <CopyButton text={key} />
          </div>
        ))}
      </div>
    </div>
  )
}

function FileBlock({ item }: { item: FileDelivery }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]"
      style={{ boxShadow: shadowSubtle }}
    >
      <div className="px-5 py-5">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(145,141,246,0.1)]">
            <FileText className="size-6 text-[#918DF6]" strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-medium tracking-[-0.32px] text-[#181925]">
              {item.fileName}
            </p>
            <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#666666]">{item.fileSize}</p>
          </div>
        </div>
        <a
          href={item.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
        >
          <Download className="size-4" strokeWidth={2} />
          Download file
        </a>
      </div>
    </div>
  )
}

function LinkBlock({ item }: { item: LinkDelivery }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]"
      style={{ boxShadow: shadowSubtle }}
    >
      <div className="px-5 py-5">
        <p className="flex items-center gap-1.5 text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
          <LinkIcon className="size-3" strokeWidth={2} />
          Activation link
        </p>
        <p className="mt-2 truncate font-mono text-[13px] tracking-[-0.32px] text-[#666666]">
          {truncateUrl(item.activationUrl)}
        </p>
        <a
          href={item.activationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
        >
          <ExternalLink className="size-4" strokeWidth={2} />
          Activate Now
        </a>
      </div>
    </div>
  )
}

function FormBlock({ item }: { item: FormDelivery }) {
  const [value, setValue] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]"
        style={{ boxShadow: shadowSubtle }}
      >
        <div className="flex flex-col items-center px-5 py-8 text-center">
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            className="flex size-12 items-center justify-center rounded-full bg-[rgba(52,168,83,0.1)]"
          >
            <CheckCircle className="size-6 text-[#34A853]" strokeWidth={1.8} />
          </motion.span>
          <p className="mt-4 text-[15px] font-medium tracking-[-0.32px] text-[#181925]">
            Your request has been submitted
          </p>
          <p className="mt-1.5 max-w-[280px] text-[13px] tracking-[-0.32px] text-[#666666]">
            You'll receive your product shortly at the provided address.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)]"
      style={{ boxShadow: shadowSubtle }}
    >
      <form onSubmit={handleSubmit} className="px-5 py-5">
        <p className="flex items-center gap-1.5 text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
          <ClipboardList className="size-3" strokeWidth={2} />
          Action required
        </p>
        <p className="mt-2 text-[14px] leading-snug tracking-[-0.32px] text-[#181925]">
          {item.formLabel}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={item.formPlaceholder}
          className="mt-3 h-11 w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-4 text-[14px] tracking-[-0.32px] text-[#181925] outline-none transition-colors placeholder:text-[#999999] focus:border-[#918DF6] focus:ring-1 focus:ring-[#918DF6]"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:opacity-40 disabled:hover:bg-[#918DF6]"
        >
          <Send className="size-4" strokeWidth={2} />
          Submit
        </button>
      </form>
    </div>
  )
}

function DeliveryContent({ item }: { item: DeliveryItem }) {
  switch (item.deliveryType) {
    case "key":
      return <KeyBlock item={item} />
    case "keys":
      return <KeysBlock item={item} />
    case "file":
      return <FileBlock item={item} />
    case "link":
      return <LinkBlock item={item} />
    case "form":
      return <FormBlock item={item} />
  }
}

// --- Main Component ---

export default function Delivery() {
  const { code } = useParams<{ code: string }>()
  const item = code ? deliveries[code] : undefined

  if (!item) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center bg-white px-5">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-[rgba(217,48,37,0.08)]">
            <AlertCircle className="size-7 text-[#D93025]" strokeWidth={1.8} />
          </span>
          <h1 className="mt-5 text-[24px] font-medium tracking-[-0.32px] text-[#181925]">
            Delivery not found
          </h1>
          <p className="mt-2 max-w-[320px] text-[14px] leading-relaxed tracking-[-0.32px] text-[#666666]">
            This delivery link may have expired or the code is invalid. Please check the link and try again.
          </p>
          <Link
            to="/"
            className="mt-6 text-[14px] font-medium tracking-[-0.32px] text-[#918DF6] hover:underline"
          >
            Go to Mont homepage
          </Link>
        </motion.div>
      </div>
    )
  }

  const steps = getRedemptionSteps(item)
  const expiresOn = getExpirationDate(item.deliveredDate)

  return (
    <div className="relative flex min-h-dvh justify-center bg-white px-5 py-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Store header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,0,0,0.08)] bg-white px-4 py-2" style={{ boxShadow: shadowSubtle }}>
            <Store className="size-4 text-[#918DF6]" strokeWidth={2} />
            <span className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
              {item.storeName}
            </span>
          </span>
        </motion.div>

        {/* Success badge + product name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="mt-8 flex flex-col items-center text-center"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-[rgba(52,168,83,0.1)]">
            <Check className="size-7 text-[#34A853]" strokeWidth={2.2} />
          </span>
          <h1 className="mt-5 text-[14px] font-medium tracking-[-0.32px] text-[#34A853]">
            Your product has been delivered
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
          className="mt-4 text-center text-[28px] font-medium leading-tight tracking-[-0.32px] text-[#181925] sm:text-[32px]"
        >
          {item.product}
        </motion.h2>

        {/* Delivery content — type-specific */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease }}
          className="mt-8"
        >
          <DeliveryContent item={item} />
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease }}
          className="mt-6 rounded-xl border border-[rgba(0,0,0,0.08)] px-5 py-4"
          style={{ boxShadow: shadowSubtle }}
        >
          <h3 className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">Order details</h3>
          <div className="mt-3 space-y-3">
            {[
              { label: "Order ID", value: item.orderId },
              { label: "Platform", value: item.platform },
              { label: "Delivery method", value: item.deliveryMethod },
              { label: "Delivered", value: item.deliveredDate },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[14px] tracking-[-0.32px] text-[#666666]">{row.label}</span>
                <span className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How to redeem */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease }}
          className="mt-6 rounded-xl border border-[rgba(0,0,0,0.08)] px-5 py-4"
          style={{ boxShadow: shadowSubtle }}
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="size-3.5 text-[#999999]" strokeWidth={2} />
            <h3 className="text-[13px] font-medium tracking-[-0.32px] text-[#999999]">How to redeem</h3>
          </div>
          <ol className="mt-3 space-y-2.5">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                  style={{ backgroundColor: "#918DF6" }}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5 text-[14px] leading-snug tracking-[-0.32px] text-[#181925]">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Expiration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65, ease }}
          className="mt-6 flex items-center justify-center gap-2 text-center"
        >
          <Clock className="size-3.5 text-[#999999]" strokeWidth={2} />
          <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
            This link expires on {expiresOn}
          </p>
        </motion.div>

        {/* Footer — Powered by Mont */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, ease }}
          className="mt-10 border-t border-[rgba(0,0,0,0.06)] pt-6"
        >
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="relative flex size-5 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                <span className="absolute top-[1px] right-[1px] size-2 rounded-full bg-white" />
              </span>
              <span className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
                Powered by Mont
              </span>
            </Link>
            <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
              Need help? Contact the seller
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
