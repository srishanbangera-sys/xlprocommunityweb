"use client"

import { motion } from "framer-motion"

export function ComingSoon() {
  return (
    <div className="relative mx-auto grid max-w-4xl place-items-center px-4 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_400px_at_50%_-100px,rgba(0,208,255,0.25),transparent)]" />
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-balance bg-gradient-to-r from-[oklch(var(--color-chart-2))] via-[oklch(var(--color-chart-4))] to-[oklch(var(--color-chart-3))] bg-clip-text text-4xl font-semibold text-transparent md:text-5xl"
      >
        Community Chat — Coming Soon
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="mt-4 max-w-prose text-pretty text-muted-foreground"
      >
        Real-time channels, typing indicators, and code-friendly messages are on the way.
      </motion.p>

      <div className="mt-10 grid w-full grid-cols-3 gap-3 md:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className="h-8 rounded-md bg-secondary/40 backdrop-blur"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground"
      >
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px] shadow-primary" />
        Preparing realtime magic...
      </motion.div>
    </div>
  )
}
