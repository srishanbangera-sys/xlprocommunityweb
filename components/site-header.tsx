"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Menu } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/members", label: "Members" },
  { href: "/events", label: "Events" },
  { href: "/chat", label: "Chat" }, // Coming Soon page
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand with Logo */}
        <Link href="/" className="group inline-flex items-center gap-2">
          <img
            src="https://oekyvgwbhszuceneipak.supabase.co/storage/v1/object/public/logo/edited-photo.png"
            alt="XL Pro Logo"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-mono text-sm tracking-wide text-foreground">XL Pro Community</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "font-medium hover:bg-secondary/30 hover:text-primary",
                    active && "text-primary underline underline-offset-4"
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="p-4">
              <DrawerHeader>
                <DrawerTitle className="text-base">Navigation</DrawerTitle>
              </DrawerHeader>
              <div className="grid gap-2 p-4 pt-0">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <DrawerClose asChild key={item.href}>
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start font-medium hover:bg-secondary/30 hover:text-primary",
                            active && "text-primary underline underline-offset-4"
                          )}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    </DrawerClose>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
