import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

const DEFAULT_DESCRIPTION = "A globe-first social travel scrapbook and discovery app.";

export const metadata: Metadata = {
  title: {
    default: "Wanderloom",
    template: "%s",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: "Wanderloom",
    type: "website",
    title: "Wanderloom",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Wanderloom",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
