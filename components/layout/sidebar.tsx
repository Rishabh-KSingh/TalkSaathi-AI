"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Headphones,
  MessagesSquare,
  BookA,
  TrendingUp,
  Settings,
  Sparkles,
  Bot,
  Heart,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/lib/storage/local-storage";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Practice", href: "/practice", icon: Headphones },
  { name: "Conversation", href: "/conversation", icon: MessagesSquare },
  { name: "Phrases", href: "/phrases", icon: BookA },
  { name: "Progress", href: "/progress", icon: TrendingUp },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useAppState();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-72 flex-col justify-between border-r border-border-subtle bg-surface px-5 py-6">
      {/* Top brand & logo */}
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-3.5 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-200 text-primary shadow-xs ring-4 ring-lavender-100/60">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-text-main">
              TalkSaathi <span className="text-primary font-black">AI</span>
            </span>
            <span className="text-xs font-medium text-text-muted">
              Your AI English Saathi
            </span>
          </div>
        </div>

        {/* Quick action button matching reference image */}
        <div className="px-1">
          <Link
            href="/practice"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-lavender-200 bg-lavender-100/80 px-4 text-sm font-semibold text-primary shadow-xs transition-all hover:bg-lavender-200 hover:shadow-sm active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Start Practice</span>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="space-y-1.5 pt-2">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-text-light">
            My Saathi
          </div>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex h-11 items-center gap-3.5 rounded-full px-4 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary text-white shadow-xs font-semibold"
                      : "text-text-muted hover:bg-lavender-100 hover:text-text-main"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-150 group-hover:scale-105",
                      isActive ? "text-white" : "text-text-muted group-hover:text-primary"
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-lavender-200 text-primary"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom section: Streak badge & Hackathon Story */}
      <div className="space-y-3 pt-4 border-t border-border-subtle">
        {/* Streak indicator */}
        <div className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface-subtle p-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-main">{state.streak} Day Streak</span>
              <span className="text-[11px] text-text-muted">Keep speaking daily</span>
            </div>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
        </div>

        {/* Hackathon tagline card */}
        <div className="flex items-center gap-2 px-2 text-[11px] text-text-light font-medium">
          <Heart className="h-3.5 w-3.5 text-primary fill-primary/20" />
          <span>Built for a Friend • Hacktoberfest &apos;26</span>
        </div>
      </div>
    </aside>
  );
}
