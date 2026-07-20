import type { Metadata } from "next";
import { Clock, Globe2, MapPin, Music2, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { MapEmbed } from "@/components/map";
import { dealer } from "@/lib/dealer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Sindh Automotive Dealers for inventory questions and test drives."
};

export default function ContactPage() {
  const contactItems = [
    { icon: Phone, label: "Phone", value: dealer.phoneDisplay, href: dealer.phoneHref },
    { icon: Globe2, label: "Website", value: dealer.websiteLabel, href: dealer.website },
    { icon: Music2, label: "TikTok", value: dealer.social.tiktokLabel, href: dealer.social.tiktok },
    { icon: MapPin, label: "Address", value: dealer.address, href: dealer.mapsUrl },
    { icon: Clock, label: "Business Hours", value: `${dealer.hours.weekday}, ${dealer.hours.saturday}, ${dealer.hours.sunday}` }
  ];

  return (
    <section className="bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-racing">Contact</p>
        <h1 className="mt-3 text-4xl font-black text-ink sm:text-5xl dark:text-white">Contact Sindh Automotive Dealers</h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="grid gap-4">
            {contactItems.map((item) => (
              <div key={item.label} className="rounded-lg border border-black/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-zinc-950">
                <item.icon className="mb-3 text-racing" />
                <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{item.label}</p>
                {item.href ? (
                  <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined} className="mt-1 block font-bold text-ink transition hover:text-racing dark:text-white">
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 font-bold text-ink dark:text-white">{item.value}</p>
                )}
              </div>
            ))}
          </div>
          <ContactForm />
        </div>
        <div className="mt-10">
          <MapEmbed />
        </div>
      </div>
    </section>
  );
}
