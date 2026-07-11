"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSlotLabel, getHoursForDate, getTimeSlotsForDate } from "@/lib/booking";
import { vehicles } from "@/lib/vehicles";

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-zinc-400 focus:border-racing focus:ring-4 focus:ring-racing/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white";

export function TextInput({ label, type = "text", name, placeholder }: { label: string; type?: string; name: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
      {label}
      <input className={inputClass} type={type} name={name} placeholder={placeholder} required />
    </label>
  );
}

export function SelectInput({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
      {label}
      <select className={inputClass} name={name}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextArea({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
      {label}
      <textarea className={`${inputClass} min-h-32 resize-y`} name={name} placeholder={placeholder} />
    </label>
  );
}

export function SubmitButton({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="submit" disabled={disabled} className="rounded-md bg-racing px-5 py-3 text-sm font-black text-white shadow-card transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400">
      {children}
    </button>
  );
}

function FormMessage({ status, message }: { status: "idle" | "loading" | "success" | "error"; message: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className={`rounded-md px-4 py-3 text-sm font-bold ${status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-racing"}`}>
      {message}
    </p>
  );
}

export function BookingForm({ selectedVehicle }: { selectedVehicle?: string }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const hours = date ? getHoursForDate(date) : { closed: true, reason: "Select a date to see available times." };
  const slots = date ? getTimeSlotsForDate(date) : [];
  const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot));

  useEffect(() => {
    setTime("");
    setMessage("");

    if (!date) {
      setBookedTimes([]);
      return;
    }

    fetch(`/api/bookings?date=${date}`)
      .then((response) => response.json())
      .then((data: { bookedTimes?: string[] }) => setBookedTimes(data.bookedTimes ?? []))
      .catch(() => {
        setBookedTimes([]);
        setMessage("Availability could not be checked. Please try again.");
      });
  }, [date]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "This booking could not be completed. Please choose another time.");
      if (date) {
        const availabilityResponse = await fetch(`/api/bookings?date=${date}`);
        const availability = (await availabilityResponse.json()) as { bookedTimes?: string[] };
        setBookedTimes(availability.bookedTimes ?? []);
      }
      return;
    }

    setStatus("success");
    setMessage("Your test drive request is booked. Our team will confirm the details with you shortly.");
    setBookedTimes((current) => [...current, time]);
    event.currentTarget.reset();
    setDate("");
    setTime("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-black/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-zinc-950">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Name
          <input className={inputClass} name="name" placeholder="Your full name" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Phone
          <input className={inputClass} name="phone" placeholder="Your phone number" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Email
          <input className={inputClass} name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Preferred Date
          <input className={inputClass} name="date" type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Preferred Time
          <select className={inputClass} name="time" value={time} onChange={(event) => setTime(event.target.value)} disabled={!date || slots.length === 0} required>
            <option value="">{date ? "Select an available time" : "Select a date first"}</option>
            {slots.map((slot) => {
              const booked = bookedTimes.includes(slot);
              return (
                <option key={slot} value={slot} disabled={booked}>
                  {formatSlotLabel(slot)}
                  {booked ? " - Booked" : ""}
                </option>
              );
            })}
          </select>
          {date && hours.closed && <span className="text-xs font-semibold text-racing">{hours.reason}</span>}
          {date && !hours.closed && availableSlots.length === 0 && <span className="text-xs font-semibold text-racing">All time slots are booked for this date.</span>}
          {date && !hours.closed && availableSlots.length > 0 && (
            <span className="text-xs font-semibold text-zinc-500">
              Available appointment starts: {formatSlotLabel(slots[0])} - {formatSlotLabel(slots[slots.length - 1])}
            </span>
          )}
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Vehicle
          <select className={inputClass} name="vehicle" defaultValue={selectedVehicle ?? ""} required>
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
        </label>
      </div>
      <FormMessage status={status} message={message} />
      <button
        type="submit"
        disabled={status === "loading" || !date || !time || availableSlots.length === 0}
        className="rounded-md bg-racing px-5 py-3 text-sm font-black text-white shadow-card transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {status === "loading" ? "Checking Availability..." : "Book Test Drive"}
      </button>
    </form>
  );
}

async function submitLead(event: React.FormEvent<HTMLFormElement>, category: "contact" | "vehicle-inquiry") {
  const formData = new FormData(event.currentTarget);
  const payload = { ...Object.fromEntries(formData.entries()), category };

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = (await response.json()) as { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "This request could not be sent. Please try again.");
  }
}

export function ContactForm({
  title = "Send a Message",
  category = "contact",
  vehicle
}: {
  title?: string;
  category?: "contact" | "vehicle-inquiry";
  vehicle?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await submitLead(event, category);
      setStatus("success");
      setMessage(category === "vehicle-inquiry" ? "Your vehicle inquiry was sent. Our team will contact you shortly." : "Your message was sent. Our team will contact you shortly.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "This request could not be sent. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-lg border border-black/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-zinc-950">
      <h3 className="text-xl font-black text-ink dark:text-white">{title}</h3>
      {vehicle && <input type="hidden" name="vehicle" value={vehicle} />}
      <div className="grid gap-5 md:grid-cols-2">
        <TextInput label="Name" name="name" />
        <TextInput label="Phone" name="phone" />
        <TextInput label="Email" name="email" type="email" />
        <TextInput label="Preferred Contact Time" name="contactTime" />
      </div>
      <TextArea label="Message" name="message" placeholder="Tell us what you are looking for." />
      <FormMessage status={status} message={message} />
      <SubmitButton disabled={status === "loading"}>{status === "loading" ? "Sending..." : "Contact Dealer"}</SubmitButton>
    </form>
  );
}
