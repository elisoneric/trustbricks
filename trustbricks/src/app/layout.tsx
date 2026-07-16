import type { Metadata } from "next";
import { Bricolage_Grotesque, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Preloader from "@/components/Preloader";

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
    "Use 25% of your Retirement Savings Account (RSA) to fund a home mortgage down payment. PenCom-regulated. Serving Abuja, Lagos, Adamawa, and Kaduna.",
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
    description: "Teamwork Makes The Dream Work — use 25% of your RSA to fund your home mortgage down payment.",
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
    description: "Use 25% of your Retirement Savings Account (RSA) to fund your home mortgage. We make the PenCom process seamless.",
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
      </body>
    </html>
  );
}
