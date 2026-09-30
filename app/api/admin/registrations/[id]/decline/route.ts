import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const supabase = getAdminSupabase()
  const id = params.id
  const { error } = await supabase.from("registered_students").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePath("/admin007/dashboard")
  return NextResponse.json({ ok: true })
}
