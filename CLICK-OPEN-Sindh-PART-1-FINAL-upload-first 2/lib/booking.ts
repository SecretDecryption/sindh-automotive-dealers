export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  vehicle: string;
  createdAt: string;
};

type HoursForDate =
  | {
      closed: true;
      reason: string;
    }
  | {
      closed: false;
      openMinutes: number;
      closeMinutes: number;
    };

const slotIntervalMinutes = 30;

function minutesToTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatSlotLabel(time: string) {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

export function getHoursForDate(date: string): HoursForDate {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return { closed: true, reason: "Select a date to see available times." };
  }

  const dayOfWeek = new Date(year, month - 1, day).getDay();

  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { closed: false, openMinutes: 10 * 60, closeMinutes: 17 * 60 };
  }

  return { closed: false, openMinutes: 9 * 60, closeMinutes: 19 * 60 };
}

export function getTimeSlotsForDate(date: string) {
  const hours = getHoursForDate(date);

  if (hours.closed) {
    return [];
  }

  const slots: string[] = [];

  for (let minutes = hours.openMinutes; minutes < hours.closeMinutes; minutes += slotIntervalMinutes) {
    slots.push(minutesToTime(minutes));
  }

  return slots;
}

export function isValidBookingSlot(date: string, time: string) {
  return getTimeSlotsForDate(date).includes(time);
}
