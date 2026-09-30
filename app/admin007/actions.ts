"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getAdminSupabase } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

const ADMIN_COOKIE = "admin_auth"

async function ensureAdmin() {
  const cookieStore = await cookies()
  const c = cookieStore.get(ADMIN_COOKIE)
  if (!c) {
    return { ok: false, error: "Unauthorized" } as const
  }
  return { ok: true } as const
}

function normalizeRole(input: string) {
  const v = (input || "").trim().toLowerCase()
  if (v === "lead") return "Lead"
  if (v === "member") return "Member"
  if (v === "alumni") return "Alumni"
  return "Member"
}

function parseLocalDateTimeToISO(raw: string): string | null {
  // Accept "YYYY-MM-DDTHH:mm" or "YYYY-MM-DD HH:mm" and normalize to ISO
  const s = (raw || "").trim().replace(" ", "T")
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/)
  if (!match) return null
  const [, y, mo, d, h, mi, se] = match
  const year = Number(y)
  const month = Number(mo) - 1
  const day = Number(d)
  const hour = Number(h)
  const minute = Number(mi)
  const second = se ? Number(se) : 0
  const dt = new Date(year, month, day, hour, minute, second)
  if (isNaN(dt.getTime())) return null
  return dt.toISOString()
}

export async function loginAdmin(_: any, formData: FormData) {
  const username = String(formData.get("username") || "")
  const password = String(formData.get("password") || "")
  const ok = username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD

  if (!ok) {
    return { ok: false, error: "Invalid credentials" }
  }

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, "1", { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 })
  redirect("/admin007/dashboard")
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  redirect("/admin007")
}

export async function requireAdminOrRedirect() {
  const cookieStore = await cookies()
  const c = cookieStore.get(ADMIN_COOKIE)
  if (!c) redirect("/admin007")
}

export async function createMember(formOrPrev: any, maybeFormData?: FormData) {
  const gate = await ensureAdmin()
  if (!gate.ok) return gate

  const supabase = getAdminSupabase()

  const formData: FormData | undefined = (() => {
    if (formOrPrev instanceof FormData) return formOrPrev
    if (maybeFormData instanceof FormData) return maybeFormData
    if (formOrPrev && typeof (formOrPrev as any).get === "function") return formOrPrev as FormData
    if (maybeFormData && typeof (maybeFormData as any).get === "function") return maybeFormData as FormData
    return undefined
  })()

  if (!formData) {
    return { ok: false, error: "Invalid form submission" }
  }

  const name = String(formData.get("name") || "").trim()
  const role = String(formData.get("role") || "").trim()
  const normalizedRole = normalizeRole(role)
  const skillsCsv = String(formData.get("skills") || "").trim()
  const github_handle = String(formData.get("github_handle") || "").trim()
  const github_url = String(formData.get("github_url") || "").trim()
  const linkedin_url = String(formData.get("linkedin_url") || "").trim()
  const bio = String(formData.get("bio") || "").trim()
  const batch = String(formData.get("batch") || "").trim()
  const status = String(formData.get("status") || "").trim()
  const avatar = formData.get("avatar") as File | null

  if (!name) return { ok: false, error: "Name is required" }

  let avatar_url: string | null = null
  if (avatar && avatar.size > 0) {
    const key = `member_${Date.now()}_${avatar.name}`
    console.log("[v0] createMember: uploading avatar:", key, avatar.type, avatar.size)
    const { error: upErr } = await supabase.storage.from("members").upload(key, avatar, {
      contentType: avatar.type || "application/octet-stream",
      upsert: false,
    })
    if (upErr) {
      console.log("[v0] createMember: avatar upload failed:", upErr.message)
      return { ok: false, error: `Avatar upload failed: ${upErr.message}` }
    }
    const { data: pub } = supabase.storage.from("members").getPublicUrl(key)
    avatar_url = pub.publicUrl
  }

  const skills =
    skillsCsv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) || []

  const { error } = await supabase.from("members").insert({
    name,
    role: normalizedRole,
    skills,
    avatar_url,
    github_handle: github_handle || null,
    github_url: github_url || null,
    linkedin_url: linkedin_url || null,
    bio: bio || null,
    batch: batch || null,
    status: status || null,
  })

  if (error) {
    console.log("[v0] createMember: insert error:", error.message)
    return { ok: false, error: error.message }
  }

  revalidatePath("/members")
  console.log("[v0] createMember: insert OK, revalidated /members")
  return { ok: true }
}

export async function createEvent(formOrPrev: any, maybeFormData?: FormData) {
  const gate = await ensureAdmin()
  if (!gate.ok) return gate

  const supabase = getAdminSupabase()

  const formData: FormData | undefined = (() => {
    if (formOrPrev instanceof FormData) return formOrPrev
    if (maybeFormData instanceof FormData) return maybeFormData
    if (formOrPrev && typeof (formOrPrev as any).get === "function") return formOrPrev as FormData
    if (maybeFormData && typeof (maybeFormData as any).get === "function") return maybeFormData as FormData
    return undefined
  })()

  if (!formData) {
    return { ok: false, error: "Invalid form submission" }
  }

  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const department = String(formData.get("department") || "").trim()
  const status = String(formData.get("status") || "").trim()
  const location = String(formData.get("location") || "").trim()
  const speaker = String(formData.get("speaker") || "").trim()
  const startsAtRaw = String(formData.get("starts_at") || "").trim()
  const priceRaw = String(formData.get("price") || "60").trim()
  const price = Number(priceRaw) || 60
  const poster = formData.get("poster") as File | null
  const paymentQr = formData.get("payment_qr") as File | null

  if (!title) return { ok: false, error: "Title is required" }

  let starts_at: string | null = null
  if (startsAtRaw) {
    const iso = parseLocalDateTimeToISO(startsAtRaw)
    if (!iso) {
      console.log("[v0] createEvent: invalid starts_at value:", startsAtRaw)
      return { ok: false, error: "Invalid date/time. Please select a valid date and time." }
    }
    starts_at = iso
  }

  let poster_url: string | null = null
  if (poster && poster.size > 0) {
    const key = `event_${Date.now()}_${poster.name}`
    console.log("[v0] createEvent: uploading poster:", key, poster.type, poster.size)
    const { error: upErr } = await supabase.storage.from("events").upload(key, poster, {
      contentType: poster.type || "application/octet-stream",
      upsert: false,
    })
    if (upErr) {
      console.log("[v0] createEvent: poster upload failed:", upErr.message)
      return { ok: false, error: `Poster upload failed: ${upErr.message}` }
    }
    const { data: pub } = supabase.storage.from("events").getPublicUrl(key)
    poster_url = pub.publicUrl
  }

  let payment_qr_url: string | null = null
  if (paymentQr && paymentQr.size > 0) {
    const key = `payment_qr_${Date.now()}_${paymentQr.name}`
    console.log("[v0] createEvent: uploading payment QR:", key, paymentQr.type, paymentQr.size)
    const { error: upErr } = await supabase.storage.from("events").upload(key, paymentQr, {
      contentType: paymentQr.type || "application/octet-stream",
      upsert: false,
    })
    if (upErr) {
      console.log("[v0] createEvent: payment QR upload failed:", upErr.message)
      return { ok: false, error: `Payment QR upload failed: ${upErr.message}` }
    }
    const { data: pub } = supabase.storage.from("events").getPublicUrl(key)
    payment_qr_url = pub.publicUrl
  }

  const { error } = await supabase.from("events").insert({
    title,
    description: description || null,
    department: department || null,
    status: status || null,
    location: location || null,
    speaker: speaker || null,
    starts_at,
    poster_url,
    price,
    payment_qr_url,
  })

  if (error) {
    console.log("[v0] createEvent: insert error:", error.message)
    return { ok: false, error: error.message }
  }

  revalidatePath("/events")
  console.log("[v0] createEvent: insert OK, revalidated /events")
  return { ok: true }
}
