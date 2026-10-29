---
status: accepted
---

# Booking and account emails are sent from Frau Asmaa's Gmail

Every new booking emails Frau Asmaa and sends the student a "we received your booking" email, and Supabase Auth sends sign-up and password-reset emails. All of them go through Frau Asmaa's Gmail over SMTP with a Google app password: free, no domain, and about 500 emails a day. Booking emails are sent by a Supabase Edge Function when a booking row is inserted. This replaces ADR-0003's choice of Resend; the contact form still emails through Web3Forms.

## Considered Options

- **Resend (ADR-0003)**: rejected for now. Without a domain we own, Resend only sends to the account owner's own address, so students couldn't get emails.
- **Supabase's built-in email**: rejected. It only sends to team members and is "not meant for production use".

## Consequences

- The app password lives only in Supabase (Auth SMTP settings and Edge Function secrets). Changing the Google password cancels it, and it must be created and saved again.
- Edge Functions use Gmail's port 465, because Supabase blocks outgoing ports 25 and 587.
- A booking is saved even if its email fails; the failure is recorded on the booking and shown in the dashboard.
- Some emails may land in spam. Moving to a domain and Resend later doesn't change the database.
