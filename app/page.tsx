import Image from "next/image";
import Link from "next/link";
import { Car, CircleDollarSign, HeartHandshake, ShieldCheck } from "lucide-react";
import { MapEmbed } from "@/components/map";
import { MotionDiv, MotionSection } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { VehicleCard } from "@/components/vehicle-card";
import { vehicles } from "@/lib/vehicles";
import { dealer } from "@/lib/dealer";

const benefits = [
  { title: "Safety Inspected", icon: ShieldCheck, text: "Every vehicle completes a mechanical and road-safety inspection." },
  { title: "Quality Pre-Owned Inventory", icon: Car, text: "Carefully selected vehicles from trusted brands at competitive prices." },
  { title: "Competitive Pricing", icon: CircleDollarSign, text: "Affordable prices to help you find the right vehicle within your budget." },
  { title: "Customer Satisfaction", icon: HeartHandshake, text: "We're committed to making your buying experience simple and enjoyable." }
];

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-x-4 top-8 flex justify-center lg:inset-y-0 lg:left-auto lg:right-8 lg:top-0 lg:w-[50%] lg:items-center">
          <Image
            src="/sindh-logo.png"
            alt=""
            width={1033}
            height={421}
            priority
            className="w-[min(78vw,430px)] object-contain opacity-80 sm:w-[min(72vw,500px)] lg:w-[min(42vw,620px)]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-white/88 to-white lg:bg-gradient-to-r lg:from-white lg:via-white/95 lg:to-white/20" />
        <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-end px-4 pb-16 pt-72 sm:px-6 sm:pt-80 lg:items-center lg:px-8 lg:py-20">
          <MotionDiv initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl text-ink">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-racing">{dealer.name}</p>
            <h1 className="text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">Quality Pre-Owned Vehicles</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">Find your next vehicle with confidence.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/inventory" className="rounded-md bg-racing px-6 py-4 text-center text-sm font-black text-white shadow-luxury transition hover:bg-red-700">
                Browse Inventory
              </Link>
              <Link href="/booking" className="rounded-md border border-black/15 bg-white/80 px-6 py-4 text-center text-sm font-black text-ink shadow-card backdrop-blur transition hover:border-racing hover:text-racing">
                Book a Test Drive
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      <MotionSection initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Featured Inventory" title="Quality Vehicles Ready For Delivery" text="Browse a curated selection of inspected pre-owned vehicles from trusted brands." />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {vehicles.slice(0, 6).map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} featured />
            ))}
          </div>
        </div>
      </MotionSection>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Why Choose Us" title="Confidence At Every Step" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="rounded-lg border border-black/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-zinc-950">
                <benefit.icon className="mb-5 text-racing" size={34} />
                <h3 className="text-lg font-black text-ink dark:text-white">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-racing">Visit Us</p>
            <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl dark:text-white">Explore Inventory In Person</h2>
            <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">
              Stop by our Brantford showroom for a walkaround, vehicle questions, or scheduled test drive.
            </p>
          </div>
          <MapEmbed />
        </div>
      </section>
    </>
  );
}
