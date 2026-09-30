"use client"

import type React from "react"

import useSWR from "swr"
import { useEffect } from "react"
import { getBrowserSupabase } from "@/lib/supabase/client"
import dynamic from "next/dynamic"
import Image from "next/image"
import { cn } from "@/lib/utils"

const ChromaGrid = dynamic(
  () => import("@/components/chroma/chroma-grid").then((m: any) => m.default ?? m.ChromaGrid),
  { ssr: false },
)

type Member = {
  id: string
  name: string
  role: string | null
  image_url: string | null
  bio: string | null
  tags: string[] | null
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function MembersGrid() {
  const { data, mutate } = useSWR<{ members: Member[] }>("/api/members", fetcher, {
    revalidateOnFocus: false,
  })

  useEffect(() => {
    const supabase = getBrowserSupabase()
    const channel = supabase
      .channel("members-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "members" }, () => {
        mutate() // refresh on any insert/update/delete
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [mutate])

  const members = data?.members ?? []

  // Fallback to a custom grid if ChromaGrid fails to load
  const Grid = ({ children }: { children: React.ReactNode }) => (
    <div className={cn("grid gap-6", "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", "animate-fade-in")}>{children}</div>
  )

  const Card = ({ m }: { m: Member }) => (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[var(--radius)]",
        "bg-card/70 border border-[color:var(--border)]",
        "shadow-[0_0_0_1px_inset_var(--grid-border)]",
        "transition-transform duration-300 hover:-translate-y-1",
        "hover:shadow-[0_0_0_1px_inset_var(--grid-border),0_10px_30px_-10px_var(--shadow)]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={m.image_url || "/placeholder.svg?height=400&width=600&query=member%20profile%20image"}
          alt={m.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--card-bg)]/80 via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-foreground text-pretty">{m.name}</h3>
        {m.role && <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>}
        {m.tags && m.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {m.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[color:var(--chip-bg)] px-2.5 py-1 text-xs text-[color:var(--chip-fg)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-[1px] rounded-[inherit] chroma-glow" />
      </div>
    </div>
  )

  const content = (
    <>
      {members.map((m) => (
        <Card key={m.id} m={m} />
      ))}
    </>
  )

  // Try to render ChromaGrid if available; otherwise fallback
  // @ts-ignore runtime-safe fallback
  return ChromaGrid ? (
    // If your ChromaGrid expects children, this will work; if it expects items, it will ignore children and our fallback Grid still works
    <ChromaGrid>
      <Grid>{content}</Grid>
    </ChromaGrid>
  ) : (
    <Grid>{content}</Grid>
  )
}
