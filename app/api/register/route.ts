import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => null)
    if (!payload) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

    const { team_name, theme, team_size, members, amount, txn_id, payment_proof_url, event_id } = payload
    if (!team_name || !theme || !team_size || !members || !amount || !txn_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabase = getServerSupabase()
    const insert = {
      event_id: event_id ?? null,
      team_name,
      theme,
      team_size,
      members,
      amount,
      txn_id,
      payment_proof_url: payment_proof_url ?? null,
      status: "pending",
    }

    const { error } = await supabase.from("registered_students").insert(insert)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Registration failed" }, { status: 500 })
  }
}
