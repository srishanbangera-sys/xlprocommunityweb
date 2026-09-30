"use client"

import { createBrowserClient } from "@supabase/ssr"
import { createFallbackSupabaseClient } from "./mock"

let _client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowser() {
  if (_client) return _client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    return createFallbackSupabaseClient()
  }

  _client = createBrowserClient(url, anon)
  return _client
}

export function getBrowserSupabase() {
  return getSupabaseBrowser()
}
