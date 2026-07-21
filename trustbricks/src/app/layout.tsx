import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";
import CookieConsent from "@/components/CookieConsent";

/* ── FONT LOADING ────────────────────────────────────────────── */
const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

/* ── METADATA ────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Trust Bricks Properties Ltd | PenCom RSA Mortgage Specialists",
    template: "%s | Trust Bricks Properties Ltd"
  },
  description:
    "Access up to 25% of your Retirement Savings Account (RSA) as equity contribution towards a residential mortgage, in compliance with PenCom guidelines. 14 branches across Nigeria.",
  keywords: [
    "PenCom mortgage",
    "RSA withdrawal",
    "Nigeria real estate",
    "pension mortgage",
    "Trust Bricks Properties",
    "Nigerian mortgage company",
  ],
  metadataBase: new URL('https://trustbrickspropertieslimited.com.ng'),
  openGraph: {
    title: "Trust Bricks Properties Ltd | Unlock Your Dream Home",
    description: "Access up to 25% of your RSA as equity contribution towards a residential mortgage under PenCom guidelines.",
    url: "https://trustbrickspropertieslimited.com.ng",
    siteName: "Trust Bricks Properties",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: "https://trustbrickspropertieslimited.com.ng/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trust Bricks Properties Ltd - PenCom RSA Mortgage Specialists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust Bricks Properties Ltd | Unlock Your Dream Home",
    description: "Access up to 25% of your RSA as equity contribution towards a residential mortgage. We simplify the PenCom application process.",
    images: ["https://trustbrickspropertieslimited.com.ng/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${publicSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#EDE7DB]">
        <Preloader />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
