import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import PropertiesPageClient from "@/components/PropertiesPageClient";
import { getProperties } from "@/app/actions/propertyActions";
import { getAdminConfig } from "@/app/actions/adminActions";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Properties for Sale & Mortgage | Trust Bricks Properties Ltd",
  description: "Browse residential, commercial, and land properties available in Nigeria through Trust Bricks Properties Ltd with RSA 25% mortgage facilitation.",
  alternates: {
    canonical: "https://trustbrickspropertieslimited.com.ng/properties",
  },
  openGraph: {
    title: "Properties for Sale & Mortgage | Trust Bricks Properties Ltd",
    description: "Browse residential, commercial, and land properties available in Nigeria through Trust Bricks Properties Ltd with RSA 25% mortgage facilitation.",
    url: "https://trustbrickspropertieslimited.com.ng/properties",
    siteName: "Trust Bricks Properties",
    locale: "en_NG",
    type: "website",
  },
};

export default async function PropertiesPage() {
  const { properties } = await getProperties(true);
  const config = await getAdminConfig();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />
      <main className="flex-grow pt-32 pb-24">
        <PropertiesPageClient properties={properties || []} />
      </main>
      <Footer siteSettings={config?.site} />
    </div>
  );
}
