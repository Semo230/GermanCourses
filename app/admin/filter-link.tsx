import Link from "next/link";

/** Pill link used to filter admin lists by status. */
export function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        "inline-flex min-h-11 items-center rounded-full border-[1.5px] px-4 font-bold no-underline " +
        (active ? "border-brand bg-brand text-white" : "border-beige-dark bg-white text-ink hover:border-brand")
      }
    >
      {children}
    </Link>
  );
}
