"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Member = {
  id: string
  name: string
  role: "Lead" | "Member" | "Alumni"
  batch: string
  avatar?: string
  bio?: string
  skills?: string[]
  status?: "Active" | "Alumni"
  github?: string
  linkedin?: string
}

export function MemberCard({ m }: { m: Member }) {
  const glow =
    m.role === "Lead"
      ? "shadow-[0_0_32px] shadow-(--color-chart-2)"
      : m.role === "Alumni"
        ? "shadow-[0_0_24px] shadow-(--color-chart-3)"
        : "shadow-[0_0_24px] shadow-(--color-chart-1)"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "group relative overflow-hidden rounded-xl border border-border/60 bg-secondary/20 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:bg-secondary/30",
            glow,
          )}
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border/60">
              <Image
                src={m.avatar || "/placeholder-user.jpg"}
                alt={`${m.name} avatar`}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{m.name}</p>
                <Badge variant="secondary" className="bg-primary/15 text-primary">
                  {m.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {m.batch} • {m.status || "Active"}
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute -inset-16 -z-10 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,208,255,0.2),rgba(138,108,255,0.2),transparent)] blur-2xl" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {m.name}
            <Badge variant="outline" className="border-primary/40 text-primary">
              {m.role}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">{m.bio || "Passionate developer."}</p>
          {!!m.skills?.length && (
            <div className="flex flex-wrap gap-2">
              {m.skills.map((s) => (
                <Badge key={s} variant="secondary" className="bg-secondary/40">
                  {s}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            {m.github && (
              <a
                className="text-sm text-primary underline-offset-4 hover:underline"
                href={m.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            )}
            {m.linkedin && (
              <a
                className="text-sm text-primary underline-offset-4 hover:underline"
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
