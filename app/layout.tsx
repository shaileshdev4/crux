import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Logo } from "@/components/Logo";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const data = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-data",
});

export const metadata: Metadata = {
  title: "Crux - the record behind every decision",
  description:
    "AI made deciding cheap. Crux makes it accountable. Capture what the AI recommended, what you chose, and how sure you were - then see your real judgment over time.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Crux",
    description: "The decision record for the AI era.",
    type: "website",
    images: [{ url: "/logo.svg", width: 120, height: 32, alt: "Crux" }],
  },
  twitter: {
    card: "summary",
    title: "Crux",
    description: "The decision record for the AI era.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${data.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative">
        <Providers>
          <Nav />
          <main className="flex-1 relative z-10">{children}</main>
          <footer className="relative z-10 border-t border-border mt-20">
            <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Logo href="/" wordmarkSize="sm" />
                <span className="eyebrow hidden sm:inline">
                  A decision record for the AI era
                </span>
              </div>
              <span className="eyebrow">
                Append-only · provenance on every field
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
