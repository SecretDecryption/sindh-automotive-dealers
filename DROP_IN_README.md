# Sindh Automotive Dealers Website

This is the clean drop-in website package for GitHub/Vercel.

Included:

- Next.js 15 website
- Logo asset
- Real dealership contact info
- Inventory JSON
- Booking form with store-hour time slots
- Double-booking API check
- Contact, financing, test drive, and vehicle inquiry forms
- Email notification plumbing
- Optional SMS notification plumbing, inactive unless Twilio keys are added
- Form setup instructions in `FORM_SETUP.md`

Do not upload `node_modules` or `.next`; Vercel rebuilds those automatically.

## Local Commands

```bash
pnpm install
pnpm build
pnpm start
```

## Important Live Setup

Before forms can send real emails on Vercel, add the Resend environment variables listed in `FORM_SETUP.md`.

Text messages are optional. Do not add Twilio variables unless you want to activate paid SMS confirmations.
