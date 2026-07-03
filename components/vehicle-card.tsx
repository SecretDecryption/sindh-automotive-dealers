import Image from "next/image";
import Link from "next/link";
import { Gauge, Settings, Zap } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { formatCurrency, formatMileage } from "@/lib/vehicles";

export function VehicleCard({ vehicle, featured = false }: { vehicle: Vehicle; featured?: boolean }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-black/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-luxury dark:border-white/10 dark:bg-zinc-950">
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-200">
        <Image
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-ink backdrop-blur">
          Inspected
        </div>
      </div>
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-ink dark:text-white">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <p className="mt-1 text-2xl font-black text-racing">{formatCurrency(vehicle.price)}</p>
            {vehicle.priceNote ? <p className="mt-1 text-xs font-bold text-zinc-500 dark:text-zinc-400">{vehicle.priceNote}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          <span className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-2 dark:bg-white/10">
            <Gauge size={14} /> {formatMileage(vehicle.mileage)}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-2 dark:bg-white/10">
            <Settings size={14} /> {vehicle.transmission}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-2 dark:bg-white/10">
            <Zap size={14} /> {vehicle.fuelType}
          </span>
        </div>
        <div className={`mt-5 grid gap-3 ${featured ? "sm:grid-cols-2" : ""}`}>
          <Link href={`/inventory/${vehicle.id}`} className="rounded-md bg-ink px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-racing dark:bg-white dark:text-ink dark:hover:bg-racing dark:hover:text-white">
            View Details
          </Link>
          <Link href={`/booking?vehicle=${vehicle.id}`} className="rounded-md border border-black/15 px-4 py-3 text-center text-sm font-bold text-ink transition hover:border-racing hover:text-racing dark:border-white/15 dark:text-white">
            Book Test Drive
          </Link>
        </div>
      </div>
    </article>
  );
}
