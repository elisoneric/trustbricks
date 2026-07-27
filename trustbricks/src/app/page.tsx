import GlobalNavbar from "@/components/GlobalNavbar";
import HomeClient   from "@/components/HomeClient";
import Footer       from "@/components/Footer";
import { getAdminConfig, getBranches } from "@/app/actions/adminActions";
import { getTestimonials } from "@/app/actions/testimonialActions";
import { getProperties } from "@/app/actions/propertyActions";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};
  const { branches } = await getBranches();
  const { testimonials } = await getTestimonials(true);
  const { properties } = await getProperties(true);

  const jsonLdRealEstate = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Trust Bricks Properties Ltd",
    url: "https://trustbrickspropertieslimited.com.ng",
    logo: "https://trustbrickspropertieslimited.com.ng/og-image.jpg",
    description: siteSettings.slogan || "Access up to 25% of your Retirement Savings Account (RSA) as equity contribution towards a residential mortgage under PenCom guidelines.",
    telephone: siteSettings.companyPhone || undefined,
    email: siteSettings.companyEmail || undefined,
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Trust Bricks Properties Ltd",
    url: "https://trustbrickspropertieslimited.com.ng",
  };

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] font-sans antialiased selection:bg-[var(--color-clay-500)] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLdRealEstate, jsonLdWebSite]) }}
      />
      <GlobalNavbar />
      <HomeClient
        siteSettings={siteSettings}
        branches={branches || []}
        testimonials={testimonials || []}
        properties={properties || []}
      />
      <Footer siteSettings={siteSettings} />
    </div>
  );
}
