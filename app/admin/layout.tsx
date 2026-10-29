import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { InnerHero, SiteFooter } from "@/app/_components/site";
import { getUser, isAdmin } from "@/lib/auth";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = { title: "لوحة التحكم | Deutsch mit Asmaa", robots: { index: false } };

/** Only Frau Asmaa's account (app_metadata.role = 'admin') gets past this point. */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) redirect("/");

  return (
    <>
      <InnerHero title="لوحة التحكم" />
      <div className="container pt-6">
        <AdminNav />
        <main className="pt-6">{children}</main>
      </div>
      <SiteFooter />
    </>
  );
}
