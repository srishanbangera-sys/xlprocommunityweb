import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from("members")
    .select("id,name,role,avatar_url,skills,bio,created_at")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const members = (data ?? []).map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    image_url: (m as any).image_url ?? (m as any).avatar_url ?? null, // prefer legacy field if present
    bio: m.bio,
    tags: (m as any).tags ?? m.skills ?? null,
    created_at: m.created_at,
  }))
  return NextResponse.json({ members })
}
