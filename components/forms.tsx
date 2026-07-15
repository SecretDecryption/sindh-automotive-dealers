"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSlotLabel, getHoursForDate, getTimeSlotsForDate } from "@/lib/booking";
import { vehicles } from "@/lib/vehicles";

const inputClass =
  "w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-zinc-400 focus:border-racing focus:ring-4 focus:ring-racing/10 dark:border-white/10 dark:bg-zinc-950 dark:text-white";

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

async function readResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

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

function FormMessage({
  status,
  message,
  successTitle = "Request received"
}: {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  successTitle?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-md border px-4 py-4 ${
        status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-racing"
      }`}
    >
      {status === "success" && <p className="text-base font-black">{successTitle}</p>}
      <p className={`${status === "success" ? "mt-1" : ""} text-sm font-bold leading-6`}>{message}</p>
    </div>
  );
}

export function BookingForm({ selectedVehicle }: { selectedVehicle?: string }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [availabilityReady, setAvailabilityReady] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const hours = date ? getHoursForDate(date) : { closed: true, reason: "Select a date to see available times." };
  const slots = date ? getTimeSlotsForDate(date) : [];
  const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot));

  useEffect(() => {
    setTime("");
    setAvailabilityReady(false);

    if (!date) {
      setBookedTimes([]);
      setCheckingAvailability(false);
      return;
    }

    let active = true;
    setCheckingAvailability(true);

    fetchWithTimeout(`/api/bookings?date=${date}`, undefined, 10000)
      .then(async (response) => {
        const data = await readResponse<{ bookedTimes?: string[]; error?: string }>(response);

        if (!response.ok) {
          throw new Error(data.error ?? "Availability could not be checked. Please try again.");
        }

        if (active) {
          setBookedTimes(data.bookedTimes ?? []);
          setAvailabilityReady(true);
        }
      })
      .catch((error) => {
        if (!active) {
          return;
        }
        setBookedTimes([]);
        setStatus("error");
        setMessage(error instanceof Error && error.name !== "AbortError" ? error.message : "Availability is taking too long. Please try again or call (647) 267-9060.");
      })
      .finally(() => {
        if (active) {
          setCheckingAvailability(false);
        }
      });

    return () => {
      active = false;
    };
  }, [date]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetchWithTimeout("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await readResponse<{ error?: string }>(response);

      if (!response.ok) {
        throw new Error(data.error ?? "This booking could not be completed. Please choose another time.");
      }

      setStatus("success");
      setMessage(
        `Your test drive has been successfully scheduled. A confirmation email has been sent to ${String(
          payload.email
        )}. If it does not arrive within a few minutes, please check your junk or spam folder.`
      );
      setBookedTimes((current) => [...current, time]);
      form.reset();
      setDate("");
      setTime("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error && error.name !== "AbortError"
          ? error.message
          : "The booking request is taking too long. Please try again or call (647) 267-9060."
      );
    }
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
          <input
            className={inputClass}
            name="date"
            type="date"
            min={minDate}
            value={date}
            onChange={(event) => {
              setStatus("idle");
              setMessage("");
              setDate(event.target.value);
            }}
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-ink dark:text-white">
          Preferred Time
          <select className={inputClass} name="time" value={time} onChange={(event) => setTime(event.target.value)} disabled={!date || !availabilityReady || slots.length === 0} required>
            <option value="">{checkingAvailability ? "Checking available times..." : date ? "Select an available time" : "Select a date first"}</option>
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
          {date && availabilityReady && !hours.closed && availableSlots.length === 0 && <span className="text-xs font-semibold text-racing">All time slots are booked for this date.</span>}
          {date && availabilityReady && !hours.closed && availableSlots.length > 0 && (
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
      <FormMessage status={status} message={message} successTitle="Booking confirmed" />
      <button
        type="submit"
        disabled={status === "loading" || !availabilityReady || !date || !time || availableSlots.length === 0}
        className="rounded-md bg-racing px-5 py-3 text-sm font-black text-white shadow-card transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {status === "loading" ? "Booking Test Drive..." : "Book Test Drive"}
      </button>
    </form>
  );
}

async function submitLead(event: React.FormEvent<HTMLFormElement>, category: "contact" | "vehicle-inquiry") {
  const formData = new FormData(event.currentTarget);
  const payload = { ...Object.fromEntries(formData.entries()), category };

  const response = await fetchWithTimeout("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await readResponse<{ error?: string }>(response);

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
