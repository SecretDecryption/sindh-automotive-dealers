import type { Metadata } from "next";
import { BookingForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Book a Test Drive",
  description: "Schedule a test drive with Sindh Automotive Dealers."
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ vehicle?: string }> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <section className="bg-zinc-50 px-4 py-14 sm:px-6 lg:px-8 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-racing">Booking</p>
        <h1 className="mt-3 text-4xl font-black text-ink dark:text-white">Book a Test Drive</h1>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-600 dark:text-zinc-300">
          Pick a vehicle, date, and available time. Monday-Friday follows 9 AM-7 PM hours, and Saturday-Sunday follows 10 AM-5 PM hours.
        </p>
        <div className="mt-8">
          <BookingForm selectedVehicle={resolvedSearchParams.vehicle} />
        </div>
      </div>
    </section>
  );
}
