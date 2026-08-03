"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const NavContent = (
    <>
      <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-2">
        <span className="relative h-10 w-10 flex-shrink-0">
          <Image src="/images/logo-soulhues.png" alt="Soul Hues" fill sizes="40px" className="object-contain" />
        </span>
        <span className="font-serif text-lg tracking-tight text-ink">Admin</span>
      </Link>

      <nav className="mt-8 flex-1 space-y-1" aria-label="Admin navigation">
        {LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm transition-colors",
                isActive
                  ? "bg-sage-dark text-cream"
                  : "text-ink/75 hover:bg-cream-alt hover:text-ink"
              )}
            >
              <link.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-ink/75 hover:bg-cream-alt hover:text-ink"
        >
          <ExternalLink className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          View Live Site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm text-ink/75 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
          {loggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white px-4 py-6 lg:flex">
        {NavContent}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="relative h-8 w-8">
            <Image src="/images/logo-soulhues.png" alt="Soul Hues" fill sizes="32px" className="object-contain" />
          </span>
          <span className="font-serif text-base text-ink">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-ink/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-64 flex-col bg-white px-4 py-6 shadow-lift"
          >
            {NavContent}
          </aside>
        </div>
      )}
    </>
  );
}
