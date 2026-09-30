import { NextResponse } from "next/server"
import { getAdminSupabase } from "@/lib/supabase/admin"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const supabase = getAdminSupabase()
    const fileName = `proofs/${crypto.randomUUID()}-${file.name}`
    const { error } = await supabase.storage.from("events").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data } = supabase.storage.from("events").getPublicUrl(fileName)
    return NextResponse.json({ url: data.publicUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 })
  }
}
