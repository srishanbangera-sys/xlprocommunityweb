"use client"

import { logoutAdmin, createMember, createEvent } from "@/app/admin007/actions"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminRegistrationsPanel } from "@/components/admin-registrations-panel"

export function AdminDashboardClient({
  membersCount = 0,
  activeEventsCount = 0,
}: {
  membersCount?: number
  activeEventsCount?: number
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <form action={logoutAdmin}>
          <Button
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent"
          >
            Log out
          </Button>
        </form>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {[
          { k: "Members", v: String(membersCount) },
          { k: "Active Events", v: String(activeEventsCount) },
          { k: "Registrations", v: "120" },
        ].map((s) => (
          <div
            key={s.k}
            className="rounded-xl border border-border/60 bg-secondary/20 p-5"
          >
            <p className="text-sm text-muted-foreground">{s.k}</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{s.v}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="members" className="mt-8">
        {/* Tabs navigation */}
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="chat">Chat Moderation</TabsTrigger>
          <TabsTrigger value="registrations">Registrations</TabsTrigger>
        </TabsList>

        {/* Members tab */}
        <TabsContent value="members" className="mt-6">
          <div className="grid gap-4 rounded-xl border border-border/60 bg-secondary/10 p-4">
            <h2 className="font-medium">Add Member</h2>
            <form action={createMember} className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  defaultValue="Member"
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="Member">Member</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="batch">Batch</Label>
                <Input id="batch" name="batch" placeholder="2025" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" name="status" placeholder="Active / Alumni" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input id="skills" name="skills" placeholder="React, ML, UI" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="github_handle">GitHub Handle</Label>
                <Input id="github_handle" name="github_handle" placeholder="octocat" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input id="github_url" name="github_url" placeholder="https://github.com/..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" placeholder="Short bio..." />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="avatar">Avatar Image</Label>
                <Input id="avatar" name="avatar" type="file" accept="image/*" />
              </div>
              <Button type="submit" className="md:col-span-2">
                Save Member
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Events tab */}
        <TabsContent value="events" className="mt-6">
          <div className="grid gap-4 rounded-xl border border-border/60 bg-secondary/10 p-4">
            <h2 className="font-medium">Create Event</h2>
            <form action={createEvent} className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Event title" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="starts_at">Date/Time</Label>
                <Input
                  id="starts_at"
                  name="starts_at"
                  type="datetime-local"
                  required
                  step={60}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" placeholder="CSE" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" name="status" placeholder="Upcoming / Past" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Auditorium" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="speaker">Speaker</Label>
                <Input id="speaker" name="speaker" placeholder="Jane Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price per Member (₹)</Label>
                <Input id="price" name="price" type="number" placeholder="60" defaultValue={60} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment_qr">Payment QR Code</Label>
                <Input id="payment_qr" name="payment_qr" type="file" accept="image/*" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Event description..." />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="poster">Poster Image</Label>
                <Input id="poster" name="poster" type="file" accept="image/*" />
              </div>
              <Button type="submit" className="md:col-span-2">
                Publish Event
              </Button>
            </form>
          </div>
        </TabsContent>

        {/* Chat tab */}
        <TabsContent value="chat" className="mt-6">
          <div className="rounded-xl border border-border/60 bg-secondary/10 p-4">
            <h2 className="font-medium">Chat Moderation</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Delete messages and manage channels (placeholder — realtime chat coming soon).
            </p>
          </div>
        </TabsContent>

        {/* Registrations tab */}
        <TabsContent value="registrations" className="mt-6">
          <div className="rounded-xl border border-border/60 bg-secondary/10 p-4">
            <AdminRegistrationsPanel />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
