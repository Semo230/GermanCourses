import Link from "next/link";
import { getUser, isAdmin } from "@/lib/auth";
import { WhatsAppFloat } from "./whatsapp";

/** "My account" / "Admin" / "Sign in" links, shown in every page header. */
export async function AccountLinks({ className = "account-link" }: { className?: string }) {
  const user = await getUser();
  if (!user) {
    return (
      <Link className={className} href="/login">
        تسجيل الدخول
      </Link>
    );
  }
  return (
    <span className="inline-flex flex-wrap gap-x-4">
      {isAdmin(user) && (
        <Link className={className} href="/admin">
          لوحة التحكم
        </Link>
      )}
      <Link className={className} href="/account">
        حسابي
      </Link>
    </span>
  );
}

/** Compact burgundy header for inner pages. */
export function InnerHero({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="inner-hero">
      <div className="container">
        <nav className="top-links" aria-label="روابط الموقع">
          <Link className="home-link" href="/">
            <span aria-hidden="true">→</span>&nbsp;الصفحة الرئيسية ·&nbsp;<bdi translate="no">Deutsch mit Asmaa</bdi>
          </Link>
          <AccountLinks />
        </nav>
        <h1>{title}</h1>
        {children}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <bdi translate="no">Deutsch mit Asmaa Abd ElHamid</bdi>
    </footer>
  );
}

/** Footer plus the floating WhatsApp button, shared by every public page. */
export function SiteEnd() {
  return (
    <>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  );
}
