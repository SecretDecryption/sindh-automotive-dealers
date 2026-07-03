import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Fuel, Gauge, Palette, Settings, Shield, Wrench } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { formatCurrency, formatMileage, getVehicle, vehicles } from "@/lib/vehicles";

const shareImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Sindh Automotive Dealers logo"
};

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ id: vehicle.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) {
    return { title: "Vehicle Not Found" };
  }

  return {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    description: `${formatCurrency(vehicle.price)} with ${formatMileage(vehicle.mileage)} at Sindh Automotive Dealers.`,
    openGraph: {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      description: vehicle.description,
      images: [shareImage]
    },
    twitter: {
      card: "summary_large_image",
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      description: vehicle.description,
      images: [shareImage.url]
    }
  };
}

export default async function VehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);

  if (!vehicle) {
    notFound();
  }

  const specs = [
    { label: "Price", value: formatCurrency(vehicle.price), icon: Shield },
    { label: "Mileage", value: formatMileage(vehicle.mileage), icon: Gauge },
    { label: "VIN", value: vehicle.vin, icon: CheckCircle2 },
    { label: "Transmission", value: vehicle.transmission, icon: Settings },
    { label: "Fuel Type", value: vehicle.fuelType, icon: Fuel },
    { label: "Exterior Color", value: vehicle.exteriorColor, icon: Palette },
    { label: "Interior Color", value: vehicle.interiorColor, icon: Palette },
    { label: "Engine", value: vehicle.engine, icon: Wrench },
    { label: "Drivetrain", value: vehicle.drivetrain, icon: Settings }
  ];

  return (
    <section className="bg-zinc-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200 shadow-luxury">
              <Image src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {vehicle.images.map((image, index) => (
                <div key={image} className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200">
                  <Image src={image} alt={`${vehicle.make} ${vehicle.model} gallery ${index + 1}`} fill sizes="50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-black/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-zinc-950">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-racing">Available Inventory</p>
            <h1 className="mt-3 text-3xl font-black text-ink dark:text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="mt-4 text-4xl font-black text-racing">{formatCurrency(vehicle.price)}</p>
            {vehicle.priceNote ? <p className="mt-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">{vehicle.priceNote}</p> : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Link href={`/booking?vehicle=${vehicle.id}`} className="rounded-md bg-racing px-5 py-3 text-center text-sm font-black text-white shadow-card transition hover:bg-red-700">
                Book Test Drive
              </Link>
              <Link href="/financing" className="rounded-md bg-ink px-5 py-3 text-center text-sm font-black text-white transition hover:bg-zinc-800 dark:bg-white dark:text-ink">
                Apply For Financing
              </Link>
              <Link href="/contact" className="rounded-md border border-black/15 px-5 py-3 text-center text-sm font-black text-ink transition hover:border-racing hover:text-racing dark:border-white/15 dark:text-white">
                Contact Dealer
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-2xl font-black text-ink dark:text-white">Vehicle Information</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.label} className="rounded-md bg-zinc-100 p-4 dark:bg-white/10">
                  <spec.icon className="mb-3 text-racing" size={20} />
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{spec.label}</p>
                  <p className="mt-1 text-sm font-bold text-ink dark:text-white">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-zinc-950">
            <h2 className="text-2xl font-black text-ink dark:text-white">Description</h2>
            <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">{vehicle.description}</p>
            <h3 className="mt-8 text-xl font-black text-ink dark:text-white">Features</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {vehicle.features.map((feature) => (
                <span key={feature} className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  <CheckCircle2 size={18} className="text-racing" /> {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <ContactForm
            title={`Inquire About This ${vehicle.make} ${vehicle.model}`}
            category="vehicle-inquiry"
            vehicle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          />
        </div>
      </div>
    </section>
  );
}
