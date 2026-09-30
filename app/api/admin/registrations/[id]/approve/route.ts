import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const supabase = getAdminSupabase()
  const id = params.id

  const { data: reg, error: e1 } = await supabase.from("registered_students").select("*").eq("id", id).single()
  if (e1 || !reg) return NextResponse.json({ error: e1?.message || "Not found" }, { status: 404 })

  const { error: e2 } = await supabase.from("approved_list").insert({
    registration_id: reg.id,
    event_id: reg.event_id,
    team_name: reg.team_name,
    members: reg.members,
  })
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })

  const { error: e3 } = await supabase.from("registered_students").update({ status: "approved" }).eq("id", id)

  if (e3) return NextResponse.json({ error: e3.message }, { status: 500 })

  revalidatePath("/admin007/dashboard")
  return NextResponse.json({ ok: true })
}
