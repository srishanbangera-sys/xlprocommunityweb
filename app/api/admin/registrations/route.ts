import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from("registered_students")
    .select("*")
    .or("status.is.null,status.eq.pending")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rows: data ?? [] })
}
