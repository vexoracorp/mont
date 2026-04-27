import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-[#181925]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl flex-col items-center justify-center text-center"
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#918DF6]">
            <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-[#181925]">Mont</span>
        </div>

        <h1 className="text-8xl font-bold tracking-tight text-[#918DF6] sm:text-[9rem]">404</h1>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#181925] sm:text-3xl">
          Page not found
        </h2>
        <p className="mt-4 max-w-md text-base leading-7 text-[#666666] sm:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#918DF6] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7f7adf] focus:outline-none focus:ring-2 focus:ring-[#918DF6] focus:ring-offset-2"
          >
            Go home
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-[#181925] underline decoration-[#918DF6]/40 underline-offset-4 transition-colors hover:text-[#918DF6]"
          >
            Go to dashboard
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
