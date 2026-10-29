# Booking emails are sent by Supabase, contact messages still by Web3Forms

The admin must hear about every new booking order, so its email is sent server-side: a Supabase Edge Function runs when an order row is inserted and emails Frau Asmaa through an email service (e.g. Resend). The contact form keeps sending its email from the visitor's browser through Web3Forms, so the site has two email paths on purpose.

## Considered Options

- **Web3Forms from the browser for bookings too**: rejected. On 2026-10-29 Web3Forms' bot protection rejected a test submission with 403, the email is lost if the visitor closes the page, and the visitor sees "sent" even when the email fails.

## Consequences

- The email service's API key lives only in Supabase secrets, never in the HTML.
- Moving the contact form to the same server-side path later is cheap and would remove the second path.
