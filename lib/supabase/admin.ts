import { createClient } from "@supabase/supabase-js"
import { createFallbackSupabaseClient } from "./mock"

let _admin: ReturnType<typeof createClient> | null = null

export function getAdminSupabase() {
  if (_admin) return _admin

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return createFallbackSupabaseClient()
  }

  _admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })
  // Uses service role for privileged writes (server-only). Forms in /admin007 call server actions that use this client.
  return _admin
}
