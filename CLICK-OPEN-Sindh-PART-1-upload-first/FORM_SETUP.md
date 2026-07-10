# Live Form Setup

All dealership lead emails are addressed to:

`sindhautomotivedealer@gmail.com`

The website is wired for:

- Dealership lead emails
- Customer confirmation emails
- Optional customer text confirmations for test drive bookings
- Test drive double-booking protection

## Email

Use Resend for email sending.

Add these environment variables in Vercel:

```txt
DEALER_LEAD_EMAIL=sindhautomotivedealer@gmail.com
FROM_EMAIL="Sindh Automotive Dealers <leads@yourdomain.com>"
RESEND_API_KEY=your_resend_api_key
```

## Optional Text Messages

Text messages use Twilio and are off by default.

Leave these variables blank if you do not want SMS costs. The website will still send emails through Resend.

Only add these in Vercel later if you decide to activate text confirmations:

```txt
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_PHONE=your_twilio_phone_number
```

## Email Subjects

- Test drive: `Test Drive Booked By Customer Name`
- Contact form: `Appointment Booked By Customer Name`
- Financing form: `Financing Application By Customer Name`
- Vehicle inquiry: `Vehicle Inquiry By Customer Name`
