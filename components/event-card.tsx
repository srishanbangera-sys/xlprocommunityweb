"use client"

import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { RegisterDialog } from "@/components/register-dialog"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

export type EventItem = {
  id: string
  title: string
  date: string
  department: string
  description: string
  poster?: string
  status?: "Upcoming" | "Past"
  speaker?: string
  location?: string
  link?: string
}

export function EventCard({ e }: { e: EventItem }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-secondary/20 transition hover:border-primary/60 hover:bg-secondary/30">
      {e.poster && (
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <Image
            src={e.poster || "/placeholder.svg"}
            alt={e.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      {/* </CHANGE> */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{e.date}</span>
          </div>
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{e.description}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-primary">{e.department}</span>
          <span className="text-xs text-muted-foreground">{e.status || "Upcoming"}</span>
        </div>
      </div>
      <div className="border-t border-border/60 p-4">
        {e.link ? (
          <a href={e.link} target="_blank" rel="noopener noreferrer" className="block w-full">
            <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 inline-flex items-center justify-center gap-2">
              <span>Register Now</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-primary text-primary-foreground hover:opacity-90">Register Now</Button>
            </DialogTrigger>
            {/* Replace inline form with our dialog component */}
            <RegisterDialog onClose={() => setOpen(false)} eventId={e.id} />
          </Dialog>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -inset-16 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,208,255,0.15),rgba(138,108,255,0.15),transparent)] blur-2xl" />
      </div>
    </div>
  )
}
