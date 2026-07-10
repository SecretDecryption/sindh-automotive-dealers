import { NextResponse } from "next/server";
import { notifyLead } from "@/lib/notifications";

export const runtime = "nodejs";

type LeadCategory = "contact" | "financing" | "vehicle-inquiry";

const validCategories = new Set<LeadCategory>(["contact", "financing", "vehicle-inquiry"]);

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  const category = body.category as LeadCategory;

  if (!validCategories.has(category)) {
    return NextResponse.json({ error: "Please choose a valid request type." }, { status: 400 });
  }

  if (!body.name || !body.phone || !body.email) {
    return NextResponse.json({ error: "Please complete your name, phone, and email." }, { status: 400 });
  }

  await notifyLead({
    category,
    name: body.name,
    phone: body.phone,
    email: body.email,
    message: body.message,
    contactTime: body.contactTime,
    budget: body.budget,
    employment: body.employment,
    credit: body.credit,
    vehicleInterest: body.vehicleInterest,
    vehicle: body.vehicle
  });

  return NextResponse.json({ ok: true });
}
