import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

/* ── FONT LOADING ────────────────────────────────────────────── */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F0F4F9]">{children}</body>
    </html>
  );
}
