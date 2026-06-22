import Link from "next/link";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { href: "/globe", label: "Globe" },
  { href: "/trips", label: "Trips" },
  { href: "/profile", label: "Profile" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background-base">
      <header className="flex items-center justify-between border-b border-text-secondary/10 px-6 py-4">
        <Link href="/globe" className="font-display text-xl text-text-primary">
          Wanderloom
        </Link>
        <nav className="flex gap-5 text-sm text-text-secondary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
