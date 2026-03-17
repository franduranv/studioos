"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/pipeline", label: "Idea Pipeline", icon: "⚡" },
  { href: "/ventures", label: "Ventures", icon: "🚀" },
  { href: "/agents", label: "Agent OS", icon: "🤖" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-[#1E1E2E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[#6C63FF] rounded-lg flex items-center justify-center text-white text-xs font-bold">
            Z
          </div>
          <span className="text-[#E2E2F0] font-bold text-sm tracking-tight">
            Studio<span className="text-[#6C63FF]">OS</span>
          </span>
          <span className="text-[#4A4A6A] text-[10px] font-mono ml-1">v0.1</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                pathname === item.href
                  ? "bg-[#6C63FF]/20 text-[#6C63FF] border border-[#6C63FF]/30"
                  : "text-[#8888AA] hover:text-[#E2E2F0] hover:bg-white/5"
              )}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Right: live indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#4A4A6A] text-[10px] font-mono hidden sm:inline">ZXY OS LIVE</span>
        </div>
      </div>
    </nav>
  );
}
