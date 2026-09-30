"use client"

import useSWR from "swr"
import { useEffect, useState } from "react"
import { getBrowserSupabase } from "@/lib/supabase/client"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Event = {
  id: string
  title: string
  starts_at: string | null
  location: string | null
  description: string | null
  poster_url: string | null
  capacity: number | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function EventsGrid() {
  const { data, mutate } = useSWR<{ events: Event[] }>("/api/events", fetcher, {
    revalidateOnFocus: false,
  })

  useEffect(() => {
    const supabase = getBrowserSupabase()
    const channel = supabase
      .channel("events-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => mutate())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const events = data?.events ?? []

  return (
    <div className={cn("grid gap-6", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", "animate-fade-in")}>
      {events.map((e) => (
        <EventCard key={e.id} e={e} onRegistered={() => mutate()} />
      ))}
    </div>
  )
}

function EventCard({
  e,
  onRegistered,
}: {
  e: Event
  onRegistered: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)

  async function register() {
    const name = prompt("Your name?")
    const email = prompt("Your email?")
    if (!name || !email) return
    setLoading(true)
    const res = await fetch(`/api/events/${e.id}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    })
    setLoading(false)
    if (res.ok) {
      setOk(true)
      onRegistered()
      setTimeout(() => setOk(false), 1800)
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius)]",
        "bg-card/70 border border-[color:var(--border)]",
        "shadow-[0_0_0_1px_inset_var(--grid-border)]",
        "transition-transform duration-300 hover:-translate-y-1",
        "hover:shadow-[0_0_0_1px_inset_var(--grid-border),0_10px_30px_-10px_var(--shadow)]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={e.poster_url || "/placeholder.svg?height=400&width=600&query=event%20banner"}
          alt={e.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--card-bg)]/80 via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground text-pretty">{e.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {e.starts_at ? new Date(e.starts_at).toLocaleString() : ""}
          {e.location ? ` • ${e.location}` : ""}
        </p>
        {e.description && <p className="mt-2 text-sm text-muted-foreground/90 line-clamp-3">{e.description}</p>}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={register}
            disabled={loading}
            className={cn(
              "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium",
              "bg-[color:var(--primary)] text-[color:var(--on-primary)]",
              "transition-colors hover:bg-[color:var(--primary-strong)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/50",
            )}
          >
            {loading ? "Registering..." : ok ? "Registered!" : "Register"}
          </button>
          {typeof e.capacity === "number" && (
            <span className="text-xs text-muted-foreground">Capacity: {e.capacity}</span>
          )}
        </div>
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-[1px] rounded-[inherit] chroma-glow" />
      </div>
    </div>
  )
}
