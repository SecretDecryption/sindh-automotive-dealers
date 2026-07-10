import inventory from "./inventory.json";
import type { Vehicle } from "./types";

export const vehicles = inventory as Vehicle[];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatMileage(value: number) {
  return `${new Intl.NumberFormat("en-CA").format(value)} km`;
}

export function getVehicle(id: string) {
  return vehicles.find((vehicle) => vehicle.id === id);
}

export function uniqueValues<Key extends keyof Vehicle>(key: Key) {
  return Array.from(new Set(vehicles.map((vehicle) => String(vehicle[key])))).sort();
}
