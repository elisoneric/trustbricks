import GlobalNavbar from "@/components/GlobalNavbar";
import HomeClient   from "@/components/HomeClient";
import Footer       from "@/components/Footer";
import { getAdminConfig, getBranches } from "@/app/actions/adminActions";
import { getTestimonials } from "@/app/actions/testimonialActions";
import { getProperties } from "@/app/actions/propertyActions";

export default async function HomePage() {
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};
  const { branches } = await getBranches();
  const { testimonials } = await getTestimonials(true);
  const { properties } = await getProperties(true);

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] font-sans antialiased selection:bg-[var(--color-clay-500)] selection:text-white">
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
