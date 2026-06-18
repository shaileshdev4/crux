import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { HiFingerPrint, HiLockClosed } from "react-icons/hi2";
import "./globals.css";
import { Logo } from "@/components/Logo";
import { IconSlot } from "@/components/IconSlot";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { PendoInitializer } from "@/components/PendoInitializer";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('0ca0d6af-0c03-404d-b1d3-1379c5f94f46');`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <PendoInitializer />
        <Providers>
          <Nav />
          <main className="flex-1 relative z-10">{children}</main>
          <footer className="relative z-10 border-t border-border mt-20">
            <div className="mx-auto max-w-6xl px-6 py-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Logo href="/" wordmarkSize="sm" />
                <span className="eyebrow hidden sm:inline-flex items-center gap-1.5">
                  <IconSlot icon={HiFingerPrint} className="h-3.5 w-3.5" />
                  A decision record for the AI era
                </span>
              </div>
              <span className="eyebrow inline-flex items-center gap-1.5">
                <IconSlot icon={HiLockClosed} className="h-3.5 w-3.5" />
                Append-only · provenance on every field
              </span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
