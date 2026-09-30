import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

const DEFAULT_EVENTS = [
  {
    id: "codeathon-3",
    title: "CODEATHON 3.0",
    starts_at: "2026-10-15T09:00:00Z",
    location: "SIT Campus, Mangaluru",
    description:
      "Turn Ideas into Impact. An intensive, single-day on-campus hackathon at Srinivas Institute of Technology. 8 hours of pure building and innovation across Circuit & Non-Circuit tracks with teams of 2 to 4 members. Build and ship a real working prototype.",
    poster_url: "/codeathon3-banner.png",
    capacity: 200,
    created_at: new Date().toISOString(),
    department: "XL Pro Developers · SIT",
    status: "Upcoming",
    speaker: "XL Pro Mentors",
    link: "https://codeathon-2026.xlprodevelopers.workers.dev",
  },
]

export async function GET() {
  try {
    const supabase = getServerSupabase()
    if (!supabase) {
      return NextResponse.json({ events: DEFAULT_EVENTS })
    }
    const { data, error } = await supabase
      .from("events")
      .select("id,title,starts_at,location,description,poster_url,capacity,created_at,department,status,speaker")
      .order("starts_at", { ascending: true })

    if (error || !data || data.length === 0) {
      return NextResponse.json({ events: DEFAULT_EVENTS })
    }

    const events = data.map((e: any) => ({
      id: e.id,
      title: e.title?.toLowerCase().includes("codeathon") ? "CODEATHON 3.0" : e.title,
      starts_at: e.starts_at,
      location: e.location,
      description:
        e.title?.toLowerCase().includes("codeathon")
          ? "Turn Ideas into Impact. An intensive, single-day on-campus hackathon at Srinivas Institute of Technology. 8 hours of pure building and innovation across Circuit & Non-Circuit tracks with teams of 2 to 4 members. Build and ship a real working prototype."
          : e.description,
      poster_url:
        e.title?.toLowerCase().includes("codeathon")
          ? "/codeathon3-banner.png"
          : e.poster_url,
      capacity: (e as any).capacity ?? null,
      created_at: e.created_at,
      department: (e as any).department ?? null,
      status: (e as any).status ?? null,
      speaker: (e as any).speaker ?? null,
      link: e.title?.toLowerCase().includes("codeathon")
        ? "https://codeathon-2026.xlprodevelopers.workers.dev"
        : undefined,
    }))

    const hasCodeathon = events.some((e: any) =>
      e.title?.toLowerCase().includes("codeathon")
    )
    if (!hasCodeathon) {
      return NextResponse.json({ events: [...DEFAULT_EVENTS, ...events] })
    }

    return NextResponse.json({ events })
  } catch {
    return NextResponse.json({ events: DEFAULT_EVENTS })
  }
}
