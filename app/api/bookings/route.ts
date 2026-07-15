import { NextResponse } from "next/server";
import { type Booking, isValidBookingSlot } from "@/lib/booking";
import {
  getBookedTimes,
  isBookingStoreConfigured,
  releaseBookingSlot,
  reserveBookingSlot,
  saveBooking
} from "@/lib/booking-store";
import { notifyTestDriveBooking } from "@/lib/notifications";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ bookedTimes: [] });
  }

  if (!isBookingStoreConfigured()) {
    return NextResponse.json(
      { error: "Online booking is being activated. Please call (647) 267-9060 for now." },
      { status: 503 }
    );
  }

  try {
    return NextResponse.json({ bookedTimes: await getBookedTimes(date) });
  } catch (error) {
    console.error("Booking availability error", error);
    return NextResponse.json(
      { error: "Availability could not be checked. Please call (647) 267-9060 or try again shortly." },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  let body: Partial<Booking>;

  try {
    body = (await request.json()) as Partial<Booking>;
  } catch {
    return NextResponse.json({ error: "Please submit the booking form again." }, { status: 400 });
  }

  const requiredFields: Array<keyof Booking> = ["name", "phone", "email", "date", "time", "vehicle"];
  const missingField = requiredFields.find((field) => !body[field]);

  if (missingField) {
    return NextResponse.json({ error: "Please complete every required field." }, { status: 400 });
  }

  if (!isValidBookingSlot(body.date!, body.time!)) {
    return NextResponse.json({ error: "Please choose a time during dealership hours." }, { status: 400 });
  }

  if (!isBookingStoreConfigured()) {
    return NextResponse.json(
      { error: "Online booking is being activated. Please call (647) 267-9060 for now." },
      { status: 503 }
    );
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

  let reserved = false;

  try {
    reserved = await reserveBookingSlot(booking.date, booking.time);

    if (!reserved) {
      return NextResponse.json(
        { error: "That time was just booked. Please choose another available time." },
        { status: 409 }
      );
    }

    await saveBooking(booking);
    await notifyTestDriveBooking(booking);
  } catch (error) {
    console.error("Test-drive booking error", error);

    if (reserved) {
      try {
        await releaseBookingSlot(booking.date, booking.time);
      } catch (releaseError) {
        console.error("Could not release failed booking", releaseError);
      }
    }

    return NextResponse.json(
      { error: "Your booking could not be completed. Please try again or call (647) 267-9060." },
      { status: 502 }
    );
  }

  return NextResponse.json({ booking }, { status: 201 });
}
