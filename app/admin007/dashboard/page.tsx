import { requireAdminOrRedirect } from "../actions"
import { SiteHeader } from "@/components/site-header"
import { AdminDashboardClient } from "@/components/admin-dashboard-client"
import { getServerSupabase } from "@/lib/supabase/server"

export default async function AdminDashboardPage() {
  await requireAdminOrRedirect()

  const supabase = getServerSupabase()
  const [{ count: membersCount }, { count: activeEventsCount }] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .in("status", ["Upcoming", "Active"] as any),
  ])

  return (
    <main>
      <SiteHeader />
      <AdminDashboardClient membersCount={membersCount ?? 0} activeEventsCount={activeEventsCount ?? 0} />
    </main>
  )
}
