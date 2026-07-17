This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Waitlist form setup

The "Join waitlist" button (`components/WaitlistButton.tsx`) submits to a Google Form, since this site is statically exported (`output: "export"` in `next.config.ts`) and has no server to run its own backend.

1. Create a Google Form with an "Email" short-answer question and a "Phone" short-answer question.
2. For each question, use the "Get pre-filled link" option, fill in a dummy value, generate the link, and pull the `entry.NNNNNNNNN` field name out of the generated URL for that question.
3. Take the form's response URL and swap `/viewform` for `/formResponse`.
4. For local dev, set these in `.env.local`:

   ```
   NEXT_PUBLIC_WAITLIST_FORM_ACTION=https://docs.google.com/forms/d/e/FORM_ID/formResponse
   NEXT_PUBLIC_WAITLIST_EMAIL_ENTRY=entry.123456789
   NEXT_PUBLIC_WAITLIST_PHONE_ENTRY=entry.987654321
   ```

5. For production, add the same three values as repo secrets (Settings → Secrets and variables → Actions) named `WAITLIST_FORM_ACTION`, `WAITLIST_EMAIL_ENTRY`, and `WAITLIST_PHONE_ENTRY` — `.github/workflows/deploy.yml` passes them into the build.

Without these set, the button still opens the modal but submissions fail gracefully with an inline error instead of pretending to succeed.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
