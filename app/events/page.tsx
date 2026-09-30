"use client"

import useSWR from "swr"
import { useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { EventCard, type EventItem } from "@/components/event-card"
import { getSupabaseBrowser } from "@/lib/supabase/client"

type DbEvent = {
  id: string
  title: string
  description: string | null
  department: string | null
  status: "Upcoming" | "Past" | string | null
  location: string | null
  speaker: string | null
  poster_url: string | null
  starts_at: string | null
  link?: string | null
}

const DEFAULT_EVENTS: DbEvent[] = [
  {
    id: "codeathon-3",
    title: "CODEATHON 3.0",
    description:
      "Turn Ideas into Impact. An intensive, single-day on-campus hackathon at Srinivas Institute of Technology. 8 hours of pure building and innovation across Circuit & Non-Circuit tracks with teams of 2 to 4 members. Build and ship a real working prototype.",
    department: "XL Pro Developers · SIT",
    status: "Upcoming",
    location: "SIT Campus, Mangaluru",
    speaker: "XL Pro Mentors",
    poster_url: "/codeathon3-banner.png",
    starts_at: "2026-10-06T09:00:00Z",
    link: "https://codeathon-2026.xlprodevelopers.workers.dev",
  },
]

export default function EventsPage() {
  const supabase = getSupabaseBrowser()

  const fetcher = async () => {
    try {
      if (!supabase) return DEFAULT_EVENTS
      const { data, error } = await supabase.from("events").select("*").order("starts_at", { ascending: true })
      if (error || !data || data.length === 0) return DEFAULT_EVENTS

      const hasCodeathon = data.some((e: any) =>
        e.title?.toLowerCase().includes("codeathon")
      )

      const mapped = data.map((e: any) => {
        if (e.title?.toLowerCase().includes("codeathon")) {
          return {
            ...e,
            title: "CODEATHON 3.0",
            description:
              "Turn Ideas into Impact. An intensive, single-day on-campus hackathon at Srinivas Institute of Technology. 8 hours of pure building and innovation across Circuit & Non-Circuit tracks with teams of 2 to 4 members. Build and ship a real working prototype.",
            link: "https://codeathon-2026.xlprodevelopers.workers.dev",
            poster_url: e.poster_url || "/codeathon3-banner.png",
          }
        }
        return e
      })

      if (!hasCodeathon) {
        return [...DEFAULT_EVENTS, ...mapped]
      }
      return mapped as DbEvent[]
    } catch {
      return DEFAULT_EVENTS
    }
  }

  const { data, mutate } = useSWR("events:list", fetcher, {
    fallbackData: DEFAULT_EVENTS,
    revalidateOnFocus: false,
  })

  useEffect(() => {
    if (!supabase || typeof supabase.channel !== "function") return
    try {
      const channel = supabase
        .channel("public:events")
        .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
          mutate()
        })
        .subscribe()
      return () => {
        supabase.removeChannel(channel)
      }
    } catch {
      // Safe fallback
    }
  }, [mutate, supabase])

  const eventsList = data && data.length > 0 ? data : DEFAULT_EVENTS

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-semibold">Events</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {eventsList.map((e) => (
            <EventCard
              key={e.id}
              e={{
                id: e.id,
                title: e.title,
                date: e.starts_at
                  ? new Date(e.starts_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                  : "",
                department: e.department || "",
                description: e.description || "",
                speaker: e.speaker || "",
                status: (e.status as EventItem["status"]) || "Upcoming",
                location: e.location || "",
                poster: e.poster_url || undefined,
                link: e.link || undefined,
              }}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
