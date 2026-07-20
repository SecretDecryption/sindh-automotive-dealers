"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Music2, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./theme-provider";
import { dealer } from "@/lib/dealer";

const links = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/88 backdrop-blur-xl dark:border-white/10 dark:bg-ink/88">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center" onClick={() => setOpen(false)} aria-label="Sindh Automotive Dealers home">
          <span className="text-sm font-black uppercase tracking-[0.12em] text-ink transition group-hover:text-racing sm:text-base dark:text-white">
            {dealer.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                pathname === link.href
                  ? "bg-ink text-white dark:bg-white dark:text-ink"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-md border border-black/10 text-ink transition hover:border-racing hover:text-racing dark:border-white/15 dark:text-white"
            aria-label="Toggle color mode"
            title="Toggle color mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href={dealer.social.tiktok}
            target="_blank"
            rel="noreferrer"
            className="hidden h-10 w-10 place-items-center rounded-md border border-black/10 text-ink transition hover:border-racing hover:text-racing sm:grid dark:border-white/15 dark:text-white"
            aria-label="Follow Sindh Automotive Dealers on TikTok"
            title="TikTok"
          >
            <Music2 size={18} />
          </a>
          <Link href="/booking" className="hidden rounded-md bg-racing px-4 py-2 text-sm font-bold text-white shadow-card transition hover:bg-red-700 sm:inline-flex">
            Book Test Drive
          </Link>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-md border border-black/10 text-ink lg:hidden dark:border-white/15 dark:text-white"
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white px-4 py-4 shadow-card lg:hidden dark:border-white/10 dark:bg-ink">
          <nav className="mx-auto grid max-w-7xl gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={dealer.social.tiktok}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-white/10"
            >
              <Music2 size={18} className="text-racing" />
              TikTok {dealer.social.tiktokLabel}
            </a>
            <Link href="/booking" onClick={() => setOpen(false)} className="rounded-md bg-racing px-4 py-3 text-sm font-bold text-white">
              Book Test Drive
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
