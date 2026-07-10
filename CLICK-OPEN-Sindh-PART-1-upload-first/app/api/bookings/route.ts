import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { type Booking, isValidBookingSlot } from "@/lib/booking";
import { notifyTestDriveBooking } from "@/lib/notifications";

export const runtime = "nodejs";

const bookingsFile = path.join(process.cwd(), "data", "bookings.json");

async function readBookings(): Promise<Booking[]> {
  try {
    const content = await fs.readFile(bookingsFile, "utf8");
    return JSON.parse(content) as Booking[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeBookings(bookings: Booking[]) {
  await fs.mkdir(path.dirname(bookingsFile), { recursive: true });
  await fs.writeFile(bookingsFile, JSON.stringify(bookings, null, 2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const bookings = await readBookings();

  if (!date) {
    return NextResponse.json({ bookedTimes: [] });
  }

  return NextResponse.json({
    bookedTimes: bookings.filter((booking) => booking.date === date).map((booking) => booking.time)
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Booking>;
  const requiredFields: Array<keyof Booking> = ["name", "phone", "email", "date", "time", "vehicle"];
  const missingField = requiredFields.find((field) => !body[field]);

  if (missingField) {
    return NextResponse.json({ error: "Please complete every required field." }, { status: 400 });
  }

  if (!isValidBookingSlot(body.date!, body.time!)) {
    return NextResponse.json({ error: "Please choose a time during dealership hours." }, { status: 400 });
  }

  const bookings = await readBookings();
  const alreadyBooked = bookings.some((booking) => booking.date === body.date && booking.time === body.time);

  if (alreadyBooked) {
    return NextResponse.json({ error: "That time was just booked. Please choose another available time." }, { status: 409 });
  }

  const booking: Booking = {
    id: crypto.randomUUID(),
    name: body.name!,
    phone: body.phone!,
    email: body.email!,
    date: body.date!,
    time: body.time!,
    vehicle: body.vehicle!,
    createdAt: new Date().toISOString()
  };

  await writeBookings([...bookings, booking]);
  await notifyTestDriveBooking(booking);

  return NextResponse.json({ booking }, { status: 201 });
}
