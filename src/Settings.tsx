import { useState, useRef } from "react"
import { Check, ChevronDown, User, Bell, Camera, Link2 } from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"

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

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof User
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div
      className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: "rgba(145,141,246,0.08)" }}
        >
          <Icon className="size-4" style={{ color: "#918DF6" }} strokeWidth={2} />
        </span>
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{title}</h2>
          <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{description}</p>
        </div>
      </div>
      <div className="h-px bg-[rgba(0,0,0,0.08)]" />
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

const timezones = [
  "Asia/Seoul (KST, UTC+9)",
  "Asia/Tokyo (JST, UTC+9)",
  "America/New_York (EST, UTC-5)",
  "America/Los_Angeles (PST, UTC-8)",
  "Europe/London (GMT, UTC+0)",
  "Europe/Berlin (CET, UTC+1)",
  "Asia/Singapore (SGT, UTC+8)",
]

export default function Settings() {
  const [currency, setCurrency] = useState<Currency>("KRW")

  const [name, setName] = useState("Yuchan")
  const [email, setEmail] = useState("yuchan@vexora.team")
  const [timezone, setTimezone] = useState("Asia/Seoul (KST, UTC+9)")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [socialConnections, setSocialConnections] = useState<Record<string, { connected: boolean; account: string | null }>>({
    Google: { connected: true, account: "yuchan@gmail.com" },
    GitHub: { connected: true, account: "@yuchan-dev" },
    Discord: { connected: false, account: null },
    Apple: { connected: false, account: null },
  })

  const socialProviders = [
    { id: "Google", icon: <svg className="size-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
    { id: "GitHub", icon: <svg className="size-4" viewBox="0 0 24 24" fill="#181925"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
    { id: "Discord", icon: <svg className="size-4" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg> },
    { id: "Apple", icon: <svg className="size-4" viewBox="0 0 24 24" fill="#000000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
  ]

  const [emailNotif, setEmailNotif] = useState(true)
  const [telegramAlert, setTelegramAlert] = useState(true)
  const [smsAlert, setSmsAlert] = useState(false)
  const [orderAlert, setOrderAlert] = useState(true)
  const [lowStockAlert, setLowStockAlert] = useState(true)

  const [savedSection, setSavedSection] = useState<string | null>(null)

  const handleSave = (section: string) => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 1500)
  }

  return (
    <DashboardLayout
      title="Settings"
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
          <SectionCard icon={User} title="Profile" description="Your account information">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setAvatarUrl(url)
                    }
                    e.target.value = ""
                  }}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="group relative flex size-14 shrink-0 items-center justify-center rounded-full"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Profile" className="size-14 rounded-full object-cover" />
                  ) : (
                    <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#918DF6] to-[#6C63FF] text-[18px] font-bold tracking-[-0.32px] text-white">
                      YC
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="size-5 text-white" strokeWidth={2} />
                  </div>
                </button>
                <div>
                  <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                    {name}
                  </p>
                  <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="h-9 w-full appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("profile")}
                  className="flex h-8 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                >
                  {savedSection === "profile" ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="size-3.5" strokeWidth={2.5} />
                      Saved!
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Link2} title="Connected Accounts" description="Manage your social login connections">
            <div className="flex flex-col gap-0">
              {socialProviders.map((provider, idx) => {
                const conn = socialConnections[provider.id]
                const connected = conn?.connected ?? false
                const account = conn?.account ?? null
                return (
                  <div
                    key={provider.id}
                    className={`flex items-center justify-between py-3 ${
                      idx < socialProviders.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(0,0,0,0.04)]">
                        {provider.icon}
                      </span>
                      <div>
                        <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{provider.id}</p>
                        <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                          {account ?? "Not connected"}
                        </p>
                      </div>
                    </div>
                    {connected ? (
                      <button
                        type="button"
                        onClick={() => setSocialConnections((prev) => ({
                          ...prev,
                          [provider.id]: { connected: false, account: null },
                        }))}
                        className="text-[12px] font-medium tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#D93025]"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSocialConnections((prev) => ({
                          ...prev,
                          [provider.id]: { connected: true, account: provider.id === "Google" ? "yuchan@gmail.com" : provider.id === "GitHub" ? "@yuchan-dev" : provider.id === "Discord" ? "yuchan#1234" : "yuchan@icloud.com" },
                        }))}
                        className="flex h-7 items-center rounded-full border border-[rgba(0,0,0,0.12)] px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard icon={Bell} title="Notifications" description="Configure how you receive alerts">
            <div className="flex flex-col gap-0">
              {[
                { label: "Email notifications", desc: "Receive order summaries and reports via email", checked: emailNotif, onChange: setEmailNotif },
                { label: "Telegram alerts", desc: "Get instant delivery notifications on Telegram", checked: telegramAlert, onChange: setTelegramAlert },
                { label: "SMS alerts", desc: "Receive critical alerts via SMS", checked: smsAlert, onChange: setSmsAlert },
                { label: "Order alerts", desc: "Notify on every new order received", checked: orderAlert, onChange: setOrderAlert },
                { label: "Low stock alerts", desc: "Warn when inventory drops below threshold", checked: lowStockAlert, onChange: setLowStockAlert },
              ].map((item, idx, arr) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-3 ${
                    idx < arr.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""
                  }`}
                >
                  <div>
                    <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                      {item.label}
                    </p>
                    <p className="text-[12px] tracking-[-0.32px] text-[#999999]">{item.desc}</p>
                  </div>
                  <Toggle checked={item.checked} onChange={item.onChange} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  )
}
