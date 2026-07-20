import Link from "next/link";
import { Clock, Globe2, MapPin, Music2, Phone } from "lucide-react";
import { LogoMark } from "./logo-mark";
import { dealer } from "@/lib/dealer";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-ink text-white dark:border-white/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <LogoMark className="mb-4 h-16 w-[220px]" />
          <p className="text-sm leading-6 text-zinc-400">
            Premium pre-owned vehicles, transparent guidance, and a buying experience built on confidence.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">Explore</h3>
          <div className="grid gap-3 text-sm text-zinc-400">
            <Link href="/inventory" className="hover:text-white">Inventory</Link>
            <Link href="/booking" className="hover:text-white">Book Test Drive</Link>
            <Link href="/contact" className="hover:text-white">Contact Dealer</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">Contact</h3>
          <div className="grid gap-3 text-sm text-zinc-400">
            <a href={dealer.phoneHref} className="flex gap-2 hover:text-white"><Phone size={16} className="text-racing" /> {dealer.phoneDisplay}</a>
            <a href={dealer.website} className="flex gap-2 hover:text-white" target="_blank" rel="noreferrer"><Globe2 size={16} className="text-racing" /> {dealer.websiteLabel}</a>
            <a href={dealer.mapsUrl} className="flex gap-2 hover:text-white" target="_blank" rel="noreferrer"><MapPin size={16} className="text-racing" /> {dealer.addressShort}</a>
            <a href={dealer.social.tiktok} className="flex gap-2 hover:text-white" target="_blank" rel="noreferrer"><Music2 size={16} className="text-racing" /> TikTok {dealer.social.tiktokLabel}</a>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">Hours</h3>
          <div className="grid gap-3 text-sm text-zinc-400">
            <span className="flex gap-2"><Clock size={16} className="text-racing" /> {dealer.hours.weekday}</span>
            <span>{dealer.hours.saturday}</span>
            <span>{dealer.hours.sunday}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-500">
        © 2026 Sindh Automotive Dealers. Inventory listings only.
      </div>
    </footer>
  );
}
