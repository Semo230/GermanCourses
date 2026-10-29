import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://germancourses.asmaaabdelhamidm.workers.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Deutsch mit Asmaa",
  description: "Frau Asmaa | معلمة اللغة الألمانية - ابدأ رحلتك في اللغة الألمانية مع Deutsch mit Asmaa، وافهم الألماني خطوة بخطوة.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%238b1a1a'/%3E%3Ctext x='32' y='45' font-family='Arial,sans-serif' font-size='38' font-weight='700' fill='%23f5ecdd' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E",
  },
  // Link preview on WhatsApp / Facebook. Pages override title and description.
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    title: "Deutsch mit Asmaa | Frau Asmaa - معلمة اللغة الألمانية",
    description: "ابدأ رحلتك في اللغة الألمانية مع Deutsch mit Asmaa، وافهم الألماني خطوة بخطوة. دروس حضوري وأونلاين لمستويات A1 و A2.",
    images: [{ url: "/images/cover.jpg", width: 669, height: 458 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#8b1a1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>{children}</body>
    </html>
  );
}
