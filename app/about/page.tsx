import type { Metadata } from "next";
import Image from "next/image";
import { Award, Handshake, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Sindh Automotive Dealers, our mission, and our dealership standards."
};

export default function AboutPage() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-racing">About Us</p>
            <h1 className="mt-3 text-4xl font-black text-ink sm:text-5xl dark:text-white">A Premium Dealership Experience Built On Trust</h1>
            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-300">
              Sindh Automotive Dealers was founded to make pre-owned vehicle shopping feel refined, transparent, and genuinely helpful. We curate quality vehicles, inspect them carefully, and guide customers through inventory questions, vehicle details, and test drive appointments with professionalism.
            </p>
            <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">
              Our mission is simple: connect drivers with dependable vehicles and make every step of the dealership visit feel clear and confident.
            </p>
          </div>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-white p-8 shadow-luxury sm:p-12 dark:border-white/10">
            <div className="absolute inset-x-0 top-0 h-1 bg-racing" />
            <Image
              src="/sindh-logo.png"
              alt="Sindh Automotive Dealers logo"
              width={1033}
              height={421}
              sizes="(max-width: 1024px) 85vw, 42vw"
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Inspection First", text: "We review vehicle condition before it reaches the front line." },
            { icon: Handshake, title: "Transparent Guidance", text: "Our team helps you compare vehicles, options, and next steps clearly." },
            { icon: Award, title: "Premium Standards", text: "Inventory, presentation, and service are held to a luxury dealership benchmark." }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-black/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-zinc-950">
              <item.icon className="mb-4 text-racing" size={32} />
              <h2 className="text-xl font-black text-ink dark:text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
