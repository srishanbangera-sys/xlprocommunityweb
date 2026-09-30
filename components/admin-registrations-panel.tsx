"use client"

import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ExternalLink } from "lucide-react"

const fetcher = (url: string) => fetch(url, { cache: "no-store" }).then((r) => r.json())

export function AdminRegistrationsPanel() {
  const { data: regs, mutate } = useSWR("/api/admin/registrations", fetcher)
  const { data: approved, mutate: mutateApproved } = useSWR("/api/admin/approved", fetcher)

  async function approve(id: string) {
    const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: "POST" })
    if (!res.ok) {
      toast({ variant: "destructive", title: "Approve failed" })
      return
    }
    mutate()
    mutateApproved()
  }
  async function decline(id: string) {
    const res = await fetch(`/api/admin/registrations/${id}/decline`, { method: "POST" })
    if (!res.ok) {
      toast({ variant: "destructive", title: "Decline failed" })
      return
    }
    mutate()
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-mono text-primary mb-3">Registered Students</h3>
        <div className="space-y-3">
          {(regs?.rows ?? []).map((r: any) => (
            <Card key={r.id} className="p-4 bg-card/60 border-primary/20">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-lg">{r.team_name}</p>
                    <p className="text-sm text-muted-foreground">Theme: {r.theme || "N/A"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approve(r.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => decline(r.id)}>
                      Decline
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border/40 pt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Team Size:</span>
                      <span className="ml-2 font-medium">{r.team_size || 0}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="ml-2 font-medium">₹{r.amount || 0}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="ml-2 font-mono text-xs">{r.txn_id || "N/A"}</span>
                    </div>
                  </div>

                  {r.payment_proof_url && (
                    <div>
                      <a
                        href={r.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View Payment Proof <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 pt-3">
                  <p className="text-sm font-medium mb-2">Team Members:</p>
                  <div className="space-y-2">
                    {(r.members || []).map((m: any, idx: number) => (
                      <div key={idx} className="text-xs bg-secondary/30 rounded p-2">
                        <p className="font-medium">
                          {m.name} {m.role === "leader" && <span className="text-primary">(Leader)</span>}
                        </p>
                        <p className="text-muted-foreground">{m.email}</p>
                        <p className="text-muted-foreground">{m.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-mono text-primary mb-3">Approved List</h3>
        <div className="space-y-3">
          {(approved?.rows ?? []).map((a: any) => (
            <Card key={a.id} className="p-4 bg-card/60 border-primary/20">
              <div className="space-y-2">
                <p className="font-medium text-lg">{a.team_name}</p>
                <p className="text-sm text-muted-foreground">
                  {a.members?.length || 0} members · Approved on{" "}
                  {a.approved_at ? new Date(a.approved_at).toLocaleDateString() : "N/A"}
                </p>
                <div className="border-t border-border/40 pt-2">
                  <p className="text-xs font-medium mb-1">Members:</p>
                  <div className="space-y-1">
                    {(a.members || []).map((m: any, idx: number) => (
                      <p key={idx} className="text-xs text-muted-foreground">
                        {m.name} {m.role === "leader" && <span className="text-primary">(Leader)</span>}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
