import { formatSlotLabel } from "@/lib/booking";
import { dealer } from "@/lib/dealer";
import { getVehicle } from "@/lib/vehicles";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type EmailField = [label: string, value?: string];

type LeadCategory = "contact" | "vehicle-inquiry";

type LeadInput = {
  category: LeadCategory;
  name: string;
  phone: string;
  email: string;
  message?: string;
  contactTime?: string;
  budget?: string;
  employment?: string;
  credit?: string;
  vehicleInterest?: string;
  vehicle?: string;
};

type BookingNotificationInput = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  vehicle: string;
};

const leadEmail = process.env.DEALER_LEAD_EMAIL ?? dealer.leadEmail;
const fromEmail = process.env.FROM_EMAIL ?? "Sindh Automotive Dealers <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value?: string) {
  if (!value) {
    return "";
  }

  return `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #ececec;color:#666;font-weight:700;width:180px;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #ececec;color:#111;">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
    </tr>
  `;
}

function emailLayout(title: string, intro: string, rows: string) {
  return `
    <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#fff;color:#111;">
      <div style="background:#111;padding:24px;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;color:#fff;font-size:24px;">${escapeHtml(title)}</h1>
        <p style="margin:8px 0 0;color:#d90429;font-weight:700;">${escapeHtml(dealer.name)}</p>
      </div>
      <div style="border:1px solid #ececec;border-top:0;padding:24px;border-radius:0 0 8px 8px;">
        <p style="margin:0 0 18px;line-height:1.6;color:#333;">${escapeHtml(intro)}</p>
        <table style="width:100%;border-collapse:collapse;background:#fafafa;border:1px solid #ececec;">
          ${rows}
        </table>
        <p style="margin:20px 0 0;color:#666;font-size:13px;line-height:1.5;">
          ${escapeHtml(dealer.address)}<br />
          ${escapeHtml(dealer.phoneDisplay)}
        </p>
      </div>
    </div>
  `;
}

function plainTextLayout(title: string, intro: string, fields: EmailField[]) {
  const details = fields
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `${title}
${dealer.name}

${intro}

${details}

${dealer.address}
${dealer.phoneDisplay}
${dealer.website}`;
}

export async function sendEmail(input: SendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.info(`[email skipped] ${input.subject} -> ${input.to}`);
    return { skipped: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo
    })
  });

  if (!response.ok) {
    throw new Error(`Email failed: ${await response.text()}`);
  }

  return response.json();
}

function normalizePhoneForSms(phone: string) {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) {
    return trimmed;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return trimmed;
}

export async function sendSms(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_PHONE;

  if (!accountSid || !authToken || !from) {
    console.info(`[sms skipped] ${body} -> ${to}`);
    return { skipped: true };
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      From: from,
      To: normalizePhoneForSms(to),
      Body: body
    })
  });

  if (!response.ok) {
    throw new Error(`SMS failed: ${await response.text()}`);
  }

  return response.json();
}

export async function notifyTestDriveBooking(input: BookingNotificationInput) {
  const vehicle = getVehicle(input.vehicle);
  const vehicleName = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : input.vehicle;
  const formattedTime = formatSlotLabel(input.time);
  const dealerSubject = `New Test Drive Booking - ${input.name}`;
  const customerSubject = `Test Drive Confirmed - ${vehicleName}`;

  const fields: EmailField[] = [
    ["Customer", input.name],
    ["Phone", input.phone],
    ["Email", input.email],
    ["Vehicle", vehicleName],
    ["Date", input.date],
    ["Time", formattedTime]
  ];
  const rows = fields.map(([label, value]) => row(label, value)).join("");
  const dealerIntro = "A customer booked a test drive through the website.";
  const customerIntro = `Hi ${input.name}, your test drive is confirmed. Please bring a valid driver's licence. If you need to make a change, call us at ${dealer.phoneDisplay}.`;

  await sendEmail({
    to: leadEmail,
    subject: dealerSubject,
    replyTo: input.email,
    html: emailLayout(dealerSubject, dealerIntro, rows),
    text: plainTextLayout(dealerSubject, dealerIntro, fields)
  });

  await sendEmail({
    to: input.email,
    subject: customerSubject,
    replyTo: leadEmail,
    html: emailLayout("Test Drive Confirmed", customerIntro, rows),
    text: plainTextLayout("Test Drive Confirmed", customerIntro, fields)
  });

  try {
    await sendSms(
      input.phone,
      `Sindh Automotive: We received your test drive request for ${vehicleName} on ${input.date} at ${formattedTime}. We will confirm shortly.`
    );
  } catch (error) {
    console.error(error);
  }
}

export async function notifyLead(input: LeadInput) {
  const subjectByCategory: Record<LeadCategory, string> = {
    contact: `Appointment Booked By ${input.name}`,
    "vehicle-inquiry": `Vehicle Inquiry By ${input.name}`
  };
  const titleByCategory: Record<LeadCategory, string> = {
    contact: "Appointment Request Received",
    "vehicle-inquiry": "Vehicle Inquiry Received"
  };
  const introByCategory: Record<LeadCategory, string> = {
    contact: "A customer contacted the dealership through the website.",
    "vehicle-inquiry": "A customer asked about a specific vehicle through the website."
  };

  const subject = subjectByCategory[input.category];
  const fields: EmailField[] = [
    ["Customer", input.name],
    ["Phone", input.phone],
    ["Email", input.email],
    ["Preferred Contact Time", input.contactTime],
    ["Vehicle", input.vehicle],
    ["Monthly Budget", input.budget],
    ["Employment Status", input.employment],
    ["Estimated Credit Score", input.credit],
    ["Vehicle Interest", input.vehicleInterest],
    ["Message", input.message]
  ];
  const rows = fields.map(([label, value]) => row(label, value)).join("");

  await sendEmail({
    to: leadEmail,
    subject,
    replyTo: input.email,
    html: emailLayout(subject, introByCategory[input.category], rows),
    text: plainTextLayout(subject, introByCategory[input.category], fields)
  });

  await sendEmail({
    to: input.email,
    subject: `Sindh Automotive: ${titleByCategory[input.category]}`,
    replyTo: leadEmail,
    html: emailLayout(
      titleByCategory[input.category],
      `Hi ${input.name}, we received your request. Our team will review it and contact you soon.`,
      rows
    ),
    text: plainTextLayout(
      titleByCategory[input.category],
      `Hi ${input.name}, we received your request. Our team will review it and contact you soon.`,
      fields
    )
  });
}
