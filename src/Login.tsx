import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Building2, Globe, Store, Zap } from "lucide-react"

type UserType = "organization" | "guest" | null

const ease = [0.22, 1, 0.36, 1] as const

function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0D0D14] p-10 lg:flex lg:w-[380px] xl:w-[420px] shrink-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="relative flex size-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Mont</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="relative z-10"
      >
        <h2 className="text-[28px] leading-[1.15] font-medium tracking-[-0.32px] text-white">
          Sell digital products
          <br />
          on autopilot.
        </h2>
        <p className="mt-4 max-w-[320px] text-sm leading-relaxed tracking-[-0.32px] text-[#999999]">
          Auto-delivery in under 3 seconds. Across Naver, G2G, G2A, and your own store — 24/7.
        </p>

        <div className="mt-8 flex items-center gap-6">
          {[
            { value: "< 3s", label: "Delivery" },
            { value: "24/7", label: "Uptime" },
            { value: "99.9%", label: "Success rate" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease }}
            >
              <span className="block text-lg font-semibold tabular-nums tracking-[-0.32px] text-[#918DF6]">
                {stat.value}
              </span>
              <span className="text-xs tracking-[-0.32px] text-[#666666]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 flex items-center gap-2"
      >
        <Zap className="size-3.5 text-[#918DF6]" strokeWidth={2} />
        <span className="text-xs tracking-[-0.32px] text-[#666666]">
          Trusted by 2,000+ digital sellers
        </span>
      </motion.div>
    </div>
  )
}

function MobileBrandHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="relative overflow-hidden bg-[#0D0D14] px-6 py-8 lg:hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex items-center gap-2">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-white">
          <ArrowLeft className="size-3" />
          Home
        </Link>
      </div>
      <p className="relative z-10 mt-4 text-lg font-medium tracking-[-0.32px] text-white">
        Welcome back
      </p>
      <p className="relative z-10 mt-1 text-sm tracking-[-0.32px] text-[#999999]">
        Sign in to your Mont account
      </p>
    </motion.div>
  )
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>(null)

  return (
    <div className="flex min-h-svh bg-white">
      <BrandPanel />

      <div className="flex flex-1 flex-col">
        <MobileBrandHeader />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-[420px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8 hidden lg:block"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
              >
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
              className="mb-10 hidden lg:block"
            >
              <h1 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
                Sign in to your Mont account
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {userType === null ? (
                <motion.div
                  key="type-selector"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex flex-col gap-3"
                >
                  <p className="mb-2 text-center text-base tracking-[-0.32px] text-[#666666]">
                    How are you signing in?
                  </p>
                  <button
                    type="button"
                    onClick={() => setUserType("organization")}
                    className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white px-6 py-5 text-left transition-all hover:border-[#918DF6]/40 hover:bg-[#918DF6]/[0.03] hover:shadow-sm"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#918DF6]/8 text-[#918DF6] transition-colors group-hover:bg-[#918DF6]/12">
                      <Building2 className="size-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-base font-semibold tracking-[-0.32px] text-[#181925]">Organization</p>
                      <p className="mt-0.5 text-sm tracking-[-0.32px] text-[#999999]">Sign in as a store owner or team member</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("guest")}
                    className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white px-6 py-5 text-left transition-all hover:border-[#918DF6]/40 hover:bg-[#918DF6]/[0.03] hover:shadow-sm"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#918DF6]/8 text-[#918DF6] transition-colors group-hover:bg-[#918DF6]/12">
                      <Globe className="size-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-base font-semibold tracking-[-0.32px] text-[#181925]">Guest</p>
                      <p className="mt-0.5 text-sm tracking-[-0.32px] text-[#999999]">Access a store with its domain</p>
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <button
                    type="button"
                    onClick={() => setUserType(null)}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                  >
                    <ArrowLeft className="size-3.5" />
                    {userType === "organization" ? "Organization" : "Guest"}
                  </button>

                  {userType === "guest" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3, ease }}
                      className="mb-6 flex flex-col gap-2"
                    >
                      <label
                        htmlFor="store-domain"
                        className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                      >
                        Store domain
                      </label>
                      <div className="relative">
                        <Store className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="store-domain"
                          type="text"
                          placeholder="yourstore.mont.app"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                      </div>
                      <p className="text-sm tracking-[-0.32px] text-[#999999]">
                        Enter the store domain you want to access
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-sm font-medium tracking-[-0.32px] text-[#181925] transition-colors hover:bg-neutral-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#2AABEE] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#229ED9]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z"/>
                      </svg>
                      Continue with Telegram
                    </button>
                  </div>

                  <div className="my-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
                    <span className="text-sm tracking-[-0.32px] text-[#999999]">or</span>
                    <div className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                        >
                          Password
                        </label>
                        <Link
                          to="#"
                          className="text-sm tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-11 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="size-[18px]" />
                          ) : (
                            <Eye className="size-[18px]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                    >
                      Sign in
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 text-center text-sm tracking-[-0.32px] text-[#666666]"
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#918DF6] transition-colors hover:text-[#9580FF]"
              >
                Create account
              </Link>
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  )
}
