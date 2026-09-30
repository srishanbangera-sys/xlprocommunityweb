import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase.from("approved_list").select("*").order("approved_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rows: data ?? [] })
}
