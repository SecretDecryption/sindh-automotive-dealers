import type { Metadata } from "next";
import { InventoryFilters } from "@/components/inventory-filters";
import { vehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Inventory",
  description: "Browse inspected pre-owned vehicles available at Sindh Automotive Dealers."
};

export default function InventoryPage() {
  return (
    <section className="bg-zinc-50 px-4 py-10 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="mx-auto max-w-7xl">
        <InventoryFilters vehicles={vehicles} />
      </div>
    </section>
  );
}
