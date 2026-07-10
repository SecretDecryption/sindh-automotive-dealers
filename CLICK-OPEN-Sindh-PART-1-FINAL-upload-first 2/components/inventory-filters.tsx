"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { VehicleCard } from "./vehicle-card";
import type { Vehicle } from "@/lib/types";

const emptyFilters = {
  search: "",
  make: "",
  model: "",
  year: "",
  price: "",
  mileage: "",
  transmission: "",
  fuelType: ""
};

function unique(list: string[]) {
  return Array.from(new Set(list)).sort();
}

export function InventoryFilters({ vehicles }: { vehicles: Vehicle[] }) {
  const [filters, setFilters] = useState(emptyFilters);

  const options = useMemo(
    () => ({
      make: unique(vehicles.map((vehicle) => vehicle.make)),
      model: unique(vehicles.map((vehicle) => vehicle.model)),
      year: unique(vehicles.map((vehicle) => String(vehicle.year))),
      transmission: unique(vehicles.map((vehicle) => vehicle.transmission)),
      fuelType: unique(vehicles.map((vehicle) => vehicle.fuelType))
    }),
    [vehicles]
  );

  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchText = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.fuelType}`.toLowerCase();
    const underPrice = !filters.price || vehicle.price <= Number(filters.price);
    const underMileage = !filters.mileage || vehicle.mileage <= Number(filters.mileage);

    return (
      searchText.includes(filters.search.toLowerCase()) &&
      (!filters.make || vehicle.make === filters.make) &&
      (!filters.model || vehicle.model === filters.model) &&
      (!filters.year || String(vehicle.year) === filters.year) &&
      underPrice &&
      underMileage &&
      (!filters.transmission || vehicle.transmission === filters.transmission) &&
      (!filters.fuelType || vehicle.fuelType === filters.fuelType)
    );
  });

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-lg border border-black/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-zinc-950">
        <h2 className="mb-5 text-xl font-black text-ink dark:text-white">Refine Inventory</h2>
        <label className="mb-4 grid gap-2 text-sm font-bold text-ink dark:text-white">
          Search
          <span className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              className="w-full rounded-md border border-black/10 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-racing dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              placeholder="Search make, model, year"
            />
          </span>
        </label>
        <div className="grid gap-4">
          {(["make", "model", "year", "transmission", "fuelType"] as const).map((key) => (
            <label key={key} className="grid gap-2 text-sm font-bold capitalize text-ink dark:text-white">
              {key === "fuelType" ? "Fuel Type" : key}
              <select
                value={filters[key]}
                onChange={(event) => updateFilter(key, event.target.value)}
                className="rounded-md border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-racing dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              >
                <option value="">All</option>
                {options[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
            Max Price
            <input
              value={filters.price}
              onChange={(event) => updateFilter("price", event.target.value)}
              className="rounded-md border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-racing dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              type="number"
              placeholder="60000"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
            Max Mileage
            <input
              value={filters.mileage}
              onChange={(event) => updateFilter("mileage", event.target.value)}
              className="rounded-md border border-black/10 bg-white px-3 py-3 text-sm outline-none focus:border-racing dark:border-white/10 dark:bg-zinc-900 dark:text-white"
              type="number"
              placeholder="50000"
            />
          </label>
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="rounded-md border border-black/15 px-4 py-3 text-sm font-bold text-ink transition hover:border-racing hover:text-racing dark:border-white/15 dark:text-white"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-racing">Available Now</p>
            <h1 className="text-3xl font-black text-ink dark:text-white">{filteredVehicles.length} Vehicles</h1>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </section>
    </div>
  );
}
