import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const eventId = params.id
  const body = await req.json().catch(() => ({}))
  const { name, email } = body || {}

  if (!eventId || !name || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const supabase = getServerSupabase()
  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    name,
    email,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
